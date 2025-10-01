import keycloakInstance from "@/hooks/keycloak";
import type { Lists } from "@/types/init";
import axios, { AxiosError, AxiosHeaders, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

/** 📦 Bentuk standar response dari API */
export interface ApiResponse<T = unknown> {
   message: string;
   data?: T;
   results?: { [key: string]: string };
   total?: number;
   errors?: Lists;
   status: boolean;
   code?: number;
}

const MAX_RETRY = 3;

/** 🔒 Mutex queue sederhana */
class Mutex {
   private mutex: Promise<void> = Promise.resolve();

   async lock<T>(fn: () => Promise<T>): Promise<T> {
      let release!: () => void;

      const ready = new Promise<void>((resolve) => (release = resolve));

      const previous = this.mutex;
      this.mutex = previous.then(() => ready);

      await previous; // tunggu antrean sebelumnya selesai

      try {
         return await fn();
      } finally {
         release(); // lepaskan lock, biar antrean berikutnya jalan
      }
   }
}

const mutex = new Mutex();

/** 🔑 Tambahkan token ke header */
const withAuthHeader = async (config: Partial<InternalAxiosRequestConfig>): Promise<InternalAxiosRequestConfig> => {
   const headers = new AxiosHeaders(config.headers);

   if (keycloakInstance?.token) {
      if (keycloakInstance.isTokenExpired()) {
         await keycloakInstance.updateToken(30);
      }
      headers.set("Authorization", `Bearer ${keycloakInstance.token}`);
   }

   return { ...config, headers };
};

/** 🔄 Cek apakah request perlu retry */
const shouldRetry = (error: AxiosError): boolean => {
   return error.response?.status === 401 || ["ECONNRESET", "ETIMEDOUT", "ERR_NETWORK"].includes(error.code || "");
};

/** 🔄 Refresh token jika expired */
const handleTokenRefresh = async (error: AxiosError): Promise<boolean> => {
   if (error.response?.status === 401 && keycloakInstance?.updateToken) {
      try {
         await keycloakInstance.updateToken(30);
         return true;
      } catch (tokenError) {
         console.error("Token refresh failed:", tokenError);
         return false;
      }
   }
   return false;
};

/** ⏱️ Abort signal helper */
const abortSignal = (timeoutMs: number): AbortSignal => {
   const controller = new AbortController();
   setTimeout(() => controller.abort(), timeoutMs);
   return controller.signal;
};

/** 📡 Request utama */
const request = async <T = unknown>(
   method: "get" | "post" | "put" | "delete",
   url: string,
   form: Record<string, unknown> = {},
   config: Partial<InternalAxiosRequestConfig> = {},
   retryCount = MAX_RETRY
): Promise<AxiosResponse<ApiResponse<T>>> => {
   return mutex.lock(async () => {
      const baseUrl = import.meta.env.VITE_API_URL || "";
      const fullUrl = /^https?:\/\//.test(url) ? url : `${baseUrl}${url}`;

      const authConfig = await withAuthHeader(config);

      try {
         const res: AxiosResponse<ApiResponse<T>> = await axios({
            method,
            url: fullUrl,
            data: method === "get" || method === "delete" ? undefined : form,
            ...authConfig,
            signal: abortSignal(200_000),
         });

         if (res.data?.code && res.data.code !== 200) {
            toast.error(res.data.message);
         }

         return res;
      } catch (e) {
         const error = e as AxiosError;

         if (retryCount > 0 && shouldRetry(error)) {
            toast.info(`Retrying request (${MAX_RETRY - retryCount + 1}/${MAX_RETRY}): ${method.toUpperCase()} ${url}`);
            const refreshed = await handleTokenRefresh(error);
            if (refreshed) {
               return request<T>(method, url, form, config, retryCount - 1);
            }
         }

         if (error.code === "ERR_CANCELED") {
            toast.error("Sistem sedang sibuk, silahkan coba beberapa saat lagi!");
         } else {
            toast.error(`[${error.code}] ${error.message}`);
         }
         throw error;
      }
   });
};

/** 📌 Helpers */
export const get = <T>(url: string, config?: Partial<InternalAxiosRequestConfig>) => request<T>("get", url, {}, config);

export const post = <T>(url: string, form: Record<string, unknown> = {}, config?: Partial<InternalAxiosRequestConfig>) =>
   request<T>("post", url, form, config);

export const put = <T>(url: string, form: Record<string, unknown> = {}, config?: Partial<InternalAxiosRequestConfig>) =>
   request<T>("put", url, form, config);

export const _delete = <T>(url: string, config?: Partial<InternalAxiosRequestConfig>) => request<T>("delete", url, {}, config);

/** 🔄 Utility convert object ke form value */
export const postValue = (obj: Record<string, unknown>) => ({ ...obj });

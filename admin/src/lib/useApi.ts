import { UseAuth } from "@/hooks/auth-context";
import {
   useMutation,
   useQuery,
   type UseMutationOptions,
   type UseMutationResult,
   type UseQueryOptions,
   type UseQueryResult,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { _delete, get, post, put, type ApiResponse } from "./api";

/**
 * Hook untuk GET request dengan react-query.
 * Selalu return ApiResponse<T> (payload sudah di-mapping).
 */

interface UseApiQueryProps<T> {
   queryKey: string | Array<unknown>;
   url: string;
   options?: Omit<UseQueryOptions<ApiResponse<T>, Error, ApiResponse<T>, readonly unknown[]>, "queryKey" | "queryFn">;
   params?: Record<string, unknown>;
}

export function useApiQuery<T>({ queryKey, url, options, params }: UseApiQueryProps<T>): UseQueryResult<ApiResponse<T>, Error> {
   return useQuery<ApiResponse<T>, Error, ApiResponse<T>>({
      queryKey: Array.isArray(queryKey) ? queryKey : [queryKey, params],
      queryFn: async () => {
         const res = await get<T>(url, { params });
         return res.data; // ✅ langsung return ApiResponse<T>
      },
      ...options,
   });
}

/**
 * Hook untuk POST request.
 */
export function usePostMutation<T, V = Record<string, unknown> | FormData>(
   url: string,
   options?: Omit<UseMutationOptions<ApiResponse<T>, Error, V, unknown>, "mutationFn">
): UseMutationResult<ApiResponse<T>, Error, V, unknown> {
   const { user } = UseAuth();

   return useMutation<ApiResponse<T>, Error, V, unknown>({
      mutationFn: async (variables: V) => {
         if (!navigator.onLine) {
            toast.error("No internet connection");
         }

         let data: V | Record<string, unknown> | FormData;
         if (variables instanceof FormData) {
            variables.append('user_modified', user?.preferred_username || '');
            data = variables;
         } else {
            // Default to JSON: send as plain object with user_modified added
            data = { ...(variables as Record<string, unknown>), user_modified: user?.preferred_username || '' };
         }

         const res = await post<T>(url, data as Record<string, unknown> | FormData);
         return res.data;
      },
      ...options,
   });
}

/**
 * Hook untuk PUT request.
 */
export function usePutMutation<T, V extends Record<string, unknown> = Record<string, unknown>>(
   url: string,
   options?: Omit<UseMutationOptions<ApiResponse<T>, Error, V, unknown>, "mutationFn">
): UseMutationResult<ApiResponse<T>, Error, V, unknown> {
   return useMutation<ApiResponse<T>, Error, V, unknown>({
      mutationFn: async (variables: V) => {
         if (!navigator.onLine) {
            toast.error("No internet connection");
         }

         const res = await put<T>(url, variables);
         return res.data;
      },
      ...options
   });
}

/**
 * Hook untuk DELETE request.
 */
export function useDeleteMutation<T>(
   url: string,
   options?: Omit<UseMutationOptions<ApiResponse<T>, Error, void, unknown>, "mutationFn">
): UseMutationResult<ApiResponse<T>, Error, void, unknown> {
   return useMutation<ApiResponse<T>, Error, void, unknown>({
      mutationFn: async () => {
         if (!navigator.onLine) {
            toast.error("No internet connection");
         }

         const res = await _delete<T>(url);
         return res.data;
      },
      ...options,
   });
}
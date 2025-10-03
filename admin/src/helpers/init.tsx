import type { Lists } from "@/types/init";
import { Loader2Icon } from "lucide-react";

export const getValue = (original: Lists, field: string) => {
   const val = original?.[field];
   if (val == null) return "";
   if (typeof val === "boolean") return val ? "t" : "f";
   if (typeof val === "string") return val;
   return "";
};

export const btn_loading = () => {
   return (
      <>
         <Loader2Icon className="animate-spin" />
         Bentar ya, lagi loading...
      </>
   );
};

export const toNumber = (val: unknown, fallback = 0): number => {
   if (typeof val === "number") return val;
   if (typeof val === "string") {
      const num = Number(val);
      return Number.isNaN(num) ? fallback : num;
   }
   return fallback;
};

export const toRupiah = (val: unknown): string => {
   const num = toNumber(val);
   return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);
};

export const formatRupiah = (value: string) => {
   const numericValue = value.replace(/\D/g, "");
   return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export function loadingSpinner() {
   return (
      <div className="flex items-center space-x-2 text-xs">
         <div className="w-4 h-4 border-2 border-t-blue-500 border-gray-300 rounded-full animate-spin" />
         <span className="text-gray-700 font-medium">Loading...</span>
      </div>
   );
}

export function getFirstHash(url: string): string {
   const hashIndex = url.indexOf("#");
   if (hashIndex === -1) return "";
   const hashPart = url.substring(hashIndex); // ambil dari #
   return hashPart.split("&")[0];
}

export const getYearOptions = () => {
   const currentYear = new Date().getFullYear();
   return Array.from({ length: 10 }, (_, i) => ({
      label: (currentYear - i).toString(),
      value: (currentYear - i).toString(),
   }));
};

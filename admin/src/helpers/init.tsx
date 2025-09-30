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

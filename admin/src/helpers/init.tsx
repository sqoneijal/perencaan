import { Badge } from "@/components/ui/badge";
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

export const getStatusUsulanKegiatan = (status?: string) => {
   const obj = {
      draft: "Draft",
      submitted: "Submitted",
      verified: "Verified",
      rejected: "Rejected",
   };

   const colorMap = {
      draft: "bg-gray-100 text-black",
      submitted: "bg-sky-400",
      verified: "bg-green-400",
      rejected: "bg-red-400",
   };

   return status && status in obj ? (
      <Badge className={`${colorMap[status as keyof typeof colorMap]} text-[10px] font-bold`}>{obj[status as keyof typeof obj]}</Badge>
   ) : null;
};

export const getStatusValidasiRAB = (status?: string) => {
   const obj = {
      perbaiki: "Perbaiki",
      valid: "Valid",
      tidak_valid: "Tidak Valid",
   };

   const colorMap = {
      perbaiki: "bg-orange-400",
      valid: "bg-green-400",
      tidak_valid: "bg-red-400",
   };

   return status && status in obj ? (
      <Badge className={`${colorMap[status as keyof typeof colorMap]} text-[10px] font-bold`}>{obj[status as keyof typeof obj]}</Badge>
   ) : (
      <Badge className="text-[10px] font-bold bg-gray-100 text-black">Draft</Badge>
   );
};

export const getStatusValidasiSesuai = (status?: string) => {
   const obj = {
      sesuai: "Sesuai",
      tidak_sesuai: "Tidak Sesuai",
   };

   const colorMap = {
      sesuai: "bg-green-400",
      tidak_sesuai: "bg-red-400",
   };

   return status && status in obj ? (
      <Badge className={`${colorMap[status as keyof typeof colorMap]} text-[10px] font-bold`}>{obj[status as keyof typeof obj]}</Badge>
   ) : (
      <Badge className="text-[10px] font-bold bg-gray-100 text-black">Draft</Badge>
   );
};

export const detailLabel = ({ label, value }: { label?: string; value?: React.ReactNode }) => {
   return (
      <div className="mt-2">
         <div className="block text-sm font-medium text-gray-600">{label}</div>
         <p className="mt-1 text-gray-900">{value}</p>
      </div>
   );
};

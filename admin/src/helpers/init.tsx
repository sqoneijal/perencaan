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

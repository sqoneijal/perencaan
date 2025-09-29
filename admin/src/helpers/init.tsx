import type { Lists } from "@/types/init";

export const getValue = (original: Lists, field: string) => {
   return typeof original?.[field] === "string" ? original?.[field] : "";
};

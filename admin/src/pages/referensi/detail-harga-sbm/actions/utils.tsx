import type { Lists } from "@/types/init";

export function findIDUnitSatuan(arr: Array<Lists>, id: string) {
   const item = arr.find((row) => row.id === id);
   return item ? item.id_unit_satuan : null;
}

export const getTahunAnggaranOptions = () => {
   const currentYear = new Date().getFullYear();
   const options = [];
   for (let i = 0; i < 5; i++) {
      const year = currentYear - i;
      options.push({ value: year.toString(), label: year.toString() });
   }
   return options;
};

export const getStatusValidasiOptions = () => {
   return [
      { value: "draft", label: "Draft" },
      { value: "valid", label: "Valid" },
      { value: "kadaluarsa", label: "Kadaluarsa" },
   ];
};

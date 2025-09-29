import { Button } from "@/components/ui/button";
import { getValue } from "@/helpers/init";
import type { Lists } from "@/types/init";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";
import type { NavigateFunction } from "react-router";

type ColumnDeps = { navigate: NavigateFunction };

const getColumns = ({ navigate }: ColumnDeps): Array<ColumnDef<Lists>> => [
   {
      accessorKey: "aksi",
      header: "",
      cell: ({ row: { original } }) => {
         return (
            <>
               <Button variant="ghost" size="icon" onClick={() => navigate(`/referensi/unit-satuan/${getValue(original, "id")}`)}>
                  <Pencil />
               </Button>
               <Button variant="ghost" size="icon" onClick={() => navigate(`/referensi/unit-satuan/${getValue(original, "id")}`)}>
                  <Trash />
               </Button>
            </>
         );
      },
      meta: { className: "text-start w-[50px]" },
   },
   {
      accessorKey: "nama",
      header: "nama",
      enableSorting: true,
   },
   {
      accessorKey: "deskripsi",
      header: "deskripsi",
      enableSorting: true,
   },
   {
      accessorKey: "status",
      header: "status",
      enableSorting: true,
   },
];
export { getColumns };

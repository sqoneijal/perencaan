import ConfirmDialog from "@/components/confirm-delete";
import { Button } from "@/components/ui/button";
import { getValue } from "@/helpers/init";
import type { Lists } from "@/types/init";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import type { NavigateFunction } from "react-router";

type ColumnDeps = { navigate: NavigateFunction; limit: number; offset: number };

const getColumns = ({ navigate, limit, offset }: ColumnDeps): Array<ColumnDef<Lists>> => [
   {
      accessorKey: "aksi",
      header: "",
      cell: ({ row: { original } }) => {
         return (
            <>
               <Button variant="ghost" size="sm" onClick={() => navigate(`/unit-kerja/lembaga/actions/${getValue(original, "id")}`)}>
                  <Pencil />
               </Button>
               <ConfirmDialog url={`/unit-kerja/lembaga/actions/${getValue(original, "id")}`} refetchKey={["unit-kerja", "lembaga", limit, offset]} />
            </>
         );
      },
      meta: { className: "text-start w-[100px]" },
   },
   {
      accessorKey: "nama",
      header: "nama",
      enableSorting: true,
   },
   {
      accessorKey: "nama_biro",
      header: "biro",
      enableSorting: true,
   },
];
export { getColumns };

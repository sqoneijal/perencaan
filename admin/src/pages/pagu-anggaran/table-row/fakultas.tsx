import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import { toRupiah } from "@/helpers/init";
import type { Lists } from "@/types/init";
import React, { lazy } from "react";

const Prodi = lazy(() => import("./prodi"));

const loading_level_3 = Array.from({ length: 5 }, (_, i) => (
   <TableRow key={`loading-level-3-${i}`}>
      <TableCell className="w-[20px]">
         <Skeleton className="h-4 w-full" />
      </TableCell>
      <TableCell className="w-[20px]">
         <Skeleton className="h-4 w-full" />
      </TableCell>
      <TableCell className="w-[20px]">
         <Skeleton className="h-4 w-full" />
      </TableCell>
      <TableCell>
         <Skeleton className="h-4 w-full" />
      </TableCell>
      <TableCell>
         <Skeleton className="h-4 w-full" />
      </TableCell>
      <TableCell>
         <Skeleton className="h-4 w-full" />
      </TableCell>
   </TableRow>
));

export default function Fakultas({
   paguFakultas,
   tableCellClass,
   id_biro,
   paguProdi,
   isLoadingPaguProdi,
   actionButton,
   actionText,
   editFormBiro,
}: {
   paguFakultas: Array<Lists>;
   tableCellClass: string;
   id_biro: string;
   isLoadingPaguProdi: boolean;
   paguProdi: Array<Lists>;
   actionButton: (row: Lists, pagu: string) => React.ReactElement;
   actionText: () => React.ReactElement;
   editFormBiro: string;
}) {
   return paguFakultas
      .filter((e) => e.id_biro === id_biro)
      .map((row) => {
         return (
            <React.Fragment key={`fakultas-${row.id}`}>
               <TableRow>
                  <TableCell className="w-[20px]" />
                  <TableCell className="w-[20px]" />
                  <TableCell className={tableCellClass} colSpan={2}>
                     {row.nama}
                  </TableCell>
                  <TableCell className={tableCellClass}>{toRupiah(row.realisasi)}</TableCell>
                  <TableCell className={tableCellClass}>{editFormBiro === `fakultas_${row.id}` ? actionText() : toRupiah(row.total_pagu)}</TableCell>
                  <TableCell className={tableCellClass}>{actionButton(row, "fakultas")}</TableCell>
               </TableRow>
               {isLoadingPaguProdi ? (
                  loading_level_3
               ) : (
                  <Prodi
                     paguProdi={paguProdi}
                     tableCellClass={tableCellClass}
                     id_fakultas={row.id as string}
                     actionButton={actionButton}
                     actionText={actionText}
                     editFormBiro={editFormBiro}
                  />
               )}
            </React.Fragment>
         );
      });
}

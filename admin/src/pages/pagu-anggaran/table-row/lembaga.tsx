import { TableCell, TableRow } from "@/components/ui/table";
import { toRupiah } from "@/helpers/init";
import type { Lists } from "@/types/init";

export default function Lembaga({
   paguLembaga,
   tableCellClass,
   id_biro,
   actionButton,
   actionText,
   editFormBiro,
}: {
   paguLembaga: Array<Lists>;
   tableCellClass: string;
   id_biro: string;
   actionButton: (row: Lists, pagu: string) => React.ReactElement;
   actionText: () => React.ReactElement;
   editFormBiro: string;
}) {
   return paguLembaga
      .filter((e) => e.id_biro === id_biro)
      .map((row) => {
         return (
            <TableRow key={`lembaga-${row.id}`}>
               <TableCell className="w-[20px]" />
               <TableCell className="w-[20px]" />
               <TableCell className={tableCellClass} colSpan={2}>
                  {row.nama}
               </TableCell>
               <TableCell className={tableCellClass}>{toRupiah(row.realisasi)}</TableCell>
               <TableCell className={tableCellClass}>{editFormBiro === `lembaga_${row.id}` ? actionText() : toRupiah(row.total_pagu)}</TableCell>
               <TableCell className={tableCellClass}>{actionButton(row, "lembaga")}</TableCell>
            </TableRow>
         );
      });
}

import { TableCell, TableRow } from "@/components/ui/table";
import { toRupiah } from "@/helpers/init";
import type { Lists } from "@/types/init";

export default function Prodi({ paguProdi, tableCellClass, id_fakultas }: { paguProdi: Array<Lists>; tableCellClass: string; id_fakultas: string }) {
   return paguProdi
      .filter((e) => e.id_fakultas === id_fakultas)
      .map((row) => (
         <TableRow key={`prodi-${row.id}`}>
            <TableCell className="w-[20px]" />
            <TableCell className="w-[20px]" />
            <TableCell className="w-[20px]" />
            <TableCell className={tableCellClass}>{row.program_studi}</TableCell>
            <TableCell className={tableCellClass}>{toRupiah(row.realisasi)}</TableCell>
            <TableCell className={tableCellClass}>{toRupiah(row.total_pagu)}</TableCell>
         </TableRow>
      ));
}

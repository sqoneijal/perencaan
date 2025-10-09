import { FormSelect } from "@/components/forms";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toRupiah } from "@/helpers/init";
import { useOptions, useTahunAnggaran } from "@/hooks/store";
import React from "react";
import { Skeleton } from "../../components/ui/skeleton";
import { useInit, useInitPaguBiro, useInitPaguFakultas } from "./init";

export default function Page() {
   const { options } = useOptions();
   const { paguUniversitas, isLoadingPaguUniversitas } = useInit();
   const { setTahunAnggaran, tahunAnggaran } = useTahunAnggaran();
   const { paguBiro, isLoading: isLoadingPaguBiro } = useInitPaguBiro();
   const { paguFakultas, isLoading: isLoadingPaguFakultas } = useInitPaguFakultas(paguBiro);

   const tableHeadClass = "h-8 text-xs font-medium text-gray-500 uppercase tracking-wider";
   const tableCellClass = "font-medium p-1 pl-2 px-3 py-1 text-sm text-gray-900 h-8 whitespace-normal break-words";

   if (isLoadingPaguUniversitas) {
      return (
         <div className="p-0">
            <div className="border rounded-lg p-6 shadow-sm bg-white space-y-4">
               {Array.from({ length: 5 }, (_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
               ))}
            </div>
         </div>
      );
   }

   return (
      <div className="p-0">
         <div className="border rounded-lg p-6 shadow-sm bg-white space-y-4">
            <div className="row">
               <div className="col-12 col-md-2">
                  <FormSelect
                     label="Tahun Anggaran"
                     name="tahun_anggaran"
                     options={
                        Array.isArray(options?.daftarTahunAnggaran)
                           ? options.daftarTahunAnggaran.map((row) => ({
                                label: row.tahun_anggaran,
                                value: row.tahun_anggaran,
                             }))
                           : []
                     }
                     value={tahunAnggaran}
                     onValueChange={(value) => setTahunAnggaran(value)}
                  />
               </div>
            </div>
            <div className="overflow-hidden rounded-lg border shadow-sm">
               <Table className="w-full">
                  <TableHeader className="bg-muted sticky top-0 z-10">
                     <TableRow>
                        <TableHead className={tableHeadClass} colSpan={3}>
                           Unit
                        </TableHead>
                        <TableHead className={tableHeadClass}>Realisasi</TableHead>
                        <TableHead className={tableHeadClass}>Jumlah Pagu</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody className="font-medium divide-y divide-gray-200">
                     <TableRow>
                        <TableCell className={tableCellClass} colSpan={3}>
                           Universitas
                        </TableCell>
                        <TableCell className={tableCellClass}>{toRupiah(paguUniversitas.realisasi)}</TableCell>
                        <TableCell className={tableCellClass}>{toRupiah(paguUniversitas.total_pagu)}</TableCell>
                     </TableRow>
                     {isLoadingPaguBiro
                        ? Array.from({ length: 5 }, (_, i) => (
                             <TableRow key={`skeleton-${i}`}>
                                <TableCell />
                                <TableCell>
                                   <Skeleton className="h-4 w-full" />
                                </TableCell>
                             </TableRow>
                          ))
                        : paguBiro.map((row) => {
                             return (
                                <React.Fragment key={`biro-${row.id}`}>
                                   <TableRow>
                                      <TableCell className="w-[20px]" />
                                      <TableCell className={tableCellClass} colSpan={2}>
                                         {row.nama}
                                      </TableCell>
                                      <TableCell className={tableCellClass}>{toRupiah(row.realisasi)}</TableCell>
                                      <TableCell className={tableCellClass}>{toRupiah(row.total_pagu)}</TableCell>
                                   </TableRow>
                                   {isLoadingPaguFakultas
                                      ? Array.from({ length: 5 }, (_, i) => (
                                           <TableRow key={`skeleton-fakultas-${i}`}>
                                              <TableCell />
                                              <TableCell>
                                                 <Skeleton className="h-4 w-full" />
                                              </TableCell>
                                           </TableRow>
                                        ))
                                      : paguFakultas
                                           .filter((e) => e.id_biro === row.id)
                                           .map((fakultas) => {
                                              return (
                                                 <TableRow key={`fakultas-${fakultas.id}`}>
                                                    <TableCell className="w-[20px]" />
                                                    <TableCell className="w-[20px]" />
                                                    <TableCell className={tableCellClass}>{fakultas.nama}</TableCell>
                                                    <TableCell className={tableCellClass}>{toRupiah(fakultas.realisasi)}</TableCell>
                                                    <TableCell className={tableCellClass}>{toRupiah(fakultas.total_pagu)}</TableCell>
                                                 </TableRow>
                                              );
                                           })}
                                </React.Fragment>
                             );
                          })}
                  </TableBody>
               </Table>
            </div>
         </div>
      </div>
   );
}

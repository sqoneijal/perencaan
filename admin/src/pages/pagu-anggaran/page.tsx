import { FormSelect } from "@/components/forms";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toRupiah } from "@/helpers/init";
import { useOptions, useTahunAnggaran } from "@/hooks/store";
import React, { lazy, Suspense } from "react";
import { Skeleton } from "../../components/ui/skeleton";
import { useInit, useInitPaguBiro, useInitPaguFakultas, useInitPaguLembaga, useInitPaguProgramStudi, useInitPaguUPT } from "./init";

const Fakultas = lazy(() => import("./table-row/fakultas"));
const Lembaga = lazy(() => import("./table-row/lembaga"));
const Upt = lazy(() => import("./table-row/upt"));

const loading_level_1 = Array.from({ length: 5 }, (_, i) => (
   <TableRow key={`loading-level-1-${i}`}>
      <TableCell className="w-[20px]" />
      <TableCell colSpan={3}>
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

const loading_level_2 = Array.from({ length: 5 }, (_, i) => (
   <TableRow key={`loading-level-2-${i}`}>
      <TableCell className="w-[20px]">
         <Skeleton className="h-4 w-full" />
      </TableCell>
      <TableCell className="w-[20px]">
         <Skeleton className="h-4 w-full" />
      </TableCell>
      <TableCell colSpan={2}>
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

export default function Page() {
   const { options } = useOptions();
   const { paguUniversitas, isLoadingPaguUniversitas } = useInit();
   const { setTahunAnggaran, tahunAnggaran } = useTahunAnggaran();
   const { paguBiro, isLoading: isLoadingPaguBiro } = useInitPaguBiro();
   const { paguFakultas, isLoading: isLoadingPaguFakultas } = useInitPaguFakultas(paguBiro);
   const { paguLembaga, isLoading: isLoadingPaguLembaga } = useInitPaguLembaga(paguBiro);
   const { paguUPT, isLoading: isLoadingPaguUPT } = useInitPaguUPT(paguBiro);
   const { paguProdi, isLoading: isLoadingPaguProdi } = useInitPaguProgramStudi(paguFakultas);

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
                        <TableHead className={tableHeadClass} colSpan={4}>
                           Unit
                        </TableHead>
                        <TableHead className={tableHeadClass}>Realisasi</TableHead>
                        <TableHead className={tableHeadClass}>Jumlah Pagu</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody className="font-medium divide-y divide-gray-200">
                     <TableRow>
                        <TableCell className={tableCellClass} colSpan={4}>
                           Universitas
                        </TableCell>
                        <TableCell className={tableCellClass}>{toRupiah(paguUniversitas.realisasi)}</TableCell>
                        <TableCell className={tableCellClass}>{toRupiah(paguUniversitas.total_pagu)}</TableCell>
                     </TableRow>
                     {isLoadingPaguBiro
                        ? loading_level_1
                        : paguBiro.map((row) => {
                             return (
                                <React.Fragment key={`biro-${row.id}`}>
                                   <TableRow>
                                      <TableCell className="w-[20px]" />
                                      <TableCell className={tableCellClass} colSpan={3}>
                                         {row.nama}
                                      </TableCell>
                                      <TableCell className={tableCellClass}>{toRupiah(row.realisasi)}</TableCell>
                                      <TableCell className={tableCellClass}>{toRupiah(row.total_pagu)}</TableCell>
                                   </TableRow>
                                   {isLoadingPaguLembaga ? (
                                      loading_level_2
                                   ) : (
                                      <Suspense fallback={loading_level_2}>
                                         <Lembaga paguLembaga={paguLembaga} tableCellClass={tableCellClass} id_biro={row.id} />
                                      </Suspense>
                                   )}
                                   {isLoadingPaguUPT ? (
                                      loading_level_2
                                   ) : (
                                      <Suspense fallback={loading_level_2}>
                                         <Upt paguUPT={paguUPT} tableCellClass={tableCellClass} id_biro={row.id} />
                                      </Suspense>
                                   )}
                                   {isLoadingPaguFakultas ? (
                                      loading_level_2
                                   ) : (
                                      <Suspense fallback={loading_level_2}>
                                         <Fakultas
                                            paguFakultas={paguFakultas}
                                            tableCellClass={tableCellClass}
                                            id_biro={row.id}
                                            paguProdi={paguProdi}
                                            isLoadingPaguProdi={isLoadingPaguProdi}
                                         />
                                      </Suspense>
                                   )}
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

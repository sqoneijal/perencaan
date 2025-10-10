import { FormSelect, FormText } from "@/components/forms";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatRupiah, getValue, toRupiah } from "@/helpers/init";
import { useOptions, useTahunAnggaran } from "@/hooks/store";
import { cn } from "@/lib/utils";
import type { Lists } from "@/types/init";
import { Pencil, Save, SquareX } from "lucide-react";
import React, { lazy, Suspense } from "react";
import { Skeleton } from "../../components/ui/skeleton";
import { useInit, useInitPaguBiro, useInitPaguFakultas, useInitPaguLembaga, useInitPaguProgramStudi, useInitPaguUPT, usePaguUpdate } from "./init";

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
   const { setTahunAnggaran, tahunAnggaran } = useTahunAnggaran();
   const { paguBiro, isLoading: isLoadingPaguBiro } = useInitPaguBiro();
   const { paguFakultas, isLoading: isLoadingPaguFakultas } = useInitPaguFakultas(paguBiro);
   const { paguLembaga, isLoading: isLoadingPaguLembaga } = useInitPaguLembaga(paguBiro);
   const { paguUPT, isLoading: isLoadingPaguUPT } = useInitPaguUPT(paguBiro);
   const { paguProdi, isLoading: isLoadingPaguProdi } = useInitPaguProgramStudi(paguFakultas);
   const { editFormBiro, setEditFormBiro, formData, setFormData, handleSubmit } = usePaguUpdate();
   const { paguUniversitas, isLoadingPaguUniversitas, sisaPaguUniversitas } = useInit(paguBiro, paguFakultas, paguLembaga, paguUPT, paguProdi);

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

   const actionButton = (row: Lists, pagu: string) => {
      return editFormBiro === `${pagu}_${row.id as string}` ? (
         <div className="float-end">
            <Button
               variant="ghost"
               onClick={() => {
                  setEditFormBiro("");
                  setFormData({});
               }}>
               <SquareX />
            </Button>
            <Button variant="ghost" onClick={handleSubmit}>
               <Save />
            </Button>
         </div>
      ) : (
         <Button
            variant="ghost"
            className="size-6 float-end"
            onClick={() => {
               setEditFormBiro(`${pagu}_${row.id as string}`);
               setFormData({
                  total_pagu: formatRupiah(row.total_pagu as string),
                  id: row.id as string,
                  pagu,
               });
            }}>
            <Pencil />
         </Button>
      );
   };

   const actionText = () => {
      return (
         <FormText
            name={editFormBiro}
            value={getValue(formData, "total_pagu")}
            onChange={(value) => setFormData((prev) => ({ ...prev, total_pagu: formatRupiah(value) }))}
         />
      );
   };

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
                        <TableHead className={cn(tableHeadClass, "w-[80px]")} />
                     </TableRow>
                  </TableHeader>
                  <TableBody className="font-medium divide-y divide-gray-200">
                     <TableRow>
                        <TableCell className={tableCellClass} colSpan={4}>
                           Universitas
                        </TableCell>
                        <TableCell className={tableCellClass}>{toRupiah(paguUniversitas.realisasi)}</TableCell>
                        <TableCell className={tableCellClass} colSpan={2}>
                           <span className="text-start">{toRupiah(paguUniversitas.total_pagu)}</span>
                           <Badge variant="outline" className="float-end">
                              Sisa {toRupiah(sisaPaguUniversitas)}
                           </Badge>
                        </TableCell>
                     </TableRow>
                     {isLoadingPaguBiro
                        ? loading_level_1
                        : paguBiro.map((row) => {
                             return (
                                <React.Fragment key={`biro-${row.id as string}`}>
                                   <TableRow>
                                      <TableCell className="w-[20px]" />
                                      <TableCell className={tableCellClass} colSpan={3}>
                                         {row.nama}
                                      </TableCell>
                                      <TableCell className={tableCellClass}>{toRupiah(row.realisasi as string)}</TableCell>
                                      <TableCell className={tableCellClass}>
                                         {editFormBiro === `biro_${row.id as string}` ? actionText() : toRupiah(row.total_pagu as string)}
                                      </TableCell>
                                      <TableCell className={tableCellClass}>{actionButton(row, "biro")}</TableCell>
                                   </TableRow>
                                   {isLoadingPaguLembaga ? (
                                      loading_level_2
                                   ) : (
                                      <Suspense fallback={loading_level_2}>
                                         <Lembaga
                                            paguLembaga={paguLembaga}
                                            tableCellClass={tableCellClass}
                                            id_biro={row.id as string}
                                            actionButton={actionButton}
                                            actionText={actionText}
                                            editFormBiro={editFormBiro}
                                         />
                                      </Suspense>
                                   )}
                                   {isLoadingPaguUPT ? (
                                      loading_level_2
                                   ) : (
                                      <Suspense fallback={loading_level_2}>
                                         <Upt
                                            paguUPT={paguUPT}
                                            tableCellClass={tableCellClass}
                                            id_biro={row.id as string}
                                            actionButton={actionButton}
                                            actionText={actionText}
                                            editFormBiro={editFormBiro}
                                         />
                                      </Suspense>
                                   )}
                                   {isLoadingPaguFakultas ? (
                                      loading_level_2
                                   ) : (
                                      <Suspense fallback={loading_level_2}>
                                         <Fakultas
                                            paguFakultas={paguFakultas}
                                            tableCellClass={tableCellClass}
                                            id_biro={row.id as string}
                                            paguProdi={paguProdi}
                                            isLoadingPaguProdi={isLoadingPaguProdi}
                                            actionButton={actionButton}
                                            actionText={actionText}
                                            editFormBiro={editFormBiro}
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

import ConfirmDialog from "@/components/confirm-delete";
import { FormSelect, FormText, FormTextarea } from "@/components/forms";
import Table from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { btn_loading, formatRupiah, getValue, getYearOptions, toNumber, toRupiah } from "@/helpers/init";
import { useDialog, useHeaderButton, useTablePagination } from "@/hooks/store";
import { queryClient } from "@/lib/queryClient";
import { useApiQuery, usePostMutation } from "@/lib/useApi";
import type { Lists, Option } from "@/types/init";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import moment from "moment";
import { Suspense, useEffect, useState } from "react";
import { useNavigate, useParams, type NavigateFunction } from "react-router";
import { toast } from "sonner";
import { loadingElement } from "../helper";

const renderTanggalEfektif = (tanggal_mulai: string, tanggal_akhir: string) => {
   const content: React.ReactNode = moment(tanggal_mulai).format("DD-MM-YYYY");

   if (tanggal_akhir) {
      return (
         <>
            {content} s.d {moment(tanggal_akhir).format("DD-MM-YYYY")}
         </>
      );
   }
   return content;
};

const getColumnsDialog = (): Array<ColumnDef<Lists>> => [
   {
      accessorKey: "kode_standar_biaya",
      header: "kode",
      enableSorting: true,
   },
   {
      accessorKey: "nama_standar_biaya",
      header: "nama",
      enableSorting: true,
   },
   {
      accessorKey: "tahun_anggaran",
      header: "tahun",
      enableSorting: true,
   },
   {
      accessorKey: "harga_satuan",
      header: "harga",
      enableSorting: true,
      cell: ({ row: { original } }) => toRupiah(getValue(original, "harga_satuan")),
   },
   {
      accessorKey: "nama_satuan",
      header: "satuan",
      enableSorting: true,
      cell: ({ row: { original } }) => (
         <Tooltip>
            <TooltipTrigger>{getValue(original, "nama_satuan")}</TooltipTrigger>
            <TooltipContent>{getValue(original, "status_satuan") === "t" ? "Aktif" : "Tidak Aktif"}</TooltipContent>
         </Tooltip>
      ),
   },
   {
      accessorKey: "efektif",
      header: "efektif",
      enableSorting: true,
      cell: ({ row: { original } }) => renderTanggalEfektif(getValue(original, "tanggal_mulai_efektif"), getValue(original, "tanggal_akhir_efektif")),
   },
   {
      accessorKey: "status_validasi",
      header: "status",
      enableSorting: true,
      cell: ({ row: { original } }) => (
         <Badge variant="outline">{getValue(original, "status_validasi").replace(/\b\w/g, (l) => l.toUpperCase())}</Badge>
      ),
   },
];

function DialogReferensiHargaSBM({
   open,
   setOpen,
   onRowClick,
}: Readonly<{ open: boolean; setOpen: (open: boolean) => void; onRowClick: (row: Lists) => void }>) {
   const { pagination } = useTablePagination();

   const limit = pagination.pageSize;
   const offset = pagination.pageIndex * pagination.pageSize;

   const [year, setYear] = useState(moment().year().toString());
   const [status_validasi, setStatus_validasi] = useState("");
   const [search, setSearch] = useState("");

   const { data, isLoading, error } = useApiQuery<{
      results: Array<Lists>;
      total: number;
   }>({
      queryKey: ["referensi", "detail-harga-sbm", limit, offset, search, year, status_validasi],
      url: "/referensi/detail-harga-sbm",
      params: { limit, offset, search, year, status_validasi },
   });

   if (error) return toast.error(error?.message);

   return (
      <Dialog open={open} onOpenChange={() => setOpen(false)}>
         <DialogContent className="w-auto min-h-0 sm:max-w-none">
            <DialogHeader>
               <DialogTitle>Daftar Harga SBM</DialogTitle>
               <DialogDescription>
                  Daftar Harga SBM berisi standar biaya yang sudah ditetapkan pemerintah, silakan pilih sesuai kebutuhan dari daftar yang tersedia.
               </DialogDescription>
            </DialogHeader>
            <ScrollArea className="w-full max-h-[calc(100vh-200px)] min-h-0">
               <div className="mb-4 row">
                  <div className="col-12 col-md-4">
                     <FormText label="Cari detail harga SBM..." value={search} onChange={setSearch} name="search" withLabel={false} />
                  </div>
                  <div className="col-12 col-md-2">
                     <FormSelect
                        withLabel={false}
                        label="Tahun"
                        name="year"
                        options={getYearOptions()}
                        value={year.toString()}
                        onValueChange={(value) => setYear(value)}
                        disabled={false}
                     />
                  </div>
                  <div className="col-12 col-md-2">
                     <FormSelect
                        withLabel={false}
                        label="Status"
                        name="status_validasi"
                        options={[
                           { value: "draft", label: "Draft" },
                           { value: "valid", label: "Valid" },
                           { value: "kadaluarsa", label: "Kadaluarsa" },
                        ]}
                        value={status_validasi}
                        onValueChange={(value) => setStatus_validasi(value)}
                        disabled={false}
                     />
                  </div>
               </div>
               <Table
                  columns={getColumnsDialog()}
                  data={Array.isArray(data?.results) ? data?.results : []}
                  total={data?.total ?? 0}
                  isLoading={isLoading}
                  trCursor={true}
                  onRowClick={onRowClick}
               />
            </ScrollArea>
         </DialogContent>
      </Dialog>
   );
}

function DialogAction() {
   const { open, setOpen } = useDialog();
   const { id_usulan_kegiatan } = useParams();
   const { pagination } = useTablePagination();

   const [formData, setFormData] = useState<Lists>({});
   const [errors, setErrors] = useState<Lists>({});
   const [openReferensiSBM, setOpenReferensiSBM] = useState(false);

   const limit = pagination.pageSize;
   const offset = pagination.pageSize * pagination.pageIndex;

   const submit = usePostMutation<{ errors: Lists }>(`/usulan-kegiatan/${id_usulan_kegiatan}/rab/actions`);

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      submit.mutate(
         {
            ...formData,
            harga_satuan: getValue(formData, "harga_satuan").toString().replace(/\./g, ""),
         },
         {
            onSuccess: (data) => {
               setErrors(data?.errors ?? {});
               if (data?.status) {
                  setFormData({});
                  setOpen(false);
                  queryClient.refetchQueries({ queryKey: ["usulan-kegiatan", id_usulan_kegiatan, "rab", limit, offset] });
                  queryClient.refetchQueries({ queryKey: ["usulan-kegiatan", id_usulan_kegiatan, "anggaran"] });
                  queryClient.refetchQueries({ queryKey: ["usulan-kegiatan", limit, offset] });
                  toast.success(data?.message);
                  return;
               }

               toast.error(data?.message);
            },
            onError: (error: Error) => {
               toast.error(error.message);
            },
         }
      );
   };

   const { data, isLoading, error } = useApiQuery<{ daftarUnitSatuan: Array<Option> }>({
      queryKey: ["usulan-kegiatan", id_usulan_kegiatan, "rab", "actions"],
      url: `/usulan-kegiatan/${id_usulan_kegiatan}/rab/actions`,
   });

   const handleRowClick = (row: Lists) => {
      setFormData((prev) => ({
         ...prev,
         total_biaya: (1 * toNumber(getValue(row, "harga_satuan").toString().replace(/\./g, ""))).toString(),
         harga_satuan: formatRupiah(getValue(row, "harga_satuan")),
         id_satuan: getValue(row, "id_satuan"),
      }));
      setOpenReferensiSBM(false);
   };

   if (isLoading) return loadingElement;

   if (error) return toast.error(error?.message);

   return (
      <Dialog open={open} onOpenChange={() => setOpen(false)}>
         <DialogContent className="w-auto min-h-0 sm:max-w-none">
            <DialogHeader>
               <DialogTitle>RAB</DialogTitle>
               <DialogDescription>
                  RAB (Rencana Anggaran Biaya) adalah perincian rencana biaya yang dibutuhkan untuk suatu kegiatan atau proyek, digunakan sebagai
                  acuan pengajuan dan pengendalian anggaran.
               </DialogDescription>
            </DialogHeader>
            <ScrollArea className="w-full max-h-[calc(100vh-200px)] min-h-0">
               <Suspense fallback={loadingElement}>
                  <DialogReferensiHargaSBM open={openReferensiSBM} setOpen={() => setOpenReferensiSBM(false)} onRowClick={handleRowClick} />
               </Suspense>
               <div className="space-y-4">
                  <div className="row">
                     <div className="col-12 col-md-3">
                        <FormText
                           type="number"
                           label="Qty"
                           name="qty"
                           value={getValue(formData, "qty")}
                           onChange={(value) =>
                              setFormData((prev) => ({
                                 ...prev,
                                 qty: value,
                                 total_biaya: (
                                    toNumber(value) * toNumber(getValue(formData, "harga_satuan").toString().replace(/\./g, ""))
                                 ).toString(),
                              }))
                           }
                           errors={errors}
                        />
                     </div>
                     <div className="col-12 col-md-3">
                        <FormSelect
                           label="Satuan"
                           name="id_satuan"
                           value={getValue(formData, "id_satuan")}
                           onValueChange={(value) => setFormData((prev) => ({ ...prev, id_satuan: value }))}
                           errors={errors}
                           options={(data?.data?.daftarUnitSatuan as Array<Lists>).map((item) => ({
                              value: item.id,
                              label: item.nama,
                              tooltip: item.deskripsi,
                           }))}
                        />
                     </div>
                     <div className="col-12 col-md-6">
                        <FormText
                           label="Harga Satuan"
                           name="harga_satuan"
                           value={getValue(formData, "harga_satuan")}
                           onChange={(value) => {
                              const formatted = formatRupiah(value);
                              setFormData((prev) => ({
                                 ...prev,
                                 harga_satuan: formatted,
                                 total_biaya: (toNumber(getValue(formData, "qty")) * toNumber(value.toString().replace(/\./g, ""))).toString(),
                              }));
                           }}
                           errors={errors}
                        />
                     </div>
                  </div>
                  <div className="row">
                     <div className="col-12 col-md-6">
                        <FormText
                           label="Total Biaya"
                           name="total_biaya"
                           value={toRupiah(getValue(formData, "total_biaya"))}
                           errors={errors}
                           disabled={true}
                        />
                     </div>
                  </div>
                  <div className="row">
                     <div className="col-12 col-md-6 mb-3">
                        <FormTextarea
                           label="Uraian Biaya"
                           name="uraian_biaya"
                           value={getValue(formData, "uraian_biaya")}
                           onChange={(value) => setFormData((prev) => ({ ...prev, uraian_biaya: value }))}
                           errors={errors}
                        />
                     </div>
                     <div className="col-12 col-md-6 mb-3">
                        <FormTextarea
                           label="Catatan"
                           name="catatan"
                           value={getValue(formData, "catatan")}
                           onChange={(value) => setFormData((prev) => ({ ...prev, catatan: value }))}
                           errors={errors}
                        />
                     </div>
                  </div>
                  <Button size="sm" disabled={submit.isPending} onClick={handleSubmit}>
                     {submit.isPending ? btn_loading() : "Simpan"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setOpenReferensiSBM(true)} className="float-end">
                     Referensi Harga SBM
                  </Button>
               </div>
            </ScrollArea>
         </DialogContent>
      </Dialog>
   );
}

type ColumnDeps = { navigate: NavigateFunction; limit: number; offset: number };

const getColumns = ({ navigate, limit, offset }: ColumnDeps): Array<ColumnDef<Lists>> => [
   {
      accessorKey: "aksi",
      header: "",
      cell: ({ row: { original } }) => {
         return (
            <>
               <Button variant="ghost" size="sm" onClick={() => navigate(`${getValue(original, "id")}`)}>
                  <Pencil />
               </Button>
               <ConfirmDialog
                  url={`/usulan-kegiatan/actions/rab/${getValue(original, "id")}`}
                  refetchKey={[
                     ["usulan-kegiatan", getValue(original, "id_usulan"), "rab", limit, offset],
                     ["usulan-kegiatan", getValue(original, "id_usulan"), "anggaran"],
                     ["usulan-kegiatan", limit, offset],
                  ]}
               />
            </>
         );
      },
      meta: { className: "text-start w-[100px]" },
   },
   {
      accessorKey: "uraian_biaya",
      header: "uraian",
      enableSorting: true,
   },
   {
      accessorKey: "qty",
      header: "qty",
      enableSorting: true,
   },
   {
      accessorKey: "id_satuan",
      header: "satuan",
      enableSorting: true,
      cell: ({ row: { original } }) => (
         <Tooltip>
            <TooltipTrigger>{getValue(original, "nama_satuan")}</TooltipTrigger>
            <TooltipContent>{getValue(original, "deskripsi_satuan")}</TooltipContent>
         </Tooltip>
      ),
   },
   {
      accessorKey: "harga_satuan",
      header: "harga",
      enableSorting: true,
      cell: ({ row: { original } }) => toRupiah(getValue(original, "harga_satuan")),
   },
   {
      accessorKey: "total_biaya",
      header: "total biaya",
      enableSorting: true,
      cell: ({ row: { original } }) => toRupiah(getValue(original, "total_biaya")),
   },
   {
      accessorKey: "catatan",
      header: "catatan",
      enableSorting: true,
   },
];

export default function Page() {
   const { pagination } = useTablePagination();
   const { setButton } = useHeaderButton();
   const { id_usulan_kegiatan } = useParams();
   const { setOpen } = useDialog();

   const limit = pagination.pageSize;
   const offset = pagination.pageSize * pagination.pageIndex;
   const navigate = useNavigate();

   const { data, isLoading, error } = useApiQuery<{
      results: Array<Lists>;
      total: number;
   }>({
      queryKey: ["usulan-kegiatan", id_usulan_kegiatan, "rab", limit, offset],
      url: `/usulan-kegiatan/${id_usulan_kegiatan}/rab`,
      params: { limit, offset },
   });

   useEffect(() => {
      setButton(
         <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            Tambah RAB
         </Button>
      );

      return () => {
         setButton(<div />);
      };
   }, [setButton, setOpen]);

   if (error) return toast.error(error?.message);

   return (
      <>
         <Suspense fallback={loadingElement}>
            <DialogAction />
         </Suspense>
         <Table
            columns={getColumns({ navigate, limit, offset })}
            data={Array.isArray(data?.results) ? data?.results : []}
            total={data?.total ?? 0}
            isLoading={isLoading}
         />
      </>
   );
}

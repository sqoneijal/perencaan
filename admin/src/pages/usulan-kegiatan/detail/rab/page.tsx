import Table from "@/components/table";
import { Button } from "@/components/ui/button";
import { useDialog, useHeaderButton, useTablePagination } from "@/hooks/store";
import { useApiQuery } from "@/lib/useApi";
import type { Lists } from "@/types/init";
import { lazy, Suspense, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { loadingElement } from "../helper";
import { getColumns } from "./column";

const DialogAction = lazy(() => import("./dialog-action"));

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

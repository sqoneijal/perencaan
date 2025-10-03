import Table from "@/components/table";
import { Suspense, lazy } from "react";
import { toast } from "sonner";
import { getColumns } from "./column";
import LoadingElement from "./loading-element";
import { useDokumen } from "./use-dokumen";

const ActionDialog = lazy(() => import("./action-dialog"));

export default function Page() {
   const { idUsulanKegiatanNum, limit, offset, navigate, data, isLoading, error } = useDokumen();

   if (error) return toast.error(error?.message);

   return (
      <>
         <Suspense fallback={<LoadingElement />}>
            <ActionDialog />
         </Suspense>
         <Table
            columns={getColumns({ navigate, limit, offset, id_usulan_kegiatan: idUsulanKegiatanNum })}
            data={Array.isArray(data?.results) ? data?.results : []}
            total={data?.total ?? 0}
            isLoading={isLoading}
         />
      </>
   );
}

import Table from "@/components/table";
import { Button } from "@/components/ui/button";
import { useHeaderButton, useTablePagination } from "@/hooks/store";
import { useApiQuery } from "@/lib/useApi";
import type { Lists } from "@/types/init";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { getColumns } from "./column";

export default function Page() {
   const { setButton } = useHeaderButton();
   const { pagination } = useTablePagination();

   const navigate = useNavigate();

   const limit = pagination.pageSize;
   const offset = pagination.pageIndex * pagination.pageSize;

   useEffect(() => {
      setButton(
         <Button variant="outline" size="sm" onClick={() => navigate("/usulan-kegiatan/actions")}>
            Tambah Usulan Kegiatan
         </Button>
      );
      return () => {
         setButton(<div />);
      };
   }, [setButton, navigate]);

   const { data, isLoading, error } = useApiQuery<{
      results: Array<Lists>;
      total: number;
   }>({
      queryKey: ["usulan-kegiatan", limit, offset],
      url: "/usulan-kegiatan",
      params: { limit, offset },
   });

   if (error) return toast.error(error?.message);

   return (
      <Table
         columns={getColumns({ navigate, limit, offset })}
         data={Array.isArray(data?.results) ? data?.results : []}
         total={data?.total ?? 0}
         isLoading={isLoading}
      />
   );
}

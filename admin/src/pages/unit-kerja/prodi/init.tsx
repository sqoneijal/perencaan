import { Button } from "@/components/ui/button";
import { useHeaderButton, useTablePagination } from "@/hooks/store";
import { queryClient } from "@/lib/queryClient";
import { useApiQuery } from "@/lib/useApi";
import type { Lists } from "@/types/init";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export function useInit() {
   const { pagination } = useTablePagination();

   const limit = pagination.pageSize;
   const offset = pagination.pageSize * pagination.pageIndex;

   const { data, isLoading, error } = useApiQuery<{
      results: Array<Lists>;
      total: number;
   }>({
      queryKey: ["unit-kerja", "program-studi", limit, offset],
      url: "/unit-kerja/program-studi",
      params: { limit, offset },
   });

   if (error) {
      toast.error(error?.message);
      queryClient.removeQueries({ queryKey: ["unit-kerja", "program-studi", limit, offset] });
   }

   const dataArray = Array.isArray(data?.results) ? data?.results : [];

   return { dataArray, isLoading, total: data?.total, limit, offset };
}

export function useButton() {
   const navigate = useNavigate();

   const { setButton } = useHeaderButton();

   useEffect(() => {
      setButton(
         <Button variant="outline" size="sm" onClick={() => navigate("/unit-kerja/program-studi/actions")}>
            Tambah Program Studi
         </Button>
      );
      return () => {
         setButton(<div />);
      };
   }, [setButton, navigate]);

   return <></>;
}

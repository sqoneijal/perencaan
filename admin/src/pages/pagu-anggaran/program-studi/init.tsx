import { Button } from "@/components/ui/button";
import { useHeaderButton, useTablePagination } from "@/hooks/store";
import { useApiQuery } from "@/lib/useApi";
import type { Lists } from "@/types/init";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export function usePaguProgramStudi() {
   const { pagination } = useTablePagination();
   const { setButton } = useHeaderButton();

   const navigate = useNavigate();
   const limit = pagination.pageSize;
   const offset = pagination.pageSize * pagination.pageIndex;

   useEffect(() => {
      setButton(
         <Button variant="outline" size="sm" onClick={() => navigate("/pagu-anggaran/program-studi/actions")}>
            Tambah Pagu Program Studi
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
      queryKey: ["pagu-anggaran", "program-studi", limit, offset],
      url: "/pagu-anggaran/program-studi",
      params: { limit, offset },
   });

   return { data, isLoading, error, navigate, limit, offset };
}

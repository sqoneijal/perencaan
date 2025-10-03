import { Button } from "@/components/ui/button";
import { useHeaderButton, useTablePagination } from "@/hooks/store";
import { useApiQuery } from "@/lib/useApi";
import type { Lists } from "@/types/init";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export function useMasterIKUPage() {
   const { setButton } = useHeaderButton();
   const { pagination } = useTablePagination();

   const navigate = useNavigate();
   const limit = pagination.pageSize;
   const offset = pagination.pageSize * pagination.pageIndex;

   useEffect(() => {
      setButton(
         <Button variant="outline" size="sm" onClick={() => navigate("/master-iku/actions")}>
            Tambah Master IKU
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
      queryKey: ["master-iku", limit, offset],
      url: "/master-iku",
      params: { limit, offset },
   });

   if (error) toast.error(error?.message);

   return { data, isLoading, error, limit, offset, navigate };
}

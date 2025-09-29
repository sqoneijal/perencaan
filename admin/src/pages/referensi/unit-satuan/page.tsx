import Table from "@/components/table";
import { Button } from "@/components/ui/button";
import { useHeaderButton } from "@/hooks/store";
import { useApiQuery } from "@/lib/useApi";
import type { Lists } from "@/types/init";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { getColumns } from "./column";

export default function Page() {
   const { setButton } = useHeaderButton();

   const navigate = useNavigate();

   useEffect(() => {
      setButton(
         <Button variant="outline" size="sm" onClick={() => navigate("/referensi/unit-satuan/actions")}>
            Tambah Unit Satuan
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
      queryKey: ["referensi", "unit-satuan"],
      url: "/referensi/unit-satuan",
   });

   if (error) return toast.error(error?.message);

   return (
      <Table
         columns={getColumns({ navigate })}
         data={Array.isArray(data?.results) ? data?.results : []}
         total={data?.total ?? 0}
         isLoading={isLoading}
      />
   );
}

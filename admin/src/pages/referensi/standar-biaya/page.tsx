import { FormText } from "@/components/forms";
import Table from "@/components/table";
import { Button } from "@/components/ui/button";
import { useHeaderButton, useTablePagination } from "@/hooks/store";
import { useApiQuery } from "@/lib/useApi";
import type { Lists } from "@/types/init";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { getColumns } from "./column";

export default function Page() {
   const { setButton } = useHeaderButton();
   const { pagination } = useTablePagination();

   const navigate = useNavigate();

   const [search, setSearch] = useState("");

   useEffect(() => {
      setButton(
         <Button variant="outline" size="sm" onClick={() => navigate("/referensi/standar-biaya/actions")}>
            Tambah Standar Biaya
         </Button>
      );
      return () => {
         setButton(<div />);
      };
   }, [setButton, navigate]);

   const limit = pagination?.pageSize;
   const offset = pagination?.pageIndex * pagination.pageSize;

   const { data, isLoading, error } = useApiQuery<{
      results: Array<Lists>;
      total: number;
   }>({
      queryKey: ["referensi", "standar-biaya", limit, offset, search],
      url: "/referensi/standar-biaya",
      params: { limit, offset, search },
   });

   if (error) return toast.error(error?.message);

   return (
      <>
         <div className="mb-4 max-w-sm">
            <FormText
               label="Cari standar biaya..."
               value={search}
               onChange={setSearch}
               name="search"
               withLabel={false}
               className="rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
         </div>
         <Table
            columns={getColumns({ navigate, limit, offset })}
            data={Array.isArray(data?.results) ? data?.results : []}
            total={data?.total ?? 0}
            isLoading={isLoading}
         />
      </>
   );
}

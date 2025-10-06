import { FormSelect, FormText } from "@/components/forms";
import Table from "@/components/table";
import { Button } from "@/components/ui/button";
import { useHeaderButton, useTablePagination } from "@/hooks/store";
import { useApiQuery, usePostMutation } from "@/lib/useApi";
import type { Lists } from "@/types/init";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { getColumns } from "./column";

export default function Page() {
   const { setButton } = useHeaderButton();
   const { pagination } = useTablePagination();

   const [search, setSearch] = useState("");
   const [status_usulan, setStatus_usulan] = useState("");

   const navigate = useNavigate();

   const limit = pagination.pageSize;
   const offset = pagination.pageIndex * pagination.pageSize;

   const { data, isLoading, error } = useApiQuery<{
      results: Array<Lists>;
      total: number;
   }>({
      queryKey: ["usulan-kegiatan", limit, offset, search, status_usulan],
      url: "/usulan-kegiatan",
      params: { limit, offset, search, status_usulan },
   });

   const submitUsulan = usePostMutation<{ errors: Lists }>("/usulan-kegiatan/actions/submit-pengajuan");

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

   if (error) return toast.error(error?.message);

   return (
      <>
         <div className="mb-4 row">
            <div className="col-12 col-md-3">
               <FormText label="Cari usulan kegiatan..." value={search} onChange={setSearch} name="search" withLabel={false} />
            </div>
            <div className="col-12 col-md-2">
               <FormSelect
                  withLabel={false}
                  label="status usulan"
                  name="status_usulan"
                  options={[
                     { value: "draft", label: "Draft" },
                     { value: "submitted", label: "Submitted" },
                     { value: "verified", label: "Verified" },
                     { value: "rejected", label: "Rejected" },
                  ]}
                  value={status_usulan}
                  onValueChange={(value) => setStatus_usulan(value)}
                  disabled={false}
               />
            </div>
         </div>
         <Table
            columns={getColumns({ navigate, limit, offset, submitUsulan })}
            data={Array.isArray(data?.results) ? data?.results : []}
            total={data?.total ?? 0}
            isLoading={isLoading}
         />
      </>
   );
}

import { FormSelect, FormText } from "@/components/forms";
import Table from "@/components/table";
import { Button } from "@/components/ui/button";
import { useHeaderButton, useTablePagination } from "@/hooks/store";
import { useApiQuery } from "@/lib/useApi";
import type { Lists } from "@/types/init";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { getColumns } from "./column";

export default function Page() {
   const { setButton } = useHeaderButton();
   const { pagination } = useTablePagination();

   const navigate = useNavigate();

   const [search, setSearch] = useState("");
   const [year, setYear] = useState(moment().year().toString());
   const [status_validasi, setStatus_validasi] = useState("");

   useEffect(() => {
      setButton(
         <Button variant="outline" size="sm" onClick={() => navigate("/referensi/detail-harga-sbm/actions")}>
            Tambah Detail Harga SBM
         </Button>
      );
      return () => {
         setButton(<div />);
      };
   }, [setButton, navigate]);

   const limit = pagination?.pageSize;
   const offset = pagination?.pageIndex * pagination.pageSize;

   // Prepare year options - last 10 years including current year
   const currentYear = new Date().getFullYear();
   const yearOptions = Array.from({ length: 10 }, (_, i) => ({
      label: (currentYear - i).toString(),
      value: (currentYear - i).toString(),
   }));

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
      <>
         <div className="mb-4 row">
            <div className="col-12 col-md-4">
               <FormText
                  label="Cari detail harga SBM..."
                  value={search}
                  onChange={setSearch}
                  name="search"
                  withLabel={false}
                  className="rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 flex-grow"
               />
            </div>
            <div className="col-12 col-md-2">
               <FormSelect
                  withLabel={false}
                  label="Tahun"
                  name="year"
                  options={yearOptions}
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
            columns={getColumns({ navigate, limit, offset })}
            data={Array.isArray(data?.results) ? data?.results : []}
            total={data?.total ?? 0}
            isLoading={isLoading}
         />
      </>
   );
}

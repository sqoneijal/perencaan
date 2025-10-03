import Table from "@/components/table";
import { getColumns } from "./column";
import { useMasterIKUPage } from "./use-page";

export default function Page() {
   const { data, isLoading, limit, offset, navigate } = useMasterIKUPage();

   return (
      <Table
         columns={getColumns({ navigate, limit, offset })}
         data={Array.isArray(data?.results) ? data?.results : []}
         total={data?.total ?? 0}
         isLoading={isLoading}
      />
   );
}

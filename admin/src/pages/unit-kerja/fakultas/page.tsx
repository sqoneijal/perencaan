import Table from "@/components/table";
import { useNavigate } from "react-router";
import { getColumns } from "./column";
import { useButton, useInit } from "./init";

export default function Page() {
   const { dataArray, isLoading, total, limit, offset } = useInit();
   useButton();

   const navigate = useNavigate();

   return <Table columns={getColumns({ navigate, limit, offset })} data={dataArray} total={total ?? 0} isLoading={isLoading} />;
}

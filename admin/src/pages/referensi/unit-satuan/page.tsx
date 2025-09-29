import Table from "@/components/table";
import { Button } from "@/components/ui/button";
import { useHeaderButton } from "@/hooks/store";
import { useEffect } from "react";
import { useNavigate } from "react-router";
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

   return <Table columns={getColumns(navigate)} data={[]} />;
}

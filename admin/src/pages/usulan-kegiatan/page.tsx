import { Button } from "@/components/ui/button";
import { useHeaderButton } from "@/hooks/store";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Page() {
   const { setButton } = useHeaderButton();

   const navigate = useNavigate();

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

   return <div>aewqfhakwehllkawhekajewhs</div>;
}

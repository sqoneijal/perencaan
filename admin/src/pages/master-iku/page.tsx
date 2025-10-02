import { Button } from "@/components/ui/button";
import { useHeaderButton } from "@/hooks/store";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Page() {
   const { setButton } = useHeaderButton();

   const navigate = useNavigate();

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

   return <div>aewhfkjawheflakhwef</div>;
}

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFirstHash } from "@/helpers/init";
import { useDialog, useHeaderButton } from "@/hooks/store";
import { lazy, Suspense, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { loadingElementFirst, loadingElementSecond } from "../helpers";
import { tabsList } from "./navigation";

const DialogPerbaiki = lazy(() => import("./dialog-perbaiki"));

export default function Page() {
   const { setButton } = useHeaderButton();
   const { setOpen } = useDialog();

   const location = useLocation();
   const navigate = useNavigate();

   useEffect(() => {
      setButton(
         <>
            <Button variant="outline" size="sm" className="bg-amber-200" onClick={() => setOpen(true)}>
               Perbaiki
            </Button>
            <Button variant="outline" size="sm" className="bg-lime-100">
               Terima Usulan Kegiatan
            </Button>
         </>
      );
      return () => {
         setButton(<div />);
      };
   }, [setButton, setOpen]);

   return (
      <div className="overflow-hidden rounded-lg border shadow-sm p-4">
         <Suspense fallback={loadingElementFirst}>
            <DialogPerbaiki />
         </Suspense>
         <Tabs defaultValue={getFirstHash(location.hash)}>
            <TabsList>
               {tabsList.map((row) => (
                  <TabsTrigger key={row.key} value={row.key} onClick={() => navigate(row.key)}>
                     {row.label}
                  </TabsTrigger>
               ))}
            </TabsList>
            {tabsList.map((row) => (
               <TabsContent key={row.key} value={row.key}>
                  <Suspense fallback={loadingElementSecond}>{row.element}</Suspense>
               </TabsContent>
            ))}
         </Tabs>
      </div>
   );
}

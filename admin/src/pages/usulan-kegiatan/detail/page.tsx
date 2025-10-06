import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFirstHash } from "@/helpers/init";

import { Button } from "@/components/ui/button";
import { useHeaderButton } from "@/hooks/store";
import { lazy, Suspense, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { loadingElement } from "./helper";

const InformasiDasar = lazy(() => import("./informasi-dasar"));
const Anggaran = lazy(() => import("./anggaran"));
const LatarBelakang = lazy(() => import("./latar-belakang"));
const Tujuan = lazy(() => import("./tujuan"));
const Sasaran = lazy(() => import("./sasaran"));
const Rab = lazy(() => import("./rab/page"));
const Iku = lazy(() => import("./iku/page"));
const Dokumen = lazy(() => import("./dokumen/page"));

export default function Page() {
   const { setButton } = useHeaderButton();

   const location = useLocation();
   const navigate = useNavigate();

   const [currentTab, setCurrentTab] = useState(getFirstHash(location.hash));

   useEffect(() => {
      setButton(
         <Button variant="outline" size="sm" onClick={() => navigate("/usulan-kegiatan")}>
            Kembali
         </Button>
      );
      return () => {
         setButton(<div />);
      };
   }, [setButton, navigate]);

   const tabsMenu = [
      { value: "#informasi-dasar", label: "Informasi Dasar", element: <InformasiDasar /> },
      { value: "#anggaran", label: "Anggaran", element: <Anggaran /> },
      { value: "#latar-belakang", label: "Latar Belakang", element: <LatarBelakang /> },
      { value: "#tujuan", label: "Tujuan", element: <Tujuan /> },
      { value: "#sasaran", label: "Sasaran", element: <Sasaran /> },
      { value: "#rab", label: "RAB", element: <Rab /> },
      { value: "#iku", label: "IKU", element: <Iku /> },
      { value: "#dokumen", label: "Dokumen", element: <Dokumen /> },
   ];

   const handleTabChange = (value: string) => {
      setCurrentTab(value);
      navigate(value);
   };

   return (
      <div className="overflow-hidden rounded-lg border shadow-sm p-4">
         <Tabs value={currentTab} onValueChange={handleTabChange}>
            <TabsList>
               {tabsMenu.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value} onClick={() => navigate(tab.value)}>
                     {tab.label}
                  </TabsTrigger>
               ))}
            </TabsList>
            {tabsMenu.map((item) => (
               <TabsContent value={item.value} className="space-y-4" key={item.value}>
                  <Suspense fallback={loadingElement}>{item.element}</Suspense>
               </TabsContent>
            ))}
         </Tabs>
      </div>
   );
}

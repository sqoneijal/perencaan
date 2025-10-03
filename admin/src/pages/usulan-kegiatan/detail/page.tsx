import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFirstHash } from "@/helpers/init";

import { lazy, Suspense } from "react";
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
   const location = useLocation();
   const navigate = useNavigate();

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

   return (
      <div className="overflow-hidden rounded-lg border shadow-sm p-4">
         <Tabs defaultValue={getFirstHash(location.hash)}>
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
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

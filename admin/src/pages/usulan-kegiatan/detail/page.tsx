import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFirstHash } from "@/helpers/init";

import { lazy, Suspense } from "react";
import { useLocation, useNavigate } from "react-router";

const InformasiDasar = lazy(() => import("./informasi-dasar"));
const Anggaran = lazy(() => import("./anggaran"));
const LatarBelakang = lazy(() => import("./latar-belakang"));
const Tujuan = lazy(() => import("./tujuan"));
const Sasaran = lazy(() => import("./sasaran"));
const Rab = lazy(() => import("./rab"));
const Iku = lazy(() => import("./iku"));
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
                  <Suspense
                     fallback={
                        <div className="bg-gray-50 p-4 rounded-md">
                           <div className="flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 min-h-[200px]">
                              <div className="text-center">
                                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                                 <p className="text-gray-600 font-medium">Memuat data...</p>
                              </div>
                           </div>
                        </div>
                     }>
                     {item.element}
                  </Suspense>
               </TabsContent>
            ))}
         </Tabs>
      </div>
   );
}

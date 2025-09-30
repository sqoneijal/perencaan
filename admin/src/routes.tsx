import { lazy, Suspense } from "react";
import { Routes as ReactRoutes, Route } from "react-router";
import { v4 } from "uuid";

const Dashboard = lazy(() => import("@/pages/dashboard/page"));

const ReferensiUnitSatuan = lazy(() => import("@/pages/referensi/unit-satuan/page"));
const ReferensiUnitSatuanActions = lazy(() => import("@/pages/referensi/unit-satuan/actions/page"));

const ReferensiKategoriSBM = lazy(() => import("@/pages/referensi/kategori-sbm/page"));
const ReferensiKategoriSBMActions = lazy(() => import("@/pages/referensi/kategori-sbm/actions/page"));

const route_path = [
   { key: v4(), path: "/", element: <Dashboard /> },
   { key: v4(), path: "/referensi/unit-satuan", element: <ReferensiUnitSatuan /> },
   { key: v4(), path: "/referensi/unit-satuan/actions", element: <ReferensiUnitSatuanActions /> },
   { key: v4(), path: "/referensi/unit-satuan/actions/:id_unit_satuan", element: <ReferensiUnitSatuanActions /> },
   { key: v4(), path: "/referensi/kategori-sbm", element: <ReferensiKategoriSBM /> },
   { key: v4(), path: "/referensi/kategori-sbm/actions", element: <ReferensiKategoriSBMActions /> },
   { key: v4(), path: "/referensi/kategori-sbm/actions/:id_kategori_sbm", element: <ReferensiKategoriSBMActions /> },
];

export default function Routes() {
   return (
      <div className="mt-3">
         <Suspense
            fallback={
               <div className="min-h-screen flex items-center justify-center from-slate-50 to-slate-100">
                  <div className="text-center">
                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                     <p className="text-gray-600 font-medium">Memuat data...</p>
                  </div>
               </div>
            }>
            <ReactRoutes>
               {route_path.map((item) => {
                  if (!item.element) {
                     return null;
                  }

                  return <Route key={item.key} path={item.path} element={item.element} />;
               })}
            </ReactRoutes>
         </Suspense>
      </div>
   );
}

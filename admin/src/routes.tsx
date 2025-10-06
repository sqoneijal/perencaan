import { lazy, Suspense } from "react";
import { Routes as ReactRoutes, Route } from "react-router";
import { v4 } from "uuid";

const Dashboard = lazy(() => import("@/pages/dashboard/page"));

const ReferensiUnitSatuan = lazy(() => import("@/pages/referensi/unit-satuan/page"));
const ReferensiUnitSatuanActions = lazy(() => import("@/pages/referensi/unit-satuan/actions/page"));

const ReferensiKategoriSBM = lazy(() => import("@/pages/referensi/kategori-sbm/page"));
const ReferensiKategoriSBMActions = lazy(() => import("@/pages/referensi/kategori-sbm/actions/page"));

const ReferensiStandarBiaya = lazy(() => import("@/pages/referensi/standar-biaya/page"));
const ReferensiStandarBiayaActions = lazy(() => import("@/pages/referensi/standar-biaya/actions/page"));

const ReferensiDetailHargaSBM = lazy(() => import("@/pages/referensi/detail-harga-sbm/page"));
const ReferensiDetailHargaSBMActions = lazy(() => import("@/pages/referensi/detail-harga-sbm/actions/page"));

const UsulanKegiatan = lazy(() => import("@/pages/usulan-kegiatan/page"));
const UsulanKegiatanActions = lazy(() => import("@/pages/usulan-kegiatan/actions/page"));
const UsulanKegiatanActionsDetail = lazy(() => import("@/pages/usulan-kegiatan/detail/page"));

const MasterIKU = lazy(() => import("@/pages/master-iku/page"));
const MasterIKUActions = lazy(() => import("@/pages/master-iku/actions/page"));

const VerifikasiUsulanPengajuan = lazy(() => import("@/pages/verifikasi-usulan/pengajuan/page"));
const VerifikasiUsulanPengajuanDetail = lazy(() => import("@/pages/verifikasi-usulan/pengajuan/detail/page"));

const VerifikasiUsulanPerbaikan = lazy(() => import("@/pages/verifikasi-usulan/perbaikan/page"));
const VerifikasiUsulanPerbaikanDetail = lazy(() => import("@/pages/verifikasi-usulan/perbaikan/detail/page"));

const route_path = [
   { key: v4(), path: "/", element: <Dashboard /> },
   { key: v4(), path: "/referensi/unit-satuan", element: <ReferensiUnitSatuan /> },
   { key: v4(), path: "/referensi/unit-satuan/actions", element: <ReferensiUnitSatuanActions /> },
   { key: v4(), path: "/referensi/unit-satuan/actions/:id_unit_satuan", element: <ReferensiUnitSatuanActions /> },
   { key: v4(), path: "/referensi/kategori-sbm", element: <ReferensiKategoriSBM /> },
   { key: v4(), path: "/referensi/kategori-sbm/actions", element: <ReferensiKategoriSBMActions /> },
   { key: v4(), path: "/referensi/kategori-sbm/actions/:id_kategori_sbm", element: <ReferensiKategoriSBMActions /> },
   { key: v4(), path: "/referensi/standar-biaya", element: <ReferensiStandarBiaya /> },
   { key: v4(), path: "/referensi/standar-biaya/actions", element: <ReferensiStandarBiayaActions /> },
   { key: v4(), path: "/referensi/standar-biaya/actions/:id_standar_biaya", element: <ReferensiStandarBiayaActions /> },
   { key: v4(), path: "/referensi/detail-harga-sbm", element: <ReferensiDetailHargaSBM /> },
   { key: v4(), path: "/referensi/detail-harga-sbm/actions", element: <ReferensiDetailHargaSBMActions /> },
   { key: v4(), path: "/referensi/detail-harga-sbm/actions/:id_detail_harga", element: <ReferensiDetailHargaSBMActions /> },
   { key: v4(), path: "/usulan-kegiatan", element: <UsulanKegiatan /> },
   { key: v4(), path: "/usulan-kegiatan/actions", element: <UsulanKegiatanActions /> },
   { key: v4(), path: "/usulan-kegiatan/actions/:id_usulan_kegiatan", element: <UsulanKegiatanActions /> },
   { key: v4(), path: "/usulan-kegiatan/:id_usulan_kegiatan", element: <UsulanKegiatanActionsDetail /> },
   { key: v4(), path: "/master-iku", element: <MasterIKU /> },
   { key: v4(), path: "/master-iku/actions", element: <MasterIKUActions /> },
   { key: v4(), path: "/master-iku/actions/:id_iku_master", element: <MasterIKUActions /> },
   { key: v4(), path: "/verifikasi-usulan/pengajuan", element: <VerifikasiUsulanPengajuan /> },
   { key: v4(), path: "/verifikasi-usulan/pengajuan/:id_usulan_kegiatan", element: <VerifikasiUsulanPengajuanDetail /> },
   { key: v4(), path: "/verifikasi-usulan/perbaikan", element: <VerifikasiUsulanPerbaikan /> },
   { key: v4(), path: "/verifikasi-usulan/perbaikan/:id_usulan_kegiatan", element: <VerifikasiUsulanPerbaikanDetail /> },
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

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Routes from "@/routes";
import { lazy, Suspense } from "react";

const AppSidebar = lazy(() => import("@/components/app-sidebar"));
const AppHeader = lazy(() => import("@/components/app-header"));

const loadingELement = (
   <div className="min-h-screen flex items-center justify-center from-slate-50 to-slate-100">
      <div className="text-center">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
         <p className="text-gray-600">Memuat data...</p>
      </div>
   </div>
);

function App() {
   return (
      <SidebarProvider>
         <Suspense
            fallback={
               <div className="flex items-center justify-center from-slate-50 to-slate-100">
                  <div className="text-center">
                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                     <p className="text-gray-600">Memuat data...</p>
                  </div>
               </div>
            }>
            <AppSidebar />
         </Suspense>
         <SidebarInset>
            <Suspense fallback={loadingELement}>
               <AppHeader />
            </Suspense>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
               <div className="@container/main flex flex-1 flex-col gap-2">
                  <Routes />
               </div>
            </div>
         </SidebarInset>
      </SidebarProvider>
   );
}

export default App;

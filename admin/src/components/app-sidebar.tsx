import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarGroupContent,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarMenuSub,
   SidebarRail,
} from "@/components/ui/sidebar";
import { BookMarked, ChevronRight, CircleGauge, ListCheck, NotepadText, TicketsPlane } from "lucide-react";
import { Link, useLocation } from "react-router";

type MenuItem = {
   label: string;
   icon?: React.ReactNode;
   url: string;
   child?: Array<MenuItem>;
   isActive?: boolean;
};

const data: Array<MenuItem> = [
   { label: "Dashboard", icon: <CircleGauge />, url: "/" },
   {
      label: "Referensi",
      icon: <BookMarked />,
      url: "#",
      child: [
         { label: "Unit Satuan", url: "/referensi/unit-satuan" },
         { label: "Kategori SBM", url: "/referensi/kategori-sbm" },
         { label: "Standar Biaya", url: "/referensi/standar-biaya" },
         { label: "Detail Harga SBM", url: "/referensi/detail-harga-sbm" },
      ],
   },
   { label: "Master IKU", icon: <ListCheck />, url: "/master-iku" },
   { label: "Usulan Kegiatan", icon: <NotepadText />, url: "/usulan-kegiatan" },
];

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
   const location = useLocation();

   return (
      <Sidebar collapsible="offcanvas" {...props}>
         <SidebarHeader>
            <SidebarMenu>
               <SidebarMenuItem>
                  <SidebarMenuButton size="lg" asChild>
                     <Link to="/">
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                           <TicketsPlane className="size-10" />
                        </div>
                        <div className="flex flex-col gap-0.5 leading-none">
                           <span className="font-semibold">PlanKePentok</span>
                           <span className="font-medium">v1.0</span>
                        </div>
                     </Link>
                  </SidebarMenuButton>
               </SidebarMenuItem>
            </SidebarMenu>
         </SidebarHeader>
         <SidebarContent>
            <SidebarGroup>
               <SidebarGroupContent>
                  <SidebarMenu>
                     {data.map((item, index) => (
                        <Tree key={index} item={item} location={location} />
                     ))}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>
         <SidebarRail />
      </Sidebar>
   );
}

function Tree({ item, location }: Readonly<{ item: MenuItem; location: ReturnType<typeof useLocation> }>) {
   const isActive = item.url !== "#" && item.url === location.pathname;
   const isParentActive = item.child?.some((child) => child.url === location.pathname) || false;

   if (!item.child || item.child.length === 0) {
      return (
         <SidebarMenuItem data-active={isActive}>
            <SidebarMenuButton asChild isActive={isActive}>
               <Link to={item.url}>
                  {item.icon}
                  {item.label}
               </Link>
            </SidebarMenuButton>
         </SidebarMenuItem>
      );
   }

   return (
      <SidebarMenuItem data-active={isParentActive}>
         <Collapsible className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90" defaultOpen={isParentActive}>
            <CollapsibleTrigger asChild>
               <SidebarMenuButton asChild isActive={isActive}>
                  <Link to={item.url}>
                     {item.icon}
                     {item.label}
                     <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </Link>
               </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
               <SidebarMenuSub>
                  {item.child.map((subItem, index) => (
                     <Tree key={index} item={subItem} location={location} />
                  ))}
               </SidebarMenuSub>
            </CollapsibleContent>
         </Collapsible>
      </SidebarMenuItem>
   );
}

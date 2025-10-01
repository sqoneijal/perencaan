import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarMenuSub,
   SidebarRail,
} from "@/components/ui/sidebar";
import { BookMarked, ChevronRight, CircleGauge, NotepadText, TicketsPlane } from "lucide-react";
import { Link } from "react-router";

type MenuItem = {
   label: string;
   icon?: React.ReactNode;
   url: string;
   child?: Array<MenuItem>;
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
   { label: "Usulan Kegiatan", icon: <NotepadText />, url: "/usulan-kegiatan" },
];

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
                           <span className="font-semibold">Perecanaan</span>
                           <span className="font-medium">v1.0</span>
                        </div>
                     </Link>
                  </SidebarMenuButton>
               </SidebarMenuItem>
            </SidebarMenu>
         </SidebarHeader>
         <SidebarContent>
            <SidebarGroup>
               <SidebarGroupLabel>Files</SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu>
                     {data.map((item, index) => (
                        <Tree key={index} item={item} />
                     ))}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>
         <SidebarRail />
      </Sidebar>
   );
}

function Tree({ item }: Readonly<{ item: MenuItem }>) {
   if (!item.child || item.child.length === 0) {
      return (
         <SidebarMenuItem>
            <SidebarMenuButton asChild>
               <Link to={item.url}>
                  {item.icon}
                  {item.label}
               </Link>
            </SidebarMenuButton>
         </SidebarMenuItem>
      );
   }
   return (
      <SidebarMenuItem>
         <Collapsible className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90">
            <CollapsibleTrigger asChild>
               <SidebarMenuButton asChild>
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
                     <Tree key={index} item={subItem} />
                  ))}
               </SidebarMenuSub>
            </CollapsibleContent>
         </Collapsible>
      </SidebarMenuItem>
   );
}

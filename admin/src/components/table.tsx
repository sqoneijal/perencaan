import { Table as ShadcnTable, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTablePagination } from "@/hooks/store";
import { cn } from "@/lib/utils";
import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";

type Props<T> = {
   columns: Array<ColumnDef<T>>;
   data: Array<T>;
   isLoading?: boolean;
   total?: number;
};

export default function Table<T>({ columns, data, isLoading, total = 0 }: Readonly<Props<T>>) {
   const { pagination, setPagination } = useTablePagination();

   const table = useReactTable<T>({
      data,
      columns,
      pageCount: total ? Math.ceil(total / pagination.pageSize) : undefined,
      state: { pagination },
      manualPagination: true, // penting supaya react-table tidak auto paginate
      onPaginationChange: (updaterOrValue) => {
         const newPagination = typeof updaterOrValue === "function" ? updaterOrValue(pagination) : updaterOrValue;
         setPagination(newPagination);
      },
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
   });

   return (
      <div className="overflow-hidden rounded-lg border shadow-sm">
         <ShadcnTable>
            <TableHeader className="bg-muted sticky top-0 z-10">
               {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                     {headerGroup.headers.map((header) => (
                        <TableHead
                           key={header.id}
                           className={cn(
                              "h-8 text-xs font-medium text-gray-500 uppercase tracking-wider",
                              (header.column.columnDef.meta as { className?: string })?.className ?? ""
                           )}>
                           {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                     ))}
                  </TableRow>
               ))}
            </TableHeader>
            <TableBody className="font-medium divide-y divide-gray-200">
               {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                     <TableRow key={row.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        {row.getVisibleCells().map((cell) => (
                           <TableCell
                              key={cell.id}
                              className={cn(
                                 "font-medium p-1 pl-2 px-3 py-1 text-sm text-gray-900 h-8",
                                 (cell.column.columnDef.meta as { className?: string })?.className ?? ""
                              )}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                           </TableCell>
                        ))}
                     </TableRow>
                  ))
               ) : (
                  <TableRow>
                     <TableCell colSpan={columns.length} className="h-24 text-center p-0 m-0">
                        {isLoading ? (
                           <div className="min-h-[200px] flex items-center justify-center from-slate-50 to-slate-100">
                              <div className="text-center">
                                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                                 <p className="text-gray-600 font-medium">Memuat data...</p>
                              </div>
                           </div>
                        ) : (
                           <div className="min-h-[200px] flex flex-col items-center justify-center bg-gray-50 p-8">
                              <svg
                                 className="w-16 h-16 text-gray-400 mb-4"
                                 fill="none"
                                 stroke="currentColor"
                                 viewBox="0 0 24 24"
                                 xmlns="http://www.w3.org/2000/svg">
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 17v-6h6v6m2 4H7a2 2 0 01-2-2V7a2 2 0 012-2h5l2 2h5a2 2 0 012 2v12a2 2 0 01-2 2z"
                                 />
                              </svg>
                              <p className="text-gray-500 text-lg mb-2 text-center">Tidak ada data yang dapat ditampilkan</p>
                              <p className="text-gray-400 text-sm text-center">Coba lakukan pencarian lain atau tambahkan data baru</p>
                           </div>
                        )}
                     </TableCell>
                  </TableRow>
               )}
            </TableBody>
         </ShadcnTable>
      </div>
   );
}

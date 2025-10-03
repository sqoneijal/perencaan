import { Button } from "@/components/ui/button";
import { useDialog, useHeaderButton, useTablePagination } from "@/hooks/store";
import { useApiQuery } from "@/lib/useApi";
import type { Lists } from "@/types/init";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

export function useDokumen() {
   const { setButton } = useHeaderButton();
   const { setOpen } = useDialog();
   const { pagination } = useTablePagination();
   const { id_usulan_kegiatan } = useParams();

   const idUsulanKegiatanNum = id_usulan_kegiatan ? Number(id_usulan_kegiatan) : 0;
   const limit = pagination.pageSize;
   const offset = pagination.pageSize * pagination.pageIndex;
   const navigate = useNavigate();

   useEffect(() => {
      setButton(
         <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            Tambah Dokumen
         </Button>
      );

      return () => {
         setButton(<div />);
      };
   }, [setButton, setOpen]);

   const { data, isLoading, error } = useApiQuery<{
      results: Array<Lists>;
      total: number;
   }>({
      queryKey: ["usulan-kegiatan", idUsulanKegiatanNum, "dokumen", limit, offset],
      url: `/usulan-kegiatan/${idUsulanKegiatanNum}/dokumen`,
      params: { limit, offset },
   });

   return { idUsulanKegiatanNum, limit, offset, navigate, data, isLoading, error };
}

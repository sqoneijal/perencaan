import { queryClient } from "@/lib/queryClient";
import { useApiQuery } from "@/lib/useApi";
import type { Lists } from "@/types/init";
import { toast } from "sonner";

export function useInit() {
   const { data, isLoading, error } = useApiQuery<{
      results: Array<Lists>;
      total: number;
   }>({
      queryKey: ["pagu-anggaran", "biro"],
      url: "/pagu-anggaran/biro",
   });

   if (error) {
      toast.error(error?.message);
      queryClient.removeQueries({ queryKey: ["pagu-anggaran", "biro"] });
   }
}

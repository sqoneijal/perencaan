import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteMutation } from "@/lib/useApi";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, Trash } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface ConfirmDialogProps {
   url: string;
   refetchKey?: Array<unknown> | Array<Array<unknown>>; // supaya fleksibel, bisa single key atau array of keys
}

export default function ConfirmDialog({ url, refetchKey }: Readonly<ConfirmDialogProps>) {
   const queryClient = useQueryClient();

   const _delete = useDeleteMutation(url, {
      onSuccess: (data) => {
         if (data?.status) {
            toast.success(data?.message);
            if (refetchKey) {
               if (Array.isArray(refetchKey) && refetchKey.length > 0 && Array.isArray(refetchKey[0])) {
                  // Array of query keys
                  (refetchKey as Array<Array<unknown>>).forEach((key) => {
                     queryClient.refetchQueries({ queryKey: key });
                  });
               } else {
                  // Single query key
                  queryClient.refetchQueries({ queryKey: refetchKey });
               }
            }
         } else {
            toast.error(data?.message);
         }
      },
      onError: (error) => {
         toast.error(error?.message);
      },
   });

   return (
      <AlertDialog>
         <AlertDialogTrigger asChild>
            <Button variant="ghost">
               <Trash />
            </Button>
         </AlertDialogTrigger>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>Konfirmasi penghapusan?</AlertDialogTitle>
               <AlertDialogDescription>Apakah anda yakin ingin menghapus. Data yang dihapus tidak dapat dikembalikan!!!</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel className="h-7">Batal</AlertDialogCancel>
               <AlertDialogAction className="h-7" disabled={_delete.isPending} onClick={() => _delete.mutate()}>
                  {_delete.isPending ? (
                     <>
                        <Loader2Icon className="animate-spin" />
                        Bentar ya, lagi loading...
                     </>
                  ) : (
                     "Lanjutkan"
                  )}
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
}

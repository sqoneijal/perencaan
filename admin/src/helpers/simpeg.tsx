import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export const useCariUnitPegawai = (pegawaiId: string | undefined) => {
   return useQuery({
      queryKey: ["pegawai", pegawaiId],
      queryFn: async () => {
         const response = await axios.post(import.meta.env.VITE_API_SIMPEG, {
            query: `
               query Pegawai($pegawaiId: ID!) {
                  pegawai(id: $pegawaiId) {
                     id
                     unitKerjaSaatIni {
                        bagian {
                           nama
                           id
                        }
                        unitKerja {
                           id
                           nama
                        }
                     }
                  }
               }
            `,
            variables: {
               pegawaiId,
            },
         });

         const unitKerjaSaatIni = response.data.data.pegawai.unitKerjaSaatIni;
         if (unitKerjaSaatIni.length > 0) {
            return unitKerjaSaatIni[0];
         } else {
            toast.error("Apakah benar anda pegawai UIN Ar Raniry.");
         }
      },
      enabled: !!pegawaiId,
   });
};

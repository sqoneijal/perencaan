import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export const useCariUnitPegawai = (pegawaiId: string | undefined) => {
   return useQuery({
      queryKey: ["cari-unit-pegawai", pegawaiId],
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

export const usePegawai = (pegawaiId: string | undefined) => {
   return useQuery({
      queryKey: ["pegawai", pegawaiId],
      queryFn: async () => {
         const response = await axios.post(import.meta.env.VITE_API_SIMPEG, {
            query: `
               query Pegawai($pegawaiId: ID!) {
                  pegawai(id: $pegawaiId) {
                     nama
                     id
                  }
               }
            `,
            variables: {
               pegawaiId,
            },
         });

         return response.data.data.pegawai;
      },
      enabled: !!pegawaiId,
   });
};

export const useUnitKerja = (id_unit_kerja: string | undefined) => {
   return useQuery({
      queryKey: ["unit-kerja", id_unit_kerja],
      queryFn: async () => {
         const response = await axios.post(import.meta.env.VITE_API_SIMPEG, {
            query: `
               query UnitKerja {
                  daftarBagianUnitKerja {
                     id
                     nama
                  }
               }
            `,
         });

         const daftarBagianUnitKerja = response.data.data.daftarBagianUnitKerja;

         return daftarBagianUnitKerja.find((e: { id: string; nama: string }) => e.id === id_unit_kerja)?.nama;
      },
      enabled: !!id_unit_kerja,
   });
};

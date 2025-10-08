<?php

namespace App\Models\PaguAnggaran;

use CodeIgniter\Database\RawSql;
use CodeIgniter\Model;

class ProgramStudi extends Model
{

   public function handleDelete(int $id): array
   {
      try {
         $this->hitungPaguFakultasPascaHapus($id);

         $table = $this->db->table('tb_pagu_anggaran_prodi');
         $table->where('id', $id);
         $table->delete();
         return ['status' => true, 'message' => 'Data berhasil dihapus.'];
      } catch (\Exception $e) {
         return ['status' => false, 'message' => $e->getMessage()];
      }
   }

   private function hitungPaguFakultasPascaHapus(int $id_pagu): void
   {
      $table = $this->db->table('tb_pagu_anggaran_prodi tpap');
      $table->select('tpaf.sisa, tpap.pagu_unit, tpaf.id as id_pagu_fakultas');
      $table->join('tb_prodi_master tpm', 'tpm.id = tpap.id_prodi');
      $table->join('tb_pagu_anggaran_fakultas tpaf', 'tpaf.id_fakultas = tpm.id_fakultas and tpaf.tahun = tpap.tahun');
      $table->where('tpap.id', $id_pagu);

      $get = $table->get();
      $data = $get->getRowArray();
      $get->freeResult();

      if (isset($data)) {
         $sisa_pagu_fakultas = (int) $data['sisa'] + (int) $data['pagu_unit'];

         $this->db->table('tb_pagu_anggaran_fakultas')
            ->where('id', $data['id_pagu_fakultas'])
            ->update(['sisa' => $sisa_pagu_fakultas]);
      }
   }

   public function handleSubmit(array $post): array
   {
      try {
         $untuk_semua_prodi = $post['untuk_semua_prodi'];

         $table = $this->db->table('tb_pagu_anggaran_prodi');
         if ($untuk_semua_prodi === 't') {
            $daftarProdi = $this->ambilProgramStudiBelumAdaPagu($post['id_fakultas'], $post['tahun']);

            $data = [];
            $total_penggunaan_pagu = 0;

            foreach ($daftarProdi as $id_prodi) {
               $total_penggunaan_pagu += (int) $post['pagu_unit'];

               array_push($data, [
                  'id_prodi' => $id_prodi,
                  'tahun' => $post['tahun'],
                  'pagu_unit' => $post['pagu_unit'],
                  'realisasi' => 0,
                  'sisa' => $post['pagu_unit'],
                  'uploaded' => new RawSql('now()'),
                  'user_modified' => $post['user_modified']
               ]);
            }

            $table->insertBatch($data);

            $this->hitungSisaPaguFakultas($post, $total_penggunaan_pagu);
         } else {
            $data = cleanDataSubmit(['id_prodi', 'tahun', 'pagu_unit', 'user_modified'], $post);

            if (@$post['id']) {
               $data['modified'] = new RawSql('now()');

               $table->where('id', $post['id']);
               $table->update($data);
            } else {
               $data['uploaded'] = new RawSql('now()');
               $data['sisa'] = $post['pagu_unit'];

               $table->insert($data);
            }
         }

         return ['status' => true, 'message' => 'Data berhasil disimpan.'];
      } catch (\Exception $e) {
         return ['status' => false, 'message' => $e->getMessage()];
      }
   }

   private function hitungSisaPaguFakultas(array $post, int $total_penggunaan_pagu): void
   {
      $sisa_pagu_fakultas = $this->getSisaPaguFakultas(['id_fakultas' => $post['id_fakultas'], 'tahun' => $post['tahun']])['data']['sisa'];

      $table = $this->db->table('tb_pagu_anggaran_fakultas');
      $table->where('id_fakultas', $post['id_fakultas']);
      $table->where('tahun', $post['tahun']);
      $table->update([
         'sisa' => $sisa_pagu_fakultas - $total_penggunaan_pagu,
         'modified' => new RawSql('now()'),
         'user_modified' => $post['user_modified']
      ]);
   }

   public function getSisaPaguFakultas(array $params): array
   {
      $table = $this->db->table('tb_pagu_anggaran_fakultas');
      $table->select('sisa');
      $table->where('id_fakultas', $params['id_fakultas']);
      $table->where('tahun', $params['tahun']);

      $get = $table->get();
      $data = $get->getRowArray();
      $fieldNames = $get->getFieldNames();
      $get->freeResult();

      $response = [];
      if (isset($data)) {
         foreach ($fieldNames as $field) {
            $response[$field] = ($data[$field] ? trim($data[$field]) : (string) $data[$field]);
         }
      }
      return [
         'data' => array_merge($response, [
            'daftarProdiBelumAdaPagu' => $this->ambilProgramStudiBelumAdaPagu($params['id_fakultas'], $params['tahun'])
         ]),
      ];
   }

   private function ambilProgramStudiBelumAdaPagu(string $id_fakultas, int $tahun_anggaran): array
   {
      $table = $this->db->table('tb_prodi_master tpm');
      $table->select('tpm.id as id_prodi');
      $table->join('tb_pagu_anggaran_prodi tpap', 'tpap.id_prodi = tpm.id and tpap.tahun = ' . $tahun_anggaran, 'left');
      $table->where('tpm.id_fakultas', $id_fakultas);
      $table->where('tpap.id is null');

      $get = $table->get();
      $result = $get->getResultArray();
      $get->freeResult();

      $response = [];

      foreach ($result as $row) {
         $response[] = $row['id_prodi'];
      }
      return $response;
   }

   public function getData(array $params): array
   {
      $table = $this->db->table('tb_pagu_anggaran_prodi tpap');
      $table->select('tpap.id, tpm.nama as program_studi, tpap.tahun, tpap.pagu_unit, tpap.realisasi, tpap.sisa, tpaf.sisa as sisa_pagu_fakultas');
      $table->join('tb_prodi_master tpm', 'tpm.id = tpap.id_prodi');
      $table->join('tb_pagu_anggaran_fakultas tpaf', 'tpaf.id_fakultas = tpm.id_fakultas');
      $table->limit((int) $params['limit'], (int) $params['offset']);

      $clone = clone $table;

      $get = $table->get();
      $result = $get->getResultArray();
      $fieldNames = $get->getFieldNames();
      $get->freeResult();

      $response = [];
      foreach ($result as $key => $val) {
         foreach ($fieldNames as $field) {
            $response[$key][$field] = $val[$field] ? trim($val[$field]) : (string) $val[$field];
         }
      }

      return [
         'results' => $response,
         'total' => $clone->countAllResults()
      ];
   }
}

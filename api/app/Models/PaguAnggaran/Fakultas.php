<?php

namespace App\Models\PaguAnggaran;

use CodeIgniter\Database\RawSql;
use CodeIgniter\Model;

class Fakultas extends Model
{

   public function handleDelete(int $id_pagu): array
   {
      try {
         $checkPenggunaanAnggaran = $this->checkPenggunaanAnggaran($id_pagu);

         if ($checkPenggunaanAnggaran) {
            return ['status' => false, 'message' => 'Tidak dapat menghapus data pagu yang sedang digunakan unit.'];
         } else {
            $table = $this->db->table('tb_pagu_anggaran_fakultas');
            $table->where('id', $id_pagu);
            $table->delete();
            return ['status' => true, 'message' => 'Data berhasil dihapus.'];
         }
      } catch (\Exception $e) {
         return ['status' => false, 'message' => $e->getMessage()];
      }
   }

   private function checkPenggunaanAnggaran(int $id_pagu): bool
   {
      $table = $this->db->table('tb_pagu_anggaran_fakultas tpaf');
      $table->join('tb_prodi_master tpm', 'tpm.id_fakultas = tpaf.id_fakultas');
      $table->join('tb_pagu_anggaran_prodi tpap', 'tpap.id_prodi = tpm.id and tpap.tahun = tpaf.tahun');
      $table->where('tpaf.id', $id_pagu);

      return $table->countAllResults() > 0;
   }

   public function getDataToEdit(int $id_pagu): array
   {
      $table = $this->db->table('tb_pagu_anggaran_fakultas');
      $table->select('id, id_fakultas, tahun, pagu_unit, realisasi');
      $table->where('id', $id_pagu);

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
         'data' => $response,
         'status' => !empty($response)
      ];
   }

   public function handleSubmit(array $post): array
   {
      try {
         $data = cleanDataSubmit(['id_fakultas', 'tahun', 'pagu_unit', 'user_modified'], $post);

         $table = $this->db->table('tb_pagu_anggaran_fakultas');

         if (@$post['id']) {
            $data['modified'] = new RawSql('now()');
            $data['sisa'] = (int) $post['pagu_unit'] - (int) $post['realisasi'];

            $table->where('id', $post['id']);
            $table->update($data);
         } else {
            $data['uploaded'] = new RawSql('now()');
            $data['sisa'] = (int) $post['pagu_unit'];

            $table->ignore(true)->insert($data);
         }
         return ['status' => true, 'message' => 'Data berhasil disimpan.'];
      } catch (\Exception $e) {
         return ['status' => false, 'message' => $e->getMessage()];
      }
   }

   public function getData(array $params): array
   {
      $table = $this->db->table('tb_pagu_anggaran_fakultas tpaf');
      $table->select('tpaf.id, tfm.nama as fakultas, tpaf.tahun, tpaf.pagu_unit, tpaf.realisasi, tpaf.sisa');
      $table->join('tb_fakultas_master tfm', 'tfm.id = tpaf.id_fakultas');
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

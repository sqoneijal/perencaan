<?php

namespace App\Models;

use CodeIgniter\Database\RawSql;
use CodeIgniter\Model;

class PaguAnggaran extends Model
{

   public function getPaguFakultas(int $tahun_anggaran): array
   {
      $result = $this->queryDaftarPaguFakultas($tahun_anggaran);

      $id_fakultas = [];
      foreach ($result as $row) {
         if ($row['id_pagu'] === '' || empty($row['id_pagu'])) {
            $id_fakultas[] = $row['id'];
         }
      }

      if (!empty($id_fakultas)) {
         $this->generateDefaultPaguFakultas($id_fakultas, $tahun_anggaran);
         return ['results' => $this->queryDaftarPaguFakultas($tahun_anggaran)];
      } else {
         return ['results' => $result];
      }
   }

   private function queryDaftarPaguFakultas(int $tahun_anggaran): array
   {
      $table = $this->db->table('tb_fakultas_master tfm');
      $table->select('tfm.*, tpaf.id as id_pagu, tpaf.tahun_anggaran, tpaf.tahun_anggaran, tpaf.total_pagu, tpaf.realisasi');
      $table->join('tb_pagu_anggaran_fakultas tpaf', 'tpaf.id_fakultas = tfm.id and tpaf.tahun_anggaran = ' . $tahun_anggaran, 'left');
      $table->orderBy('tfm.nama');

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
      return $response;
   }

   public function getPaguBiro(int $tahun_anggaran): array
   {
      $result = $this->queryDaftarPaguBiro($tahun_anggaran);

      $id_biro = [];
      foreach ($result as $row) {
         if ($row['id_pagu_biro'] === '' || empty($row['id_pagu_biro'])) {
            $id_biro[] = $row['id'];
         }
      }

      if (!empty($id_biro)) {
         $this->generateDefaultPaguBiro($id_biro, $tahun_anggaran);
         return ['results' => $this->queryDaftarPaguBiro($tahun_anggaran)];
      } else {
         return ['results' => $result];
      }
   }

   private function queryDaftarPaguBiro(int $tahun_anggaran)
   {
      $table = $this->db->table('tb_biro_master tbm');
      $table->select('tbm.id, tbm.nama, tpab.id as id_pagu_biro, tpab.tahun_anggaran, tpab.total_pagu, tpab.realisasi');
      $table->join('tb_pagu_anggaran_biro tpab', 'tpab.id_biro = tbm.id and tpab.tahun_anggaran = ' . $tahun_anggaran, 'left');
      $table->orderBy('tbm.nama');

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
      return $response;
   }

   private function generateDefaultPaguFakultas(array $id_fakultas, int $tahun_anggaran)
   {
      $data = [];
      foreach ($id_fakultas as $id) {
         array_push($data, [
            'id_fakultas' => $id,
            'tahun_anggaran' => $tahun_anggaran,
            'uploaded' => new RawSql('now()')
         ]);
      }

      $table = $this->db->table('tb_pagu_anggaran_fakultas');
      $table->insertBatch($data);
   }

   private function generateDefaultPaguBiro(array $id_biro, int $tahun_anggaran)
   {
      $data = [];
      foreach ($id_biro as $id) {
         array_push($data, [
            'id_biro' => $id,
            'tahun_anggaran' => $tahun_anggaran,
            'uploaded' => new RawSql('now()')
         ]);
      }

      $table = $this->db->table('tb_pagu_anggaran_biro');
      $table->insertBatch($data);
   }

   public function getTahunAnggaran(): array
   {
      $table = $this->db->table('tb_pengaturan');
      $table->select('tahun_anggaran, is_aktif');
      $table->orderBy('tahun_anggaran', 'desc');

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
      return ['results' => $response, 'total' => $clone->countAllResults()];
   }

   public function getPaguUniversitas(int $tahun_anggaran): array
   {
      $table = $this->db->table('tb_pengaturan');
      $table->where('tahun_anggaran', $tahun_anggaran);

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

      return ['results' => $response, 'status' => !empty($response)];
   }
}

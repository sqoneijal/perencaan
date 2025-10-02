<?php

namespace App\Models;

use CodeIgniter\Database\RawSql;
use CodeIgniter\Model;

class UsulanKegiatan extends Model
{

   public function deleteUsulanKegiatan(int $id): array
   {
      try {
         $this->db->table('tb_usulan_kegiatan')->where('id', $id)->delete();
         $this->db->table('tb_rab_detail')->where('id_usulan', $id)->delete();
         return ['status' => true, 'message' => 'Data berhasil dihapus.'];
      } catch (\Exception $e) {
         return ['status' => false, 'message' => $e->getMessage()];
      }
   }

   public function deleteRAB(int $id): array
   {
      try {
         $table = $this->db->table('tb_rab_detail');
         $table->where('id', $id);
         $table->delete();
         return ['status' => true, 'message' => 'Data berhasil dihapus.'];
      } catch (\Exception $e) {
         return ['status' => false, 'message' => $e->getMessage()];
      }
   }

   public function getDataRAB(int $id_usulan_kegiatan, array $params): array
   {
      $table = $this->db->table('tb_rab_detail trd');
      $table->select('trd.id, trd.uraian_biaya, trd.qty, tus.nama as nama_satuan, tus.deskripsi as deskripsi_satuan, trd.harga_satuan, trd.total_biaya, trd.catatan');
      $table->join('tb_unit_satuan tus', 'tus.id = trd.id_satuan', 'left');
      $table->where('trd.id_usulan', $id_usulan_kegiatan);
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

   public function submitRAB(array $post): array
   {
      try {
         $data = cleanDataSubmit(['id_usulan', 'uraian_biaya', 'qty', 'id_satuan', 'harga_satuan', 'total_biaya', 'catatan', 'user_modified'], $post);

         $table = $this->db->table('tb_rab_detail');
         if (@$post['id']) {
            $data['modified'] = new RawSql('now()');

            $table->where('id', $post['id']);
            $table->update($data);
         } else {
            $data['uploaded'] = new RawSql('now()');

            $table->insert($data);
         }
         return ['status' => true, 'content' => '', 'message' => 'Data berhasil disimpan.'];
      } catch (\Exception $e) {
         return ['status' => false, 'message' => $e->getMessage()];
      }
   }

   public function getDetail(int $id_usulan_kegiatan, string $type): array
   {
      $response = [];
      if ($type === 'informasi-dasar') {
         $response = $this->getInformasiDasar($id_usulan_kegiatan);
      } elseif ($type === 'anggaran') {
         $response = $this->getAnggaran($id_usulan_kegiatan);
      } elseif ($type === 'latar-belakang') {
         $response = $this->getLatarBelakang($id_usulan_kegiatan);
      } elseif ($type === 'tujuan') {
         $response = $this->getTujuan($id_usulan_kegiatan);
      } elseif ($type === 'sasaran') {
         $response = $this->getSasaran($id_usulan_kegiatan);
      }
      return $response;
   }

   private function getSasaran(int $id_usulan_kegiatan): array
   {
      try {
         $table = $this->db->table('tb_usulan_kegiatan');
         $table->select('sasaran');
         $table->where('id', $id_usulan_kegiatan);

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

         return ['status' => true, 'data' => $response];
      } catch (\Exception $e) {
         return ['status' => false, 'message' => $e->getMessage()];
      }
   }

   private function getTujuan(int $id_usulan_kegiatan): array
   {
      try {
         $table = $this->db->table('tb_usulan_kegiatan');
         $table->select('tujuan');
         $table->where('id', $id_usulan_kegiatan);

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

         return ['status' => true, 'data' => $response];
      } catch (\Exception $e) {
         return ['status' => false, 'message' => $e->getMessage()];
      }
   }

   private function getLatarBelakang(int $id_usulan_kegiatan): array
   {
      try {
         $table = $this->db->table('tb_usulan_kegiatan');
         $table->select('latar_belakang');
         $table->where('id', $id_usulan_kegiatan);

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

         return ['status' => true, 'data' => $response];
      } catch (\Exception $e) {
         return ['status' => false, 'message' => $e->getMessage()];
      }
   }

   private function getAnggaran(int $id_usulan_kegiatan): array
   {
      try {
         $table = $this->db->table('tb_usulan_kegiatan');
         $table->select('total_anggaran, rencanca_total_anggaran');
         $table->where('id', $id_usulan_kegiatan);

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

         return ['status' => true, 'data' => $response];
      } catch (\Exception $e) {
         return ['status' => false, 'message' => $e->getMessage()];
      }
   }

   private function getInformasiDasar(int $id_usulan_kegiatan): array
   {
      try {
         $table = $this->db->table('tb_usulan_kegiatan tuk');
         $table->select('tuk.id, tuk.kode, tuk.nama, tuk.waktu_mulai as tanggal_mulai, tuk.waktu_selesai as tanggal_selesai, tuk.tempat_pelaksanaan, tuk.id_unit_pengusul, tuk.operator_input, tuk.status_usulan, tuk.tanggal_submit as tanggal_pengajuan');
         $table->where('tuk.id', $id_usulan_kegiatan);

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

         return ['status' => true, 'data' => $response];
      } catch (\Exception $e) {
         return ['status' => false, 'message' => $e->getMessage()];
      }
   }

   public function submit(array $post): array
   {
      try {
         $data = cleanDataSubmit(['kode', 'nama', 'latar_belakang', 'tujuan', 'sasaran', 'waktu_mulai', 'waktu_selesai', 'tempat_pelaksanaan', 'id_unit_pengusul', 'rencanca_total_anggaran', 'user_modified'], $post);

         $table = $this->db->table('tb_usulan_kegiatan');
         if (@$post['id']) {
            $data['modified'] = new RawSql('now()');

            $table->where('id', $post['id']);
            $table->update($data);

            $id_usulan_kegiatan = $post['id'];
         } else {
            $data['tanggal_submit'] = new RawSql('now()');
            $data['operator_input'] = $post['user_modified'];
            $data['uploaded'] = new RawSql('now()');

            $table->insert($data);

            $id_usulan_kegiatan = $this->db->insertID('tb_usulan_kegiatan_id_seq');
         }

         return ['status' => true, 'id_usulan_kegiatan' => $id_usulan_kegiatan, 'message' => 'Data berhasil disimpan.'];
      } catch (\Exception $e) {
         return ['status' => false, 'message' => $e->getMessage()];
      }
   }

   public function getData(array $params): array
   {
      $table = $this->db->table('tb_usulan_kegiatan tuk');
      $table->select('tuk.id, tuk.kode, tuk.nama, tuk.waktu_mulai, tuk.waktu_selesai, tuk.tempat_pelaksanaan, tuk.total_anggaran, tuk.rencanca_total_anggaran, tuk.status_usulan');
      $table->limit((int) $params['limit'], (int) $params['offset']);
      $table->orderBy('tuk.id', 'desc');

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

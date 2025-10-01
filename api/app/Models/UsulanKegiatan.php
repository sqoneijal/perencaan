<?php

namespace App\Models;

use CodeIgniter\Database\RawSql;
use CodeIgniter\Model;

class UsulanKegiatan extends Model
{

   public function getDetail(int $id_usulan_kegiatan): array
   {
      $table = $this->db->table('tb_usulan_kegiatan tuk');
      $table->select('tuk.id, tuk.kode, tuk.nama, tuk.latar_belakang, tuk.tujuan, tuk.sasaran, tuk.waktu_mulai as tanggal_mulai, tuk.waktu_selesai as tanggal_selesai, tuk.tempat_pelaksanaan, tuk.id_unit_pengusul, tuk.operator_input, tuk.total_anggaran, tuk.status_usulan, tuk.tanggal_submit as tanggal_pengajuan, tuk.rencanca_total_anggaran');
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
      return $response;
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
}

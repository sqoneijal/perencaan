<?php

namespace App\Models;

use CodeIgniter\Model;

class Common extends Model
{

   public function getDaftarUnitSatuan(): array
   {
      $table = $this->db->table('tb_unit_satuan');
      $table->select('id, nama, deskripsi');
      $table->where('aktif', true);
      $table->orderBy('nama');

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
}

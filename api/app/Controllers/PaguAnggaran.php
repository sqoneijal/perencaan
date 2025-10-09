<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\PaguAnggaran as Model;

class PaguAnggaran extends BaseController
{

   public function getTahunAnggaran(): object
   {
      $model = new Model();
      $data = $model->getTahunAnggaran();
      return $this->respond($data);
   }

   public function getPaguUniversitas(int $tahun_anggaran): object
   {
      $model = new Model();
      $data = $model->getPaguUniversitas($tahun_anggaran);
      return $this->respond($data);
   }

   public function getPaguBiro(int $tahun_anggaran): object
   {
      $model = new Model();
      $data = $model->getPaguBiro($tahun_anggaran);
      return $this->respond($data);
   }

   public function getPaguFakultas(int $tahun_anggaran): object
   {
      $model = new Model();
      $data = $model->getPaguFakultas($tahun_anggaran);
      return $this->respond($data);
   }
}

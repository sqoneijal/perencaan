<?php

namespace App\Controllers\PaguAnggaran;

use App\Controllers\BaseController;
use App\Models\PaguAnggaran\Fakultas as Model;
use App\Validation\PaguAnggaran\Fakultas as Validate;

class Fakultas extends BaseController
{

   public function index()
   {
      $model = new Model();
      $data = $model->getData($this->request->getGet());
      return $this->respond($data);
   }

   public function handleDelete(int $id_pagu)
   {
      $model = new Model();
      $data = $model->handleDelete($id_pagu);
      return $this->respond($data);
   }

   public function getDataToEdit(int $id_pagu)
   {
      $model = new Model();
      $data = $model->getDataToEdit($id_pagu);
      return $this->respond($data);
   }

   public function handleSubmit(): object
   {
      $response = ['status' => false, 'errors' => []];

      $validation = new Validate();
      if ($this->validate($validation->handleSubmit())) {
         $model = new Model();
         $submit = $model->handleSubmit((array) $this->request->getJSON());

         $response = array_merge($submit, ['errors' => []]);
      } else {
         $response['message'] = 'Tolong periksa kembali inputan anda!';
         $response['errors'] = \Config\Services::validation()->getErrors();
      }
      return $this->respond($response);
   }
}

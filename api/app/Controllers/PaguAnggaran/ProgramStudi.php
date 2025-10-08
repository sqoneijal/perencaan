<?php

namespace App\Controllers\PaguAnggaran;

use App\Controllers\BaseController;
use App\Models\PaguAnggaran\ProgramStudi as Model;
use App\Validation\PaguAnggaran\ProgramStudi as Validate;

class ProgramStudi extends BaseController
{
   public function index()
   {
      $model = new Model();
      $data = $model->getData($this->request->getGet());
      return $this->respond($data);
   }

   public function handleDelete(int $id)
   {
      $model = new Model();
      $data = $model->handleDelete($id);
      return $this->respond($data);
   }

   public function getSisaPaguFakultas()
   {
      $model = new Model();
      $data = $model->getSisaPaguFakultas($this->request->getGet());
      return $this->respond($data);
   }

   public function handleSubmit(): object
   {
      $response = ['status' => false, 'errors' => []];

      $post = (array) $this->request->getJSON();

      $validation = new Validate();
      if ($this->validate($validation->handleSubmit($post['untuk_semua_prodi']))) {
         $model = new Model();
         $submit = $model->handleSubmit($post);

         $response = array_merge($submit, ['errors' => []]);
      } else {
         $response['message'] = 'Tolong periksa kembali inputan anda!';
         $response['errors'] = \Config\Services::validation()->getErrors();
      }
      return $this->respond($response);
   }
}

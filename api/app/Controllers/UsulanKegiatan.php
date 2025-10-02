<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\UsulanKegiatan as Model;
use App\Validation\UsulanKegiatan as Validate;
use App\Models\Common;

class UsulanKegiatan extends BaseController
{
   public function index(): object
   {
      $model = new Model();
      $data = $model->getData($this->request->getGet());
      return $this->respond($data);
   }

   public function deleteUsulanKegiatan(int $id): object
   {
      $model = new Model();
      $data = $model->deleteUsulanKegiatan($id);
      return $this->respond($data);
   }

   public function deleteRAB(int $id): object
   {
      $model = new Model();
      $data = $model->deleteRAB($id);
      return $this->respond($data);
   }

   public function getDataRAB(int $id_usulan_kegiatan): object
   {
      $model = new Model();
      $data = $model->getDataRAB($id_usulan_kegiatan, $this->request->getGet());
      return $this->respond($data);
   }

   public function getRabActions(): object
   {
      $common = new Common();
      $data = [
         'daftarUnitSatuan' => $common->getDaftarUnitSatuan()
      ];
      return $this->respond(['data' => $data]);
   }

   public function getDetail(int $id_usulan_kegiatan, string $type): object
   {
      $model = new Model();
      $data = $model->getDetail($id_usulan_kegiatan, $type);
      return $this->respond($data);
   }

   public function submitRAB(int $id_usulan_kegiatan): object
   {
      $response = ['status' => false, 'errors' => []];

      $post = (array) $this->request->getJSON();

      $validation = new Validate();
      if ($this->validate($validation->submitRAB())) {
         $model = new Model();
         $submit = $model->submitRAB(array_merge($post, ['id_usulan' => $id_usulan_kegiatan]));

         $response = array_merge($submit, ['errors' => []]);
      } else {
         $response['message'] = 'Tolong periksa kembali inputan anda!';
         $response['errors'] = \Config\Services::validation()->getErrors();
      }
      return $this->respond($response);
   }

   public function submit(): object
   {
      $response = ['status' => false, 'errors' => []];

      $post = (array) $this->request->getJSON();

      $validation = new Validate();
      if ($this->validate($validation->submit(@$post['id']))) {
         $model = new Model();
         $submit = $model->submit($post);

         $response = array_merge($submit, ['errors' => []]);
      } else {
         $response['message'] = 'Tolong periksa kembali inputan anda!';
         $response['errors'] = \Config\Services::validation()->getErrors();
      }
      return $this->respond($response);
   }
}

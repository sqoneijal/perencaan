<?php

namespace App\Validation;

class UsulanKegiatan
{

   public function submit(?int $id = null): array
   {
      return [
         'kode' => [
            'rules' => 'required|is_unique[tb_usulan_kegiatan.kode,id,' . $id . ']',
            'label' => 'Kode usulan kegiatan'
         ],
         'nama' => [
            'rules' => 'required',
            'label' => 'Nama'
         ],
         'latar_belakang' => [
            'rules' => 'required',
            'label' => 'Latar belakang'
         ],
         'tujuan' => [
            'rules' => 'required',
            'label' => 'Tujuan'
         ],
         'sasaran' => [
            'rules' => 'required',
            'label' => 'Sasaran'
         ],
         'waktu_mulai' => [
            'rules' => 'required',
            'label' => 'Tanggal mulai'
         ],
         'waktu_selesai' => [
            'rules' => 'required',
            'label' => 'Tanggal selesai'
         ],
         'tempat_pelaksanaan' => [
            'rules' => 'required',
            'label' => 'Tempat pelaksanaan'
         ],
         'id_unit_pengusul' => [
            'rules' => 'required',
            'label' => 'Unit pengusul'
         ],
         'rencanca_total_anggaran' => [
            'rules' => 'required|numeric',
            'label' => 'Rencana total anggaran'
         ]
      ];
   }
}

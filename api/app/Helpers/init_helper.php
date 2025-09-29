<?php

function cleanDataSubmit(array $fields, array $post): array
{
   foreach ($fields as $field) {
      if (@$post[$field]) {
         $data[$field] = $post[$field];
      } else {
         $data[$field] = null;
      }
   }
   return $data;
}

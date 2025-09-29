<?php

use CodeIgniter\Router\RouteCollection;

$routes->options('referensi/(:any)', 'BaseController::options');

$routes->group('referensi', ['namespace' => "App\Controllers\Referensi"], function (RouteCollection $routes) {
   $routes->group('unit-satuan', function (RouteCollection $routes) {
      $routes->get('/', 'UnitSatuan::index');

      $routes->delete('(:num)', 'UnitSatuan::handleDelete/$1');

      $routes->group('actions', function (RouteCollection $routes) {
         $routes->get('(:num)', 'UnitSatuan::getDetailEdit/$1');

         $routes->post('/', 'UnitSatuan::submit');
      });
   });
});

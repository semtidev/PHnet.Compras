<?php
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Auth::routes();

// Start App
Route::get('/', 'AppController@index')->name('Home');
Route::get('/home', 'AppController@index')->name('Home');
Route::get('/locked', 'AppController@locked')->name('Locked Screen');
Route::get('/dashboard', 'DashboardController@dashboard')->name('Dashboard');
Route::get('/dashboard/{filter_work}/{filter_dpto}/{filter_month}/{filter_year}', 'DashboardController@dashboard')->name('Dashboard Filters');
Route::get('/mail/request/create', 'AppController@mailRequestCreate');
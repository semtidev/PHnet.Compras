<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// LOCKED SCREEN
Route::post('/unlocked', 'AppController@unlocked')->name('Unlocked');

// CONFIGURATION
Route::post('/usertoken', 'AppController@getUserTokenAccess')->name('User Token');
Route::post('/descrypter', 'AppController@descrypter')->name('Descrypter');
Route::post('replacement', 'AppController@setReplacement')->name('Replacement');

Route::get('departments/{system}', 'ConfigController@getDepartments')->name('Get Departments');
Route::get('specialities/{department}', 'ConfigController@getSpecialities')->name('Get Specialities');
Route::get('works/{appmodule}', 'ConfigController@getWorks')->name('Get Works');
Route::get('worksabbr', 'ConfigController@getWorksAbbr')->name('Get Works Abbr');
Route::post('updateStateModuleWork', 'ConfigController@updateStateModuleWork')->name('Update Work Module State');
Route::post('updateSubsystemDpto', 'ConfigController@updateSubsystemDpto')->name('Update Department Subsystems State');
Route::post('deleteWork', 'ConfigController@delWorks')->name('Delete Work');
Route::post('deleteDpto', 'ConfigController@deleteDpto')->name('Delete Department');
Route::post('updateWork', 'ConfigController@updWork')->name('Update Work');
Route::post('updateDpto', 'ConfigController@updateDpto')->name('Update Work');
Route::post('metrotypes/upd', 'ConfigController@updMetrotype')->name('Update Metrology Type');
Route::post('user/store', 'ConfigController@storeUser')->name('User Store');
Route::post('user/profile', 'ConfigController@profileUser')->name('User Profile');
Route::post('user/notify', 'ConfigController@notifyUser')->name('User Notify');
Route::post('user/password', 'AppController@changePassword')->name('User Change Pass');

// SHOPPING REQUESTS
Route::get('shopping/departments', 'ShoppingController@getDepartments')->name('Get Shopping Departments');
Route::get('shopping/departmentsform/{user}/{all?}', 'ShoppingController@getDepartmentsForm')->name('Get Shopping Departments Form');
Route::get('shopping/works', 'ShoppingController@getWorks')->name('Get Shopping Works');
Route::get('shopping/worksform/{user}', 'ShoppingController@getWorksForm')->name('Get Shopping Works Form');
Route::get('shopping/warehouse', 'ShoppingController@getGoodsWarehouse')->name('Get Shopping Goods Warehouse');
Route::get('shopping/requests/{user}/{work}/{dpto}/{filter?}/{search?}/{circuit?}/{active?}', 'ShoppingController@getShoppingRequest')->name('Get Shopping Requests');
Route::get('shopping/request/{id}/products', 'ShoppingController@getShoppingRequestProducts')->name('Get Shopping Request Products');
Route::get('shopping/pdf/711', 'ShoppingController@expModel')->name('Make PDF 711 Model');
Route::get('shopping/request/comments/{id}', 'ShoppingController@requestGetComments')->name('Get Request Comments');
Route::post('shopping/filter', 'ShoppingController@setFilter')->name('Set Shopping Filter');
Route::post('shopping/filter/loadForm', 'ShoppingController@loadFilterForm')->name('Load Shopping Filter Form');

Route::post('shopping/request/add', 'ShoppingController@createRequest')->name('Create Shopping Request');
Route::post('shopping/request/upd', 'ShoppingController@updateRequest')->name('Update Shopping Request');
Route::post('shopping/request/del', 'ShoppingController@deleteRequest')->name('Delete Shopping Request');
Route::post('shopping/request/loadForm', 'ShoppingController@loadRequestForm')->name('Load Form Shopping Request');
Route::post('shopping/request/product/add', 'ShoppingController@createProduct')->name('Create Shopping Request Product');
Route::post('shopping/request/uploadpdf', 'ShoppingController@uploadRequestPdf')->name('Upload Request PDF');
Route::post('shopping/request/rolstate', 'ShoppingController@rolState')->name('Get Request State for Rol');
Route::post('shopping/request/confirm', 'ShoppingController@rolConfirm')->name('Confirm Request by User');
Route::post('shopping/request/approve', 'ShoppingController@rolApprove')->name('Approve Request by User');
Route::post('shopping/request/reject', 'ShoppingController@rolReject')->name('Reject Request by User');
Route::post('shopping/request/comment', 'ShoppingController@requestComment')->name('Request Comment');
Route::post('shopping/request/cancel', 'ShoppingController@requestCancel')->name('Request Cancel');
Route::post('shopping/request/active', 'ShoppingController@requestActive')->name('Request Active');
Route::put('shopping/request/product/upd', 'ShoppingController@updateProduct')->name('Update Shopping Request Product');
Route::put('shopping/request/product/setphoto', 'ShoppingController@setPhoto')->name('Set Product Photo');
Route::delete('shopping/request/product/del', 'ShoppingController@deleteProduct')->name('Delete Shopping Request Product');
Route::delete('shopping/request/comment/del', 'ShoppingController@deleteComment')->name('Delete Request Comment');
Route::delete('request/product/quitphoto', 'ShoppingController@quitphotoProduct')->name('Quit photo Product');

// GALLERY
Route::get('gallery', 'GalleryController@getGallery')->name('Get Gallery');
Route::post('gallery/loadtempphoto', 'GalleryController@loadTempPhoto')->name('Load Temp Photo');
Route::post('gallery/add', 'GalleryController@createPhoto')->name('Gallery Photo Create');

// REQUESTS TRACKING
Route::get('tracking/{type}/{work}/{dpto}/{filter?}/{search?}/{circuit?}/{active?}/{state?}', 'TrackingController@getTracking')->name('Get Tracking');
Route::get('tracking/export/xlsx', 'TrackingController@exportExcel')->name('Tracking Export to Excel');
Route::get('tracking/export/pdf', 'TrackingController@exportPDF')->name('Tracking Export to Excel');
Route::put('tracking/national/upd', 'TrackingController@updateTrackingnat')->name('Update Nationalal Tracking');
Route::post('tracking/filter', 'TrackingController@setFilter')->name('Set Tracking Filter');
Route::post('tracking/filter/loadForm', 'TrackingController@loadFilterForm')->name('Load Filter Form');
Route::post('tracking/state', 'TrackingController@setShoppingState')->name('Set Request State');
Route::post('tracking/request/ubidate', 'TrackingController@setUbidate')->name('Set UBI Date');
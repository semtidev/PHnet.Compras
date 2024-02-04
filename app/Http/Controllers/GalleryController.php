<?php

namespace App\Http\Controllers;

use Image;
use App\ProductGallery;
use App\ShoppingRequestProduct;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    /**
     * Get Gallery.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function getGallery()
    {        
        $photos = ProductGallery::orderBy('category', 'ASC')->get();

        foreach ($photos as $row) {
            $row['src'] = $row->name;
            $arr_name = explode('.', $row->name);
            $row['name'] = $arr_name[0];
        }

        $response = array('success' => true, 'photos' => $photos);
        return response()->json($response,200);
    }
    
    /**
     * Load temp photo in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function loadTempPhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,jpg,png|max:1024'
        ]);

        $current_user = $request->user;

        // images routes
        $imagePath = public_path('/dist/img/temp/');
        $thumbnailPath = public_path('/dist/img/temp/thumbnails/');
        $mediumPath = public_path('/dist/img/temp/medium/');

        // delete prev image
        if($request->loadphoto_prev != null && $request->loadphoto_prev != ''){
            
            $image_prev = $request->loadphoto_prev;
            if (\file_exists($imagePath . $image_prev)) {
                \unlink($imagePath . $image_prev);
            }
            if (\file_exists($thumbnailPath . $image_prev)) {
                \unlink($thumbnailPath . $image_prev);
            }
            if (\file_exists($mediumPath . $image_prev)) {
                \unlink($mediumPath . $image_prev);
            }
        }       
        
        // get image form
        $imagenOriginal = $request->file('photo');
        
        // crear instancia de imagen
        $image = Image::make($imagenOriginal);
        
        // get image form name
        $imageName = $imagenOriginal->getClientOriginalName();
        
        // set image name
        $arr_name = explode('.', $imageName);
        $imageName = 'photo' . $current_user . '_' . $request->nrandom . '.' . $arr_name[1];
        
        // save original image
        $image->save($imagePath . $imageName, 100);
        
        // resize image to 215x180 px
        $image->resize(215,180);
        
        // save medium image
        $image->save($mediumPath . $imageName, 100);

        // resize thumbnail to 100x70 px
        $image->resize(100,70);

        // save thumbnail image
        $image->save($thumbnailPath . $imageName, 100);

        $response = array('success' => true, 'imagename' => $imageName);
        return response()->json($response,200);
    }

    /**
     * Create Gallery Photo.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function createPhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required',
            'name' => 'required|max:20',
            'category' => 'required'
        ]);
        
        // photo name
        $arr_name = explode('.', $request->photo);
        $photo_name = str_replace(' ', '_', strtolower(trim($request->name))) . '.' . $arr_name[1];
        
        if (ProductGallery::where('name', $photo_name)->exists()) {

            $response = array(
                'failure' => true,
                'message' => 'Ya existe un producto con este nombre en la Galer&iacute;a.'
            );
            return response()->json($response,200);
        }
        else {

            // images routes temp
            $temp_imagePath = public_path('/dist/img/temp/');
            $temp_thumbnailPath = public_path('/dist/img/temp/thumbnails/');
            $temp_mediumPath = public_path('/dist/img/temp/medium/');

            // images routes storage
            $imagePath = storage_path('/app/public/products/');
            $thumbnailPath = storage_path('/app/public/products/thumbnails/');
            $mediumPath = storage_path('/app/public/products/medium/');

            // copy the images in storage folder
            \copy($temp_imagePath . $request->photo, $imagePath . $request->photo);
            \copy($temp_mediumPath . $request->photo, $mediumPath . $request->photo);
            \copy($temp_thumbnailPath . $request->photo, $thumbnailPath . $request->photo);

            // rename the images in storage folder
            \rename($imagePath . $request->photo, $imagePath . $photo_name);
            \rename($mediumPath . $request->photo, $mediumPath . $photo_name);
            \rename($thumbnailPath . $request->photo, $thumbnailPath . $photo_name);

            // delete temp image
            \unlink($temp_imagePath . $request->photo);
            \unlink($temp_mediumPath . $request->photo);
            \unlink($temp_thumbnailPath . $request->photo);
            
            // description
            if ($request->description == 'Descripción del producto') {
                $description = null;
            }
            else {
                $description = $request->description;
            }
            
            // Store Photo
            try {
                ProductGallery::create([
                    'name' => $photo_name,
                    'description' => $description,
                    'category' => $request->category
                ]);
            } 
            catch (Throwable $e) {            
                $response = array('error' => true, 'errors' => $e);
                return response()->json($response,200);
            }

            // Set product photo
            ShoppingRequestProduct::find($request->product)->update([
                'photo' => $photo_name
            ]);

            $product = ShoppingRequestProduct::select('id', 'description', 'photo')
                            ->where('id', $request->product)->first();

            $response = array('success' => true, 'product' => $product);
            return response()->json($response,200);
        }
    }
}

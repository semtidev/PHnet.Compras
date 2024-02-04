<?php

namespace App\Http\Controllers;

use Throwable;
use App\User;
use App\Replacement;
use App\Position;
use App\LogUser;
use App\Encryption\Encryption;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class AppController extends Controller
{
    /**
     * Start the application.
     */
    public function index()
    {
        // Clear Entire Cache
        Cache::flush();
        return view('index');
    }

    /**
     * Locked Screen.
     */
    public function locked()
    {
        return view('auth.locked');
    }

	/**
     * Get user token access.
     *
     * @param  \Illuminate\Http\Request $request
     *
     * @return Response
     */
    public function getUserTokenAccess(Request $request)
    {
		$user  = User::find($request->id);
		$roles = array();
		$works = array();
		$dpto  = $user->department;
		$position = Position::find($user->position)->position;
		
		foreach ($user->roles as $role) {
			$roles[] = $role->name;
		}
		$roles = implode(",", $roles);

		foreach ($user->works as $work) {
			$works[] = $work->id;
		}
		$works = implode(",", $works);

		$access = $works . '*' . $roles;
		
		$encryption = new Encryption();
		$token = $encryption->Encrypt($access);
		//$descrypt =  $encryption->Decrypt($token);
    	//return  "ROLES :> $access" . "<br> ENCRYPT :> ". $token . "<br> DESCRYPT :> ". $descrypt;

		$response = array(
			'success' => true,
			'access' => $token,
			'position' => $position
		);

		return response()->json($response,200);
    }

	/**
     * Descrypter token.
     *
     * @param  \Illuminate\Http\Request $request
     *
     * @return Response
     */
    public function descrypter(Request $request)
    {
		$encryption = new Encryption();
		$descrypt =  $encryption->Decrypt($request->token);
		$response = array(
			'success' => true,
			'access' => $descrypt
		);
		return response()->json($response,200);
    }

    /**
     * Unlocked Screen.
     *
     * @param  \Illuminate\Http\Request $request
     *
     * @return Response
     */
    public function unlocked(Request $request)
    {
        $credentials = $request->only('email', 'password');

        $admin_pwd = User::where('email', $request->email)->first()->password;
        $form_pwd  = Hash::make($request->password);
        //return $admin_pwd . '<br>' . $form_pwd;
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $response = array(
                'success' => true
            );
        }
        else {
            $response = array(
                'success' => false,
                'errors' => 'Error'
            );
        }
        return response()->json($response,200);
    }

    /**
     * Change User Password.
     *
     * @param  \Illuminate\Http\Request $request
     *
     * @return Response
     */
    public function changePassword(Request $request)
    {
        $credentials = $request->only('email', 'password');

        $email   = User::where('id', $request->user)->first()->email;
        $newpass = Hash::make($request->new_pass);

        if (Auth::attempt(['email' => $email, 'password' => $request->old_pass])) {
            
            $user = User::find($request->user)->update([
                'password' => $newpass
            ]);

            $response = array(
                'success' => true
            );
        }
        else {
            $response = array(
                'success' => false,
                'message' => 'La Contraseña actual es Incorrecta. Por favor, inténtelo nuevamente.'
            );
        }
        return response()->json($response,200);
    }

    /**
     * Set Replacement.
     *
     * @param  \Illuminate\Http\Request $request
     *
     * @return Response
     */
    public function setReplacement(Request $request)
    {
        $id_user = intval($request->id_user);
		$client  = getIP();

		if ($request->director2 && $request->director2 == 'on') {
			Replacement::create([
                'id_user' => 2008,
				'date_from' => $request->date_from,
				'date_to' => $request->date_to
            ]);
		}

		if ($request->director3 && $request->director3 == 'on') {
			Replacement::create([
                'id_user' => 2012,
				'date_from' => $request->date_from,
				'date_to' => $request->date_to
            ]);
		}

		// Save log
		$user_rol  = User::find($id_user);		
		$log_roles = '';
        foreach ($user_rol->roles as $roles) {
			$log_roles .= ', ' . $roles->name;
		}
		$log_roles = substr($log_roles, 2);
		
		try {			
			LogUser::create([
				'id_user' => $id_user,
				'action' => 'replacement',
				'created_at' => now(),
				'client' => $client,
				'rol' => $log_roles
			]);
		} catch (Throwable $th) {			
			$response = array('success' => true, 'error' => $th);
        	return response()->json($response,200);
		}
		
		$response = array(
			'success' => true
		);
        return response()->json($response,200);
    }
}

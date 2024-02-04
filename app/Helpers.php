<?php
use App\ShoppingRequest;
use App\Encryption\Encryption;

// MONTH NAME
if (!function_exists('month_name')) {
    function month_name($month)
    {
        $months  = array('', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');
        return $months[$month];
    }
}

// DB DAYS
if (!function_exists('db_day')) {
    function db_day($day)
    {
        $db_days  = array('01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31');
        return $db_days[$day];
    }
}

// NEW SHOPPING REQUEST
if (!function_exists('new_shopping_request')) {
    function new_shopping_request()
    {
        $total_request_circuit = ShoppingRequest::selectRaw('count(id) as total_request_circuit')
                                    ->where('id_shopping_state', 1)
									->where('esp_confirm', 1)
                                    ->first()
                                    ->total_request_circuit;
        return $total_request_circuit;
    }
}

// DESCRYPTER
if (!function_exists('descrypter')) {
    function descrypter($token)
    {
        //$encryption = new Encryption();
		//$access = $encryption->Decrypt($token);
        return $token;
    }
}

// GET IP CLIENT
if (!function_exists('getIP')) {
    function getIP()
    {
       if (getenv("HTTP_CLIENT_IP") && strcasecmp(getenv("HTTP_CLIENT_IP"),"unknown"))
               $ip = getenv("HTTP_CLIENT_IP");
       else if (getenv("HTTP_X_FORWARDED_FOR") && strcasecmp(getenv("HTTP_X_FORWARDED_FOR"), "unknown"))
               $ip = getenv("HTTP_X_FORWARDED_FOR");
       else if (getenv("REMOTE_ADDR") && strcasecmp(getenv("REMOTE_ADDR"), "unknown"))
               $ip = getenv("REMOTE_ADDR");
       else if (isset($_SERVER['REMOTE_ADDR']) && $_SERVER['REMOTE_ADDR'] && strcasecmp($_SERVER['REMOTE_ADDR'], "unknown"))
               $ip = $_SERVER['REMOTE_ADDR'];
       else
               $ip = "IP desconocida";
       return($ip);
    }
}
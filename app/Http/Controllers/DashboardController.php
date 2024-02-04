<?php

namespace App\Http\Controllers;

use App\Work;
use App\Department;
use App\ShoppingRequest;
use App\RequestTracking;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function dashboard($filter_work = -1, $filter_dpto = -1, $filter_month = -1, $filter_year = -1)
    {        
        
        // REQUEST SELECTS
        $works = Work::where('shoppingrequest', 1)->where('active', 1)->orderBy('name', 'ASC')->get();
        $dptos = Department::orderBy('name', 'ASC')->get();
        $months = array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');
        
        // REQUEST BANNERS
        $total_request = ShoppingRequest::selectRaw('count(id) as total_request')
                                    ->first()
                                    ->total_request;

        $total_request_circuit = ShoppingRequest::selectRaw('count(id) as total_request_circuit')
                                    ->where('id_shopping_state', 1)
									->where('esp_confirm', 1)
                                    ->first()
                                    ->total_request_circuit;

        $total_request_offer = ShoppingRequest::selectRaw('count(*) as total_request_offer')
                                    ->where('id_shopping_state', 2)
                                    ->first()
                                    ->total_request_offer;

        $total_request_contract = ShoppingRequest::selectRaw('count(*) as total_request_contract')
                                    ->where('id_shopping_state', 3)
                                    ->first()
                                    ->total_request_contract;

        $total_request_supplied = ShoppingRequest::selectRaw('count(*) as total_request_supplied')
                                    ->where('id_shopping_state', 4)
                                    ->first()
                                    ->total_request_supplied;

        // REQUEST CHART
        $categories = array();
        $data_circf = array();
        $data_offer = array();
        $data_cntto = array();
        $data_suppl = array();

        if ($filter_work == -1) {
            
            $works_chart = $works;
        }
        else {
            $works_chart = Work::where('shoppingrequest', 1)->where('id', $filter_work)->get();
        }
        

        foreach ($works_chart as $work) {
                        
            if ($filter_dpto == -1) {
                
                if ($filter_month == -1) {

                    if ($filter_year == -1) {

                        $total_circf = ShoppingRequest::selectRaw('count(id) as total_request_circuit')
                                            ->where('id_work', $work->id)
                                            ->where('id_shopping_state', 1)
                                            ->first()
                                            ->total_request_circuit;
                        $total_offer = ShoppingRequest::selectRaw('count(id) as total_request_offer')
                                            ->where('id_work', $work->id)
                                            ->where('id_shopping_state', 2)
                                            ->first()
                                            ->total_request_offer;
                        $total_cntto = ShoppingRequest::selectRaw('count(id) as total_request_cntto')
                                            ->where('id_work', $work->id)
                                            ->where('id_shopping_state', 3)
                                            ->first()
                                            ->total_request_cntto;
                        $total_suppl = ShoppingRequest::selectRaw('count(id) as total_request_suppl')
                                            ->where('id_work', $work->id)
                                            ->where('id_shopping_state', 4)
                                            ->first()
                                            ->total_request_suppl;
                    }
                    else {
                        
                        $total_circf = ShoppingRequest::selectRaw('count(id) as total_request_circuit')
                                            ->where('id_work', $work->id)
                                            ->where('id_shopping_state', 1)
                                            ->whereYear('created_at', $filter_year)
                                            ->first()
                                            ->total_request_circuit;
                        $total_offer = ShoppingRequest::selectRaw('count(id) as total_request_offer')
                                            ->where('id_work', $work->id)
                                            ->where('id_shopping_state', 2)
                                            ->whereYear('created_at', $filter_year)
                                            ->first()
                                            ->total_request_offer;
                        $total_cntto = ShoppingRequest::selectRaw('count(id) as total_request_cntto')
                                            ->where('id_work', $work->id)
                                            ->where('id_shopping_state', 3)
                                            ->whereYear('created_at', $filter_year)
                                            ->first()
                                            ->total_request_cntto;
                        $total_suppl = ShoppingRequest::selectRaw('count(id) as total_request_suppl')
                                            ->where('id_work', $work->id)
                                            ->where('id_shopping_state', 4)
                                            ->whereYear('created_at', $filter_year)
                                            ->first()
                                            ->total_request_suppl;
                    }
                }
                else {

                    if ($filter_year == -1) {

                        $total_circf = ShoppingRequest::selectRaw('count(id) as total_request_circuit')
                                            ->where('id_work', $work->id)
                                            ->where('id_shopping_state', 1)
                                            ->whereMonth('created_at', $filter_month)
                                            ->first()
                                            ->total_request_circuit;
                        $total_offer = ShoppingRequest::selectRaw('count(id) as total_request_offer')
                                            ->where('id_work', $work->id)
                                            ->where('id_shopping_state', 2)
                                            ->whereMonth('created_at', $filter_month)
                                            ->first()
                                            ->total_request_offer;
                        $total_cntto = ShoppingRequest::selectRaw('count(id) as total_request_cntto')
                                            ->where('id_work', $work->id)
                                            ->where('id_shopping_state', 3)
                                            ->whereMonth('created_at', $filter_month)
                                            ->first()
                                            ->total_request_cntto;
                        $total_suppl = ShoppingRequest::selectRaw('count(id) as total_request_suppl')
                                            ->where('id_work', $work->id)
                                            ->where('id_shopping_state', 4)
                                            ->whereMonth('created_at', $filter_month)
                                            ->first()
                                            ->total_request_suppl;
                    }
                    else {
                        
                        $total_circf = ShoppingRequest::selectRaw('count(id) as total_request_circuit')
                                            ->where('id_work', $work->id)
                                            ->where('id_shopping_state', 1)
                                            ->whereMonth('created_at', $filter_month)
                                            ->whereYear('created_at', $filter_year)
                                            ->first()
                                            ->total_request_circuit;
                        $total_offer = ShoppingRequest::selectRaw('count(id) as total_request_offer')
                                            ->where('id_work', $work->id)
                                            ->where('id_shopping_state', 2)
                                            ->whereMonth('created_at', $filter_month)
                                            ->whereYear('created_at', $filter_year)
                                            ->first()
                                            ->total_request_offer;
                        $total_cntto = ShoppingRequest::selectRaw('count(id) as total_request_cntto')
                                            ->where('id_work', $work->id)
                                            ->where('id_shopping_state', 3)
                                            ->whereMonth('created_at', $filter_month)
                                            ->whereYear('created_at', $filter_year)
                                            ->first()
                                            ->total_request_cntto;
                        $total_suppl = ShoppingRequest::selectRaw('count(id) as total_request_suppl')
                                            ->where('id_work', $work->id)
                                            ->where('id_shopping_state', 4)
                                            ->whereMonth('created_at', $filter_month)
                                            ->whereYear('created_at', $filter_year)
                                            ->first()
                                            ->total_request_suppl;
                    }
                }
            }
            else {

                if ($filter_month == -1) {

                    if ($filter_year == -1) {

                        $total_circf = ShoppingRequest::selectRaw('count(id) as total_request_circuit')
                                            ->where('id_work', $work->id)
                                            ->where('id_shopping_state', 1)
                                            ->where('id_department', $filter_dpto)
                                            ->first()
                                            ->total_request_circuit;
                        $total_offer = ShoppingRequest::selectRaw('count(id) as total_request_offer')
                                            ->where('id_work', $work->id)
                                            ->where('id_shopping_state', 2)
                                            ->where('id_department', $filter_dpto)
                                            ->first()
                                            ->total_request_offer;
                        $total_cntto = ShoppingRequest::selectRaw('count(id) as total_request_cntto')
                                            ->where('id_work', $work->id)
                                            ->where('id_shopping_state', 3)
                                            ->where('id_department', $filter_dpto)
                                            ->first()
                                            ->total_request_cntto;
                        $total_suppl = ShoppingRequest::selectRaw('count(id) as total_request_suppl')
                                            ->where('id_work', $work->id)
                                            ->where('id_shopping_state', 4)
                                            ->where('id_department', $filter_dpto)
                                            ->first()
                                            ->total_request_suppl;
                    }
                    else {
                        
                        $total_circf = ShoppingRequest::selectRaw('count(id) as total_request_circuit')
                                            ->where('id_work', $work->id)
                                            ->where('id_shopping_state', 1)
                                            ->whereYear('created_at', $filter_year)
                                            ->where('id_department', $filter_dpto)
                                            ->first()
                                            ->total_request_circuit;
                        $total_offer = ShoppingRequest::selectRaw('count(id) as total_request_offer')
                                            ->where('id_work', $work->id)
                                            ->where('id_shopping_state', 2)
                                            ->whereYear('created_at', $filter_year)
                                            ->where('id_department', $filter_dpto)
                                            ->first()
                                            ->total_request_offer;
                        $total_cntto = ShoppingRequest::selectRaw('count(id) as total_request_cntto')
                                            ->where('id_work', $work->id)
                                            ->where('id_shopping_state', 3)
                                            ->whereYear('created_at', $filter_year)
                                            ->where('id_department', $filter_dpto)
                                            ->first()
                                            ->total_request_cntto;
                        $total_suppl = ShoppingRequest::selectRaw('count(id) as total_request_suppl')
                                            ->where('id_work', $work->id)
                                            ->where('id_shopping_state', 4)
                                            ->whereYear('created_at', $filter_year)
                                            ->where('id_department', $filter_dpto)
                                            ->first()
                                            ->total_request_suppl;
                    }
                }
                else {

                    if ($filter_year == -1) {

                        $total_circf = ShoppingRequest::selectRaw('count(id) as total_request_circuit')
                                            ->where('id_work', $work->id)
                                            ->where('id_shopping_state', 1)
                                            ->whereMonth('created_at', $filter_month)
                                            ->where('id_department', $filter_dpto)
                                            ->first()
                                            ->total_request_circuit;
                        $total_offer = ShoppingRequest::selectRaw('count(id) as total_request_offer')
                                            ->where('id_work', $work->id)
                                            ->where('id_shopping_state', 2)
                                            ->whereMonth('created_at', $filter_month)
                                            ->where('id_department', $filter_dpto)
                                            ->first()
                                            ->total_request_offer;
                        $total_cntto = ShoppingRequest::selectRaw('count(id) as total_request_cntto')
                                            ->where('id_work', $work->id)
                                            ->where('id_shopping_state', 3)
                                            ->whereMonth('created_at', $filter_month)
                                            ->where('id_department', $filter_dpto)
                                            ->first()
                                            ->total_request_cntto;
                        $total_suppl = ShoppingRequest::selectRaw('count(id) as total_request_suppl')
                                            ->where('id_work', $work->id)
                                            ->where('id_shopping_state', 4)
                                            ->whereMonth('created_at', $filter_month)
                                            ->where('id_department', $filter_dpto)
                                            ->first()
                                            ->total_request_suppl;
                    }
                    else {
                        
                        $total_circf = ShoppingRequest::selectRaw('count(id) as total_request_circuit')
                                            ->where('id_work', $work->id)
                                            ->where('id_shopping_state', 1)
                                            ->whereMonth('created_at', $filter_month)
                                            ->whereYear('created_at', $filter_year)
                                            ->where('id_department', $filter_dpto)
                                            ->first()
                                            ->total_request_circuit;
                        $total_offer = ShoppingRequest::selectRaw('count(id) as total_request_offer')
                                            ->where('id_work', $work->id)
                                            ->where('id_shopping_state', 2)
                                            ->whereMonth('created_at', $filter_month)
                                            ->whereYear('created_at', $filter_year)
                                            ->where('id_department', $filter_dpto)
                                            ->first()
                                            ->total_request_offer;
                        $total_cntto = ShoppingRequest::selectRaw('count(id) as total_request_cntto')
                                            ->where('id_work', $work->id)
                                            ->where('id_shopping_state', 3)
                                            ->whereMonth('created_at', $filter_month)
                                            ->whereYear('created_at', $filter_year)
                                            ->where('id_department', $filter_dpto)
                                            ->first()
                                            ->total_request_cntto;
                        $total_suppl = ShoppingRequest::selectRaw('count(id) as total_request_suppl')
                                            ->where('id_work', $work->id)
                                            ->where('id_shopping_state', 4)
                                            ->whereMonth('created_at', $filter_month)
                                            ->whereYear('created_at', $filter_year)
                                            ->where('id_department', $filter_dpto)
                                            ->first()
                                            ->total_request_suppl;
                    }
                }
            }
            
            if ($total_circf > 0 || $total_offer > 0 || $total_cntto > 0 || $total_suppl > 0) {
                
                $categories[] = $work->name;
                $data_circf[] = $total_circf;
                $data_offer[] = $total_offer;
                $data_cntto[] = $total_cntto;
                $data_suppl[] = $total_suppl;
            }            
        }

        $categories = json_encode(implode(',', $categories));
        $data_circf = json_encode(implode(',', $data_circf));
        $data_offer = json_encode(implode(',', $data_offer));
        $data_cntto = json_encode(implode(',', $data_cntto));
        $data_suppl = json_encode(implode(',', $data_suppl));

        // REQUEST TYPES
        $total_request_local = ShoppingRequest::selectRaw('count(id) as total_request_local')
                                    ->where('id_shopping_type', 1)
                                    ->first()
                                    ->total_request_local;
        $total_request_national = ShoppingRequest::selectRaw('count(id) as total_request_national')
                                    ->where('id_shopping_type', 2)
                                    ->first()
                                    ->total_request_national;
        $total_request_import = ShoppingRequest::selectRaw('count(id) as total_request_import')
                                    ->where('id_shopping_type', 3)
                                    ->first()
                                    ->total_request_import;

        // LAST REQUEST
        $last_requests = ShoppingRequest::leftJoin('works', 'works.id', 'shopping_requests.id_work')
                            ->leftJoin('shopping_states', 'shopping_states.id', 'shopping_requests.id_shopping_state')
                            ->select('shopping_requests.code', 'shopping_requests.created_at', 'shopping_states.state', 'works.abbr as work')
                            ->orderBy('created_at', 'DESC')
                            ->limit(6)
                            ->get();
        
        return view('dashboard', compact('filter_work', 'filter_dpto', 'filter_month', 'filter_year', 'works', 'dptos', 'months', 'total_request', 'total_request_circuit', 'total_request_offer', 'total_request_contract', 'total_request_supplied', 'categories', 'data_circf', 'data_offer', 'data_cntto', 'data_suppl', 'total_request_local', 'total_request_national', 'total_request_import', 'last_requests'));
    }
}

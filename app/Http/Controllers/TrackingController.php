<?php

namespace App\Http\Controllers;

use Throwable;
use App\User;
use App\ShoppingRequest;
use App\RequestTracking;
use App\LogRequest;
use App\CommentRequest;
use App\Department;
use App\DepartmentRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\exports\ShoppingExport;
use Maatwebsite\Excel\Facades\Excel as Excel;
use Barryvdh\DomPDF\Facade as PDF;
use Illuminate\Support\Facades\Cache;

class TrackingController extends Controller
{
    /**
     * Get National/Import Tracking.
     */
    public function getTracking($type, $work = -1, $dpto = -1, $filter = 0, $search = '-1', $circuit = 'all', $active = 1, $state = -1)
    {
        $children = array();
        $shopp_requests = array();

        if ($type == 'national') {
            
            if ($filter == 0) {                
                $operator = '<>';
                Cache::forget('tracking');
            }
            else {
                $cache_tracking = Cache::get('tracking');
                $response = array('success' => true, 'children' => $cache_tracking);
                return response()->json($response,200);
            }
        }
        else {
            if ($filter == 0) {                
                $operator = '=';
                Cache::forget('tracking');
            }
            else {
                $cache_trackingnat = Cache::get('tracking');
                $response = array('success' => true, 'children' => $cache_trackingnat);
                return response()->json($response,200);
            }
        }
    
        // Query builder
        $sql = "SELECT r.id, r.created_at, r.code, r.document_date AS ubidate, r.name,	r.document, r.circuit, w.name AS works_name, w.abbr AS works_abbr, s.state AS state, r.parent, t.code_almest, t.code_requested, t.import_invoice, t.code_invoice, t.contract_value, t.contract_code, t.comment FROM dbo.shopping_requests AS r LEFT JOIN dbo.works AS w ON w.id = r.id_work LEFT JOIN dbo.shopping_states AS s ON s.id = r.id_shopping_state LEFT JOIN dbo.request_tracking AS t ON t.id_request = r.id WHERE r.id_shopping_type ".$operator." 3 AND r.active = " . $active;

        if (intval($work) != -1) {
            $sql .= " AND r.id_work = " . $work;
        }

		if ($search != '-1') {
            $sql .= " AND ((LOWER(r.code) LIKE LOWER('%$search%') COLLATE Modern_Spanish_CI_AI) OR (LOWER(r.name) LIKE LOWER('%$search%') COLLATE Modern_Spanish_CI_AI))";
        }

		if ($circuit != 'all') {
			$sql .= " AND r.circuit = '" . $circuit . "'";
        }

		if (intval($state)  != -1) {
			$sql .= " AND r.id_shopping_state = " . $state;
        }

        $shopp_requests = DB::select($sql);
        
        if ($work == -1) {
            
            foreach ($shopp_requests as $row) {
                            
                $id = $row->id;                
                // Total price
                $products = ShoppingRequest::find($id)->products()
                                ->select('ctdad', 'price')
                                ->get();        
                $total_price = 0;
                foreach ($products as $product) {
                    $total_price += $product->ctdad * $product->price;
                }

                // Date request
                $created_datetime  = explode(' ', $row->created_at);
                $created_date      = explode('-', $created_datetime[0]);
                $date_request      = $created_date[2] . '/' . $created_date[1] . '/' . $created_date[0];

                $rowchildrens = array();
                foreach ($shopp_requests as $findson) {
                    
                    if ($findson->parent == $id) {
                                                
                        // Comments
						$comments = CommentRequest::select(DB::raw('count(id) as comments'))
						->where('id_request', $id)
						->first()->comments;
						
						// Total price
                        $son_products = ShoppingRequest::find($findson->id)->products()
                                        ->select('ctdad', 'price')
                                        ->get();        
                        $son_total_price = 0;
                        foreach ($son_products as $son_product) {
                            $son_total_price += $son_product->ctdad * $son_product->price;
                        }

                        // Date request
                        $son_created_datetime  = explode(' ', $findson->created_at);
                        $son_created_date      = explode('-', $son_created_datetime[0]);
                        $son_date_request      = $son_created_date[2] . '/' . $son_created_date[1] . '/' . $son_created_date[0];

						// UBI date
						if ($findson->ubidate != null && $findson->ubidate != '') {
							$db_ubidate = explode('-', $findson->ubidate);
							$ubidate = $db_ubidate[2] . '/' . $db_ubidate[1] . '/' . $db_ubidate[0];
						}else{
							$ubidate = null;
						}

						$approved = 'CA';

                        $rowchildrens[] = array(
                            'leaf' => true,
                            'id' => $findson->id, 
                            'document_date' => $son_date_request,
                            'codedb' => $findson->code,
                            'code' => $findson->code, 
                            'name' => $findson->name, 
                            'work_name' => $findson->works_name, 
                            'work_abbr' => $findson->works_abbr, 
                            'ubidate' => $ubidate,
                            //'dpto_abbr' => $findson->dpto_abbr, 
                            'state' => $findson->state,
                            'document' => $findson->document,
                            'parent' => $findson->parent,
                            'code_almest' => $findson->code_almest,
                            'code_requested' => $findson->code_requested,
                            'budget' => number_format($son_total_price, 2, '.', ','),
                            'import_invoice' => number_format($findson->import_invoice, 2, '.', ','),
                            'code_invoice' => $findson->code_invoice,
                            'contract_value' => $findson->contract_value,
                            'contract_code' => $findson->contract_code,
                            'comment' => $findson->comment,
							'approved' => $approved,
							'totalcomments' => intval($comments)
                        );
                    }
                }

				// Filter Dpto
				$delchildrequests = array();
				if ($dpto != -1) {
					for($i = 0; $i < count($rowchildrens); $i++) {
						if (DepartmentRequest::where('id_request', $rowchildrens[$i]['id'])->where('id_department', $dpto)->exists()) {
							$department = Department::find($dpto);
							$rowchildrens[$i]['department'] = $department->name;
							$rowchildrens[$i]['dpto_ids'] = $department->id;
						}
						else {
							array_push($delchildrequests, $i);
						}
					}
				}
				else {
					
					for($i = 0; $i < count($rowchildrens); $i++) {
						
						$row_dptos = DepartmentRequest::leftJoin('departments', 'departments.id', 'department_requests.id_department')
													->select('departments.id', 'departments.name')
													->where('id_request', $rowchildrens[$i]['id'])
													->get();
						$dptos = '';
						$dpto_ids = '';
						foreach ($row_dptos as $row_dpto) {
							$dptos .= ', ' . $row_dpto->name;
							$dpto_ids .= ', ' . $row_dpto->id;
						}

						$rowchildrens[$i]['department'] = substr($dptos, 2);
						$rowchildrens[$i]['dpto_ids'] = substr($dpto_ids, 2);
					}
				}
				
				// Delete row no filter
				for($i = 0; $i < count($delchildrequests); $i++) {
					$idx = $delchildrequests[$i];
					unset($rowchildrens[$idx]);
				}
				
				sort($rowchildrens);				
                
                if ($row->parent == null || $row->parent == '') {

                    // Comments
					$comments = CommentRequest::select(DB::raw('count(id) as comments'))
											->where('id_request', $id)
											->first()->comments;

					// Get approve
					$confirmed = '';
					$approved  = 'pending';
					$reqlogs   = LogRequest::where('id_request', $id)->orderBy('id', 'DESC')->get();
					foreach ($reqlogs as $reqlog) {
						if ($reqlog->action == 'approved') {
							$approved_date = explode(' ', $reqlog->created_at);
							$approved = $approved_date[0];
							//$confirmed = LogRequest::where('id_request', $id)->where('action', 'confirmed')->get();
							break;
						}
						if ($reqlog->action == 'rejected') {
							$approved = 'rejected';
							break;
						}
					}

					// UBI date
					if ($row->ubidate != null && $row->ubidate != '') {
						$db_ubidate = explode('-', $row->ubidate);
						$ubidate = $db_ubidate[2] . '/' . $db_ubidate[1] . '/' . $db_ubidate[0];
					}else{
						$ubidate = null;
					}
					
					$children[] = array(
                        'id' => $row->id, 
                        'document_date' => $date_request,
                        'codedb' => $row->code, 
                        'code' => '<i class="fas fa-shopping-cart fa-sm"></i>&nbsp;' . $row->code, 
                        'name' => $row->name, 
                        'work_name' => $row->works_name, 
                        'work_abbr' => $row->works_abbr, 
                        'ubidate' => $ubidate,
                        //'dpto_abbr' => $row->dpto_abbr,
                        'state' => $row->state, 
                        'document' => $row->document, 
                        'parent' => $row->parent,
                        'code_almest' => $row->code_almest,
                        'code_requested' => $row->code_requested,
                        'budget' => number_format($total_price, 2, '.', ','),
                        'import_invoice' => number_format($row->import_invoice, 2, '.', ','),
                        'code_invoice' => $row->code_invoice,
                        'contract_value' => $row->contract_value,
                        'contract_code' => $row->contract_code,
                        'comment' => $row->comment,
                        "expanded" => true,
                        "children" => $rowchildrens,
						'approved' => $approved,
						'totalcomments' => intval($comments)
                    );
                }
            }
        }
        else {
            
            foreach ($shopp_requests as $row) {
                            
                $id = $row->id;

				// Comments
				$comments = CommentRequest::select(DB::raw('count(id) as comments'))
								->where('id_request', $id)
								->first()->comments;
                // Total price
                $products = ShoppingRequest::find($id)->products()
                                ->select('ctdad', 'price')
                                ->get();        
                $total_price = 0;
                foreach ($products as $product) {
                    $total_price += $product->ctdad * $product->price;
                }

                // Date request
                $created_datetime  = explode(' ', $row->created_at);
                $created_date      = explode('-', $created_datetime[0]);
                $date_request      = $created_date[2] . '/' . $created_date[1] . '/' . $created_date[0];

				// Get approve
				$approved = 'pending';
				$reqlogs  = LogRequest::where('id_request', $id)->orderBy('id', 'DESC')->get();
				foreach ($reqlogs as $reqlog) {
					if ($reqlog->action == 'approved') {
						$approved_date = explode(' ', $reqlog->created_at);
						$approved = $approved_date[0];
						break;
					}
					if ($reqlog->action == 'rejected') {
						$approved = 'rejected';
						break;
					}
				}

				// UBI date
				if ($row->ubidate != null && $row->ubidate != '') {
					$db_ubidate = explode('-', $row->ubidate);
					$ubidate = $db_ubidate[2] . '/' . $db_ubidate[1] . '/' . $db_ubidate[0];
				}else{
					$ubidate = null;
				}

                $children[] = array(
                    'leaf' => true,
                    'id' => $row->id, 
                    'document_date' => $date_request,
                    'codedb' => $row->code, 
                    'code' => '<i class="fas fa-shopping-cart fa-sm"></i>&nbsp;' . $row->code, 
                    'name' => $row->name, 
                    'work_name' => $row->works_name, 
                    'work_abbr' => $row->works_abbr, 
                    'ubidate' => $ubidate,
                    //'dpto_abbr' => $row->dpto_abbr,
                    'state' => $row->state, 
                    'document' => $row->document, 
                    'parent' => $row->parent,
                    'code_almest' => $row->code_almest,
                    'code_requested' => $row->code_requested,
                    'budget' => number_format($total_price, 2, '.', ','),
                    'import_invoice' => number_format($row->import_invoice, 2, '.', ','),
                    'code_invoice' => $row->code_invoice,
                    'contract_value' => $row->contract_value,
                    'contract_code' => $row->contract_code,
                    'comment' => $row->comment,
					'approved' => $approved,
					'totalcomments' => intval($comments)
                );
            }
        }

		// Filter Dpto
		$delrequests = array();
		if ($dpto != -1) {
            
			for($i = 0; $i < count($children); $i++) {
				if (DepartmentRequest::where('id_request', $children[$i]['id'])->where('id_department', $dpto)->exists()) {
					$department = Department::find($dpto);
					$children[$i]['department'] = $department->name;
					$children[$i]['dpto_ids'] = $department->id;
				}
				else {
					array_push($delrequests, $i);
				}
			}
        }
		else {
			
			for($i = 0; $i < count($children); $i++) {
				
				$row_dptos = DepartmentRequest::leftJoin('departments', 'departments.id', 'department_requests.id_department')
								->select('departments.id', 'departments.name')
								->where('id_request', $children[$i]['id'])
								->get();
				$dptos = '';
				$dpto_ids = '';
				foreach ($row_dptos as $row_dpto) {
					$dptos .= ', ' . $row_dpto->name;
					$dpto_ids .= ', ' . $row_dpto->id;
				}

				$children[$i]['department'] = substr($dptos, 2);
				$children[$i]['dpto_ids'] = substr($dpto_ids, 2);
			}
		}
		
		// Delete row no filter
		for($i = 0; $i < count($delrequests); $i++) {
			$idx = $delrequests[$i];
			unset($children[$idx]);
		}
		
		sort($children);

        Cache::forever('tracking', $children);
        
        $response = array('success' => true, 'children' => $children);
        return response()->json($response,200);
    }

    /**
     * Update National Tracking.
     */
    public function updateTrackingnat(Request $request)
    {
        if (RequestTracking::where('id_request', $request->id_request)->exists()) {

            RequestTracking::where('id_request', $request->id_request)->update([
                $request->field => $request->value
            ]);
        }
        else {
            RequestTracking::create([
                'id_request' => $request->id_request,
                $request->field => $request->value
            ]);
        }

        $response = array('success' => true);
        return response()->json($response,200);
    }

	/**
     * Update UBI Date.
     */
    public function setUbidate(Request $request)
    {
		$id_request = intval($request->id_request);
        $id_user    = intval($request->id_user);
		$client     = getIP();
		
		$db_ubidate = explode('-', $request->newdate);
		$front_ubidate = $db_ubidate[2] . '/' .$db_ubidate[1] . '/' .$db_ubidate[0];
		
		try {    
			ShoppingRequest::find($id_request)->update([
                'document_date' => $request->newdate
            ]);
			
		} catch (Throwable $th) {			
			$response = array('success' => true, 'error' => $th);
        	return response()->json($response,200);
		}

		// Save log
		$user_rol  = User::find($id_user);		
		$log_roles = '';
        foreach ($user_rol->roles as $roles) {
			$log_roles .= ', ' . $roles->name;
		}
		$log_roles = substr($log_roles, 2);
		
		try {			
			LogRequest::create([
				'id_user' => $id_user,
				'id_request' => $id_request,
				'action' => 'ubidate',
				'created_at' => now(),
				'client' => $client,
				'rol' => $log_roles
			]);
		} catch (Throwable $th) {			
			$response = array('success' => true, 'error' => $th);
        	return response()->json($response,200);
		}

        $response = array('success' => true, 'ubidate' => $front_ubidate);
        return response()->json($response,200);
    }

    /**
     * Load Filter Form.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function loadFilterForm()
    {
        $filter = Cache::get('trackingfilter');
        
        $response = array(
            'success' => true,
            'data' => array(
                "description" => $filter['description'],
                "code" => $filter['code'],
                "state" => $filter['state'],
                "quote" => $filter['quote'],
                "created_start" => $filter['created_start'],
                "created_end" => $filter['created_end'],
                "ubi_start" => $filter['ubi_start'],
                "ubi_end" => $filter['ubi_end']
            )
        );

        
        return response()->json($response,200);
    }

    /**
     * Set Tracking Filter.
     */
    public function setFilter(Request $request)
    {
        $filter = array();
        $children = array();
        $shopp_requests = array();

        if ($request->request_type == 'trackingnatFilter') $operator = '<>'; else $operator = '=';
        
        // Query builder
        $sql = "SELECT r.id, r.created_at, r.code, r.name,	r.document, w.name AS works_name, w.abbr AS works_abbr, s.state AS state, r.parent, t.code_almest, t.code_requested, t.import_invoice, t.code_invoice, t.contract_value, t.contract_code, t.comment FROM dbo.shopping_requests AS r LEFT JOIN dbo.works AS w ON w.id = r.id_work LEFT JOIN dbo.shopping_states AS s ON s.id = r.id_shopping_state LEFT JOIN dbo.request_tracking AS t ON t.id_request = r.id WHERE r.id_shopping_type ".$operator." 3";
        
        if ($request->work != -1) {
            $sql .= " AND r.id_work = " . $request->work;
        }

        /*if ($request->dpto != -1) {
            $sql .= " AND r.id_department = " . $request->dpto;
        }

        if ($request->month != -1) {
            $sql .= " AND MONTH(r.created_at) = " . intval($request->month);
        }

        if ($request->year != -1) {
            $sql .= " AND YEAR(r.created_at) = " . intval($request->year);
        }*/

        if ($request->description != "Texto contenido en el nombre") {
            $filter['description'] = $request->description;
            $sql .= " AND LOWER(r.name) LIKE LOWER('%$request->description%') COLLATE Modern_Spanish_CI_AI";
        } else $filter['description'] = null;

        if ($request->code != 'Ej. HCA9003') {
            $filter['code'] = $request->code;
            $sql .= " AND r.code LIKE '" . $request->code . "'";
        } else $filter['code'] = null;

        if ($request->state != -1) {
            $filter['state'] = $request->state;
            $sql .= " AND r.id_shopping_state LIKE " . $request->state;
        } else $filter['state'] = -1;

        if ($request->quote != 'all') {
            $filter['quote'] = $request->quote;
            $sql .= " AND r.quote LIKE '" . $request->quote . "'";
        } else $filter['quote'] = 'all';

        if ($request->created_start != '' && $request->created_start != null) {
            $filter['created_start'] = $request->created_start;
            $sql .= " AND CAST(r.created_at AS DATE) >= " . "'". $request->created_start ."'";
        } else $filter['created_start'] = null; 

        if ($request->created_end != 'Hoy') {
            $filter['created_end'] = $request->created_end;
            $sql .= " AND CAST(r.created_at AS DATE) <= " . "'". $request->created_end ."'";
        } else $filter['created_end'] = null;

        if ($request->ubi_start != '' && $request->ubi_start != null) {
            $filter['ubi_start'] = $request->ubi_start;
            $sql .= " AND CAST(r.document_date AS DATE) >= " . "'". $request->ubi_start ."'";
        } else $filter['ubi_start'] = null;

        if ($request->ubi_end != 'Hoy') {
            $filter['ubi_end'] = $request->ubi_end;
            $sql .= " AND CAST(r.document_date AS DATE) <= " . "'". $request->ubi_end ."'";
        } else $filter['ubi_end'] = null;

        $shopp_requests = DB::select($sql);

        if ($request->work == -1) {
            
            foreach ($shopp_requests as $row) {
                            
                $id = $row->id;                
                // Total price
                $products = ShoppingRequest::find($id)->products()
                                ->select('ctdad', 'price')
                                ->get();        
                $total_price = 0;
                foreach ($products as $product) {
                    $total_price += $product->ctdad * $product->price;
                }

                // Date request
                $created_datetime  = explode(' ', $row->created_at);
                $created_date      = explode('-', $created_datetime[0]);
                $date_request      = $created_date[2] . '/' . $created_date[1] . '/' . $created_date[0];

                $rowchildrens = array();
                foreach ($shopp_requests as $findson) {
                    
                    if ($findson->parent == $id) {
                                                
                        // Total price
                        $son_products = ShoppingRequest::find($findson->id)->products()
                                        ->select('ctdad', 'price')
                                        ->get();        
                        $son_total_price = 0;
                        foreach ($son_products as $son_product) {
                            $son_total_price += $son_product->ctdad * $son_product->price;
                        }

                        // Date request
                        $son_created_datetime  = explode(' ', $findson->created_at);
                        $son_created_date      = explode('-', $son_created_datetime[0]);
                        $son_date_request      = $son_created_date[2] . '/' . $son_created_date[1] . '/' . $son_created_date[0];

                        $rowchildrens[] = array(
                            'leaf' => true,
                            'id' => $findson->id, 
                            'document_date' => $son_date_request,
                            'codedb' => $findson->code,
                            'code' => '<i class="fas fa-shopping-cart fa-sm"></i>&nbsp;' . $findson->code, 
                            'name' => $findson->name, 
                            'work_name' => $findson->works_name, 
                            'work_abbr' => $findson->works_abbr, 
                            //'dpto_name' => $findson->dpto_name,
                            //'dpto_abbr' => $findson->dpto_abbr, 
                            'state' => $findson->state,
                            'document' => $findson->document,
                            'parent' => $findson->parent,
                            'code_almest' => $findson->code_almest,
                            'code_requested' => $findson->code_requested,
                            'budget' => number_format($son_total_price, 2, '.', ','),
                            'import_invoice' => number_format($findson->import_invoice, 2, '.', ','),
                            'code_invoice' => $findson->code_invoice,
                            'contract_value' => $findson->contract_value,
                            'contract_code' => $findson->contract_code,
                            'comment' => $findson->comment
                        );
                    }
                }

				// Filter Dpto
				$delchildrequests = array();
				if ($request->dpto != -1) {
					for($i = 0; $i < count($rowchildrens); $i++) {
						if (DepartmentRequest::where('id_request', $rowchildrens[$i]['id'])->where('id_department', $request->dpto)->exists()) {
							$department = Department::find($request->dpto);
							$rowchildrens[$i]['department'] = $department->name;
							$rowchildrens[$i]['dpto_ids'] = $department->id;
						}
						else {
							array_push($delchildrequests, $i);
						}
					}
				}
				else {
					
					for($i = 0; $i < count($rowchildrens); $i++) {
						
						$row_dptos = DepartmentRequest::leftJoin('departments', 'departments.id', 'department_requests.id_department')
													->select('departments.id', 'departments.name')
													->where('id_request', $rowchildrens[$i]['id'])
													->get();
						$dptos = '';
						$dpto_ids = '';
						foreach ($row_dptos as $row_dpto) {
							$dptos .= ', ' . $row_dpto->name;
							$dpto_ids .= ', ' . $row_dpto->id;
						}

						$rowchildrens[$i]['department'] = substr($dptos, 2);
						$rowchildrens[$i]['dpto_ids'] = substr($dpto_ids, 2);
					}
				}
				
				// Delete row no filter
				for($i = 0; $i < count($delchildrequests); $i++) {
					$idx = $delchildrequests[$i];
					unset($rowchildrens[$idx]);
				}
				
				sort($rowchildrens);	
                
                if ($row->parent == null || $row->parent == '') {

                    $children[] = array(
                        'id' => $row->id, 
                        'document_date' => $date_request,
                        'codedb' => $row->code, 
                        'code' => '<i class="fas fa-shopping-cart fa-sm"></i>&nbsp;' . $row->code, 
                        'name' => $row->name, 
                        'work_name' => $row->works_name, 
                        'work_abbr' => $row->works_abbr, 
                        //'dpto_name' => $row->dpto_name,
                        //'dpto_abbr' => $row->dpto_abbr,
                        'state' => $row->state, 
                        'document' => $row->document, 
                        'parent' => $row->parent,
                        'code_almest' => $row->code_almest,
                        'code_requested' => $row->code_requested,
                        'budget' => number_format($total_price, 2, '.', ','),
                        'import_invoice' => number_format($row->import_invoice, 2, '.', ','),
                        'code_invoice' => $row->code_invoice,
                        'contract_value' => $row->contract_value,
                        'contract_code' => $row->contract_code,
                        'comment' => $row->comment,
                        "expanded" => true,
                        "children" => $rowchildrens
                    );
                }
            }
        }
        else {

            foreach ($shopp_requests as $row) {
                            
                $id = $row->id;
                // Total price
                $products = ShoppingRequest::find($id)->products()
                                ->select('ctdad', 'price')
                                ->get();        
                $total_price = 0;
                foreach ($products as $product) {
                    $total_price += $product->ctdad * $product->price;
                }

                // Date request
                $created_datetime  = explode(' ', $row->created_at);
                $created_date      = explode('-', $created_datetime[0]);
                $date_request      = $created_date[2] . '/' . $created_date[1] . '/' . $created_date[0];

                $children[] = array(
                    'leaf' => true,
                    'id' => $row->id, 
                    'document_date' => $date_request,
                    'codedb' => $row->code, 
                    'code' => '<i class="fas fa-shopping-cart fa-sm"></i>&nbsp;' . $row->code, 
                    'name' => $row->name, 
                    'work_name' => $row->works_name, 
                    'work_abbr' => $row->works_abbr, 
                    //'dpto_name' => $row->dpto_name,
                    //'dpto_abbr' => $row->dpto_abbr,
                    'state' => $row->state, 
                    'document' => $row->document, 
                    'parent' => $row->parent,
                    'code_almest' => $row->code_almest,
                    'code_requested' => $row->code_requested,
                    'budget' => number_format($total_price, 2, '.', ','),
                    'import_invoice' => number_format($row->import_invoice, 2, '.', ','),
                    'code_invoice' => $row->code_invoice,
                    'contract_value' => $row->contract_value,
                    'contract_code' => $row->contract_code,
                    'comment' => $row->comment,
                );
            }
        }

		// Filter Dpto
		$delrequests = array();
		if ($request->dpto != -1) {
            for($i = 0; $i < count($children); $i++) {
				if (DepartmentRequest::where('id_request', $children[$i]['id'])->where('id_department', $request->dpto)->exists()) {
					$department = Department::find($request->dpto);
					$children[$i]['department'] = $department->name;
					$children[$i]['dpto_ids'] = $department->id;
				}
				else {
					array_push($delrequests, $i);
				}
			}
        }
		else {
			
			for($i = 0; $i < count($children); $i++) {
				
				$row_dptos = DepartmentRequest::leftJoin('departments', 'departments.id', 'department_requests.id_department')
											->select('departments.id', 'departments.name')
											->where('id_request', $children[$i]['id'])
											->get();
				$dptos = '';
				$dpto_ids = '';
				foreach ($row_dptos as $row_dpto) {
					$dptos .= ', ' . $row_dpto->name;
					$dpto_ids .= ', ' . $row_dpto->id;
				}

				$children[$i]['department'] = substr($dptos, 2);
				$children[$i]['dpto_ids'] = substr($dpto_ids, 2);
			}
		}
		
		// Delete row no filter
		for($i = 0; $i < count($delrequests); $i++) {
			$idx = $delrequests[$i];
			unset($children[$idx]);
		}
		
		sort($children);
        
        Cache::forever('tracking', $children);
        Cache::forever('trackingfilter', $filter);
        
        $response = array('success' => true , 'children' => $children);
        return response()->json($response,200);
    }

    /**
     * Export.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function export($class, $filename, $type)
    {
        if (! in_array($type, ['xlsx', 'csv', 'ods'])) {
            $type = 'xlsx';
        }

        $fn = $filename.' - '.date('Y-m-d');
        
        return Excel::download(new $class, $fn.'.'.$type);
    }

    /**
     * Tracking Export Excel.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function exportExcel(Request $request)
    {
        return $this->export('App\Exports\TrackingExport', $request->title, 'xlsx');
    }

    /**
     * Tracking Export PDF.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function exportPDF(Request $request)
    {
        $title    = $request->title;
        $comment  = $request->comment;
        $tracking = Cache::get('tracking');

        $pdf = PDF::loadView('pdf.TrackingReport', compact('title', 'comment', 'tracking'))->setPaper('letter', 'landscape');
        return $pdf->download($title .'.pdf');
    }

	/**
     * Set Shopping State.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function setShoppingState(Request $request)
    {
        ShoppingRequest::where('id', $request->id)
						->orWhere('parent', $request->id)
						->update([
			'id_shopping_state' => $request->state
		]);

		$response = array('success' => true);
		return response()->json($response,200);
    }
}

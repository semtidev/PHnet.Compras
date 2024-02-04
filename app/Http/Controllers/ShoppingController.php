<?php

namespace App\Http\Controllers;

use Throwable;
use DateTime;
use App\User;
use App\RoleUser;
use App\Work;
use App\Company;
use App\Department;
use App\CommentRequest;
use App\DepartmentRequest;
use App\ProductGallery;
use App\ShoppingRequest;
use App\ShoppingRequestProduct;
use App\ShoppingState;
use App\GoodsWarehouse;
use App\Companytype;
use App\LogRequest;
use App\Mail\ShoppingRequestNotify;
use App\UserWork;
use Illuminate\Support\Facades\Mail;
use Barryvdh\DomPDF\Facade as PDF;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Request;

class ShoppingController extends Controller
{
    
	/**
     * Get Works.
     */
    public function getWorks()
    {
        $works = array();
        
        $qry = Work::where('shoppingrequest', 1)->where('active', 1)->orderBy('name', 'ASC')->get();

        foreach ($qry as $row) {
            $works[] = $row;
        }

        $works[] = array(
            'id' => -1, 
            'name' => 'Todos los Proyectos', 
            'abbr' => 'Todos',
            'metrology' => null,
            'planning' => null,
            'intcustomerpoll' => null,
            'extcustomerpoll' => null,
            'shopping' => null
        );

        $response = array('success' => true, 'works' => $works);
        return response()->json($response,200);
    }

    /**
     * Get Works Form.
     */
    public function getWorksForm($user)
    {
        $works = array();
        
        $qry = Work::where('shoppingrequest', 1)->where('active', 1)->orderBy('name', 'ASC')->get();

        foreach ($qry as $row) {
            if (UserWork::where('user_id', intval($user))->where('work_id', $row->id)->exists()) {
				$works[] = $row;
			}
        }

        $response = array('success' => true, 'works' => $works);
        return response()->json($response,200);
    }
    
    /**
     * Get Departments.
     */
    public function getDepartments()
    {
        $departments = array();
    
        $qry = Department::where('buys', 1)->orderBy('order', 'ASC')->get();

        foreach ($qry as $row) {
            $departments[] = $row;
        }

        $departments[] = array(
            'id' => -1, 
            'name' => 'Todos los Dptos', 
            'abbr' => 'Todos',
            'manager' => null,
            'email' => null,
            'telephone' => null,
            'quality' => null,
            'shopping' => null
        );

        $response = array('success' => true, 'departments' => $departments);
        return response()->json($response,200);
    }

    /**
     * Get Departments.
     */
    public function getDepartmentsForm($user, $all = 0)
    {
        $departments = array();
    
        $qry = Department::orderBy('order', 'ASC')->get();

        foreach ($qry as $row) {
            if ($all == 0) {
				if (User::where('id', intval($user))->where('department', $row->id)->orWhere('department', 5)->exists()) {
					$departments[] = $row;
				}
			}
			else {
				$departments[] = $row;
			}
        }

        $response = array('success' => true, 'departments' => $departments);
        return response()->json($response,200);
    }

    /**
     * Get Goods Warehouse.
     */
    public function getGoodsWarehouse()
    {
        $warehouse = array();
    
        $warehouse = GoodsWarehouse::all();

        $response = array('success' => true, 'warehouse' => $warehouse);
        return response()->json($response,200);
    }

    /**
     * Get Requests.
     */
    public function getShoppingRequest($user = 0, $work = -1, $dpto = -1, $filter = 0, $search = '-1', $circuit = 'all', $active = 1)
    {
        $sql = array();
        $conditions = '';
        $shopp_requests = array();

		if ($filter == 0) {                
			Cache::forget('shopp_requests');
		}
		else {
			$shopp_requests = Cache::get('shopp_requests');
			$response = array('success' => true, 'shopp_requests' => $shopp_requests);
			return response()->json($response,200);
		}
    
        $sql = "SELECT r.id, r.created_at, r.code, r.name, r.document, r.circuit, w.id AS works_id, w.name AS works_name, w.abbr AS works_abbr, s.state AS state, r.parent, t.code_almest, t.code_requested, t.import_invoice, t.code_invoice, t.contract_value, t.contract_code, t.comment, l.id_user AS created_by, r.esp_confirm, r.dpto_confirm, r.comp_comfirm, r.dir_confirm, r.gendir_aprove, r.gendir_reject FROM dbo.shopping_requests AS r LEFT JOIN dbo.works AS w ON w.id = r.id_work LEFT JOIN dbo.shopping_states AS s ON s.id = r.id_shopping_state LEFT JOIN dbo.request_tracking AS t ON t.id_request = r.id LEFT JOIN dbo.log_request AS l ON l.id_request = r.id WHERE (r.esp_confirm = 1 OR (l.id_user = ". $user ." AND l.action = 'created')) AND (r.id_shopping_state = 1 OR w.name = 'Compras Agrupadas' OR r.parent > 0) AND l.action = 'created' AND r.active = " . $active;

        if ($work != -1) {
            $conditions .= " AND r.id_work = " . $work; 
        }

		if ($search != '-1') {
            $conditions .= " AND ((LOWER(r.code) LIKE LOWER('%$search%') COLLATE Modern_Spanish_CI_AI) OR (LOWER(r.name) LIKE LOWER('%$search%') COLLATE Modern_Spanish_CI_AI))";
        }

		if ($circuit != 'all' ) {
			$conditions .= " AND r.circuit = '" . $circuit . "'";
        }

        $qry_request = DB::select($sql . $conditions);
        
        if ($work == -1) {
            
            foreach ($qry_request as $row) {
                            
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
                $created_datetime = explode(' ', $row->created_at);
                $created_date     = explode('-', $created_datetime[0]);
                $date_request     = $created_date[2] . '/' . $created_date[1] . '/' . $created_date[0];
				
				$rowchildrens = array();
                foreach ($qry_request as $findson) {
                    
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

						$approved = 'CA';

						// User created
						$created = 0;
						if ($user > 0) {
							$logs = LogRequest::where('id_request', intval($findson->id))
										->where('id_user', intval($user))
										->get();
							foreach ($logs as $log) {
								if ($log->action == 'created') {
									$created = 1;
								}
							}
						}

                        $shopp_requests[] = array(
                            'id' => $findson->id, 
                            'document_date' => $son_date_request,
                            'codedb' => $findson->code,
                            'code' => $findson->code,
							'created_by' => $findson->created_by,
                            'name' => $findson->name,
							'work_id' => $findson->works_id, 
                            'work_name' => $findson->works_name, 
                            'work_abbr' => $findson->works_abbr, 
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
                            'children' => 0,
							'approved' => $approved,
							'totalcomments' => intval($comments),
							'created' => $created,
							'esp_confirm' => $findson->esp_confirm,
							'dpto_confirm'=> $findson->dpto_confirm,
							'comp_comfirm' => $findson->comp_comfirm,
							'dir_confirm' => $findson->dir_confirm,
							'gendir_aprove' => $findson->gendir_aprove,
							'gendir_reject' => $findson->gendir_reject
                        );
                    }
                }
                
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

					// User created
					$created = 0;
					if ($user > 0) {
						$logs = LogRequest::where('id_request', intval($row->id))
									->where('id_user', intval($user))
									->get();
						foreach ($logs as $log) {
							if ($log->action == 'created') {
								$created = 1;
							}
						}
					}

					$shopp_requests[] = array(
                        'id' => $row->id, 
                        'document_date' => $date_request,
                        'codedb' => $row->code, 
                        'code' => $row->code,
						'created_by' => $row->created_by,
                        'name' => $row->name,
						'work_id' => $row->works_id,
                        'work_name' => $row->works_name, 
                        'work_abbr' => $row->works_abbr, 
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
                        'children' => 1,
						'approved' => $approved,
						'totalcomments' => intval($comments),
						'created' => $created,
						'esp_confirm' => $row->esp_confirm,
						'dpto_confirm'=> $row->dpto_confirm,
						'comp_comfirm' => $row->comp_comfirm,
						'dir_confirm' => $row->dir_confirm,
						'gendir_aprove' => $row->gendir_aprove,
						'gendir_reject' => $row->gendir_reject
                    );
                }
            }
        }
        else {
            
            foreach ($qry_request as $row) {
                            
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

				/*if ($row->parent != null && $row->parent != '') {
					$approved = 'CA';
				}*/

				// User created
				$created = 0;
				if ($user > 0) {
					$logs = LogRequest::where('id_request', intval($row->id))
								->where('id_user', intval($user))
								->get();
					foreach ($logs as $log) {
						if ($log->action == 'created') {
							$created = 1;
						}
					}
				}

                $shopp_requests[] = array(
                    'id' => $row->id, 
                    'document_date' => $date_request,
                    'codedb' => $row->code, 
                    'code' => $row->code,
					'created_by' => $row->created_by,
                    'name' => $row->name,
					'work_id' => $row->works_id, 
                    'work_name' => $row->works_name, 
                    'work_abbr' => $row->works_abbr, 
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
                    'children' => 0,
					'approved' => $approved,
					'totalcomments' => intval($comments),
					'created' => $created,
					'esp_confirm' => $row->esp_confirm,
					'dpto_confirm'=> $row->dpto_confirm,
					'comp_comfirm' => $row->comp_comfirm,
					'dir_confirm' => $row->dir_confirm,
					'gendir_aprove' => $row->gendir_aprove,
					'gendir_reject' => $row->gendir_reject
                );
            }
        }

		// Filter Dpto
		$delrequests = array();
		if ($dpto != -1) {
            for($i = 0; $i < count($shopp_requests); $i++) {
				if (DepartmentRequest::where('id_request', $shopp_requests[$i]['id'])->where('id_department', $dpto)->exists()) {
					$department = Department::find($dpto);
					$shopp_requests[$i]['department'] = $department->name;
					$shopp_requests[$i]['dpto_ids'] = $department->id;
				}
				else {
					array_push($delrequests, $i);
				}
			}
        }
		else {
			
			for($i = 0; $i < count($shopp_requests); $i++) {
				
				$row_dptos = DepartmentRequest::leftJoin('departments', 'departments.id', 'department_requests.id_department')
											->select('departments.id', 'departments.name')
											->where('id_request', $shopp_requests[$i]['id'])
											->get();
				$dptos = '';
				$dpto_ids = '';
				foreach ($row_dptos as $row_dpto) {
					$dptos .= ', ' . $row_dpto->name;
					$dpto_ids .= ', ' . $row_dpto->id;
				}

				$shopp_requests[$i]['department'] = substr($dptos, 2);
				$shopp_requests[$i]['dpto_ids'] = substr($dpto_ids, 2);
			}
		}
		
		// Delete row no filter
		for($i = 0; $i < count($delrequests); $i++) {
			$idx = $delrequests[$i];
			unset($shopp_requests[$idx]);
		}
		
		sort($shopp_requests);
        
        $response = array('success' => true, 'shopp_requests' => $shopp_requests);
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
        $filter = Cache::get('requestfilter');
        
        $response = array(
            'success' => true,
            'data' => array(
                "description" => $filter['description'],
                "code" => $filter['code'],
                "state" => (int) $filter['state'],
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
     * Set Shopping Filter.
     */
    public function setFilter(Request $request)
    {
        $filter         = array();
		$sql            = array();
        $shopp_requests = array();
		$conditions     = '';
        
        // Query builder
        $sql = "SELECT r.id, r.created_at, r.code, r.name,	r.document, w.id AS works_id, w.name AS works_name, w.abbr AS works_abbr, s.state AS state, r.parent, t.code_almest, t.code_requested, t.import_invoice, t.code_invoice, t.contract_value, t.contract_code, t.comment, l.id_user AS created_by, r.esp_confirm, r.dpto_confirm, r.comp_comfirm, r.dir_confirm, r.gendir_aprove, r.gendir_reject FROM dbo.shopping_requests AS r LEFT JOIN dbo.works AS w ON w.id = r.id_work LEFT JOIN dbo.shopping_states AS s ON s.id = r.id_shopping_state LEFT JOIN dbo.request_tracking AS t ON t.id_request = r.id LEFT JOIN dbo.log_request AS l ON l.id_request = r.id WHERE (r.esp_confirm = 1 OR (l.id_user = ". $request->user ." AND l.action = 'created')) AND r.id_shopping_state = 1 AND l.action = 'created'";
        
        if ($request->work != -1) {
            $conditions .= " AND r.id_work = " . $request->work;
        }

        /*if ($request->dpto != -1) {
            $conditions .= " AND r.id_department = " . $request->dpto;
        }*/

        if ($request->description != "Texto contenido en el nombre") {
            $filter['description'] = $request->description;
            $conditions .= " AND LOWER(r.name) LIKE LOWER('%$request->description%') COLLATE Modern_Spanish_CI_AI";
        } else $filter['description'] = null;

        if ($request->code != 'Ej. HCA9003') {
            $filter['code'] = $request->code;
            $conditions .= " AND r.code LIKE '" . $request->code . "'";
        } else $filter['code'] = null;

        if ($request->state != -1 && $request->state != '') {
            $filter['state'] = $request->state;
            $conditions .= " AND r.id_shopping_state LIKE " . $request->state;
        } else $filter['state'] = -1;

        if ($request->quote != 'all') {
            $filter['quote'] = $request->quote;
            $conditions .= " AND r.quote LIKE '" . $request->quote . "'";
        } else $filter['quote'] = 'all';

        if ($request->created_start != '' && $request->created_start != null) {
            $filter['created_start'] = $request->created_start;
            $conditions .= " AND CAST(r.created_at AS DATE) >= " . "'". $request->created_start ."'";
        } else $filter['created_start'] = null; 

        if ($request->created_end != 'Hoy') {
            $filter['created_end'] = $request->created_end;
            $conditions .= " AND CAST(r.created_at AS DATE) <= " . "'". $request->created_end ."'";
        } else $filter['created_end'] = null;

        if ($request->ubi_start != '' && $request->ubi_start != null) {
            $filter['ubi_start'] = $request->ubi_start;
            $conditions .= " AND CAST(r.document_date AS DATE) >= " . "'". $request->ubi_start ."'";
        } else $filter['ubi_start'] = null;

        if ($request->ubi_end != 'Hoy') {
            $filter['ubi_end'] = $request->ubi_end;
            $conditions .= " AND CAST(r.document_date AS DATE) <= " . "'". $request->ubi_end ."'";
        } else $filter['ubi_end'] = null;

		$qry_request = DB::select($sql . $conditions);

        if ($request->work == -1) {
            
            foreach ($qry_request as $row) {
                            
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
                foreach ($qry_request as $findson) {
                    
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

						$approved = 'CA';

                        $shopp_requests[] = array(
                            'id' => $findson->id, 
                            'document_date' => $son_date_request,
                            'codedb' => $findson->code,
                            'code' => $findson->code,
							'created_by' => $findson->created_by,
                            'name' => $findson->name,
							'work_id' => $findson->works_id, 
                            'work_name' => $findson->works_name, 
                            'work_abbr' => $findson->works_abbr, 
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
                            'children' => 0,
							'approved' => $approved,
							'esp_confirm' => $findson->esp_confirm,
							'dpto_confirm'=> $findson->dpto_confirm,
							'comp_comfirm' => $findson->comp_comfirm,
							'dir_confirm' => $findson->dir_confirm,
							'gendir_aprove' => $findson->gendir_aprove,
							'gendir_reject' => $findson->gendir_reject
                        );
                    }
                }
                
                if ($row->parent == null || $row->parent == '') {

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

					$shopp_requests[] = array(
                        'id' => $row->id, 
                        'document_date' => $date_request,
                        'codedb' => $row->code, 
                        'code' => $row->code,
						'created_by' => $row->created_by,
                        'name' => $row->name,
						'work_id' => $row->works_id, 
                        'work_name' => $row->works_name, 
                        'work_abbr' => $row->works_abbr, 
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
                        'children' => 1,
						'approved' => $approved,
						'esp_confirm' => $row->esp_confirm,
						'dpto_confirm'=> $row->dpto_confirm,
						'comp_comfirm' => $row->comp_comfirm,
						'dir_confirm' => $row->dir_confirm,
						'gendir_aprove' => $row->gendir_aprove,
						'gendir_reject' => $row->gendir_reject
                    );
                }
            }
        }
        else {
            
            foreach ($qry_request as $row) {
                            
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

				if ($row->parent != null && $row->parent != '') {
					$approved = 'CA';
				}

                $shopp_requests[] = array(
                    'id' => $row->id, 
                    'document_date' => $date_request,
                    'codedb' => $row->code, 
                    'code' => $row->code,
					'created_by' => $row->created_by,
                    'name' => $row->name,
					'work_id' => $row->works_id, 
                    'work_name' => $row->works_name, 
                    'work_abbr' => $row->works_abbr, 
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
                    'children' => 0,
					'approved' => $approved,
					'esp_confirm' => $row->esp_confirm,
					'dpto_confirm'=> $row->dpto_confirm,
					'comp_comfirm' => $row->comp_comfirm,
					'dir_confirm' => $row->dir_confirm,
					'gendir_aprove' => $row->gendir_aprove,
					'gendir_reject' => $row->gendir_reject
                );
            }
        }

        
        Cache::forever('shopp_requests', $shopp_requests);
        Cache::forever('requestfilter', $filter);
        
        $response = array('success' => true , 'shopp_requests' => $shopp_requests);
        return response()->json($response,200);
    }

    /**
     * Get Request Products.
     */
    public function getShoppingRequestProducts($id)
    {
        $products = array();
        
        $products = ShoppingRequest::find($id)->products()
                        ->select('id', 'id_request', 'code', 'description', 'ctdad', 'price', 'um', 'characteristic', 'photo')
                        ->get();
        
        $total_price = 0;
        foreach ($products as $product) {
            $total_price += $product->ctdad * $product->price;
            $product['total_price'] = $total_price;
        }

        $products[] = array(
            'id' => 0,
            'id_request' => '',
            'code' => '',
            'description' => '',
            'ctdad' => 0,
            'price' => '0.00',
            'um' => '',
            'characteristic' => '',
            'photo' => null,
            'total_price' => number_format($total_price, 2, '.', ',')
        );

        $response = array('success' => true, 'products' => $products);
        return response()->json($response,200);
    }

	/**
     * Get Request State for Rol.
     */
    public function rolState(Request $request)
    {
        $id_request = $request->id_request;
        $id_user    = $request->id_user;
		$created    = 0;
		$confirmed  = 0;
		$approved   = 0;
		$rejected   = 0;
        
		$logs = LogRequest::where('id_request', intval($id_request))
							->where('id_user', intval($id_user))
							->get();

		foreach ($logs as $log) {
			if ($log->action == 'created')   $created   = 1;
			if ($log->action == 'confirmed') $confirmed = 1;
			if ($log->action == 'approved')  $approved  = 1;
			if ($log->action == 'rejected')  $rejected  = 1;
		}

        $response = array('success' => true, 'created' => $created, 'confirmed' => $confirmed, 'approved' => $approved, 'rejected' => $rejected);
        return response()->json($response,200);
    }

	/**
     * Confirm Request by User.
     */
    public function rolConfirm(Request $request)
    {
        $id_request   = intval($request->id_request);
        $id_user      = intval($request->id_user);
		$client       = getIP();

		$qry_request  = ShoppingRequest::find($id_request);
		$esp_confirm  = $qry_request->esp_confirm;
		$dpto_confirm = $qry_request->dpto_confirm;
		$comp_comfirm = $qry_request->comp_comfirm;
		$dir_confirm  = $qry_request->dir_confirm;
		
		$user_rol = User::find($id_user);
		$log_roles  = '';
        foreach ($user_rol->roles as $roles) {
			$log_roles .= ', ' . $roles->name;
			switch ($roles->name) {
				case 'Especialista de Obra':
					$esp_confirm = 1;
					break;
				case 'Jefe de Departamento':
					$dpto_confirm = 1;
					break;
				case 'Jefe de Compras':
					$comp_comfirm = 1;
					break;
				case 'Directivo CH':
					$dir_confirm = 1;
					break;
				case 'Directivo TDC':
					$dir_confirm = 1;
					break;
			}
		}		
		$log_roles = substr($log_roles, 2);
		
		try {			
			// Update Request
			ShoppingRequest::find($id_request)->update([
				'esp_confirm' => $esp_confirm,
				'dpto_confirm' => $dpto_confirm,
				'comp_comfirm' => $comp_comfirm,
				'dir_confirm' => $dir_confirm
			]);
			// Create Log
			LogRequest::create([
				'id_user' => $id_user,
				'id_request' => $id_request,
				'action' => 'confirmed',
				'created_at' => now(),
				'client' => $client,
				'rol' => $log_roles
			]);
		} catch (Throwable $th) {			
			$response = array('success' => true, 'error' => $th);
        	return response()->json($response,200);
		}

        $response = array('success' => true);
        return response()->json($response,200);
    }

	/**
     * Approve Request by User.
     */
    public function rolApprove(Request $request)
    {
        $id_request = intval($request->id_request);
        $id_user    = intval($request->id_user);
		$client     = getIP();

		$user_rol   = User::find($id_user);		
		$log_roles  = '';
        foreach ($user_rol->roles as $roles) {
			$log_roles .= ', ' . $roles->name;
		}
		$log_roles = substr($log_roles, 2);
        
		try {			
			// Update Request
			ShoppingRequest::where('id', $id_request)
				->orWhere('parent', $id_request)
				->update([
					'circuit' => 'approved',
					'gendir_aprove' => 1
			]);
			// Create Log
			LogRequest::create([
				'id_user' => $id_user,
				'id_request' => $id_request,
				'action' => 'approved',
				'created_at' => now(),
				'client' => $client,
				'rol' => $log_roles
			]);
		} catch (Throwable $th) {			
			$response = array('success' => true, 'error' => $th);
        	return response()->json($response,200);
		}

        $response = array('success' => true, 'approvedate' => date('Y-m-d'));
        return response()->json($response,200);
    }

	/**
     * Reject Request by User.
     */
    public function rolReject(Request $request)
    {
        $id_request = intval($request->request_reject_id);
        $id_user    = intval($request->request_reject_user);
		$comment    = $request->comment;
		$client     = getIP();

		$user_rol   = User::find($id_user);		
		$log_roles  = '';
        foreach ($user_rol->roles as $roles) {
			$log_roles .= ', ' . $roles->name;
		}
		$log_roles = substr($log_roles, 2);
        
		try {			
			// Update Request
			ShoppingRequest::where('id', $id_request)
							->orWhere('parent', $id_request)
							->update([
								'circuit' => 'rejected',
								'gendir_reject' => 1
							]);
			// Create Log
			LogRequest::create([
				'id_user' => $id_user,
				'id_request' => $id_request,
				'action' => 'rejected',
				'created_at' => now(),
				'client' => $client,
				'comment' => $comment,
				'rol' => $log_roles
			]);
		} catch (Throwable $th) {			
			$response = array('success' => true, 'error' => $th);
        	return response()->json($response,200);
		}

        $response = array('success' => true);
        return response()->json($response,200);
    }

	/**
     * Request Comment.
     */
    public function requestComment(Request $request)
    {
        $id_request = intval($request->request_comment_id);
        $id_user    = intval($request->request_comment_user);
		$comment    = $request->comment;
		$client     = getIP();

		$user_rol   = User::find($id_user);		
		$log_roles  = '';
        foreach ($user_rol->roles as $roles) {
			$log_roles .= ', ' . $roles->name;
		}
		$log_roles = substr($log_roles, 2);
        
		try {		
			CommentRequest::create([
				'id_user' => $id_user,
				'id_request' => $id_request,
				'comment' => $comment
			]);
			
			LogRequest::create([
				'id_user' => $id_user,
				'id_request' => $id_request,
				'action' => 'comment',
				'created_at' => now(),
				'client' => $client,
				'comment' => $comment,
				'rol' => $log_roles
			]);
		} catch (Throwable $th) {			
			$response = array('success' => true, 'error' => $th);
        	return response()->json($response,200);
		}

        $response = array('success' => true);
        return response()->json($response,200);
    }

	/**
     * Request Cancel.
     */
    public function requestCancel(Request $request)
    {
        $id_request = intval($request->request_cancel_id);
        $id_user    = intval($request->request_cancel_user);
		$comment    = $request->comment;
		$client     = getIP();

		$user_rol   = User::find($id_user);
		$log_roles  = '';
        foreach ($user_rol->roles as $roles) {
			$log_roles .= ', ' . $roles->name;
		}
		$log_roles = substr($log_roles, 2);

		try {
			ShoppingRequest::find($id_request)->update([
				'active' => 0
			]);
			
			LogRequest::create([
				'id_user' => $id_user,
				'id_request' => $id_request,
				'action' => 'cancelled',
				'created_at' => now(),
				'client' => $client,
				'comment' => $comment,
				'rol' => $log_roles
			]);
		} catch (Throwable $th) {			
			$response = array('success' => true, 'error' => $th);
        	return response()->json($response,200);
		}

        $response = array('success' => true);
        return response()->json($response,200);
    }

	/**
     * Request Active.
     */
    public function requestActive(Request $request)
    {
        $id_request = intval($request->id_request);
        $id_user    = intval($request->id_user);
		$client     = getIP();

		$user_rol   = User::find($id_user);
		$log_roles  = '';
        foreach ($user_rol->roles as $roles) {
			$log_roles .= ', ' . $roles->name;
		}
		$log_roles = substr($log_roles, 2);

		try {
			ShoppingRequest::find($id_request)->update([
				'active' => 1
			]);
			
			LogRequest::create([
				'id_user' => $id_user,
				'id_request' => $id_request,
				'action' => 'active',
				'created_at' => now(),
				'client' => $client,
				'rol' => $log_roles
			]);
		} catch (Throwable $th) {			
			$response = array('success' => true, 'error' => $th);
        	return response()->json($response,200);
		}

        $response = array('success' => true);
        return response()->json($response,200);
    }

	/**
     * Request Get Comments.
     */
    public function requestGetComments($id)
    {
		$comments = array();
        
        $qry = CommentRequest::where('id_request', $id)->orderBy('created_at', 'DESC')->get();

        foreach ($qry as $row) {
            
			$user  = User::find($row->id_user);
			$photo = $user->photo;
			$name  = $user->name;
			$created_at = explode(' ', $row->created_at);
			$created_date = explode('-', $created_at[0]);

			$comments[] = array(
				'id' => $row->id,
				'id_user' => $row->id_user,
				'id_request' => $row->id_request,
				'photo' => $photo . '.jpg',
				'user_name' => $name,
				'comment' => $row->comment,
				'created_at' => $created_date[2] . '/' . $created_date[1] . '/' . $created_date[0]
			);
        }

        $response = array('success' => true, 'comments' => $comments);
        return response()->json($response,200);
	}

	/**
     * Delete Request Comment.
     */
    public function deleteComment(Request $request)
    {
		$comment = CommentRequest::find(intval($request->id));
		$id_user = $comment->id_user;
		$id_req  = $comment->id_request;
		$text    = $comment->comment;
		$client = getIP();
		
		try {
			CommentRequest::find($request->id)->delete();
			// Store Log Request
			$user_rol   = User::find($id_user);		
			$log_roles  = '';
			foreach ($user_rol->roles as $roles) {
				$log_roles .= ', ' . $roles->name;
			}
			$log_roles = substr($log_roles, 2);

			LogRequest::create([
							'id_user' => $id_user,
							'id_request' => $id_req,
							'action' => 'comment-deleted',
							'created_at' => now(),
							'client' => $client,
							'comment' => $text,
							'rol' => $log_roles
						]);
		} catch (Throwable $th) {
			$response = array('success' => true, 'error' => $th);
        	return response()->json($response,200);
		}	

        $response = array('success' => true);
        return response()->json($response,200);
	}

    /**
     * Create Shopping Request.
     */
    public function createRequest(Request $request)
    {
        $fields = $request->all();
		$quote = 'project';
		for ($i = 0; $i < count($fields['department']); $i++) {
			$dpto = Department::find(intval($fields['department'][$i]))->abbr;
			if ($dpto == 'GTIA') $quote = 'warranty';
		}
        
        // Let Code        
        $abbrwork = Work::select('abbr')->where('id', $fields['project'])->first()->abbr;
        $prefix   = '';
        
        if ($quote == 'warranty') {
            $prefix = 6;
        }
        else {
            if ($fields['typeshop'] == 'local') {
                $prefix = 4;
            }
            else {
                $prefix = 9;
            }
        }
        
        if (ShoppingRequest::select('code')->where('code', 'like', $abbrwork.$prefix.'%')->exists()) {
            
            $lastcode     = ShoppingRequest::select('code')->where('code', 'like', $abbrwork.$prefix.'%')->orderBy('code', 'DESC')->first()->code;
            $arr_lastcode = explode($abbrwork, $lastcode);
            $next_number  = $arr_lastcode[1] + 1;
            $newcode      = $abbrwork . $next_number;
        }
        else {            
            $newcode = $abbrwork . $prefix . '000'; 
        }

        // Shopping Type
        if ($fields['typeshop'] == 'import') {
            $id_type = 3;
            $approval_number = 'A37-002.21-1.1';
        }
        elseif ($request->typeshop == 'national') {
            $id_type = 2;
            $approval_number = null;
        }
        else {
            $id_type = 1;
            $approval_number = null;
        }
        
        // Store Request
        $shopprequest = ShoppingRequest::create([
                            'id_work' => $fields['project'],
                            'id_shopping_type' => $id_type,
                            'id_shopping_state' => 1,
                            'code' => $newcode,
                            'name' => $fields['name'],
                            'approval_number' => $approval_number,
                            'management_code' => $fields['management_code'],
                            'comment' => $fields['comment'],
                            'quote' => $quote,
                            'parent' =>$fields['id_parent']
                        ]);

        // Store Departments
		for ($i = 0; $i < count($fields['department']); $i++) {
			DepartmentRequest::create([
				'id_department' => $fields['department'][$i],
				'id_request' => $shopprequest->id
			]);
		}
		
		// Get parent products
        if ($fields['id_parent'] != null && $fields['id_parent'] != '') {
            
            $products = ShoppingRequestProduct::where('id_request', intval($fields['id_parent']))->get();
            foreach ($products as $product) {
                $newproduct = ShoppingRequestProduct::create([
                                'id_request' => $shopprequest->id,
                                'id_contract' => $product->id_contract,
                                'code' => $product->code,
                                'description' => $product->description,
                                'ctdad' => $product->ctdad,
                                'price' => $product->price,
                                'um' => $product->um,
                                'characteristic' => $product->characteristic,
                                'photo' => $product->photo
                            ]);
            }
        }

		// Store Log Request
		$id_user = $fields['updated_by'];
		$client = getIP();

		$user_rol   = User::find($id_user);		
		$log_roles  = '';
        foreach ($user_rol->roles as $roles) {
			$log_roles .= ', ' . $roles->name;
		}
		$log_roles = substr($log_roles, 2);

		LogRequest::create([
						'id_user' => $id_user,
						'id_request' => $shopprequest->id,
						'action' => 'created',
						'created_at' => now(),
						'client' => $client,
						'rol' => $log_roles
					]);

        /*$receivers = 'semti@nauta.cu';
        $shopprequest = $newcode;
        Mail::to($receivers)->send(new ShoppingRequestNotify($shopprequest));*/

        $response = array('success' => true, 'shopprequest' => $shopprequest);
        return response()->json($response,200);
    }

    /**
     * Upload Request PDF.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function uploadRequestPdf(Request $request)
    {
        $name = $request->file('document')->getClientOriginalName();
        $ext  = $request->file('document')->extension();
        $newname = $request->code_request . '.' . $ext;
        
        $path = $request->file('document')->storeAs(
                    'public/documents', $newname
                );

        // Update Request DB
        $shopprequest = ShoppingRequest::find($request->id_request)->update([
            'document' => $newname
        ]);

        $response = array('success' => true);        
        return response()->json($response,200);
    }

    /**
     * Load Request Form.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function loadRequestForm(Request $request)
    {
        $requestload = ShoppingRequest::select('id', 'id_work', 'id_shopping_type', 'name', 'management_code', 'comment', 'quote', 'parent')
						->where('id', $request->id_request)
						->first();
		$departments = DepartmentRequest::select('id_department')
						->where('id_request', $request->id_request)
						->get();
		$dptos = array();
		foreach ($departments as $dpto) {
			$dptos[] = intval($dpto->id_department);
		}
		
		switch ($requestload->id_shopping_type) {
            case 1:
                $type = 'local';
                break;
            case 2:
                $type = 'national';
                break;
            default:
                $type = 'import';
                break;
        }

        if ($request->action == 'addSub711') {
            $response = array(
                'success' => true,
                'data' => array(
                    "id_parent" => $requestload->id,
                    "name" => $requestload->name,
                    "department[]" => $dptos,
                    "management_code" => $requestload->management_code,
                    "quote" => $requestload->quote,
                    "typeshop" => $type
                )
            );
        }
        else {
            $response = array(
                'success' => true,
                'data' => array(
                    "id_request" => $requestload->id,
                    "name" => $requestload->name,
                    "project" => intval($requestload->id_work),
                    "department[]" => $dptos,
                    "management_code" => $requestload->management_code,
                    "quote" => $requestload->quote,
                    "typeshop" => $type,
                    "comment" => $requestload->comment,
                    "id_parent" => $requestload->parent,
                )
            );
        }

        
        return response()->json($response,200);
    }

    /**
     * Update Shopping Request.
     */
    public function updateRequest(Request $request)
    {
        $fields = $request->all();
		$requestable = ShoppingRequest::find($fields['id_request']);

		$quote = 'project';
		for ($i = 0; $i < count($fields['department']); $i++) {
			$dpto = Department::find(intval($fields['department'][$i]))->abbr;
			if ($dpto == 'GTIA') $quote = 'warranty';
		}
        
        // Shopping Type
        switch ($fields['typeshop']) {
            case 'local':
                $id_type = 1;
                break;
            case 'national':
                $id_type = 2;
                break;
            default:
                $id_type = 3;
                break;
        }
        
        // Let Code        
        if ($fields['project'] != $requestable->id_work || $quote != $requestable->quote || $id_type != $requestable->id_shopping_type) {

            ShoppingRequest::find($fields['id_request'])->update([
                'code' => ''
            ]);

            $abbrwork = Work::select('abbr')->where('id', $fields['project'])->first()->abbr;
            $prefix   = '';
            
            if ($fields['quote'] == 'warranty') {
                $prefix = 6;
            }
            else {
                if ($fields['typeshop'] == 'local') {
                    $prefix = 4;
                }
                else {
                    $prefix = 9;
                }
            }
            
            if (ShoppingRequest::select('code')->where('code', 'like', $abbrwork.$prefix.'%')->exists()) {
                
                $lastcode     = ShoppingRequest::select('code')->where('code', 'like', $abbrwork.$prefix.'%')->orderBy('code', 'DESC')->first()->code;
                $arr_lastcode = explode($abbrwork, $lastcode);
                $next_number  = $arr_lastcode[1] + 1;
                $newcode      = $abbrwork . $next_number;
            }
            else {            
                $newcode = $abbrwork . $prefix . '000'; 
            }

            // Update Request
            $shopprequest = ShoppingRequest::find($fields['id_request'])->update([
                'id_work' => $fields['project'],
                'id_shopping_type' => $id_type,
                'id_shopping_state' => 1,
                'code' => $newcode,
                'name' => $fields['name'],
                'approval_number' => 'A37-002.21',
                'management_code' => $fields['management_code'],
                'comment' => $fields['comment'],
                'quote' => $quote
            ]);
        }
        else {
            
            // Update Request
            $shopprequest = ShoppingRequest::find($fields['id_request'])->update([
                'id_work' => $fields['project'],
                'id_shopping_type' => $id_type,
                'id_shopping_state' => 1,
                'name' => $request->name,
                'approval_number' => 'A37-002.21',
                'management_code' => $fields['management_code'],
                'comment' => $fields['comment'],
                'quote' => $quote
            ]);
        }

		// Delete all dptos and Insert again
		DepartmentRequest::where('id_request', $fields['id_request'])->delete();
		for ($i = 0; $i < count($fields['department']); $i++) {
			DepartmentRequest::create([
				'id_department' => $fields['department'][$i],
				'id_request' => $fields['id_request']
			]);
		}

		// Store Log Request
		$id_user = $fields['updated_by'];
		$client = getIP();

		$user_rol   = User::find($id_user);
		$log_roles  = '';
        foreach ($user_rol->roles as $roles) {
			$log_roles .= ', ' . $roles->name;
		}
		$log_roles = substr($log_roles, 2);

		LogRequest::create([
						'id_user' => $id_user,
						'id_request' => $fields['id_request'],
						'action' => 'updated',
						'created_at' => now(),
						'client' => $client,
						'rol' => $log_roles
					]);

        $response = array('success' => true, 'shopprequest' => $shopprequest);
        return response()->json($response,200);
    }

    /**
     * Delete Shopping Request.
     */
    public function deleteRequest(Request $request)
    {
        $shopprequest = ShoppingRequest::find($request->id)->delete();
		DepartmentRequest::where('id_request', $request->id)->delete();
		
		// Store Log Request
		$id_user = $request->id_user;
		$client = getIP();

		$user_rol   = User::find($id_user);		
		$log_roles  = '';
        foreach ($user_rol->roles as $roles) {
			$log_roles .= ', ' . $roles->name;
		}
		$log_roles = substr($log_roles, 2);

		LogRequest::create([
						'id_user' => $id_user,
						'id_request' => $request->id,
						'action' => 'deleted',
						'created_at' => now(),
						'client' => $client,
						'rol' => $log_roles
					]);

        $response = array('success' => true, 'shopprequest' => $shopprequest);
        return response()->json($response,200);
    }

    /**
     * Create Request Product.
     */
    public function createProduct(Request $request)
    {
        $product = ShoppingRequestProduct::create([
                        'id_request' => $request->id_request,
                        $request->field => $request->value
                    ]);

        $response = array('success' => true, 'product' => $product);
        return response()->json($response,200);
    }

    /**
     * Update Request Product.
     */
    public function updateProduct(Request $request)
    {
        $product = ShoppingRequestProduct::find($request->id_product)->update([
                        $request->field => $request->value
                    ]);

        $response = array('success' => true, 'product' => $product);
        return response()->json($response,200);
    }

    /**
     * Delete Request Product.
     */
    public function deleteProduct(Request $request)
    {
        $product = ShoppingRequestProduct::find($request->id)->delete();

        $response = array('success' => true, 'product' => $product);
        return response()->json($response,200);
    }

    /**
     * Set Photo Product.
     */
    public function setPhoto(Request $request)
    {        
        $photo = ProductGallery::find($request->photo)->name;
        
        ShoppingRequestProduct::find($request->product)->update([
            'photo' => $photo
        ]);
        $product = ShoppingRequestProduct::select('id', 'description', 'photo')
                        ->where('id', $request->product)->first();

        $response = array('success' => true, 'product' => $product);
        return response()->json($response,200);
    }

    /**
     * Quit Photo Product.
     */
    public function quitphotoProduct(Request $request)
    {        
        ShoppingRequestProduct::find($request->product)->update([
            'photo' => null
        ]);

        $response = array('success' => true);
        return response()->json($response,200);
    }

    /**
     * Get Sunday beetwend two dates .
     *
     * @return \Illuminate\Http\Response
     */
    public function setDateIncWithoutSunday($startDate, $endDate)
    {     
        $start = new DateTime($startDate);
        $end = new DateTime($endDate);
        $days = $start->diff($end, true)->days;

        for ($i=0; $i < $days; $i++) { 
            $startDate = date("Y-m-d", strtotime($startDate . " +1 days"));
            if (date('w', strtotime($startDate)) == 0) {
                $days++;
            }
        }

        $lastDate = $startDate;
        return $startDate;
    }

    /**
     * Export Model to PDF .
     *
     * @return \Illuminate\Http\Response
     */
    public function expModel(Request $request)
    {
        $shopp_request = ShoppingRequest::find($request->id_request);
        $work = $shopp_request->work;
        $photo = false;

        $products = $shopp_request->products()
                        ->select('code', 'description', 'ctdad', 'price', 'um', 'characteristic', 'photo')
                        ->get();
        $total_price = 0;
        foreach ($products as $product) {
            $total_price += $product->ctdad * $product->price;
            if ($product->photo != null && $product->photo != '') $photo = true;
        }

        if (Work::where('id', $shopp_request->id_work)->first()->name == 'Compras Agrupadas') {
			$department = Department::where('name', 'Compras UBPH')->first();
		}
		else {
			$department = DepartmentRequest::leftJoin('departments', 'departments.id', 'department_requests.id_department')->select('departments.id', 'departments.name', 'departments.manager', 'departments.email', 'departments.telephone', 'departments.abbr', 'departments.buys', 'departments.order')->where('department_requests.id_request', $request->id_request)->first();

		}
		
        $company = Company::first();
        $goods_warehouse = GoodsWarehouse::find($work->id_goods_warehouse)->address;
        $ubi = Companytype::find($work->id_company_type);
        $request_datetime = explode(' ', $shopp_request->created_at);
        $request_date = explode('-', $request_datetime[0]);
        $date = $request_date[2] . '/' . $request_date[1] . '/' . $request_date[0];
        $year = $request_date[0];

        if ($request->model_name == '711') {
            $pdf = PDF::loadView('pdf.Model711', compact('shopp_request', 'work', 'total_price', 'department', 'company', 'goods_warehouse', 'ubi', 'date', 'year'))->setPaper('letter', 'landscape');
            return $pdf->download('Modelo 711 - '. $shopp_request->code .' pdf');
        }
        elseif ($request->model_name == 'Products') {
            $pdf = PDF::loadView('pdf.ModelProducts', compact('shopp_request', 'products', 'total_price', 'photo', 'ubi'))->setPaper('letter', 'landscape');
            return $pdf->download('Listado de Productos - '. $shopp_request->code .' pdf');
        }
        elseif ($request->model_name == 'Chronogram') {
            // Get chronogram
            $chronogram = array();
            $cictot_count = 0;
            $cictcx_count = 0;
			// Get Approved date
			$approvedate = LogRequest::where('id_request', $request->id_request)
									->where('action', 'approved')
									->orderBy('id', 'DESC')
									->first()->created_at;
			$approvedate = explode(' ', $approvedate);

            // UBPH Approval
            $ubph_approval = $approvedate[0];
            $arr_ubph_approval = explode('-', $ubph_approval);
            $ubph_approval_date = $arr_ubph_approval[2] . '/' . $arr_ubph_approval[1] . '/' . $arr_ubph_approval[0];
            $chronogram[0] = array(
                                'task' => 'APROBACI&Oacute;N 711 UBPH',
                                'resp' => 'UBPH',
                                'date' => $ubph_approval_date,
                                'cictot' => '0',
                                'cictcx' => ''
                             );
            // ECM4 Approval
            $ecm4_approval = $ubph_approval;
            $startDate = $ubph_approval;
            $ecm4_approval = date("Y-m-d", strtotime($ecm4_approval . " +10 days"));
            $endDate = $ecm4_approval;
            $ecm4_approval = $this->setDateIncWithoutSunday($startDate, $endDate);
            $arr_ecm4_approval = explode('-', $ecm4_approval);
            $ecm4_approval_date = $arr_ecm4_approval[2] . '/' . $arr_ecm4_approval[1] . '/' . $arr_ecm4_approval[0];     
            $cictot_count += 10;
            $cictcx_count += 0;
            $chronogram[1] = array(
                                'task' => 'APROBACI&Oacute;N 711 ECM4',
                                'resp' => 'ECM4',
                                'date' => $ecm4_approval_date,
                                'cictot' => '10',
                                'cictcx' => ''
                             );
			// UBI Present
            $ubi_present = $ecm4_approval;
			$startDate = $ecm4_approval;
            $ubi_present = date("Y-m-d", strtotime($ubi_present . " +1 days"));
            $endDate = $ubi_present;
            $ubi_present = $this->setDateIncWithoutSunday($startDate, $endDate);
            $arr_ubipresent = explode('-', $ubi_present);
            $ubi_present_date = $arr_ubipresent[2] . '/' . $arr_ubipresent[1] . '/' . $arr_ubipresent[0];
            $cictot_count += 1;
            $cictcx_count += 0;
            $chronogram[2] = array(
                                'task' => 'PRESENTACI&Oacute;N 711 A UBI-PH',
                                'resp' => 'UBPH',
                                'date' => $ubi_present_date,
                                'cictot' => '1',
                                'cictcx' => ''
                             );
            // UBI Approval
            $ubi_approval = $ubi_present;
            $startDate = $ubi_present;
            $ubi_approval = date("Y-m-d", strtotime($ubi_approval . " +3 days"));
            $endDate = $ubi_approval;
            $ubi_approval = $this->setDateIncWithoutSunday($startDate, $endDate);
            $arr_ubi_approval = explode('-', $ubi_approval);
            $ubi_approval_date = $arr_ubi_approval[2] . '/' . $arr_ubi_approval[1] . '/' . $arr_ubi_approval[0];     
            $cictot_count += 3;
            $cictcx_count += 0;
            $chronogram[3] = array(
                                'task' => 'APROBACI&Oacute;N 711 UBI-UBPH',
                                'resp' => 'UBI-PH',
                                'date' => $ubi_approval_date,
                                'cictot' => '3',
                                'cictcx' => ''
                             );
            // ASEG ALMEST Approval
            $aseg_almest_approval = $ubi_approval;
            $startDate = $ubi_approval;
            $aseg_almest_approval = date("Y-m-d", strtotime($aseg_almest_approval . " +5 days"));
            $endDate = $aseg_almest_approval;
            $aseg_almest_approval = $this->setDateIncWithoutSunday($startDate, $endDate);
            $arr_aseg_almest_approval = explode('-', $aseg_almest_approval);
            $aseg_almest_approval_date = $arr_aseg_almest_approval[2] . '/' . $arr_aseg_almest_approval[1] . '/' . $arr_aseg_almest_approval[0];
            $cictot_count += 5;
            $cictcx_count += 0;
            $chronogram[4] = array(
                                'task' => 'APROBACI&Oacute;N 711 ASEG-ALMEST',
                                'resp' => 'UBI-PH',
                                'date' => $aseg_almest_approval_date,
                                'cictot' => '5',
                                'cictcx' => ''
                             );
            // TECNOTEX Present
            $tecnotex_present = $aseg_almest_approval;
            $startDate = $aseg_almest_approval;
            $tecnotex_present = date("Y-m-d", strtotime($aseg_almest_approval . " +3 days"));
            $endDate = $tecnotex_present;
            $tecnotex_present = $this->setDateIncWithoutSunday($startDate, $endDate);
            $arr_tecnotex_present = explode('-', $tecnotex_present);
            $tecnotex_present_date = $arr_tecnotex_present[2] . '/' . $arr_tecnotex_present[1] . '/' . $arr_tecnotex_present[0];
            $cictot_count += 3;
            $cictcx_count += 0;
            $chronogram[5] = array(
                                'task' => 'PRESENTACI&Oacute;N 711 TECNOTEX',
                                'resp' => 'UBI-PH',
                                'date' => $tecnotex_present_date,
                                'cictot' => '3',
                                'cictcx' => ''
                             );
            // TECNOTEX Approval
            $tecnotex_approval = $tecnotex_present;
            $startDate = $tecnotex_present;
            $tecnotex_approval = date("Y-m-d", strtotime($tecnotex_approval . " +3 days"));
            $endDate = $tecnotex_approval;
            $tecnotex_approval = $this->setDateIncWithoutSunday($startDate, $endDate);
            $arr_tecnotex_approval = explode('-', $tecnotex_approval);
            $tecnotex_approval_date = $arr_tecnotex_approval[2] . '/' . $arr_tecnotex_approval[1] . '/' . $arr_tecnotex_approval[0];
            $cictot_count += 3;
            $cictcx_count += 3;
            $chronogram[6] = array(
                                'task' => 'ACEPTACI&Oacute;N 711 TECNOTEX',
                                'resp' => 'TECNOTEX',
                                'date' => $tecnotex_approval_date,
                                'cictot' => '3',
                                'cictcx' => '3'
                             );
            // TECNOTEX Offer
            $tecnotex_offer = $tecnotex_approval;
            $startDate = $tecnotex_approval;
            $tecnotex_offer = date("Y-m-d", strtotime($tecnotex_offer . " +21 days"));
            $endDate = $tecnotex_offer;
            $tecnotex_offer = $this->setDateIncWithoutSunday($startDate, $endDate);
            $arr_tecnotex_offer = explode('-', $tecnotex_offer);
            $companytecnotex_offer_date = $arr_tecnotex_offer[2] . '/' . $arr_tecnotex_offer[1] . '/' . $arr_tecnotex_offer[0];
            $cictot_count += 21;
            $cictcx_count += 21;
            $chronogram[7] = array(
                                'task' => 'PRESENTACI&Oacute;N OFERTAS TECNOTEX',
                                'resp' => 'TECNOTEX',
                                'date' => $companytecnotex_offer_date,
                                'cictot' => '21',
                                'cictcx' => '21'
                             );
            // DT Offer
            $dt_offer = $tecnotex_offer;
            $startDate = $tecnotex_offer;
            $dt_offer = date("Y-m-d", strtotime($dt_offer . " +15 days"));
            $endDate = $dt_offer;
            $dt_offer = $this->setDateIncWithoutSunday($startDate, $endDate);
            $arr_dt_offer = explode('-', $dt_offer);
            $dt_offer_date = $arr_dt_offer[2] . '/' . $arr_dt_offer[1] . '/' . $arr_dt_offer[0];
            $cictot_count += 15;
            $cictcx_count += 15;
            $chronogram[8] = array(
                                'task' => 'DT OFERTAS',
                                'resp' => 'UBPH-PH',
                                'date' => $dt_offer_date,
                                'cictot' => '15',
                                'cictcx' => '15'
                             );
            // Negotiation & Committee
            $neg_com = $dt_offer;
            $startDate = $dt_offer;
            $neg_com = date("Y-m-d", strtotime($neg_com . " +20 days"));
            $endDate = $neg_com;
            $neg_com = $this->setDateIncWithoutSunday($startDate, $endDate);
            $arr_neg_com = explode('-', $neg_com);
            $neg_com_date = $arr_neg_com[2] . '/' . $arr_neg_com[1] . '/' . $arr_neg_com[0];
            $cictot_count += 20;
            $cictcx_count += 20;
            $chronogram[9] = array(
                                'task' => 'NEGOCIACI&Oacute;N y COMITES',
                                'resp' => 'TECNOTEX',
                                'date' => $neg_com_date,
                                'cictot' => '20',
                                'cictcx' => '20'
                             );
            // Closing
            $closing = $neg_com;
            $startDate = $neg_com;
            $closing = date("Y-m-d", strtotime($closing . " +10 days"));
            $endDate = $closing;
            $closing = $this->setDateIncWithoutSunday($startDate, $endDate);
            $arr_closing = explode('-', $closing);
            $closing_date = $arr_closing[2] . '/' . $arr_closing[1] . '/' . $arr_closing[0];
            $cictot_count += 10;
            $cictcx_count += 10;
            $chronogram[10] = array(
                                'task' => 'CIERRE',
                                'resp' => 'TCX-UBI-UBPH',
                                'date' => $closing_date,
                                'cictot' => '10',
                                'cictcx' => '10'
                             );
            // Contract
            $contract = $closing;
            $startDate = $closing;
            $contract = date("Y-m-d", strtotime($contract . " +7 days"));
            $endDate = $contract;
            $contract = $this->setDateIncWithoutSunday($startDate, $endDate);
            $arr_contract = explode('-', $contract);
            $ubipresentcontract_date = $arr_contract[2] . '/' . $arr_contract[1] . '/' . $arr_contract[0];
            $cictot_count += 7;
            $cictcx_count += 7;
            $chronogram[11] = array(
                                'task' => 'CONTRATACI&Oacute;N',
                                'resp' => 'TECNOTEX',
                                'date' => $ubipresentcontract_date,
                                'cictot' => '7',
                                'cictcx' => '7'
                             );
            // Credit Post
            $credit = $contract;
            $startDate = $contract;
            $credit = date("Y-m-d", strtotime($contract . " +20 days"));
            $endDate = $credit;
            $credit = $this->setDateIncWithoutSunday($startDate, $endDate);
            $arr_credit = explode('-', $credit);
            $credit_date = $arr_credit[2] . '/' . $arr_credit[1] . '/' . $arr_credit[0];
            $cictot_count += 20;
            $cictcx_count += 20;
            $chronogram[12] = array(
                                'task' => 'CARTA DE CR&Eacute;DITO',
                                'resp' => 'TECNOTEX',
                                'date' => $credit_date,
                                'cictot' => '20',
                                'cictcx' => '20'
                            );
			// Building
            $build = $credit;
            $startDate = $credit;
            $build = date("Y-m-d", strtotime($build . " +60 days"));
            $endDate = $build;
            $build = $this->setDateIncWithoutSunday($startDate, $endDate);
            $arr_build = explode('-', $build);
            $build_date = $arr_build[2] . '/' . $arr_build[1] . '/' . $arr_build[0];
            $cictot_count += 60;
            $cictcx_count += 60;
            $chronogram[13] = array(
                                'task' => 'FABRICACI&Oacute;N',
                                'resp' => 'TECNOTEX',
                                'date' => $build_date,
                                'cictot' => '60',
                                'cictcx' => '60'
                            );
            // Sea Transport
            $transport = $build;
            $startDate = $build;
            $transport = date("Y-m-d", strtotime($transport . " +21 days"));
            $endDate = $transport;
            $transport = $this->setDateIncWithoutSunday($startDate, $endDate);
            $arr_transport = explode('-', $transport);
            $transport_date = $arr_transport[2] . '/' . $arr_transport[1] . '/' . $arr_transport[0];
            $cictot_count += 21;
            $cictcx_count += 21;
            $chronogram[14] = array(
                                'task' => 'TRANSPOTE MAR&Iacute;TIMO',
                                'resp' => 'TECNOTEX',
                                'date' => $transport_date,
                                'cictot' => '21',
                                'cictcx' => '21'
                             );
            // DDP Work
            $ddp_work = $transport;
            $startDate = $transport;
            $ddp_work = date("Y-m-d", strtotime($ddp_work . " +10 days"));
            $endDate = $ddp_work;
            $ddp_work = $this->setDateIncWithoutSunday($startDate, $endDate);
            $arr_ddp_work = explode('-', $ddp_work);
            $ddp_work_date = $arr_ddp_work[2] . '/' . $arr_ddp_work[1] . '/' . $arr_ddp_work[0];
            $cictot_count += 10;
            $cictcx_count += 10;
            $chronogram[15] = array(
                                'task' => 'DDP OBRA',
                                'resp' => 'TECNOTEX',
                                'date' => $ddp_work_date,
                                'cictot' => '10',
                                'cictcx' => '10'
                             );

            // Get months interval
            $months_cictot = round($cictot_count / 30);
            $months_cictcx = round($cictcx_count / 30);
            
            $pdf = PDF::loadView('pdf.ModelChronogram', compact('chronogram', 'cictot_count', 'cictcx_count', 'months_cictot', 'months_cictcx', 'ubi', 'work', 'shopp_request', 'total_price', 'department', 'company', 'date'))->setPaper('letter');
            return $pdf->download('Cronograma de Suministro - '. $shopp_request->code .' .pdf');
        }
    }
}

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>PHnet - Compras</title>
    <link rel="shortcut icon" href="{{ asset('dist/img/icons/logo-sm.png') }}" />

    <!-- ExtJS v4.2 -->
    <link href="{{ asset('extjs42/resources/css/ext-all-neptune.css') }}" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="{{ asset('extjs42/includes/shared/messages.css') }}" />

    <!-- Font Awesome Icons v5 -->
    <link href="{{ asset('dist/fa-563/css/all.css') }}" rel="stylesheet">
    <!-- DataTables -->
    <link rel="stylesheet" href="{{ asset('controlpanel/plugins/datatables-bs4/css/dataTables.bootstrap4.css') }}">
    <!-- Select2 -->
    <link rel="stylesheet" href="{{ asset('controlpanel/plugins/select2/css/select2.min.css') }}">
    <link rel="stylesheet" href="{{ asset('controlpanel/plugins/select2-bootstrap4-theme/select2-bootstrap4.min.css') }}">
    <!-- Theme style -->
    <link rel="stylesheet" href="{{ asset('controlpanel/dist/css/adminlte.min.css') }}">
    <!-- Dashboard  -->
	<link type="text/css" href="{{ asset('dist/css/dashboard.css') }}" rel="stylesheet">
</head>

<body onLoad="javascript: var mask = document.getElementById('loading-mask'); mask.remove(0);">
    <div id="loading-mask">
        <div class="message">
            <div class="animation"><i class="fas fa-cog fa-spin"></i></div>
            <div class="text1">PHnet Compras</div>
            <div class="text2">Cargando CMI...</div>
        </div>
    </div>
    
    <nav class="main-header navbar navbar-expand navbar-beige navbar-light navbar-inner" style="position: fixed; width: 100%">
        <!-- SEARCH FORM -->
        <form id="form-filters" class="form-inline ml-2">
            @csrf
            <div class="input-group mr-3">
                <div class="input-group-prepend">
                    <span class="input-group-text">
                        <i class="fas fa-hotel"></i>
                    </span>
                </div>
                <select id="select-work" class="form-control custom-select">
                    <option value="-1">Todos los Proyectos</option>
                    @foreach ($works as $work)
                    <option @if ($filter_work == $work->id) selected @endif value="{{ $work->id }}">{{ $work->name }}</option>
                    @endforeach
                </select>
            </div>
            <div class="input-group mr-3">
                <div class="input-group-prepend">
                    <span class="input-group-text">
                        <i class="fas fa-home"></i>
                    </span>
                </div>
                <select id="select-dpto" class="form-control custom-select">
                    <option value="-1">Todos los Dptos</option>
                    @foreach ($dptos as $dpto)
                    <option @if ($filter_dpto == $dpto->id) selected @endif value="{{ $dpto->id }}">{{ $dpto->name }}</option>
                    @endforeach
                </select>
            </div> 
            <div class="input-group mr-3">
                <div class="input-group-prepend">
                    <span class="input-group-text">
                        <i class="fas fa-calendar-alt"></i>
                    </span>
                </div>
                <select id="select-month" class="form-control custom-select">
                    <option value="-1">Todos los Meses</option>
                    @for ($i = 0; $i < 12; $i++)
                    <option @if ($filter_month == $i + 1) selected @endif value="{{ $i + 1 }}">{{ $months[$i] }}</option>
                    @endfor
                </select>
            </div>
            <div class="input-group mr-3">
                <div class="input-group-prepend">
                    <span class="input-group-text">
                        <i class="fas fa-calendar-alt"></i>
                    </span>
                </div>
                <select id="select-year" class="form-control custom-select">
                    <option value="-1">Todos los A&ntilde;os</option>
                    @for ($i = 0; $i < 5; $i++)
                    <option @if ($filter_year == date('Y') - $i) selected @endif value="{{ date('Y') - $i }}">{{ date('Y') - $i }}</option>
                    @endfor
                </select>
            </div>            
        </form>
    
        <!-- Right navbar links -->
        <ul class="navbar-nav ml-auto">            
            <small class="cmi-name mr-2">CMI Gesti&oacute;n de Compras</small>
        </ul>
    </nav>

    <div class="wrapper">
        
        <!-- Main content -->
        <section class="content">
            <div class="container-fluid">
                <!-- Info boxes -->
                <div class="row">
                    <div class="col-md-3 col-sm-6 col-12">
                        <div class="info-box bg-danger">
                        <span class="info-box-icon"><i class="fas fa-shopping-cart"></i></span>
            
                        <div class="info-box-content">
                            <span class="info-box-text">Circuito de Firmas</span>
                            <span class="info-box-number">{{ $total_request_circuit }}</span>
            
                            <div class="progress">
                            <div class="progress-bar" style="width: {{ ($total_request_circuit / $total_request) * 100 }}%"></div>
                            </div>
                            <span class="progress-description">
                                {{ number_format(($total_request_circuit / $total_request), 2) * 100 }}% sin Aprobar de {{ $total_request }} en Total
                            </span>
                        </div>
                        <!-- /.info-box-content -->
                        </div>
                        <!-- /.info-box -->
                    </div>
                    <!-- /.col -->
                    <div class="col-md-3 col-sm-6 col-12">
                        <div class="info-box bg-warning">
                        <span class="info-box-icon"><i class="fas fa-bullhorn"></i></span>
            
                        <div class="info-box-content">
                            <span class="info-box-text">Solicitudes en Oferta</span>
                            <span class="info-box-number">{{ $total_request_offer }}</span>
                            <div class="progress">
                            <div class="progress-bar" style="width: {{ ($total_request_offer / $total_request) * 100 }}%"></div>
                            </div>
                            <span class="progress-description">
                                {{ number_format(($total_request_offer / $total_request), 2) * 100 }}% de {{ $total_request }} en Total
                            </span>
                        </div>
                        <!-- /.info-box-content -->
                        </div>
                        <!-- /.info-box -->
                    </div>
                    <!-- /.col -->
                    <div class="col-md-3 col-sm-6 col-12">
                        <div class="info-box bg-info">
                        <span class="info-box-icon"><i class="fas fa-handshake"></i></span>
            
                        <div class="info-box-content">
                            <span class="info-box-text">Solicitudes Contratadas</span>
                            <span class="info-box-number">{{ $total_request_contract }}</span>
            
                            <div class="progress">
                            <div class="progress-bar" style="width: {{ ($total_request_contract / $total_request) * 100 }}%"></div>
                            </div>
                            <span class="progress-description">
                                {{ number_format(($total_request_contract / $total_request), 2) * 100 }}% de {{ $total_request }} en Total
                            </span>
                        </div>
                        <!-- /.info-box-content -->
                        </div>
                        <!-- /.info-box -->
                    </div>
                    <!-- /.col -->
                    <div class="col-md-3 col-sm-6 col-12">
                        <div class="info-box bg-success">
                        <span class="info-box-icon"><i class="fas fa-truck"></i></span>
            
                        <div class="info-box-content">
                            <span class="info-box-text">Solicitudes Suministradas</span>
                            <span class="info-box-number">{{ $total_request_supplied }}</span>
            
                            <div class="progress">
                            <div class="progress-bar" style="width: {{ ($total_request_supplied / $total_request) * 100 }}%"></div>
                            </div>
                            <span class="progress-description">
                                {{ number_format(($total_request_supplied / $total_request), 2) * 100 }}% de {{ $total_request }} en Total
                            </span>
                        </div>
                        <!-- /.info-box-content -->
                        </div>
                        <!-- /.info-box -->
                    </div>
                    <!-- /.col -->
                </div>
                <!-- /.row -->

                <div class="row">
                    <div class="col-md-12">
            
                        <!-- STACKED BAR CHART -->
                        <div class="card request-chart">
                        <div class="card-header">
                            <h3 class="card-title">Solicitudes de Compra por Obra</h3>
                            <div class="card-tools">
                                <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i>
                            </button>
                            </div>
                        </div>
                        <div class="card-body pt-3 pb-0">
                            <div id="container-request" style="height: 350px; width: 100%; margin: 0 auto"></div>
                        </div>
                        <!-- /.card-body -->
                        </div>
                        <!-- /.card -->
            
                    </div>
                    <!-- /.col (RIGHT) -->
                </div>
                <!-- /.row -->

                <div class="row">
                    <div class="col-md-6">
            
                        <!-- STACKED BAR CHART -->
                        <div class="card request-chart">
                        <div class="card-header">
                            <h3 class="card-title">Tipos de Compras del Total <small>({{ $total_request }} Solicitudes)</small></h3>
                            <div class="card-tools">
                                <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i>
                            </button>
                            </div>
                        </div>
                        <div class="card-body pt-0 pb-0">
                            <div id="container-types" style="height: 350px; width: 100%; margin: 0 auto"></div>
                        </div>
                        <!-- /.card-body -->
                        </div>
                        <!-- /.card -->
            
                    </div>
                    <!-- /.col  -->
                    <div class="col-md-6">
                        <!-- Widget: user widget style 2 -->
                        <div class="card card-widget bg-gradient-info">
                            <div class="card-header border-0">
                                <h3 class="card-title">
                                    <i class="fas fa-shopping-cart mr-1"></i>
                                    <span>&Uacute;ltimas Solicitudes Creadas</span>
                                </h3>
                                <div class="card-tools">
                                    <button type="button" class="btn bg-info btn-sm" data-card-widget="collapse">
                                    <i class="fas fa-minus"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="card-body p-0">
                                <table class="table table-striped">
                                    <thead>
                                    <tr>
                                        <th>Solicitud</th>
                                        <th>Fecha</th>
                                        <th style="text-align:center">Estado</th>
                                        <th style="width: 40px; text-align:center">Obra</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    @foreach ($last_requests as $request)
                                    
                                    @php
                                    $arr_datetime = explode(' ', $request->created_at);
                                    $arr_date     = explode('-', $arr_datetime[0]);
                                    $date_request = $arr_date[2] . '/' . $arr_date[1] . '/' . $arr_date[0];
                                    switch ($request->state) {
                                        case 'Oferta':
                                            $badge = 'warning';
                                            break;
                                        case 'Contratado':
                                            $badge = 'primary';
                                            break;
                                        case 'Suministrado':
                                            $badge = 'success';
                                            break;    
                                        default:
                                            $badge = 'danger';
                                            break;
                                    }

                                    @endphp
                                    <tr>
                                        <td>{{ $request->code }}</td>
                                        <td>{{ $date_request }}</td>
                                        <td align="center"><span class="badge bg-{{ $badge }}">{{ $request->state }}</span></td>
                                        <td align="center">{{ $request->work }}</td>
                                    </tr>
                                    @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <!-- /.widget-user -->
                    </div>
                    <!-- /.col  -->
                </div>
                <!-- /.row -->
      
            </div><!-- /.container-fluid -->
        </section>
        <!-- /.content --> 
          
    </div>
        
    <!-- REQUIRED SCRIPTS -->
    
    <!-- jQuery -->
    <script src="{{ asset('controlpanel/plugins/jquery/jquery.min.js') }}"></script>
    <!-- Bootstrap 4 -->
    <script src="{{ asset('controlpanel/plugins/bootstrap/js/bootstrap.bundle.min.js') }}"></script>
    <!-- AdminLTE App -->
    <script src="{{ asset('controlpanel/dist/js/adminlte.min.js') }}"></script>
    <!-- page script -->
    @yield('script')
    
    <!-- Highcharts 7.2.1 -->
    <script src="{{ asset('controlpanel/plugins/highcharts-721/highcharts.js') }}"></script>
    <script src="{{ asset('controlpanel/plugins/highcharts-721/highcharts-3d.js') }}"></script>

    <script>
    
    // SEND FILTERS

    $(document).on('change', 'select', function() {
        
        let work  = $('#select-work').val(),
            dpto  = $('#select-dpto').val(),
            month = $('#select-month').val(),
            year  = $('#select-year').val();

        document.location = '/phnet.compras/public/dashboard/' + work + '/' + dpto + '/' + month + '/' + year;
    });

    // BUILD CHARTS

    let php_categories = '{{ $categories }}',
        php_data_circf = '{{ $data_circf }}',
        php_data_offer = '{{ $data_offer }}',
        php_data_cntto = '{{ $data_cntto }}',
        php_data_suppl = '{{ $data_suppl }}',
        categories     = [],
        data_circf     = [],
        data_offer     = [],
        data_cntto     = [],
        data_suppl     = [],
        donut_local    = parseInt('{{ $total_request_local }}'),
        donut_national = parseInt('{{ $total_request_national }}'),
        donut_import   = parseInt('{{ $total_request_import }}');

    php_categories = php_categories.substring(6,php_categories.indexOf('&',2));
    php_data_circf = php_data_circf.substring(6,php_data_circf.indexOf('&',2));
    php_data_offer = php_data_offer.substring(6,php_data_offer.indexOf('&',2));
    php_data_cntto = php_data_cntto.substring(6,php_data_cntto.indexOf('&',2));
    php_data_suppl = php_data_suppl.substring(6,php_data_suppl.indexOf('&',2));
    categories     = php_categories.split(',');
    data_circf     = php_data_circf.split(',').map(function(el){ return +el;});
    data_offer     = php_data_offer.split(',').map(function(el){ return +el;});
    data_cntto     = php_data_cntto.split(',').map(function(el){ return +el;});
    data_suppl     = php_data_suppl.split(',').map(function(el){ return +el;});
    
    // Request x Project
    Highcharts.chart('container-request', {
        chart: {
            type: 'column',
            options3d: {
                enabled: true,
                alpha: 0,
                beta: 0,
                viewDistance: 70,
                depth: 50
            }
        },

        title: {
            text: null
        },

        xAxis: {
            categories: categories,
            labels: {
                skew3d: true,
                style: {
                    fontSize: '13px'
                }
            }
        },

        yAxis: {
            allowDecimals: false,
            min: 0,
            title: {
                text: 'Solicitudes de Compra',
                skew3d: true
            }
        },

        tooltip: {
            headerFormat: '<b>{point.key}</b><br>',
            pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y} Solicitud(es) de un Total de {point.stackTotal}'
        },

        plotOptions: {
            column: {
                stacking: 'normal',
                depth: 100
            }
        },

        series: [{
            name: 'Circuito Firmas',
            color: '#dc3545',
            data: data_circf,
            stack: 'male'
        }, {
            name: 'Ofertas',
            color: '#ffc107',
            data: data_offer,
            stack: 'male'
        }, {
            name: 'Contratado',
            color: '#3c6fdf',
            data: data_cntto,
            stack: 'male'
        }, {
            name: 'Suministrado',
            color: '#28a745',
            data: data_suppl,
            stack: 'male'
        }]
    });

    // Request Types
    Highcharts.chart('container-types', {
        chart: {
            type: 'pie',
            //backgroundColor: '#7092BE',
            options3d: {
                enabled: true,
                alpha: 45
            }
        },

        title: {
            text: null
        },

        plotOptions: {
            pie: {
                innerSize: 100,
                depth: 45
            }
        },

        series: [{
            name: 'Solicitudes de Compra',
            data: [
                {
                    name: 'Locales',
                    y: donut_local,
                    color: '#40405B'
                },
                {
                    name: 'Nacionales',
                    y: donut_national,
                    color: '#A2E140'
                },
                {
                    name: 'Importaci\xF3n',
                    y: donut_import,
                    color: '#649ED7'
                }
            ]
        }]
    });
    </script>
    <script src="{{ asset('dist/js/app.js') }}" type="text/javascript"></script>
</body>
</html>
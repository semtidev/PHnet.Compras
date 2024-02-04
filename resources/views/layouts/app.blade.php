<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>PHnet - Compras</title>
    <link rel="shortcut icon" href="{{ asset('dist/img/icons/favicon.ico') }}" />

    <!-- ExtJS v4.2 -->
    <link href="{{ asset('extjs42/resources/css/ext-all-neptune.css') }}" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="{{ asset('extjs42/includes/shared/messages.css') }}" />
    <!-- Font Awesome Icons v5 -->
    <link href="{{ asset('dist/fa-563/css/all.css') }}" rel="stylesheet">
    <!-- Bootstrap v2.2.2 -->
    <link type="text/css" href="{{ asset('bootstrap/css/bootstrap.min.css') }}" rel="stylesheet">
    <link type="text/css" href="{{ asset('bootstrap/css/bootstrap-responsive.min.css') }}" rel="stylesheet">
    <!-- Theme -->
    <link type="text/css" href="{{ asset('dist/css/theme.css') }}" rel="stylesheet">
    <!-- App -->
    <link type="text/css" href="{{ asset('dist/css/phnet.css') }}" rel="stylesheet">

</head>

<body onLoad="javascript: var mask = document.getElementById('loading-mask'); mask.remove(0);">
    <div id="loading-mask">
        <div class="message">
            <div class="animation"><i class="fas fa-cog fa-spin"></i></div>
            <div class="text1">PHnet Compras</div>
            <div class="text2">Cargando Sistema...</div>
        </div>
    </div>
    <div class="navbar navbar-fixed-top">
        <div class="navbar-inner">
            <div class="container-fluid">
                <a class="brand" href="/phnet.compras/public" style="padding-left:90px"><img
                        src="{{ asset('dist/img/icons/logo-home.jpg') }}" alt="" width="48"
                        style="position:absolute; top: 10px; left:25px;">UBPH</a>
                <div>
                    <ul class="nav nav-icons">
                        <li id="lnk-home">
                            <a title="Inicio"><i class="fas fa-home"></i></a>
                        </li>
                        <!--
						<li id="lnk-notify">
                            <a title="Notificaciones"><i class="fas fa-bell"></i></a>
                        </li>
						-->
                        <li id="lnk-cmi">
                            @if (new_shopping_request() > 0)
                                <a
                                    title="Cuadro de Mando Integral | {{ new_shopping_request() }} Solicitudes por Aprobar">
                                    <i class="fas fa-chart-bar"></i>
                                    <span class="badge danger">{{ new_shopping_request() }}</span>
                                </a>
                            @else
                                <a title="Cuadro de Mando Integral"><i class="fas fa-chart-bar"></i></a>
                            @endif
                        </li>
                        @auth
                            @if (Auth::user()->rol == 'Administrador')
                                <li id="lnk-config">
                                    <a title="Configuraci&oacute;n"><i class="fas fa-cog"></i></a>
                                </li>
                            @endif
                        @endauth

                    </ul>
                    <ul class="nav pull-right">
                        <!-- MAILS
                        <li id="dropdown-phnet" class="dropdown">
                            <a class="dropdown-toggle" data-toggle="dropdown">
                                Correos <b class="caret"></b>
                            </a>
                            <ul class="dropdown-menu">
                                <li class="nav-header">Request</li>
                                <li>
                                    <a href="http://localhost/phnet.compras/mail/request/create" target="_blank"
                                        title="Correo Solicitud de Compra">
                                        Nueva Solicitud
                                    </a>
                                </li>
                            </ul>
                        </li>  -->
                        <li id="dropdown-shopping" class="dropdown">
                            <a class="dropdown-toggle" data-toggle="dropdown">
                                Compras <b class="caret"></b>
                            </a>
                            <ul class="dropdown-menu">
                                <li class="nav-header">Solicitudes</li>
                                <li>
                                    <a id="lnk-shopping-request" title="Gestión de Solicitudes de Compra">
                                        <i class="fas fa-shopping-cart"></i> Solicitudes de Compra
                                    </a>
                                </li>
                                <li class="nav-header">Seguimiento</li>
                                <li>
                                    <a id="lnk-shopping-trackingnat" title="Compras Nacionales y Locales">
                                        <i class="fas fa-truck"></i> Nacionales y Locales
                                    </a>
                                </li>
                                <li>
                                    <a id="lnk-shopping-trackingimp" title="Compras de Importaci&oacute;n">
                                        <i class="fas fa-globe"></i> Compras de Importaci&oacute;n
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li id="dropdown-phnet" class="dropdown">
                            <a class="dropdown-toggle" data-toggle="dropdown">
                                PHnet <b class="caret"></b>
                            </a>
                            <ul class="dropdown-menu">
                                <li class="nav-header">Sistemas</li>
                                <!--<li>
                                    <a href="http://localhost/phnet.cmi" target="_blank"
                                        title="Cuadro de Mando Integral">
                                        <i class="fas fa-tachometer-alt"></i> PHnet CMI
                                    </a>
                                </li>-->
                                <li>
                                    <a href="http://localhost/phnet.calidad/public" target="_blank"
                                        title="Sistema de Gesti&oacute;n de la Calidad">
                                        <i class="fas fa-star"></i> PHnet Calidad
                                    </a>
                                </li>
                                <!--<li>
                                    <a href="http://localhost/phnet.calidad/public" target="_blank"
                                        title="Control de Par&aacute;metros Productivos">
                                        <i class="fas fa-hotel"></i> PHnet Producci&oacute;n
                                    </a>
                                </li>
                                <li>
                                    <a href="http://localhost/phnet.calidad/public" target="_blank"
                                        title="Sistema de Planificaci&oacute;n Estrat&eacute;gica">
                                        <i class="fas fa-paper-plane"></i> PHnet Planificaci&oacute;n
                                    </a>
                                </li>
                                <li>
                                    <a href="http://localhost/phnet.calidad/public" target="_blank"
                                        title="Control de Contratos Ejecutivos">
                                        <i class="fas fa-handshake"></i> PHnet Contrataci&oacute;n
                                    </a>
                                </li>-->
                            </ul>
                        </li>

                        @auth
                            <li id="dropdown-user" class="nav-user dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown">
								<img src="{{ asset('dist/img/users/' . (Auth::user()->photo ? Auth::user()->photo : 'no-photo') . '.jpg') }}"
									class="nav-avatar" />
								<b class="caret"></b></a>
                                <ul class="dropdown-menu">
                                    <li>
										<a id="lnk-userprofile"><i class="fas fa-user text-primary mr-2"></i> Perfil de Usuario</a>
									</li>
                                    <li>
										<a id="lnk-userpassword"><i class="fas fa-key text-primary mr-2"></i> Cambiar Contrase&ntilde;a</a>
									</li>
									@if (Auth::user()->position == 1)
									<li>
										<a id="lnk-replace"><i class="fas fa-stamp text-primary mr-2"></i> Designar Sustituto(s)</a>
									</li>
									@endif
                                    <li class="divider"></li>
                                    <li>
                                        <a href="{{ route('logout') }}"
                                            onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                                            <i class="fas fa-sign-out-alt text-primary mr-2"></i>
                                            {{ __('Cerrar Sesión') }}
                                        </a>
                                        <form id="logout-form" action="{{ route('logout') }}" method="POST"
                                            style="display: none;">
                                            @csrf
                                        </form>
                                    </li>
                                </ul>
                            </li>
                        @endauth
                        @guest
                            <li>
                                <a href="login" class="login_button" title="Acceso como usuario del Sistema">
									<span style="font-weight:700; margin-top:2px">Iniciar Sesi&oacute;n</span>
								</a>
                            </li>
                        @endguest
                    </ul>
                </div>
                <!-- /.nav-collapse -->
            </div>
        </div>
        <!-- /navbar-inner -->
    </div>
    <!-- /navbar -->

    <div class="footer">
        <div class="container-fluid">
            <div style="float:left; width:auto;">
                <b class="copyright">ECM4 - UBPH </b>Servicios Inform&aacute;ticos {{ date('Y') }}.
            </div>
            <div style="float:right; width:auto;">
                Plataforma de Gesti&oacute;n&nbsp;<b class="copyright">PHnet -
                    Compras</b>&nbsp;&nbsp;|&nbsp;&nbsp;Versi&oacute;n 1.0
            </div>
        </div>
    </div>

    <!-- REQUIRED SCRIPTS -->
    <script src="{{ asset('extjs42/ext-all.js') }}"></script>
    <script src="{{ asset('extjs42/locale/ext-lang-es.js') }}"></script>
    <script src="{{ asset('extjs42/ext-theme-neptune.js') }}"></script>
    <script type="text/javascript" src="{{ asset('extjs42/includes/shared/messages.js') }}"></script>

    <script src="{{ asset('dist/js/jquery-2.2.3.min.js') }}" type="text/javascript"></script>
    <script src="{{ asset('dist/js/jquery-ui-1.10.1.custom.min.js') }}" type="text/javascript"></script>
    <script src="{{ asset('bootstrap/js/bootstrap.min.js') }}" type="text/javascript"></script>

    <script src="{{ asset('dist/js/app.js') }}" type="text/javascript"></script>

	<script type="text/javascript">
        let auth = false;
        @auth
            auth = true;
            localStorage.setItem('phcp_ui', '{{ Auth::user()->id }}');
            localStorage.setItem('phcp_un', '{{ Auth::user()->name }}');
			localStorage.setItem('phcp_ud', '{{ Auth::user()->department }}');
            localStorage.setItem('phcp_up', '{{ Auth::user()->photo }}');
            localStorage.setItem('phcp_f', '{{ csrf_token() }}');
			Ext.Ajax.request({
                url: '/phnet.compras/public/api/usertoken',
                method: 'POST',
                params: {
                    id: '{{ Auth::user()->id }}'
                },
                success: function (result, request) {
                    let jsonData = Ext.JSON.decode(result.responseText);
                    if (jsonData.failure) {
                        Ext.MessageBox.show({
							title: 'Mensaje del Sistema',
							msg: 'Ha ocurrido un error al cargar los datos del Usuario. Presione la tecla F5 de su teclado para que todo inicie nuevamente. Si el problema persiste póngase en contacto con el <a href="mailto:semti@nauta.cu">Administrador del Sistema</a>.',
							buttons: Ext.MessageBox.OK,
							icon: 'fas fa-exclamation-triangle fa-2x dlg-error'
						});
                    } else {
                        localStorage.setItem('phcp_a', jsonData.access);
						localStorage.setItem('phcp_upn', jsonData.position);
                    }
                },
                failure: function () {
                    Ext.MessageBox.show({
                        title: 'Mensaje del Sistema',
                        msg: 'Ha ocurrido un error al cargar los datos del Usuario. Presione la tecla F5 de su teclado para que todo inicie nuevamente. Si el problema persiste póngase en contacto con el <a href="mailto:semti@nauta.cu">Administrador del Sistema</a>.',
                        buttons: Ext.MessageBox.OK,
                        icon: 'fas fa-exclamation-triangle fa-2x dlg-error'
                    });
                }
            });
        @endauth
        @guest
            localStorage.removeItem('phcp_ui');
            localStorage.removeItem('phcp_un');
            localStorage.removeItem('phcp_a');
            localStorage.removeItem('phcp_up');
            localStorage.setItem('phcp_f', '{{ csrf_token() }}');
        @endguest
    </script>

</body>

</html>

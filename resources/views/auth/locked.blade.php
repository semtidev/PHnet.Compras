<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>PHNet - Compras</title>
    <link rel="shortcut icon" href="{{ asset('dist/img/icons/favicon.ico') }}" />

    <!-- Font Awesome Icons v5 -->
    <link href="{{ asset('dist/fa-563/css/all.css') }}" rel="stylesheet">
    <!-- icheck bootstrap -->
    <link rel="stylesheet" href="{{ asset('dist/plugins/icheck-bootstrap/icheck-bootstrap.min.css') }}">
    <!-- Theme style -->
    <link rel="stylesheet" href="{{ asset('dist/css/adminlte.min.css') }}">
    <!-- Auth -->
    <link type="text/css" href="{{ asset('dist/css/locked.css') }}" rel="stylesheet">
</head>
<body class="hold-transition locked-page">
    @auth
    <!-- Automatic element centering -->
    <div class="lockscreen-wrapper">
    <div class="lockscreen-logo">
        <center><img src="{{ asset('dist/img/icons/ecm4-logo.png') }}" width="100"></center>
        <a href="../../index2.html"><b>UBPH</b> Centro Hist&oacute;rico</a>
    </div>
    <!-- User name -->
    <div class="lockscreen-name">{{ Auth::user()->name }}</div>

    <!-- START LOCK SCREEN ITEM -->
    <div class="lockscreen-item">
        <!-- lockscreen image -->
        <div id="avatar" class="lockscreen-image">
        <img src="{{ asset('dist/img/users/' . (Auth::user()->photo ? Auth::user()->photo : 'no-photo') . '.jpg') }}" alt="User Image">
        </div>
        <!-- /.lockscreen-image -->

        <!-- lockscreen credentials (contains the form) -->
        <form id="form-unlocked" class="lockscreen-credentials" onSubmit="return false;">
        @csrf
        <input type="hidden" name="email" value="{{ Auth::user()->email }}">
        <div id="formfields" class="input-group">
            <input id="pwd" name="password" type="password" class="form-control" placeholder="contrase&ntilde;a">

            <div class="input-group-append">
            <button id="formbtn" type="button" class="btn"><i class="fas fa-arrow-right text-muted"></i></button>
            </div>
        </div>
        </form>
        <div id="locked-loading" class="locked-loading hidden"></div>
        <!-- /.lockscreen credentials -->

    </div>
    <!-- /.lockscreen-item -->
    <div class="system-name text-center">
        PHNet - Compras
    </div>
    <div class="help-block text-center">
        Introduzca su contrase&ntilde;a para desbloquear la sesi&oacute;n, o
    </div>
    <div class="text-center">
        <b><a href="{{ route('logout') }}" class="text-black" onclick="event.preventDefault(); localStorage.setItem('phcp_ss', 'active'); document.getElementById('logout-form').submit();">Inicie Sesi&oacute;n con otra cuenta</a></b>
        <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
            @csrf
        </form>
    </div>
    
    </div>
    <!-- /.center -->
    @endauth

    <!-- jQuery -->
    <script src="{{ asset('dist/plugins/jquery/jquery.min.js') }}"></script>
    <!-- Bootstrap 4 -->
    <script src="{{ asset('dist/plugins/bootstrap/js/bootstrap.bundle.min.js') }}"></script>
    <!-- AdminLTE App -->
    <script src="{{ asset('dist/js/adminlte.min.js') }}"></script>

    <!-- Unlocked -->
    <script type="text/javascript">
    @auth
        localStorage.setItem('phcp_ss', 'locked');
    @endauth
    @guest
        localStorage.setItem('phcp_ss', 'active');
        window.location = '/phnet.compras/public';
    @endguest
    $("#pwd").keypress(function(event) {
        if ( event.which == 13 ) {
            sendUnlocked();
        }
    });
    $(document).on('click', '#formbtn', function(){
        sendUnlocked();
    });
    
    function sendUnlocked() {
        
        var form = $('#form-unlocked'),
            formData = new FormData(form[0]),
            loading = $('#locked-loading');
        
        form.find('.help-block').remove();
        form.find('.form-group').removeClass('has-error');
        loading.html('<i class="fas fa-cog fa-spin"></i>');
        loading.removeClass('hidden');
        
        $.ajax({
            type: 'POST',
            url: '/phnet.compras/public/api/unlocked',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function(response)
            {
                if (response.success) {
                    localStorage.setItem('phcp_ss', 'active');
                    document.location = '/phnet.compras/public/';
                }
                else {
                    $('#formfields').addClass('error');
                    $('#avatar').addClass('avatar-error');
                    loading.html('<strong>Acceso Denegado</strong>');
                }
            },
            error: function(xhr){
                document.location = '/phnet.compras/public/locked';
            }
        });
    }

	// Expire Session
	setTimeout(function(){ 
		
		localStorage.setItem('phcp_ss', 'active');
		
		// Remove user config
		localStorage.removeItem('phcp_ui');
		localStorage.removeItem('phcp_un');
		localStorage.removeItem('phcp_ud');
		localStorage.removeItem('phcp_up');
		localStorage.removeItem('phcp_f');
		localStorage.removeItem('phcp_win');
		localStorage.removeItem('phcp_win_id');
		$('#dropdown-shopping').removeClass('focus');
		$('#lnk-home').addClass('active');

		document.location = '/phnet.compras/public/';
	}, 7200000);
    </script>

</body>
</html>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>PHnet - Compras</title>
    <link rel="shortcut icon" href="{{ asset('dist/img/icons/logo-sm.png') }}" />

    <!-- Font Awesome Icons v5 -->
    <link href="{{ asset('dist/fa-563/css/all.css') }}" rel="stylesheet">
    <!-- icheck bootstrap -->
    <link rel="stylesheet" href="{{ asset('dist/plugins/icheck-bootstrap/icheck-bootstrap.min.css') }}">
    <!-- Theme style -->
    <link rel="stylesheet" href="{{ asset('dist/css/adminlte.min.css') }}">
    <!-- Auth -->
    <link type="text/css" href="{{ asset('dist/css/auth.css') }}" rel="stylesheet">
</head>
<body class="hold-transition login-page">
    <div class="login-box">
    <!-- /.login-logo -->
    <div class="card mt-4">
        <div class="card-body login-card-body">
        <center style="margin-bottom:10px">
            <a href="/quality/public">
                <img src="{{ asset('dist/img/icons/logo.png') }}" width="40" height="30" style="margin-top:-12px; margin-right:5px">
                <span>UBPH Centro Hist&oacute;rico</span>
            </a>
        </center>
        
        <h5 class="text-center mb-4">Acceso PHnet Compras</h5>

        <form method="POST" action="{{ route('login') }}">
            @csrf
            <div class="input-group mb-3">
                <input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email" autofocus placeholder="Correo">
                <div class="input-group-append">
                    <div class="input-group-text">
                    <span class="fas fa-envelope"></span>
                    </div>
                </div>
            </div>
            @error('email')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
            @enderror
            <div class="input-group mb-3">
                <input  id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="current-password" placeholder="Contrase&ntilde;a">
                <div class="input-group-append">
                    <div class="input-group-text">
                    <span class="fas fa-lock"></span>
                    </div>
                </div>
            </div>
            @error('password')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
            @enderror
            <div class="row pt-1">
            <div class="col-12 pb-2">
                <p class="mb-1">
                    <a href="/phnet.compras/public">Regresar al Inicio</a>
                </p>
            </div>
            <div class="col-8">
                <div class="icheck-primary">
                <input type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>
                <label for="remember">
                    Recordarme
                </label>
                </div>
            </div>
            <!-- /.col -->
            <div class="col-4">
                <button type="submit" class="btn btn-primary btn-block">
                    <i class="fas fa-sign-in-alt"></i> Entrar
                </button>
            </div>
            <!-- /.col -->
            </div>
        </form>

        </div>
        <!-- /.login-card-body -->
    </div>

    <div class="copyright">
        <b>ECM4 - UBPH </b>Servicios Inform&aacute;ticos {{ date('Y') }}
    </div>
    </div>
    <!-- /.login-box -->


    <!-- jQuery -->
    <script src="{{ asset('dist/plugins/jquery/jquery.min.js') }}"></script>
    <!-- Bootstrap 4 -->
    <script src="{{ asset('dist/plugins/bootstrap/js/bootstrap.bundle.min.js') }}"></script>
    <!-- AdminLTE App -->
    <script src="{{ asset('dist/js/adminlte.min.js') }}"></script>

</body>
</html>

<html lang="es">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>{{ config('app.name') }} - @yield('title')</title>

        <style>            
            .document-title {
                font-family: Verdana, Arial, Helvetica, sans-serif; 
                font-size: 13px;
                line-height: 20px;
                font-weight: bold;
                padding: 3px auto;
                text-align: center;
            }
            .data {
                font-family: Verdana, Arial, Helvetica, sans-serif; 
                font-size: 11px;
                line-height: 18px;
                font-weight: normal;
                padding: 0 2px;
            }
			.certify_711 {
				margin-top: 50px;
			}
			.certify_title {
				text-align: center;
				font-size: 20px;
				font-weight: 700;
				padding: 7px 10px;
			}
			.certify_category {
				font-size: 18px;
				font-weight: normal;
				padding: 7px 10px;
			}
			.check {
				font-size: 16px;
				font-weight: 700;
				padding: 7px 10px;
				color: rgb(14, 119, 4);
				text-align: center;
				border-color: #000;
				text-transform: uppercase;
			}

            @page { margin: 40px 20px 15px 25px; }
            /*.header-page { width: 100%; text-align: center; margin: 0; padding: 0;}*/
            p { page-break-after: always; }
            p:last-child { page-break-after: never; }
            .pagenum:before {
                content: counter(page);
            }
            hr { margin: 50px auto; border-color: #ccc; }
            .page-break {
                page-break-after: always;
            }
        </style>

    </head>
    <body>
        <main style="width:100%">
            @yield('content')
        </main>
    </body>
</html>
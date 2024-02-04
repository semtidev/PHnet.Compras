<html lang="es">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>{{ config('app.name') }} - @yield('title')</title>

        <style>            
            .doc-shopp-ecm {
                font-size: 13px;
                text-transform: uppercase;
                line-height: 16px;
                text-align: center;
                font-weight: 700;
                font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
            }
            .doc-shopp-ph {
                font-size: 15px;
                font-weight: 600;
                line-height: 25px;
                text-align: center;
                font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
            }
            .doc-shopp-work {
                font-size: 16px;
                font-weight: 700;
                text-transform: uppercase;
                line-height: 30px;
                text-align: center;
                font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
            }
            .document-title {
                font-family: Verdana, Arial, Helvetica, sans-serif; 
                font-size: 14px;
                line-height: 22px;
                font-weight: bold;
                padding: 5px 5px;
                text-align: center;
            }
            .column-title {
                font-family: Verdana, Arial, Helvetica, sans-serif; 
                font-size: 12px;
                line-height: 18px;
                font-weight: bold;
                padding: 3px 5px;
            }
            .field-name {
                font-family: Verdana, Arial, Helvetica, sans-serif; 
                font-size: 11px;
                vertical-align: top;
                font-weight: normal;
            }
            .data {
                font-family: Verdana, Arial, Helvetica, sans-serif; 
                font-size: 11px;
                line-height: 20px;
                font-weight: normal;
                padding: 2px 5px;
            }
            .data-subtitle {
                font-family: Verdana, Arial, Helvetica, sans-serif; 
                font-size: 13px;
                font-weight: 700;
                line-height: 25px;
                padding: 2px 5px;
            }

            @page { margin: 20px 20px 0 35px; }
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
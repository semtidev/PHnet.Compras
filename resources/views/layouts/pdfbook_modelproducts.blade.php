<html lang="es">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>{{ config('app.name') }} - @yield('title')</title>

        <style>            
            .company-title1 {
                font-family: Verdana, Arial, Helvetica, sans-serif; 
                font-size: 17px;
                font-weight: 700;
            }
            .company-title2 {
                font-family: Verdana, Arial, Helvetica, sans-serif; 
                font-size: 9px;
                font-weight: bold;
                color: #000;
            }
            .company-title3 {
                font-family: Verdana, Arial, Helvetica, sans-serif; 
                font-size: 12px;
                font-weight: normal;
                color: #000;
                text-transform: normal;
                padding: 3px 7px;
            }
            .company-title3 span {
                font-family: Verdana, Arial, Helvetica, sans-serif; 
                font-size: 12px;
                font-weight: bold;
                color: #000;
                text-transform: uppercase;
                padding: 3px 0;
            }
            .doc-title {
                font-family: Verdana, Arial, Helvetica, sans-serif; 
                font-size: 16px;
                font-weight: bold;
                /*text-transform: uppercase;*/
                padding: 5px 7px;
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
                padding: 4px 5px;
            }
            .data {
                font-family: Verdana, Arial, Helvetica, sans-serif; 
                font-size: 11px;
                line-height: 18px;
                font-weight: normal;
                padding: 4px 5px;
            }
            .total {
                font-family: Verdana, Arial, Helvetica, sans-serif; 
                font-size: 12px;
                line-height: 18px;
                font-weight: 700;
                text-transform: uppercase;
                padding: 4px 5px;
            }
            .total-data {
                font-family: Verdana, Arial, Helvetica, sans-serif; 
                font-size: 12px;
                line-height: 18px;
                font-weight: 700;
                text-align: center;
                padding: 4px 5px;
            }
            @page { margin: 100px 20px 15px 27px; }
            header {
                position: fixed;
                top: -60px;
                left: 0px;
                right: 0px;
                padding: 10px 0;
                height: 130px; 
                vertical-align: middle;
                margin-bottom: 20px !important;
            }
            .pagenum {
                font-size: 11px;
                font-family: Verdana, Arial, Helvetica, sans-serif;
                width: auto;
                padding: 0 7px;
            }
            .headpage {
                margin-bottom: 5px;
            }
            p { page-break-after: always; }
            p:last-child { page-break-after: never; }
            .pagenum:after {
                content: counter(page);
            }
            hr { margin: 50px auto; border-color: #ccc; }
            .page-break {
                page-break-after: always;
            }
        </style>

    </head>
    <body>
        <header>
            <table width="750" border="1" cellspacing="0" cellpadding="0">
                <tr>
                    <td width="35" align="center" class="column-title">&Iacute;TEMS</td>
                    <td width="50" align="center" class="column-title">C&Oacute;DIGO</td>
                    <td class="column-title">DECSCRIPCI&Oacute;N DEL PRODUCTO</td>
                    <td width="40" align="center" class="column-title">UM</td>
                    <td width="50" align="center" class="column-title">CTDAD</td>
                    <td width="90" align="center" class="column-title">PRECIO UNITARIO CUP</td>
                    <td width="170" class="column-title">CARACTER&Iacute;STICAS T&Eacute;CNICAS</td>
                    @if ($photo)
                    <td width="60" align="center" class="column-title">FOTO</td>
                    @endif
                </tr>
            </table>
        </header>        
        <main style="width:100%">
            @yield('content')
        </main>
    </body>
</html>
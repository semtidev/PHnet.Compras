<html lang="en">
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
            .column-title {
                font-family: Verdana, Arial, Helvetica, sans-serif; 
                font-size: 13px;
                font-weight: normal;
                color: #000;
                padding: 3px 7px;
            }
            .title-document{
                font-family: Verdana, Arial, Helvetica, sans-serif; 
                font-size: 12px;
                font-weight: normal;
                color: #000;
                text-transform: uppercase;
                padding: 0 0 10px 0;
            }
            .title-document span{
                font-size: 15px;
                font-weight: bold;
            }
            .title-category{
                font-family: Verdana, Arial, Helvetica, sans-serif; 
                font-size: 14px;
                font-weight: 700;
                color: #000;
                padding: 0 0 10px 0;
            }
            .title-paragraph{
                font-family: Verdana, Arial, Helvetica, sans-serif; 
                font-size: 13px;
                font-weight: normal;
                color: #000;
                line-height: 20px;
                padding: 20px 0;
                text-align: justify;
            }
            .title-table{
                font-family: Verdana, Arial, Helvetica, sans-serif; 
                font-size: 13px;
                font-weight: 700;
                color: #000;
                line-height: 20px;
                padding: 5px;
            }
            .table-footer {
                margin-top: 20px;
            }
            .table-signature {
                font-family: Verdana, Arial, Helvetica, sans-serif; 
                font-size: 12px;
                font-weight: normal;
                padding: 5px 7px;
            }
            .data {
                font-family: Verdana, Arial, Helvetica, sans-serif; 
                font-size: 12px;
                font-weight: normal;
                padding: 3px 5px;
            }
            .comment {
                font-family: Verdana, Arial, Helvetica, sans-serif; 
                font-size: 14px;
                font-weight: normal;
                padding: 3px 5px;
            }
            .doc-title {
                font-family: Verdana, Arial, Helvetica, sans-serif; 
                font-size: 16px;
                font-weight: bold;
                /*text-transform: uppercase;*/
                padding: 5px 7px;
            }
            .cell-planning {
                background-color: #D0E9B2 !important;
                color: #000;
                font-weight: bold;
            }
            .cell-real {
                background-color: #9EC86A !important;
                color: #000;
                font-weight: bold;
            }
            .cell-backlog {
                background-color: #F8E8D9 !important;
                color: #000;
                font-weight: bold;
            }
            /*.table-footer {
                font-family: Verdana, Arial, Helvetica, sans-serif; 
                font-size: 13px;
                font-weight: normal;
                padding: 5px 7px;
            }*/
            @page { margin: 170px 30px 30px 30px; }
            header {
                position: fixed;
                top: -148px;
                left: 0px;
                right: 0px;
                padding: 10px 0;
                height: 150px; 
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
                padding-bottom: 20px;
                border-bottom: #999 1px solid;
            }
            /*.header-page { width: 100%; text-align: center; margin: 0; padding: 0;}*/
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
            <table class="headpage" width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                    <td valign="middle">
                        <div class="pagenum">Fecha: {{ date('d/m/Y') }}&nbsp;&nbsp;|&nbsp;&nbsp;P&aacute;gina </div>
                        <div class="doc-title">UBPH Centro Hist&oacute;rico</div>
                    </td>
                    <td align="right" valign="top">
                        <div class="company-title1">Empresa Constructora Militar No 4</div>
                        <div class="company-title2">Km 11/2 carretera a Cidra Matanzas</div>
                        <div class="company-title2">
                            tel&eacute;fono: (45) 292423&nbsp;&nbsp;&nbsp;correo electr&oacute;nico: ecm4@ucm4.co.cu
                        </div>    
                    </td>
                    <td align="right" width="65" valign="top">
                        <img src="{{ public_path('/dist/img/icons/logo.png') }}"/>
                    </td>
                </tr>
                <tr><td colspan="3">&nbsp;</td></tr>
            </table>
            <table width="100%" class="table" border="0" cellpadding="0" cellspacing="0" style="margin-top:10px">
                <tr height="20">
                    <td class="title-document" valign="top">
                        <span>{{ $title }}</span>
                    </td>
                </tr>
            </table>
            <table width="100%" border="1" cellspacing="0" cellpadding="0">
                <tr>
                    <td width="15" class="data" align="center"><strong>No.</strong></td>
                    <td width="35" class="data" align="center"><strong>Obra</strong></td>
                    <td width="50" class="data" align="center"><strong>C&oacute;digo UBPH</strong></td>
                    <td class="data"><strong>Descripci&oacute;n</strong></td>
                    <td width="50" class="data" align="center"><strong>Fecha</strong></td>
                    <td width="60" class="data" align="right"><strong>Presupuesto</strong></td>
                    <td width="50" class="data" align="center"><strong>Contrato</strong></td>
                    <td width="50" class="data" align="right"><strong>Valor Contrato</strong></td>
                    <td width="60" class="data" align="center"><strong>Estado</strong></td>
                    <td width="50" class="data" align="center"><strong>Factura</strong></td>
                    <td width="50" class="data" align="right"><strong>Importe</strong></td>
                </tr>
            </table>
        </header>
        <main style="width:100%">
            @yield('content')
        </main>
    </body>
</html>
<!doctype html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0">
    <title>Nueva Solicitud de Compra</title>
</head>
<body>
    <table style = "border: 0; width:100%" cellspacing="0" cellpadding="0">
        <tr>
         <td align="center">
            <img src="http://localhost/phnet.compras/public/dist/img/icons/ecm4-logo.png" width="120" />
            <h3>UBPH CENTRO HIST&Oacute;RICO</h3>
         </td>
        </tr>
        <tr>
         <td align="left">
            <p><strong>Hola estimado usuario</strong>, el Sistema PHnet Compras de nuestra Unidad Básica le informa que ha sido generada una nueva Solicitud de Compra.
            </p>
         </td>
        </tr>
        <tr>
         <td>
            <p>Detalles de la Solicitud:</p>
            <ul>
                <li>Usuario: Liliana Mayea</li>
                <li>C&oacute;digo: {{ $shopprequest }}</li>
                <li>Departamento: Acabados CH</li>
                <li>Proyecto: Hotel Catedral</li>
                <li>Descripci&oacute;n: Masilla para muros de albañilerias</li>
            </ul>
         </td>
      </tr>
    </table>
    <br/>
    <p><strong>Nota</strong>: Esto es un mensaje automático generado por el Sistema 
    <a href="http://localhost/phnet.compras/public" target="_blank">PHnet Compras</a>.
    Por favor no responda a este correo.</p>
    <br/>
    <center>
        <font style="color:#03A332">{{ date('Y') }} ECM4 </font> - 
        <font style="color:#BC5005">PHnet Compras.</font> 
    </center>
</body>
</html>
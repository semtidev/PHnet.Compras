@extends('layouts.pdfbook_model711')

@section('title', 'Modelo 711')

@section('content')
  <table width="750" class="data" border="1" cellspacing="0" cellpadding="0">
      <tr>
        <td colspan="5" class="document-title">PLAN DE ABASTECIMIENTO A&Ntilde;O {{ $year }}</td>
        <td colspan="6" align="center" class="document-title">SOLICITUD DE IMPORTACI&Oacute;N</td>
        <td colspan="2" class="data">No 711: {{ $shopp_request->code }}</td>
        <td class="data">No 711 TCX:</td>
        <td class="data"></td>
      </tr>
      <tr>
        <td colspan="2" class="data">Codigo REUP:</td>
        <td colspan="3" rowspan="2" class="data">Destino Final:</td>
        <td colspan="2" align="center" class="data">&nbsp;</td>
        <td align="center" class="data">I</td>
        <td align="center" class="data">II</td>
        <td align="center" class="data">III</td>
        <td align="center" class="data">IV</td>
        <td colspan="2" rowspan="3" class="data">Fuente de<br>Financiamiento</td>
        <td class="data">TX</td>
        <td class="data">&nbsp;</td>
      </tr>
      <tr>
        <td colspan="2" class="data">CLIENTE: ECM4 MATANZAS</td>
        <td colspan="2" align="center" class="data">Solicitadas</td>
        <td class="data">&nbsp;</td>
        <td class="data">&nbsp;</td>
        <td class="data">&nbsp;</td>
        <td class="data">&nbsp;</td>
        <td class="data">CREDITO</td>
        <td class="data">&nbsp;</td>
      </tr>
      <tr>
        <td colspan="2" class="data">Plan: A&ntilde;o {{ $year }}</td>
        <td colspan="3" class="data">{{ $work->name }}</td>
        <td colspan="2" align="center" class="data">Aceptadas</td>
        <td class="data">&nbsp;</td>
        <td class="data">&nbsp;</td>
        <td class="data">&nbsp;</td>
        <td class="data">&nbsp;</td>
        <td class="data">No APROB.</td>
        <td class="data">{{ $shopp_request->approval_number }}</td>
      </tr>
      <tr>
        <td colspan="4" rowspan="2" class="data">Descripcion General del 711: {{ $shopp_request->name }}</td>
        <td colspan="7" align="center" class="data">Para uso de ELCLIENTE</td>
        <td colspan="4" align="center" class="data">Para uso de EL SUMINISTRADOR</td>
      </tr>
      <tr>
        <td class="data">&nbsp;</td>
        <td colspan="2" align="center" class="data">Solicitud</td>
        <td colspan="2" class="data">Ctdad Asignada</td>
        <td class="data">&nbsp;</td>
        <td class="data">&nbsp;</td>
        <td rowspan="2" align="center" class="data">Pais</td>
        <td align="center" class="data">Valor</td>
        <td align="center" class="data">Valor</td>
        <td align="center" class="data">Ctto</td>
      </tr>
      <tr>
        <td align="center" class="data">Item</td>
        <td class="data">Descripcion del Suministro</td>
        <td align="center" class="data">UM</td>
        <td align="center" class="data">Codigo</td>
        <td align="center" class="data">Precio</td>
        <td align="center" class="data">Ctdad</td>
        <td align="center" class="data">Valor</td>
        <td align="center" class="data">I</td>
        <td align="center" class="data">II</td>
        <td align="center" class="data">III</td>
        <td align="center" class="data">IV</td>
        <td align="center" class="data">E. Plan</td>
        <td align="center" class="data">Ext.</td>
        <td align="center" class="data">Ext.</td>
      </tr>
      <tr>
        <td width="70" align="center" class="data">1</td>
        <td align="center" class="data">2</td>
        <td width="35" align="center" class="data">3</td>
        <td width="35" align="center" class="data">4</td>
        <td width="55" align="center" class="data">5</td>
        <td width="50" align="center" class="data">6</td>
        <td width="60" align="center" class="data">7</td>
        <td width="30" align="center" class="data">8</td>
        <td width="20" align="center" class="data">9</td>
        <td width="20" align="center" class="data">10</td>
        <td width="20" align="center" class="data">11</td>
        <td width="32" align="center" class="data">12</td>
        <td width="35" align="center" class="data">13</td>
        <td width="55" align="center" class="data">14</td>
        <td width="65" align="center" class="data">15</td>
      </tr>
      <tr>
        <td align="center" class="data">1</td>
        <td class="data">{{ $shopp_request->name }}</td>
        <td align="center" class="data">LOTE</td>
        <td class="data">&nbsp;</td>
        <td align="center" class="data">${{ number_format($total_price, 2, '.', ',') }}</td>
        <td align="center" class="data">1</td>
        <td align="center" class="data">${{ number_format($total_price, 2, '.', ',') }}</td>
        <td class="data">&nbsp;</td>
        <td rowspan="4" class="data">&nbsp;</td>
        <td rowspan="4" class="data">&nbsp;</td>
        <td rowspan="4" class="data">&nbsp;</td>
        <td rowspan="4" class="data">&nbsp;</td>
        <td rowspan="4" class="data">&nbsp;</td>
        <td rowspan="4" class="data">&nbsp;</td>
        <td rowspan="4" class="data">&nbsp;</td>
      </tr>
      <tr>
        <td colspan="6" align="right" class="data">Total de Suministro CIF (flete, seguro, comision e inspeccion)</td>
        <td align="center" class="data">${{ number_format($total_price, 2, '.', ',') }}</td>
        <td rowspan="3" align="center" class="data">CUP</td>
      </tr>
      <tr>
        <td colspan="6" align="right" class="data">Otros gastos de operacion, transportacion interna y margen comercial 12.7%</td>
        <td align="center" class="data">${{ number_format(($total_price * 0.127), 2, '.', ',') }}</td>
      </tr>
      <tr>
        <td colspan="6" align="right" class="data">Total General</td>
        <td align="center" class="data">${{ number_format($total_price + ($total_price * 0.127), 2, '.', ',') }}</td>
      </tr>
      <tr>
        <td colspan="2" align="center" class="data">Representante de EL SUMINISTRADOR</td>
        <td colspan="5" align="center" class="data">Representante por EL CLIENTE</td>
        <td colspan="6" align="center" class="data">FECHAS</td>
        <td colspan="2" class="data">Lugar Entrega Mercancia</td>
      </tr>
      <tr>
        <td class="data">Especialista CS:</td>
        <td class="data">Comprador:</td>
        <td colspan="3" class="data">Director:</td>
        <td colspan="2" class="data">Esp. que aprueba las ofertas</td>
        <td colspan="3" align="center" class="data">Fecha Presentacion</td>
        <td colspan="3" align="center" class="data">Fecha Aprobacion</td>
        <td colspan="2" rowspan="3" class="data">{{ $goods_warehouse }}</td>
      </tr>
      <tr>
        <td class="data">&nbsp;</td>
        <td class="data">&nbsp;</td>
        <td colspan="3" class="data">{{ $company->director }}</td>
        <td colspan="2" rowspan="2" valign="top" class="data">{{ $department->manager }}</td>
        <td rowspan="2" class="data">&nbsp;</td>
        <td rowspan="2" class="data">&nbsp;</td>
        <td rowspan="2" class="data">&nbsp;</td>
        <td rowspan="2" class="data">&nbsp;</td>
        <td rowspan="2" class="data">&nbsp;</td>
        <td rowspan="2" class="data">&nbsp;</td>
      </tr>
      <tr>
        <td class="data">Firma:</td>
        <td class="data">Firma:</td>
        <td colspan="3" class="data">Firma</td>
      </tr>
      <tr>
        <td colspan="2" class="data">Tel.:</td>
        <td colspan="3" class="data">Tel. y Correo: {{ $company->telephone }}</td>
        <td colspan="2" class="data">Tel. y Correo: {{ $department->telephone }}</td>
        <td align="center" class="data">D</td>
        <td align="center" class="data">M</td>
        <td align="center" class="data">A</td>
        <td align="center" class="data">D</td>
        <td align="center" class="data">M</td>
        <td align="center" class="data">A</td>
        <td class="data">Garantia</td>
        <td class="data">Post Venta</td>
      </tr>
      <tr>
        <td colspan="2" class="data">Correo:</td>
        <td colspan="3" class="data">{{ $company->email }}</td>
        <td colspan="2" class="data">{{ $department->email }}</td>
        <td class="data">&nbsp;</td>
        <td class="data">&nbsp;</td>
        <td class="data">&nbsp;</td>
        <td class="data">&nbsp;</td>
        <td class="data">&nbsp;</td>
        <td class="data">&nbsp;</td>
        <td class="data">Asist. T&eacute;c.</td>
        <td class="data">Documentac.</td>
      </tr>
      <tr>
        <td colspan="15" align="center" class="data">REVISION DEL 711 EN LA EMPRESA</td>
      </tr>
      <tr>
        <td colspan="2" align="center" class="data">DIRECCION DE INVERSIONES</td>
        <td colspan="5" align="center" class="data">DIRECCION DE FINANZAS</td>
        <td colspan="6" align="center" class="data">DIRECCION DE LA EMPRESA</td>
        <td colspan="2" align="center" class="data">DIRECCION DE<br>ASEGURAMIENTO</td>
      </tr>
      <tr>
        <td colspan="2" rowspan="5" class="data">&nbsp;</td>
        <td class="data">SALDO</td>
        <td colspan="4" class="data">&nbsp;</td>
        <td colspan="6" rowspan="5" class="data">&nbsp;</td>
        <td colspan="2" rowspan="4" class="data">&nbsp;</td>
      </tr>
      <tr>
        <td class="data">INCREM</td>
        <td colspan="4" class="data">&nbsp;</td>
      </tr>
      <tr>
        <td class="data">INCREM</td>
        <td colspan="4" class="data">&nbsp;</td>
      </tr>
      <tr>
        <td class="data">INCREM</td>
        <td colspan="4" class="data">&nbsp;</td>
      </tr>
      <tr>
        <td class="data">OTROS</td>
        <td colspan="4" class="data">&nbsp;</td>
        <td class="data">FECHA</td>
        <td class="data">&nbsp;</td>
      </tr>
      <tr>
        <td colspan="15" align="center" class="data">REVISION DEL 711 EN EL TERRITORIO</td>
      </tr>
      <tr>
        <td colspan="2" align="center" class="data">DATOS UBI</td>
        <td colspan="5" align="center" class="data">DATOS DE LA DELEGACION</td>
        <td colspan="6" align="center" class="data">DIRECCION ECM#4</td>
        <td colspan="2" rowspan="2" align="center" class="data">REGISTRO DE 711<br>(REGA06.002)</td>
      </tr>
      <tr>
        <td class="data">Nro</td>
        <td class="data">{{ $ubi->ubi_director }}</td>
        <td class="data">Nro</td>
        <td colspan="4" class="data">{{ $ubi->delegate }}</td>
        <td colspan="6" rowspan="2" class="data">&nbsp;</td>
      </tr>
      <tr>
        <td class="data">FECHA</td>
        <td class="data">&nbsp;</td>
        <td class="data">FECHA</td>
        <td colspan="4" class="data">&nbsp;</td>
        <td class="data">Nro</td>
        <td class="data">&nbsp;</td>
      </tr>
      <tr>
        <td class="data">FIRMA</td>
        <td class="data">&nbsp;</td>
        <td class="data">FIMRA</td>
        <td colspan="4" class="data">&nbsp;</td>
        <td colspan="6" class="data">FIRMA Y FECHA</td>
        <td class="data">FECHA</td>
        <td class="data">&nbsp;</td>
      </tr>
      <tr>
        <td colspan="15" class="data">OBSERVACIONES: {{ $shopp_request->comment }}</td>
      </tr>
      <tr>
        <td rowspan="2" class="data">COD. GESTION</td>
        <td rowspan="2" class="data">{{ $shopp_request->management_code }}</td>
        <td class="data">Nro 711</td>
        <td colspan="2" class="data">{{ $shopp_request->code }}</td>
        <td colspan="10" rowspan="2" class="data">&nbsp;</td>
      </tr>
      <tr>
        <td class="data">FECHA</td>
        <td colspan="2" class="data">{{ $date }}</td>
      </tr>
  </table>

  <div class="page-break"></div>

  <table class="certify_711" align="center" width="400" border="1" cellspacing="0" cellpadding="0">
	<tr>
		<td colspan="2" class="certify_title">Niveles de Revisi&oacute;n del Modelo 711</td>
	</tr>
	<tr>
		<td width="250" class="certify_category">Director UBPH</td>
		<td class="check">
			@if ($shopp_request->gendir_aprove == 1)
				Aprobado
			@else
				<font style="color:#333; text-transform: unset;">Pendiente</font>
			@endif
		</td>
	</tr>
	<tr>
		<td class="certify_category">Director de Proyecto</td>
		<td class="check">
			@if ($shopp_request->dir_confirm == 1)
				Confirmado
			@else
				<font style="color:#333; text-transform: unset;">Pendiente</font>
			@endif
		</td>
	</tr>
	<tr>
		<td class="certify_category">Jefe de Compras</td>
		<td class="check">
			@if ($shopp_request->comp_comfirm == 1)
				Confirmado
			@else
				<font style="color:#333; text-transform: unset;">Pendiente</font>
			@endif
		</td>
	</tr>
	<tr>
		<td class="certify_category">Jefe de Departamento Solicitante</td>
		<td class="check">
			@if ($shopp_request->dpto_confirm == 1)
				Confirmado
			@else
				<font style="color:#333; text-transform: unset;">Pendiente</font>
			@endif
		</td>
	</tr>
  </table>
@stop
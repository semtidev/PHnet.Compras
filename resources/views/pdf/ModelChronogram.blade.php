@extends('layouts.pdfbook_modelchronogram')

@section('title', 'Cronograma de Suministro')

@section('content')
<table width="558" border="1" cellspacing="0" cellpadding="0" rules="rows" style="padding: 4px 5px; margin-bottom: 20px;">
    <tr height="70">
        <td width="110" align="left" valign="middle"><img src="{{ public_path('/dist/img/icons/doc_ucm.jpg') }}" width="90" style="margin-left: 10px"/></td>
        <td align="center">
            <span class="doc-shopp-ecm">ECM#4</span><br>
            <span class="doc-shopp-ph">Unidad B&aacute;sica Proyecto Hotelero {{ $ubi->name }}</span><br>
            <span class="doc-shopp-work">{{ $work->name }}</span>
        </td>
        <td width="110" align="right" valign="middle"><img src="{{ public_path('/dist/img/icons/doc_almest.jpg') }}" width="90" style="margin-right: 10px"/></td>
    </tr>
    <tr>
        <td colspan="3">
            <table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td style="border-right: 1px solid">
                        <span class="field-name">&nbsp;<i>Descripci&oacute;n</i></span><br>
                        <span class="data-subtitle">{{ $shopp_request->name }}</span>
                    </td>
                    <td width="100" style="border-right: 1px solid">
                        <span class="field-name">&nbsp;<i>No. 711</i></span><br>
                        <span class="data-subtitle">{{ $shopp_request->code }}</span>
                    </td>
                    <td width="100">
                        <span class="field-name">&nbsp;<i>Presupuesto</i></span><br>
                        <span class="data-subtitle">${{ number_format($total_price, 2, '.', ',') }}</span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
<table width="560" class="data" border="1" cellspacing="0" cellpadding="0" style="margin-bottom: 30px">
    <tr>
        <td colspan="5" class="document-title">CRONOGRAMA DE SUMINISTRO</td>
    </tr>
    <tr>
        <td class="column-title">&nbsp;</td>
        <td width="80" align="center" class="column-title">RESPONSABLE</td>
        <td width="80" align="center" class="column-title">FECHAS</td>
        <td width="80" align="center" class="column-title">CICLO TOTAL</td>
        <td width="80" align="center" class="column-title">CICLO TCX</td>
    </tr>
    @php $count = 0; @endphp
    @foreach ($chronogram as $key => $data)
    @php $count++; @endphp
    <tr>
        <td @if ($count%2 != 0) bgcolor="#EAECED" @endif class="data" align="right">
            <strong>{!! $data['task'] !!}</strong>
        </td>
        <td @if ($count%2 != 0) bgcolor="#EAECED" @endif class="data" align="center">{!! $data['resp'] !!}</td>
        <td @if ($count%2 != 0) bgcolor="#EAECED" @endif class="data" align="center">{!! $data['date'] !!}</td>
        <td @if ($count%2 != 0) bgcolor="#EAECED" @endif class="data" align="center">{!! $data['cictot'] !!}</td>
        <td @if ($count%2 != 0) bgcolor="#EAECED" @endif class="data" align="center">{!! $data['cictcx'] !!}</td>
    </tr>
    @endforeach
    <tr>
        <td colspan="3" align="right" class="data"><strong>TOTAL CICLO</strong></td>
        <td class="data" align="center"><strong>{{ $cictot_count }}</strong></td>
        <td class="data" align="center"><strong>{{ $cictcx_count }}</strong></td>
    </tr>
    <tr>
        <td colspan="3" align="right" class="data"><strong>TOTAL MESES</strong></td>
        <td class="data" align="center"><strong>{{ $months_cictot }}</strong></td>
        <td class="data" align="center"><strong>{{ $months_cictcx }}</strong></td>
    </tr>
</table>
<table width="560" class="data" border="1" cellspacing="0" cellpadding="0">
    <tr>
        <td class="data"><strong>ELABORADO POR:</strong></td>
        <td width="80" class="data" align="center"><strong>Cargo:</strong></td>
        <td width="80" class="data" align="center"><strong>Fecha:</strong></td>
        <td width="80" class="data" align="center"><strong>Firma:</strong></td>
    </tr>
    <tr>
        <td class="data">{{ $department->manager }}</td>
        <td width="80" class="data" align="center">J' Departamento</td>
        <td width="80" class="data" align="center">{{ $date }}</td>
        <td width="80" class="data" align="center">&nbsp;</td>
    </tr>
    <tr>
        <td class="data"><strong>APROBADO POR:</strong></td>
        <td width="80" class="data" align="center"><strong>Cargo:</strong></td>
        <td width="80" class="data" align="center"><strong>Fecha:</strong></td>
        <td width="80" class="data" align="center"><strong>Firma:</strong></td>
    </tr>
    <tr>
        <td class="data">{{ $company->director }}</td>
        <td width="80" class="data" align="center">Director UBPH-PH</td>
        <td width="80" class="data" align="center"></td>
        <td width="80" class="data" align="center">&nbsp;</td>
    </tr>
    <tr>
        <td class="data"><strong>APROBADO POR:</strong></td>
        <td width="80" class="data" align="center"><strong>Cargo:</strong></td>
        <td width="80" class="data" align="center"><strong>Fecha:</strong></td>
        <td width="80" class="data" align="center"><strong>Firma:</strong></td>
    </tr>
    <tr>
        <td class="data"></td>
        <td width="80" class="data" align="center">Esp. Inversiones UBI</td>
        <td width="80" class="data" align="center">&nbsp;</td>
        <td width="80" class="data" align="center">&nbsp;</td>
    </tr>
    <tr>
        <td class="data"><strong>APROBADO POR:</strong></td>
        <td width="80" class="data" align="center"><strong>Cargo:</strong></td>
        <td width="80" class="data" align="center"><strong>Fecha:</strong></td>
        <td width="80" class="data" align="center"><strong>Firma:</strong></td>
    </tr>
    <tr>
        <td class="data">{{ $ubi->ubi_director }}</td>
        <td width="80" class="data" align="center">Director UBI</td>
        <td width="80" class="data" align="center"></td>
        <td width="80" class="data" align="center">&nbsp;</td>
    </tr>
    <tr>
        <td class="data"><strong>CONFORME POR:</strong></td>
        <td width="80" class="data" align="center"><strong>Cargo:</strong></td>
        <td width="80" class="data" align="center"><strong>Fecha:</strong></td>
        <td width="80" class="data" align="center"><strong>Firma:</strong></td>
    </tr>
    <tr>
        <td class="data">&nbsp;</td>
        <td width="80" class="data" align="center">Representante TCX</td>
        <td width="80" class="data" align="center">&nbsp;</td>
        <td width="80" class="data" align="center">&nbsp;</td>
    </tr>
</table>
@stop
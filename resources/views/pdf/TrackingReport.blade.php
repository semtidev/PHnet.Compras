@extends('layouts.pdfbook_trackingreport')

@section('title', 'Reporte PHnet Compras')

@section('content')
<table width="100%" border="1" cellspacing="0" cellpadding="0" style="margin-top:22px">
    @php $count = 0; $total_budget = 0; $total_contract = 0; $total_invoice = 0; @endphp
    @foreach ($tracking as $key => $data)
    @php
        $count++;
        $budget = str_replace(',', '', $data['budget']);
        $total_budget += (float)$budget;
        $contract = str_replace(',', '', $data['contract_value']);
        $total_contract += (float)$contract;
        $invoice = str_replace(',', '', $data['import_invoice']);
        $total_invoice += (float)$invoice;
    @endphp
    <tr>
        <td width="15" class="data" align="center">{{ $count }}</td>
        <td width="35" class="data" align="center">{{ $data['work_abbr'] }}</td>
        <td width="50" class="data" align="center">{{ $data['codedb'] }}</td>
        <td class="data">{{ $data['name'] }}</td>
        <td width="50" class="data" align="center">{{ $data['document_date'] }}</td>
        <td width="60" class="data" align="right">
            {{ $data['budget'] }}
        </td>
        <td width="50" class="data" align="center">{{ $data['contract_code'] }}&nbsp;</td>
        <td width="50" class="data" align="right">
            {{ number_format((float)$data['contract_value'], 2, '.', ',') }}
        </td>
        <td width="60" class="data" align="center">{{ $data['state'] }}&nbsp;</td>
        <td width="50" class="data" align="center">{{ $data['code_invoice'] }}&nbsp;</td>
        <td width="50" class="data" align="right">
            {{ $data['import_invoice'] }}
        </td>
    </tr>
    @if (count($data['children']) > 0)
        @foreach ($data['children'] as $key_child => $data_child)
        @php 
            $count++;
            $budget = str_replace(',', '', $data_child['budget']);
            $total_budget += (float)$budget;
            $contract = str_replace(',', '', $data_child['contract_value']);
            $total_contract += (float)$contract;
            $invoice = str_replace(',', '', $data_child['import_invoice']);
            $total_invoice += (float)$invoice;
        @endphp
        <tr>
            <td width="15" class="data" align="center">{{ $count }}</td>
            <td width="35" class="data" align="center">{{ $data_child['work_abbr'] }}</td>
            <td width="50" class="data" align="center">{{ $data_child['codedb'] }}</td>
            <td class="data">{{ $data_child['name'] }}</td>
            <td width="50" class="data" align="center">{{ $data_child['document_date'] }}</td>
            <td width="60" class="data" align="right">
                {{ $data_child['budget'] }}
            </td>
            <td width="50" class="data" align="center">{{ $data_child['contract_code'] }}&nbsp;</td>
            <td width="50" class="data" align="right">
                {{ number_format((float)$data_child['contract_value'], 2, '.', ',') }}
            </td>
            <td width="60" class="data" align="center">{{ $data_child['state'] }}&nbsp;</td>
            <td width="50" class="data" align="center">{{ $data_child['code_invoice'] }}&nbsp;</td>
            <td width="50" class="data" align="right">
                {{ $data_child['import_invoice'] }}
            </td>
        </tr>
        @endforeach
    @endif
    @endforeach
    <tr>
        <td colspan="5" class="data" align="right"><strong>TOTAL</strong></td>
        <td class="data" align="right">
            <strong>{{ number_format($total_budget, 2, '.', ',') }}</strong>
        </td>
        <td class="data" align="center">&nbsp;</td>
        <td class="data" align="right">
            <strong>{{ number_format($total_contract, 2, '.', ',') }}</strong>
        </td>
        <td class="data" align="center">&nbsp;</td>
        <td class="data" align="center">&nbsp;</td>
        <td class="data" align="right">
            <strong>{{ number_format($total_invoice, 2, '.', ',') }}</strong>
        </td>
    </tr>
</table>
<br>
<table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top:10px">
    <tr>
        <td class="comment">{{ $comment }}</td>
    </tr>
</table>
<br>
<table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top:30px">
    <tr>
        <td valign="top" class="table-signature" width="70">
            <strong>Elabora:</strong>
        </td>
        <td width="200" style="border-bottom: #000 1px solid">&nbsp;</td>
        <td>&nbsp;</td>
        <td width="200" style="border-bottom: #000 1px solid">&nbsp;</td>
        <td>&nbsp;</td>
        <td width="100" style="border-bottom: #000 1px solid">&nbsp;</td>
        <td>&nbsp;</td>
    </tr>
    <tr>
        <td></td>
        <td valign="top" class="table-signature" align="center">
             Nombre(s y Apliidos)
        </td>
        <td>&nbsp;</td>
        <td valign="top" class="table-signature" align="center">
            Cargo
        </td>
        <td>&nbsp;</td>
        <td valign="top" class="table-signature" align="center">
            Firma
        </td>
        <td>&nbsp;</td>
    </tr>
</table>
@stop
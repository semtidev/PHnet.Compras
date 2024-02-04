@extends('layouts.pdfbook_modelproducts')

@section('title', 'Listado de Productos Adjuntos')

@section('content')
<table width="750" border="1" cellspacing="0" cellpadding="0">
    @php $count = 0; @endphp
    @foreach ($products as $key => $data)
    @php $count++; @endphp
    <tr>
        <td width="35" @if ($count%2 != 0) bgcolor="#EAECED" @endif class="data" align="center">{!! $count !!}</td>
        <td width="50" @if ($count%2 != 0) bgcolor="#EAECED" @endif class="data" align="center">{!! $data['code'] !!}&nbsp;</td>
        <td @if ($count%2 != 0) bgcolor="#EAECED" @endif class="data" >{!! $data['description'] !!}</td>
        <td width="40" @if ($count%2 != 0) bgcolor="#EAECED" @endif class="data" align="center">{!! $data['um'] !!}</td>
        <td width="50" @if ($count%2 != 0) bgcolor="#EAECED" @endif class="data" align="center">{!! $data['ctdad'] !!}</td>
        <td width="90" @if ($count%2 != 0) bgcolor="#EAECED" @endif class="data" align="center">$ {!! $data['price'] !!}</td>
        <td width="170" @if ($count%2 != 0) bgcolor="#EAECED" @endif class="data" >{!! $data['characteristic'] !!}&nbsp;</td>
        @if ($photo)
        <td width="60" @if ($count%2 != 0) bgcolor="#EAECED" @endif class="data" align="center">
            @if ($data['photo'] != null && $data['photo'] != '')
            <img src="{{ storage_path('app/public/products/thumbnails/' . $data['photo']) }}" width="70" height="50">
            @else
            <img src="{{ public_path('dist/img/nophoto.png') }}" width="70" height="50">
            @endif
        </td>
        @endif
    </tr>
    @endforeach
</table>
@stop
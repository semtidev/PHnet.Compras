<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Events\AfterSheet;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Illuminate\Support\Facades\Cache;

class TrackingExport implements FromCollection, WithHeadings, ShouldAutoSize, WithEvents
{
    // Set the headings
    public function headings(): array 
    {
        return [
            'No', 
            'Obra', 
            'Departamento(s)', 
            'Estado', 
            'Codigo UBPH', 
            'Codigo UBI', 
            'Descripcion', 
            'Presupuesto',
            'No. Contrato',
            'Imp Contrato',
            'No. Factura',
            'Imp Factura',
            'Comentario'
        ];
    }

    // freeze the first row with headings
    public function registerEvents():array 
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                
                // Headers
                $cellRange = 'A1:M1'; // All headers
                $event->sheet->getDelegate()->getStyle($cellRange)->getFont()->setName('Arial');
                $event->sheet->getDelegate()->getStyle($cellRange)->getFont()->setSize(11);
                $event->sheet->getDelegate()->getStyle($cellRange)->getFont()->setBold(true);
                // Content
                $event->sheet->freezePane('A2', 'A2');
            },
        ];
    }
    
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        $data     = array();
        $counter  = 0;
        $tracking = Cache::get('tracking');
        foreach ($tracking as $row) {
            $counter++;
            $data[] = array(
                'no' => $counter,
                'work_abbr' => $row['work_abbr'],
                'dpto_name' => $row['department'],
                'state' => $row['state'],
                'codedb' => $row['codedb'],
                'code_almest' => $row['code_almest'],
                'name' => $row['name'],
                'budget' => $row['budget'],
                'contract_code' => $row['contract_code'],
                'contract_value' => $row['contract_value'],
                'code_invoice' => $row['code_invoice'],
                'import_invoice' => $row['import_invoice'],
                'comment' => $row['comment']
            );

            if (count($row['children']) > 0) {
                foreach ($row['children'] as $child) {
                    $counter++;
                    $data[] = array(
                        'no' => $counter,
                        'work_abbr' => $child['work_abbr'],
                        'dpto_name' => $child['department'],
                        'state' => $child['state'],
                        'codedb' => $child['codedb'],
                        'code_almest' => $child['code_almest'],
                        'name' => $child['name'],
                        'budget' => $child['budget'],
                        'contract_code' => $child['contract_code'],
                        'contract_value' => $child['contract_value'],
                        'code_invoice' => $child['code_invoice'],
                        'import_invoice' => $child['import_invoice'],
                        'comment' => $child['comment']
                    );
                }
            }
        }
        return collect($data);
    }
}

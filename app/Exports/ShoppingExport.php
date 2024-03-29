<?php

namespace App\Exports;

use App\ShoppingRequest;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\AfterSheet;

class ShoppingExport implements FromCollection, WithHeadings, WithEvents
{
    // Set the headings
    public function headings(): array 
    {
        return [
            'Company name', 'Flyer name', 'Co Company', 'Stand', 'Online invitation', 'Pending'
        ];
    }

    // freeze the first row with headings
    public function registerEvents():array 
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $event->sheet->freezePane('A2', 'A2');
            },
        ];
    }
    
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        $data = ShoppingRequest::all();
        return collect($data);
    }
}

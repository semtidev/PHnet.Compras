<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ShoppingRequestNotify extends Mailable
{
    use Queueable, SerializesModels;

    public $shopprequest;
    
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($shopprequest)
    {
        $this->shopprequest = $shopprequest;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Nueva Solicitud de Compra')
                    ->view('mail.RequestCreate');
    }
}

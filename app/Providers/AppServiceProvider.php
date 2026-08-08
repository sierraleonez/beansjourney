<?php

namespace App\Providers;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Mailtrap\Bridge\Transport\MailtrapSdkTransportFactory;
use Symfony\Component\Mailer\Transport\Dsn;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Mail::extend('mailtrap', function () {
            return (new MailtrapSdkTransportFactory())->create(
                Dsn::fromString('mailtrap+sdk://'.config('services.mailtrap.api_key').'@default'),
            );
        });
    }
}

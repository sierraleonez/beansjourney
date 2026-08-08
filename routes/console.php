<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Mailtrap\Helper\ResponseHelper;
use Mailtrap\MailtrapClient;
use Mailtrap\Mime\MailtrapEmail;
use Symfony\Component\Mime\Address;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('mail:send-test {to : Recipient email address}', function (string $to) {
    $email = (new MailtrapEmail())
        ->from(new Address(config('mail.from.address'), config('mail.from.name')))
        ->to(new Address($to))
        ->subject('You are awesome!')
        ->category('Integration Test')
        ->text('Congrats for sending test email with Mailtrap!');

    $response = MailtrapClient::initSendingEmails(
        apiKey: config('services.mailtrap.api_key'),
    )->send($email);

    $this->info('Sent via Mailtrap:');
    dump(ResponseHelper::toArray($response));
})->purpose('Send a test email through Mailtrap\'s Sending API');

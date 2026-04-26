<?php

$sandbox = (bool) env('CARRYBEE_SANDBOX', false);

return [
    'sandbox'        => $sandbox,
    'base_url'       => $sandbox
                            ? 'https://sandbox.carrybee.com'
                            : 'https://developers.carrybee.com',
    'client_id'      => env('CARRYBEE_CLIENT_ID'),
    'client_secret'  => env('CARRYBEE_CLIENT_SECRET'),
    'client_context' => env('CARRYBEE_CLIENT_CONTEXT'),
];

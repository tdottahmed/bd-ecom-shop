<?php

$sandbox = (bool) env('PATHAO_SANDBOX', false);

return [
    'sandbox'       => $sandbox,
    'base_url'      => $sandbox
                           ? 'https://hermes-sandbox.pathao.com'
                           : 'https://hermes.pathao.com',
    'client_id'     => env('PATHAO_CLIENT_ID'),
    'client_secret' => env('PATHAO_CLIENT_SECRET'),
    'username'      => env('PATHAO_USER'),
    'password'      => env('PATHAO_PASSWORD'),
    'store_id'      => env('PATHAO_STORE_ID'),
];

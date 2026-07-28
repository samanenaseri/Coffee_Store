<?php

return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000','http://localhost:3001', 'http://localhost:5173', 'http://admin.beanhouse.ir','https://admin.beanhouse.ir','https://beanhouse.ir',,'http://beanhouse.ir'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];

<?php
/**
 * GET  → current announcement (public, used by the homepage hero).
 * POST → save announcement (admin token required).
 */
require __DIR__ . '/config.php';

$default = [
    'active'    => false,
    'type'      => 'info',
    'message'   => '',
    'link'      => '',
    'linkLabel' => '',
];

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    send_json(read_json('announcement.json', $default));
}

if ($method === 'POST') {
    require_admin();
    $body = read_body();
    $type = $body['type'] ?? 'info';
    if (!in_array($type, ['info', 'success', 'warning', 'alert'], true)) {
        $type = 'info';
    }
    $announcement = [
        'active'    => (bool) ($body['active'] ?? false),
        'type'      => $type,
        'message'   => (string) ($body['message'] ?? ''),
        'link'      => (string) ($body['link'] ?? ''),
        'linkLabel' => (string) ($body['linkLabel'] ?? ''),
    ];
    write_json('announcement.json', $announcement);
    send_json($announcement);
}

send_json(['error' => 'Method not allowed'], 405);

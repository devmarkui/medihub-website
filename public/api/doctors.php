<?php
/**
 * GET  → doctors list (public, shown on the website). Returns null when the
 *        admin hasn't saved any yet, so the client uses its built-in defaults.
 * POST → save the full doctors array (admin token required).
 *        Body: { "doctors": [ ... ] }
 */
require __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    send_json(read_json('doctors.json', null));
}

if ($method === 'POST') {
    require_admin();
    $body = read_body();
    $list = $body['doctors'] ?? null;
    if (!is_array($list)) {
        send_json(['error' => 'Expected { doctors: [...] }'], 422);
    }
    write_json('doctors.json', $list);
    send_json(['ok' => true, 'count' => count($list)]);
}

send_json(['error' => 'Method not allowed'], 405);

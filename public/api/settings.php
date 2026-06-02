<?php
/**
 * Admin notification settings (WhatsApp delivery config). Admin-only both ways.
 *   GET  → saved settings, or null if never saved (client uses defaults).
 *   POST → save settings object.
 */
require __DIR__ . '/config.php';
require_admin();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    send_json(read_json('settings.json', null));
}

if ($method === 'POST') {
    $body = read_body();
    write_json('settings.json', $body);
    send_json(['ok' => true]);
}

send_json(['error' => 'Method not allowed'], 405);

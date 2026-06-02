<?php
/** POST { password } → { token } on success, 401 on failure. */
require __DIR__ . '/config.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    send_json(['error' => 'Method not allowed'], 405);
}

$body = read_body();
$password = (string) ($body['password'] ?? '');

// Constant-time comparison to avoid leaking the password via timing.
if (!hash_equals(ADMIN_SECRET, $password)) {
    send_json(['error' => 'Incorrect password'], 401);
}

$token = create_token();
if ($token === null) {
    send_json([
        'error' => 'Server storage is not writable. Make the api/data folder writable (chmod 755 or 775).',
    ], 500);
}
send_json(['token' => $token]);

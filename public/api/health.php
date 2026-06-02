<?php
/**
 * Diagnostic endpoint — open https://yourdomain/api/health.php in a browser.
 * Confirms PHP runs and that the data folder is writable (the #1 thing that
 * stops announcements/bookings from saving on shared hosting).
 */
require __DIR__ . '/config.php';

$dir = data_dir();
$probe = $dir . '/.probe';
$canWrite = @file_put_contents($probe, 'ok') !== false;
if ($canWrite) {
    @unlink($probe);
}

send_json([
    'ok'            => $canWrite,
    'php'           => PHP_VERSION,
    'dataDir'       => $dir,
    'writable'      => $canWrite,
    'message'       => $canWrite
        ? 'Backend is healthy — announcements and bookings can be saved.'
        : 'Data folder is NOT writable. chmod the api/data folder to 755 (or 775).',
]);

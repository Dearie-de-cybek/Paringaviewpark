<?php
// Paringa Park View contact form handler (cPanel / PHP mail)
$to = 'hello@paringaparkview.com.au';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Location: contact.html'); exit; }
// Honeypot: real visitors never fill this hidden field
if (!empty($_POST['website'])) { header('Location: contact.html?sent=1'); exit; }

function clean($v) { return trim(str_replace(["\r", "\n"], ' ', strip_tags((string)$v))); }

$first    = clean($_POST['first_name'] ?? '');
$last     = clean($_POST['last_name'] ?? '');
$who      = clean($_POST['who'] ?? '');
$business = clean($_POST['business'] ?? '');
$phone    = clean($_POST['phone'] ?? '');
$email    = trim((string)($_POST['email'] ?? ''));
$interest = clean($_POST['interest'] ?? '');
$message  = trim(strip_tags((string)($_POST['message'] ?? '')));

if ($first === '' || $last === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($_POST['consent'])) {
    header('Location: contact.html?error=1'); exit;
}

$subject = "Website enquiry from $first $last";
$body  = "Name: $first $last\n";
$body .= "I am a: $who\n";
$body .= "Business: $business\n";
$body .= "Phone: +61 $phone\n";
$body .= "Email: $email\n";
$body .= "Interested in: $interest\n\n";
$body .= "Message:\n$message\n";

$host = preg_replace('/^www\./', '', $_SERVER['HTTP_HOST'] ?? 'paringaparkview.com.au');
$headers  = "From: Paringa Park View Website <no-reply@$host>\r\n";
$headers .= "Reply-To: " . str_replace(["\r", "\n"], '', $email) . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$ok = mail($to, $subject, $body, $headers);
header('Location: contact.html?' . ($ok ? 'sent=1' : 'error=1'));
exit;

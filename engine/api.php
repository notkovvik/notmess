<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

function getJsonInput() {
    return json_decode(file_get_contents('php://input'), true);
}

function telegramApi($method, $params = []) {
    $url = 'https://api.telegram.org/bot' . BOT_TOKEN . '/' . $method;
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($params));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    $result = curl_exec($ch);
    curl_close($ch);
    return json_decode($result, true);
}

$request_uri = $_SERVER['REQUEST_URI'];
$request_method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($request_uri, PHP_URL_PATH);

if ($path === '/api/telegram' && $request_method === 'POST') {
    $data = getJsonInput();
    $result = telegramApi($data['method'], $data['params'] ?? []);
    echo json_encode($result);
    exit;
}

if ($path === '/api/auth/code' && $request_method === 'POST') {
    $data = getJsonInput();
    $stmt = $pdo->prepare('INSERT INTO auth_codes (username, code, chatId, createdAt) VALUES (?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE code = ?, chatId = ?, createdAt = NOW()');
    $stmt->execute([$data['username'], $data['code'], $data['chatId'], $data['code'], $data['chatId']]);
    echo json_encode(['success' => true]);
    exit;
}

if ($path === '/api/auth/verify' && $request_method === 'POST') {
    $data = getJsonInput();
    $stmt = $pdo->prepare('SELECT * FROM auth_codes WHERE username = ? AND code = ?');
    $stmt->execute([$data['username'], $data['code']]);
    $row = $stmt->fetch();
    
    if (!$row) {
        echo json_encode(['valid' => false]);
        exit;
    }
    
    $created = strtotime($row['createdAt']);
    if (time() - $created > 600) {
        $stmt = $pdo->prepare('DELETE FROM auth_codes WHERE username = ?');
        $stmt->execute([$data['username']]);
        echo json_encode(['valid' => false, 'expired' => true]);
        exit;
    }
    
    $stmt = $pdo->prepare('DELETE FROM auth_codes WHERE username = ?');
    $stmt->execute([$data['username']]);
    echo json_encode(['valid' => true, 'chatId' => $row['chatId']]);
    exit;
}

if ($path === '/api/users' && $request_method === 'POST') {
    $data = getJsonInput();
    $stmt = $pdo->prepare('INSERT INTO users (username, firstname, lastname, displayUsername, chatId, createdAt) VALUES (?, ?, ?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE firstname = ?, lastname = ?, displayUsername = ?, chatId = ?');
    $stmt->execute([
        $data['username'], 
        $data['firstname'], 
        $data['lastname'] ?? '', 
        $data['displayUsername'], 
        $data['chatId'] ?? null,
        $data['firstname'], 
        $data['lastname'] ?? '', 
        $data['displayUsername'], 
        $data['chatId'] ?? null
    ]);
    echo json_encode(['success' => true, 'username' => $data['username']]);
    exit;
}

if ($path === '/api/users' && $request_method === 'GET') {
    $stmt = $pdo->query('SELECT * FROM users ORDER BY createdAt DESC');
    echo json_encode($stmt->fetchAll());
    exit;
}

if (preg_match('#^/api/users/([^/]+)$#', $path, $matches) && $request_method === 'GET') {
    $username = urldecode($matches[1]);
    $stmt = $pdo->prepare('SELECT * FROM users WHERE username = ?');
    $stmt->execute([$username]);
    $user = $stmt->fetch();
    echo json_encode($user ?: null);
    exit;
}

if (preg_match('#^/api/users/search/([^/]+)$#', $path, $matches) && $request_method === 'GET') {
    $query = '%' . urldecode($matches[1]) . '%';
    $stmt = $pdo->prepare('SELECT * FROM users WHERE displayUsername LIKE ? OR firstname LIKE ? OR lastname LIKE ?');
    $stmt->execute([$query, $query, $query]);
    echo json_encode($stmt->fetchAll());
    exit;
}

if (preg_match('#^/api/chats/([^/]+)$#', $path, $matches) && $request_method === 'GET') {
    $username = urldecode($matches[1]);
    $stmt = $pdo->prepare('SELECT * FROM chats WHERE participant1 = ? OR participant2 = ? ORDER BY lastMessageTime DESC');
    $stmt->execute([$username, $username]);
    echo json_encode($stmt->fetchAll());
    exit;
}

if (preg_match('#^/api/chats/search/([^/]+)$#', $path, $matches) && $request_method === 'GET') {
    $query = '%' . urldecode($matches[1]) . '%';
    $stmt = $pdo->prepare('SELECT * FROM chats WHERE isChannel = 1 AND channelName LIKE ?');
    $stmt->execute([$query]);
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($path === '/api/chats' && $request_method === 'POST') {
    $data = getJsonInput();
    
    if (isset($data['isChannel']) && $data['isChannel']) {
        $stmt = $pdo->prepare('SELECT * FROM chats WHERE id = ?');
        $stmt->execute([$data['id']]);
        $existing = $stmt->fetch();
        
        if ($existing) {
            echo json_encode($existing);
            exit;
        }
        
        $stmt = $pdo->prepare('INSERT INTO chats (id, participant1, participant2, isChannel, channelName, createdAt) VALUES (?, ?, ?, 1, ?, NOW())');
        $stmt->execute([$data['id'], $data['participant1'], $data['participant2'], $data['channelName'] ?? null]);
        echo json_encode(['id' => $data['id'], 'participant1' => $data['participant1'], 'participant2' => $data['participant2'], 'isChannel' => true]);
        exit;
    }
    
    $stmt = $pdo->prepare('SELECT * FROM chats WHERE (participant1 = ? AND participant2 = ?) OR (participant1 = ? AND participant2 = ?)');
    $stmt->execute([$data['participant1'], $data['participant2'], $data['participant2'], $data['participant1']]);
    $existing = $stmt->fetch();
    
    if ($existing) {
        echo json_encode($existing);
        exit;
    }
    
    $chatId = 'chat_' . $data['participant1'] . '_' . $data['participant2'] . '_' . time();
    $stmt = $pdo->prepare('INSERT INTO chats (id, participant1, participant2, createdAt) VALUES (?, ?, ?, NOW())');
    $stmt->execute([$chatId, $data['participant1'], $data['participant2']]);
    echo json_encode(['id' => $chatId, 'participant1' => $data['participant1'], 'participant2' => $data['participant2']]);
    exit;
}

if (preg_match('#^/api/chats/info/([^/]+)$#', $path, $matches) && $request_method === 'GET') {
    $chatId = urldecode($matches[1]);
    $stmt = $pdo->prepare('SELECT * FROM chats WHERE id = ?');
    $stmt->execute([$chatId]);
    $chat = $stmt->fetch();
    echo json_encode($chat ?: null);
    exit;
}

if (preg_match('#^/api/messages/([^/]+)$#', $path, $matches) && $request_method === 'GET') {
    $chatId = urldecode($matches[1]);
    $stmt = $pdo->prepare('SELECT * FROM messages WHERE chatId = ? ORDER BY timestamp ASC');
    $stmt->execute([$chatId]);
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($path === '/api/messages' && $request_method === 'POST') {
    $data = getJsonInput();
    $stmt = $pdo->prepare('INSERT INTO messages (chatId, text, time, sender, timestamp, fileUrl, fileType, fileName) VALUES (?, ?, ?, ?, NOW(), ?, ?, ?)');
    $stmt->execute([
        $data['chatId'],
        $data['text'] ?? '',
        $data['time'],
        $data['sender'],
        $data['fileUrl'] ?? null,
        $data['fileType'] ?? null,
        $data['fileName'] ?? null
    ]);
    
    $messageId = $pdo->lastInsertId();
    
    $stmt = $pdo->prepare('UPDATE chats SET lastMessage = ?, lastMessageTime = ? WHERE id = ?');
    $stmt->execute([$data['text'] ?? 'Файл', $data['timestamp'], $data['chatId']]);
    
    echo json_encode(['success' => true, 'id' => $messageId]);
    exit;
}

if ($path === '/api/upload' && $request_method === 'POST') {
    if (!isset($_FILES['file'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Файл не загружен']);
        exit;
    }
    
    $file = $_FILES['file'];
    
    if ($file['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['error' => 'Ошибка загрузки файла']);
        exit;
    }
    
    if ($file['size'] > 50 * 1024 * 1024) {
        http_response_code(400);
        echo json_encode(['error' => 'Файл слишком большой']);
        exit;
    }
    
    $uploadDir = __DIR__ . '/../uploads/';
    if (!is_dir($uploadDir)) {
        @mkdir($uploadDir, 0777, true);
    }
    
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $uniqueName = uniqid() . '_' . bin2hex(random_bytes(8)) . '.' . $ext;
    $uploadPath = $uploadDir . $uniqueName;
    
    if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
        $chatId = $_POST['chatId'] ?? null;
        $sender = $_POST['sender'] ?? null;
        $time = $_POST['time'] ?? date('H:i');
        $timestamp = $_POST['timestamp'] ?? date('c');
        
        if ($chatId && $sender) {
            $stmt = $pdo->prepare('INSERT INTO messages (chatId, fileUrl, fileType, fileName, time, sender, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)');
            $stmt->execute([$chatId, '/uploads/' . $uniqueName, $file['type'], $file['name'], $time, $sender, $timestamp]);
            
            $stmt = $pdo->prepare('UPDATE chats SET lastMessage = ?, lastMessageTime = ? WHERE id = ?');
            $stmt->execute(['📎 ' . $file['name'], $timestamp, $chatId]);
        }
        
        echo json_encode([
            'success' => true,
            'fileUrl' => '/uploads/' . $uniqueName,
            'fileName' => $file['name'],
            'fileType' => $file['type']
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Не удалось сохранить файл']);
    }
    exit;
}

if ($path === '/api/favorites' && $request_method === 'POST') {
    $data = getJsonInput();
    $stmt = $pdo->prepare('INSERT INTO favorites (username, messageId, text, fileUrl, fileType, fileName, time, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([
        $data['username'],
        $data['messageId'] ?? null,
        $data['text'] ?? null,
        $data['fileUrl'] ?? null,
        $data['fileType'] ?? null,
        $data['fileName'] ?? null,
        $data['time'],
        $data['timestamp']
    ]);
    
    echo json_encode(['id' => $pdo->lastInsertId(), 'success' => true]);
    exit;
}

if (preg_match('#^/api/favorites/([^/]+)$#', $path, $matches) && $request_method === 'GET') {
    $username = urldecode($matches[1]);
    $stmt = $pdo->prepare('SELECT * FROM favorites WHERE username = ? ORDER BY timestamp DESC');
    $stmt->execute([$username]);
    echo json_encode($stmt->fetchAll());
    exit;
}

if (preg_match('#^/api/favorites/(\d+)$#', $path, $matches) && $request_method === 'DELETE') {
    $favoriteId = $matches[1];
    $stmt = $pdo->prepare('DELETE FROM favorites WHERE id = ?');
    $stmt->execute([$favoriteId]);
    echo json_encode(['success' => true]);
    exit;
}

if ($path === '/api/users/badge' && $request_method === 'POST') {
    $data = getJsonInput();
    $stmt = $pdo->prepare('UPDATE users SET badge = ? WHERE username = ?');
    $stmt->execute([$data['badge'], $data['username']]);
    echo json_encode(['success' => true]);
    exit;
}

if ($path === '/api/stars' && $request_method === 'POST') {
    $data = getJsonInput();
    $stmt = $pdo->prepare('INSERT INTO stars (username, amount) VALUES (?, ?) ON DUPLICATE KEY UPDATE amount = amount + ?');
    $stmt->execute([$data['username'], $data['amount'], $data['amount']]);
    echo json_encode(['success' => true]);
    exit;
}

if (preg_match('#^/api/stars/([^/]+)$#', $path, $matches) && $request_method === 'GET') {
    $stmt = $pdo->prepare('SELECT COALESCE(amount, 0) as stars FROM stars WHERE username = ?');
    $stmt->execute([urldecode($matches[1])]);
    $row = $stmt->fetch();
    echo json_encode(['stars' => $row ? (int)$row['stars'] : 0]);
    exit;
}

if ($path === '/api/messages/stats' && $request_method === 'GET') {
    $users = $pdo->query('SELECT COUNT(*) as c FROM users')->fetch()['c'];
    $chats = $pdo->query('SELECT COUNT(*) as c FROM chats')->fetch()['c'];
    $msgs = $pdo->query('SELECT COUNT(*) as c FROM messages')->fetch()['c'];
    echo json_encode(['users' => (int)$users, 'chats' => (int)$chats, 'messages' => (int)$msgs]);
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Not found']);
?>

CREATE TABLE IF NOT EXISTS `users` (
  `username` varchar(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `displayUsername` varchar(255) NOT NULL,
  `chatId` varchar(255) DEFAULT NULL,
  `badge` varchar(50) DEFAULT NULL,
  `avatarUrl` varchar(500) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`username`),
  UNIQUE KEY `displayUsername` (`displayUsername`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `auth_codes` (
  `username` varchar(255) NOT NULL,
  `code` varchar(10) NOT NULL,
  `chatId` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `chats` (
  `id` varchar(255) NOT NULL,
  `participant1` varchar(255) NOT NULL,
  `participant2` varchar(255) NOT NULL,
  `isChannel` tinyint(1) DEFAULT 0,
  `channelName` varchar(255) DEFAULT NULL,
  `lastMessage` text DEFAULT NULL,
  `lastMessageTime` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chatId` varchar(255) NOT NULL,
  `text` text DEFAULT NULL,
  `fileUrl` varchar(500) DEFAULT NULL,
  `fileType` varchar(100) DEFAULT NULL,
  `fileName` varchar(255) DEFAULT NULL,
  `time` varchar(10) DEFAULT NULL,
  `sender` varchar(255) NOT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `chatId` (`chatId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `favorites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `messageId` int(11) DEFAULT NULL,
  `text` text DEFAULT NULL,
  `fileUrl` varchar(500) DEFAULT NULL,
  `fileType` varchar(100) DEFAULT NULL,
  `fileName` varchar(255) DEFAULT NULL,
  `time` varchar(10) DEFAULT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `stars` (
  `username` varchar(255) NOT NULL,
  `amount` int(11) DEFAULT 0,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

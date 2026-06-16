-- ==========================================================
-- DATABASE: centralmelon_db
-- ==========================================================
-- Anda bisa mengimport file ini ke phpMyAdmin atau MySQL
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `centralmelon_db`;
USE `centralmelon_db`;

-- 1. Table: users
CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(191) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','supplier') NOT NULL DEFAULT 'supplier',
  `phone` varchar(20) DEFAULT NULL,
  `company_name` varchar(150) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Admin User (Password is 'password123' hashed with bcrypt if needed, but here is a dummy hash)
-- Since Prisma uses bcrypt, the password below is a generic bcrypt hash for 'password123'
INSERT IGNORE INTO `users` (`id`, `name`, `email`, `password`, `role`, `company_name`, `updated_at`) VALUES
('admin-001', 'Admin Central Melon', 'admin@centralmelon.com', '$2b$10$X7vW4.J.VjE5y.zZ5M5Y2Oq9s5Q5h5w5e5r5t5y5u5i5o5p', 'admin', 'Central Melon', NOW()),
('supplier-001', 'Budi Santoso', 'budi@supplier.com', '$2b$10$X7vW4.J.VjE5y.zZ5M5Y2Oq9s5Q5h5w5e5r5t5y5u5i5o5p', 'supplier', 'PT Buah Segar', NOW());


-- 2. Table: products
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `variety_type` varchar(100) NOT NULL,
  `grade` enum('AA','A','B') NOT NULL,
  `price_per_ton` decimal(12,2) NOT NULL,
  `avg_brix_min` int(11) NOT NULL,
  `avg_brix_max` int(11) NOT NULL,
  `moq_kg` int(11) NOT NULL,
  `supply_cap_ton_week` decimal(6,2) NOT NULL,
  `lead_time_days` int(11) NOT NULL,
  `status` enum('available','limited','out') NOT NULL DEFAULT 'available',
  `image_url` text,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `products` (`id`, `name`, `variety_type`, `grade`, `price_per_ton`, `avg_brix_min`, `avg_brix_max`, `moq_kg`, `supply_cap_ton_week`, `lead_time_days`, `status`, `updated_at`) VALUES
(1, 'Melon Inthanon Premium', 'Inthanon', 'AA', 15000000.00, 14, 16, 500, 10.00, 3, 'available', NOW()),
(2, 'Melon Golden Aroma', 'Golden', 'A', 12000000.00, 13, 15, 300, 15.00, 2, 'available', NOW());


-- 3. Table: rfq_requests
CREATE TABLE IF NOT EXISTS `rfq_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(191) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity_ton` decimal(8,2) NOT NULL,
  `grade_requested` varchar(10) NOT NULL,
  `notes` text,
  `status` enum('pending','quoted','accepted','rejected') NOT NULL DEFAULT 'pending',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `responded_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `rfq_requests_user_id_fkey` (`user_id`),
  KEY `rfq_requests_product_id_fkey` (`product_id`),
  CONSTRAINT `rfq_requests_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rfq_requests_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 4. Table: contracts
CREATE TABLE IF NOT EXISTS `contracts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(191) NOT NULL,
  `product_id` int(11) NOT NULL,
  `volume_ton_month` decimal(8,2) NOT NULL,
  `price_per_ton_locked` decimal(12,2) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `packaging` enum('standard','custom') NOT NULL DEFAULT 'standard',
  `custom_label_info` text,
  `status` enum('active','expired','terminated') NOT NULL DEFAULT 'active',
  `signed_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `contracts_user_id_fkey` (`user_id`),
  KEY `contracts_product_id_fkey` (`product_id`),
  CONSTRAINT `contracts_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `contracts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 5. Table: harvest_forecasts
CREATE TABLE IF NOT EXISTS `harvest_forecasts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `period_label` varchar(50) NOT NULL,
  `forecast_ton` decimal(8,2) NOT NULL,
  `actual_ton` decimal(8,2) DEFAULT NULL,
  `accuracy_pct` float DEFAULT NULL,
  `forecast_date` date NOT NULL,
  `harvest_date` date NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `harvest_forecasts_product_id_fkey` (`product_id`),
  CONSTRAINT `harvest_forecasts_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `harvest_forecasts` (`id`, `product_id`, `period_label`, `forecast_ton`, `forecast_date`, `harvest_date`, `updated_at`) VALUES
(1, 1, 'Panen Juli 2026', 20.00, '2026-06-01', '2026-07-15', NOW()),
(2, 2, 'Panen Juli 2026', 15.00, '2026-06-01', '2026-07-20', NOW());


-- 6. Table: sensor_readings
CREATE TABLE IF NOT EXISTS `sensor_readings` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `greenhouse_zone` varchar(50) NOT NULL,
  `temperature_c` float NOT NULL,
  `humidity_pct` float NOT NULL,
  `soil_moisture_pct` float NOT NULL,
  `light_intensity_lux` float NOT NULL,
  `ec_ms` float NOT NULL,
  `ph` float NOT NULL,
  `recorded_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 7. Table: contact_messages
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('new','read','replied') NOT NULL DEFAULT 'new',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- Selesai
-- ==========================================================

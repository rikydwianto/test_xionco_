/*
 Navicat Premium Data Transfer

 Source Server         : LOKAL_laragon
 Source Server Type    : MySQL
 Source Server Version : 80403 (8.4.3)
 Source Host           : localhost:3306
 Source Schema         : bmc_db

 Target Server Type    : MySQL
 Target Server Version : 80403 (8.4.3)
 File Encoding         : 65001

 Date: 18/06/2025 10:07:51
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for order_items
-- ----------------------------
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(12, 2) NOT NULL,
  `size` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `order_id`(`order_id` ASC) USING BTREE,
  INDEX `product_id`(`product_id` ASC) USING BTREE,
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 40 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of order_items
-- ----------------------------
INSERT INTO `order_items` VALUES (26, 23, 1, 2, 75000.00, 'M', '2025-06-18 09:40:10', '2025-06-18 09:40:10');
INSERT INTO `order_items` VALUES (27, 23, 5, 1, 150000.00, 'L', '2025-06-18 09:40:15', '2025-06-18 09:40:15');
INSERT INTO `order_items` VALUES (28, 24, 2, 3, 45000.00, 'S', '2025-06-18 09:45:05', '2025-06-18 09:45:05');
INSERT INTO `order_items` VALUES (29, 25, 8, 1, 250000.00, 'XL', '2025-06-18 09:50:00', '2025-06-18 09:50:00');
INSERT INTO `order_items` VALUES (30, 25, 1, 2, 75000.00, 'M', '2025-06-18 09:50:05', '2025-06-18 09:50:05');
INSERT INTO `order_items` VALUES (31, 26, 10, 4, 60000.00, 'L', '2025-06-18 09:55:10', '2025-06-18 09:55:10');
INSERT INTO `order_items` VALUES (32, 27, 5, 1, 150000.00, 'M', '2025-06-18 10:00:00', '2025-06-18 10:00:00');
INSERT INTO `order_items` VALUES (33, 28, 2, 2, 45000.00, 'S', '2025-06-18 10:05:00', '2025-06-18 10:05:00');
INSERT INTO `order_items` VALUES (34, 29, 1, 1, 75000.00, 'XL', '2025-06-18 10:10:00', '2025-06-18 10:10:00');
INSERT INTO `order_items` VALUES (35, 29, 8, 3, 250000.00, 'M', '2025-06-18 10:10:05', '2025-06-18 10:10:05');
INSERT INTO `order_items` VALUES (36, 30, 10, 1, 60000.00, 'L', '2025-06-18 10:15:00', '2025-06-18 10:15:00');
INSERT INTO `order_items` VALUES (37, 31, 2, 2, 45000.00, 'S', '2025-06-18 10:20:00', '2025-06-18 10:20:00');
INSERT INTO `order_items` VALUES (38, 32, 5, 1, 150000.00, 'M', '2025-06-18 10:25:00', '2025-06-18 10:25:00');
INSERT INTO `order_items` VALUES (39, 33, 2, 4, 8500.00, NULL, '2025-06-18 09:48:41', '2025-06-18 09:48:41');

-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_ref` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `user_id` int NOT NULL,
  `order_date` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `status_proses` enum('pending','processing','completed','cancelled','rejected','') CHARACTER SET utf32 COLLATE utf32_general_ci NULL DEFAULT 'pending',
  `shipping_address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `payment_method` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status_order` enum('pending','confirm','success','reject') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'pending',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 34 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of orders
-- ----------------------------
INSERT INTO `orders` VALUES (23, 'ORD_2025-06-18-0023', 1, '2025-06-18 09:40:00', 'processing', 'Jl. Mangga No.10, Jakarta Barat', 'credit_card', '2025-06-18 09:40:00', '2025-06-18 09:40:00', 'confirm');
INSERT INTO `orders` VALUES (24, 'ORD_2025-06-18-0024', 3, '2025-06-18 09:45:00', 'pending', 'Jl. Merpati Putih No. 5, Bogor', 'bank_transfer', '2025-06-18 09:45:00', '2025-06-18 09:45:00', 'pending');
INSERT INTO `orders` VALUES (25, 'ORD_2025-06-18-0025', 2, '2025-06-18 09:50:00', 'completed', 'Jl. Mawar Mekar Blok C2, Depok', 'gopay', '2025-06-18 09:50:00', '2025-06-18 09:50:00', 'success');
INSERT INTO `orders` VALUES (26, 'ORD_2025-06-18-0026', 4, '2025-06-18 09:55:00', 'processing', 'Apartemen Riverside Tower A, Bekasi', 'ovo', '2025-06-18 09:55:00', '2025-06-18 09:55:00', 'confirm');
INSERT INTO `orders` VALUES (27, 'ORD_2025-06-18-0027', 5, '2025-06-18 10:00:00', 'rejected', 'Komplek Griya Indah No. 8, Tangerang', 'bank_transfer', '2025-06-18 10:00:00', '2025-06-18 10:00:00', 'reject');
INSERT INTO `orders` VALUES (28, 'ORD_2025-06-18-0028', 1, '2025-06-18 10:05:00', 'completed', 'Jl. Mangga No.10, Jakarta Barat', 'credit_card', '2025-06-18 10:05:00', '2025-06-18 10:05:00', 'success');
INSERT INTO `orders` VALUES (29, 'ORD_2025-06-18-0029', 3, '2025-06-18 10:10:00', 'pending', 'Jl. Merpati Putih No. 5, Bogor', 'shopee_pay', '2025-06-18 10:10:00', '2025-06-18 10:10:00', 'pending');
INSERT INTO `orders` VALUES (30, 'ORD_2025-06-18-0030', 2, '2025-06-18 10:15:00', 'completed', 'Jl. Mawar Mekar Blok C2, Depok', 'gopay', '2025-06-18 10:15:00', '2025-06-18 09:43:42', 'success');
INSERT INTO `orders` VALUES (31, 'ORD_2025-06-18-0031', 4, '2025-06-18 10:20:00', 'cancelled', 'Apartemen Riverside Tower A, Bekasi', 'ovo', '2025-06-18 10:20:00', '2025-06-18 10:20:00', 'reject');
INSERT INTO `orders` VALUES (32, 'ORD_2025-06-18-0032', 5, '2025-06-18 10:25:00', 'completed', 'Komplek Griya Indah No. 8, Tangerang', 'bank_transfer', '2025-06-18 10:25:00', '2025-06-18 10:25:00', 'success');
INSERT INTO `orders` VALUES (33, 'ORD-1750214921112-3885', 2, '2025-06-18 09:48:41', 'pending', NULL, NULL, '2025-06-18 09:48:41', '2025-06-18 09:48:41', 'pending');

-- ----------------------------
-- Table structure for products
-- ----------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `image_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `price` decimal(12, 2) NOT NULL DEFAULT 0.00,
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `is_active` tinyint(1) NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of products
-- ----------------------------
INSERT INTO `products` VALUES (1, 'Kopi Arabika Gayo', 'Kopi khas Gayo dengan rasa kuat dan aroma khas', '/images/kopi-gayo.jpg', 48000.00, 'Minuman', 1, '2025-06-17 21:11:17', '2025-06-17 21:11:17');
INSERT INTO `products` VALUES (2, 'Teh Hijau Botol', 'Teh hijau menyegarkan dalam botol 350ml', '/images/teh-hijau.jpg', 8500.00, 'Minuman', 1, '2025-06-17 21:11:17', '2025-06-17 21:11:17');
INSERT INTO `products` VALUES (3, 'Roti Tawar Gandum', 'Roti sehat tanpa pengawet berbahan gandum utuh', '/images/roti-gandum.jpg', 23000.00, 'Makanan', 1, '2025-06-17 21:11:17', '2025-06-17 21:11:17');
INSERT INTO `products` VALUES (4, 'Susu Full Cream 1L', 'Susu sapi murni full cream tanpa pemanis tambahan', '/images/susu-fullcream.jpg', 19000.00, 'Minuman', 1, '2025-06-17 21:11:17', '2025-06-17 21:11:17');
INSERT INTO `products` VALUES (5, 'Mi Instan Pedas', 'Mi instan rasa ayam pedas level 5', '/images/mi-pedas.jpg', 3500.00, 'Makanan', 1, '2025-06-17 21:11:17', '2025-06-17 21:11:17');
INSERT INTO `products` VALUES (6, 'Air Mineral 600ml', 'Air mineral kemasan botol ukuran sedang', '/images/air-mineral.jpg', 4000.00, 'Minuman', 1, '2025-06-17 21:11:17', '2025-06-17 21:11:17');
INSERT INTO `products` VALUES (7, 'Sabun Mandi Cair', 'Sabun mandi cair aroma lavender untuk relaksasi', '/images/sabun-cair.jpg', 12000.00, 'Kebutuhan Harian', 1, '2025-06-17 21:11:17', '2025-06-17 21:11:17');
INSERT INTO `products` VALUES (8, 'Sikat Gigi Dewasa', 'Sikat gigi dengan bulu halus dan pegangan anti slip', '/images/sikat-gigi.jpg', 6500.00, 'Kebutuhan Harian', 1, '2025-06-17 21:11:17', '2025-06-17 21:11:17');
INSERT INTO `products` VALUES (9, 'Beras Premium 5kg', 'Beras kualitas premium pulen dan harum', '/images/beras-5kg.jpg', 75000.00, 'Sembako', 1, '2025-06-17 21:11:17', '2025-06-17 21:11:17');
INSERT INTO `products` VALUES (10, 'Minyak Goreng 1L', 'Minyak goreng sawit dalam botol 1 liter', '/images/minyak-1l.jpg', 17000.00, 'Sembako', 1, '2025-06-17 21:11:17', '2025-06-17 21:11:17');

-- ----------------------------
-- Table structure for stock
-- ----------------------------
DROP TABLE IF EXISTS `stock`;
CREATE TABLE `stock`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT 0,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `product_id`(`product_id` ASC) USING BTREE,
  CONSTRAINT `stock_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of stock
-- ----------------------------
INSERT INTO `stock` VALUES (1, 1, 20, '2025-06-18 08:47:52');
INSERT INTO `stock` VALUES (2, 2, 20, '2025-06-18 08:47:56');
INSERT INTO `stock` VALUES (3, 3, 10, '2025-06-18 08:48:00');
INSERT INTO `stock` VALUES (4, 4, 30, '2025-06-18 08:48:04');
INSERT INTO `stock` VALUES (5, 5, 56, '2025-06-18 08:48:08');
INSERT INTO `stock` VALUES (6, 6, 2, '2025-06-18 08:48:17');
INSERT INTO `stock` VALUES (7, 7, 53, '2025-06-18 08:48:13');
INSERT INTO `stock` VALUES (8, 8, 20, '2025-06-18 08:48:21');
INSERT INTO `stock` VALUES (9, 9, 120, '2025-06-18 08:48:25');
INSERT INTO `stock` VALUES (10, 10, 12, '2025-06-18 08:48:29');

-- ----------------------------
-- Table structure for stock_logs
-- ----------------------------
DROP TABLE IF EXISTS `stock_logs`;
CREATE TABLE `stock_logs`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `change_type` enum('IN','OUT') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `quantity` int NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `product_id`(`product_id` ASC) USING BTREE,
  CONSTRAINT `stock_logs_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of stock_logs
-- ----------------------------
INSERT INTO `stock_logs` VALUES (3, 1, 'IN', 20, 'Perubahan stok dari 0 menjadi 20', '2025-06-18 08:47:52');
INSERT INTO `stock_logs` VALUES (4, 2, 'IN', 20, 'Perubahan stok dari 0 menjadi 20', '2025-06-18 08:47:56');
INSERT INTO `stock_logs` VALUES (5, 3, 'IN', 10, 'Perubahan stok dari 0 menjadi 10', '2025-06-18 08:48:00');
INSERT INTO `stock_logs` VALUES (6, 4, 'IN', 30, 'Perubahan stok dari 0 menjadi 30', '2025-06-18 08:48:04');
INSERT INTO `stock_logs` VALUES (7, 5, 'IN', 56, 'Perubahan stok dari 0 menjadi 56', '2025-06-18 08:48:08');
INSERT INTO `stock_logs` VALUES (8, 7, 'IN', 53, 'Perubahan stok dari 0 menjadi 53', '2025-06-18 08:48:13');
INSERT INTO `stock_logs` VALUES (9, 6, 'IN', 2, 'Perubahan stok dari 0 menjadi 2', '2025-06-18 08:48:17');
INSERT INTO `stock_logs` VALUES (10, 8, 'IN', 20, 'Perubahan stok dari 0 menjadi 20', '2025-06-18 08:48:21');
INSERT INTO `stock_logs` VALUES (11, 9, 'IN', 120, 'Perubahan stok dari 0 menjadi 120', '2025-06-18 08:48:25');
INSERT INTO `stock_logs` VALUES (12, 10, 'IN', 12, 'Perubahan stok dari 0 menjadi 12', '2025-06-18 08:48:29');
INSERT INTO `stock_logs` VALUES (13, 10, 'OUT', 1, 'Order selesai: ID Order 30, item: 10', '2025-06-18 09:43:42');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `full_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `role` enum('admin','user') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'user',
  `status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'admin', 'Admin', 'admin@mail.com', 'gaktau', 'admin', 'active', '2025-06-17 22:23:13', '2025-06-17 22:23:13');
INSERT INTO `users` VALUES (2, 'cust', 'Customer', 'cust@mail.copm', 'gaktau', 'user', 'active', '2025-06-17 22:33:59', '2025-06-17 22:33:59');
INSERT INTO `users` VALUES (3, 'jane_doe', 'Jane Doe', 'jane.doe@example.com', 'hashed_password_jane', 'user', 'active', '2025-06-18 09:34:00', '2025-06-18 09:34:00');
INSERT INTO `users` VALUES (4, 'admin_user', 'Admin Siaga', 'admin.siaga@example.com', 'hashed_password_admin', 'admin', 'active', '2025-06-18 09:34:05', '2025-06-18 09:34:05');
INSERT INTO `users` VALUES (5, 'budi_santoso', 'Budi Santoso', 'budi.santoso@example.com', 'hashed_password_budi', 'user', 'active', '2025-06-18 09:34:10', '2025-06-18 09:34:10');
INSERT INTO `users` VALUES (6, 'siti_zahra', 'Siti Zahra', 'siti.zahra@example.com', 'hashed_password_siti', 'user', 'active', '2025-06-18 09:34:15', '2025-06-18 09:34:15');
INSERT INTO `users` VALUES (7, 'eko_prabowo', 'Eko Prabowo', 'eko.prabowo@example.com', 'hashed_password_eko', 'user', 'active', '2025-06-18 09:34:20', '2025-06-18 09:34:20');

SET FOREIGN_KEY_CHECKS = 1;

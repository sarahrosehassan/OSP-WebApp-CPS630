-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 04, 2025 at 12:58 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `osp`
--

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `item_id` int(11) NOT NULL,
  `item_name` varchar(100) NOT NULL,
  `item_image` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `made_in` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`item_id`, `item_name`, `item_image`, `price`, `made_in`, `created_at`) VALUES
(1, 'Louis Vuitton Neverfull', 'bag1.jpg', 2490.00, 'France', '2025-03-02 16:44:10'),
(2, 'Chanel Classic Flap Bag', 'bag2.jpg', 8800.00, 'France', '2025-03-02 16:44:10'),
(3, 'Hermes Birkin 30', 'bag3.jpg', 15900.00, 'France', '2025-03-02 16:44:10'),
(4, 'Gucci Dionysus', 'bag4.jpg', 2890.00, 'Italy', '2025-03-02 16:44:10'),
(5, 'Prada Galleria Bag', 'bag5.jpg', 3450.00, 'Italy', '2025-03-02 16:44:10'),
(6, 'Dior Lady Bag', 'bag6.jpg', 5900.00, 'France', '2025-03-02 16:44:10'),
(7, 'Fendi Baguette', 'bag7.jpg', 3790.00, 'Italy', '2025-03-02 16:44:10'),
(8, 'Bottega Veneta Pouch', 'bag8.jpg', 3500.00, 'Italy', '2025-03-02 16:44:10');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `trip_id` int(11) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `payment_code` varchar(100) NOT NULL,
  `order_status` enum('Pending','Processing','Shipped','Delivered') DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `trip_id`, `total_price`, `payment_code`, `order_status`, `created_at`) VALUES
(1, 3, 1, 133317.40, '5fftf', 'Pending', '2025-03-02 20:38:01'),
(2, 3, 1, 0.00, '5fftf', 'Pending', '2025-03-02 20:39:15'),
(3, 3, 1, 0.00, 'ed', 'Pending', '2025-03-02 20:39:51'),
(4, 7, 3, 10565.50, 'wx', 'Pending', '2025-03-02 22:16:07'),
(5, 3, 1, 58217.60, '2453', 'Pending', '2025-03-03 23:15:12');

-- --------------------------------------------------------

--
-- Table structure for table `shopping_cart`
--

CREATE TABLE `shopping_cart` (
  `cart_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shopping_cart`
--

INSERT INTO `shopping_cart` (`cart_id`, `user_id`, `item_id`, `quantity`, `price`, `created_at`) VALUES
(10, 5, 5, 1, 3450.00, '2025-03-02 21:50:18'),
(11, 5, 4, 1, 2890.00, '2025-03-02 21:50:23'),
(12, 5, 3, 1, 15900.00, '2025-03-02 21:57:34'),
(15, 7, 2, 1, 8800.00, '2025-03-03 03:28:05'),
(16, 7, 3, 1, 15900.00, '2025-03-03 03:28:08');

-- --------------------------------------------------------

--
-- Table structure for table `trip`
--

CREATE TABLE `trip` (
  `trip_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `truck_id` int(11) NOT NULL,
  `source_address` text NOT NULL,
  `destination_address` text NOT NULL,
  `distance` decimal(10,2) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trip`
--

INSERT INTO `trip` (`trip_id`, `user_id`, `truck_id`, `source_address`, `destination_address`, `distance`, `price`, `created_at`) VALUES
(1, 3, 3, 'Toronto', 'Toronto Pearson International Airport (YYZ), Silver Dart Drive, Mississauga, ON, Canada', 27.04, 40.00, '2025-03-02 16:44:59'),
(2, 5, 2, 'Brampton', '225 Simcoe Street, Toronto, ON, Canada', 45.14, 40.00, '2025-03-02 22:08:45'),
(3, 7, 2, 'Toronto', '225 Simcoe Street, Toronto, ON, Canada', 1.03, 0.00, '2025-03-02 22:15:46');

-- --------------------------------------------------------

--
-- Table structure for table `truck`
--

CREATE TABLE `truck` (
  `truck_id` int(11) NOT NULL,
  `truck_code` varchar(50) NOT NULL,
  `availability_code` enum('Available','In Use','Maintenance') DEFAULT 'Available',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `truck`
--

INSERT INTO `truck` (`truck_id`, `truck_code`, `availability_code`, `created_at`) VALUES
(1, 'TRK001', 'Available', '2025-03-02 16:44:10'),
(2, 'TRK002', 'Available', '2025-03-02 16:44:10'),
(3, 'TRK003', 'Available', '2025-03-02 16:44:10'),
(4, 'TRK004', 'Maintenance', '2025-03-02 16:44:10'),
(5, 'TRK005', 'In Use', '2025-03-02 16:44:10');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` text NOT NULL,
  `city_code` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `name`, `email`, `password`, `phone`, `address`, `city_code`, `created_at`) VALUES
(1, 'John Doe', 'john@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '123-456-7890', '123 Main St', 'Toronto', '2025-03-02 15:24:15'),
(2, 'Jane Smith', 'jane@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '987-654-3210', '456 Oak Ave', 'Oshawa', '2025-03-02 15:24:15'),
(3, 'rijul', 'rijul@gmail.com', '$2y$10$D2TSOqHiSYMxs4pMSNZkh.j5cS0XJQj52hRyeNuzyHNAUG8tB6EAW', '24242142342', 'tmu', 'm4l1z6', '2025-03-02 15:24:25'),
(4, 'tony', 'tony@gmail.com', '$2y$10$ixH8UCKiC5a1otuA27rPp.6VB3p8XhN4GidZ8uwK8/0UQSg/r66pi', '6999999999', '69 bramptom', 'm56lrn', '2025-03-02 18:14:41'),
(5, 'ram', 'ram@gmail.com', '$2y$10$NVlsx8vzV89yJ6hyuTWVOOEi7hnr1u.21FCvDYoMc0OUGoGP/SJ8.', '1344rre', 'd334', '1s3', '2025-03-02 21:49:46'),
(6, 'sham', 'sham@gamil.com', '$2y$10$gWBzF3wvhyU1rf04PzslaeTV3DUGO1rM8s2QdBzprEVF0R2rk7ZjG', '1245544', 'wedwc', 'cwecf', '2025-03-02 22:13:58'),
(7, 'rick', 'rick@gmail.com', '$2y$10$bq.r7.BlHlVBdw8aHg6X4eDQWSyZ565eIk.V1hC1b/8/zdnUk8dBC', '1235643', '2ed3fd', '23d32c', '2025-03-02 22:15:04'),
(8, 'new', 'new@gmail.com', '$2y$10$chvbY4RJBiRLc86akqDCJemCKf9FrxRedpPqF//xmGeJF3TyZ.e4O', '123456789', 'new ', '123new', '2025-03-03 23:46:06');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`item_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `trip_id` (`trip_id`);

--
-- Indexes for table `shopping_cart`
--
ALTER TABLE `shopping_cart`
  ADD PRIMARY KEY (`cart_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indexes for table `trip`
--
ALTER TABLE `trip`
  ADD PRIMARY KEY (`trip_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `truck_id` (`truck_id`);

--
-- Indexes for table `truck`
--
ALTER TABLE `truck`
  ADD PRIMARY KEY (`truck_id`),
  ADD UNIQUE KEY `truck_code` (`truck_code`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `shopping_cart`
--
ALTER TABLE `shopping_cart`
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `trip`
--
ALTER TABLE `trip`
  MODIFY `trip_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `truck`
--
ALTER TABLE `truck`
  MODIFY `truck_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`trip_id`) REFERENCES `trip` (`trip_id`);

--
-- Constraints for table `shopping_cart`
--
ALTER TABLE `shopping_cart`
  ADD CONSTRAINT `shopping_cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `shopping_cart_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`);

--
-- Constraints for table `trip`
--
ALTER TABLE `trip`
  ADD CONSTRAINT `trip_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `trip_ibfk_2` FOREIGN KEY (`truck_id`) REFERENCES `truck` (`truck_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

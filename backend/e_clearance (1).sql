-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 18, 2025 at 12:26 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `e_clearance`
--

-- --------------------------------------------------------

--
-- Table structure for table `clearances`
--

CREATE TABLE `clearances` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `type` enum('Sanitary','Barangay','Business') NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `purpose` varchar(255) DEFAULT NULL,
  `business_name` varchar(255) DEFAULT NULL,
  `business_owner` varchar(255) DEFAULT NULL,
  `business_nature` varchar(255) DEFAULT NULL,
  `pickup_date` date NOT NULL,
  `requested_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('Pending','Processing','For Pickup','Released','Approved','Denied') DEFAULT 'Pending',
  `gender` varchar(10) DEFAULT NULL,
  `purok` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clearances`
--

INSERT INTO `clearances` (`id`, `user_id`, `type`, `full_name`, `purpose`, `business_name`, `business_owner`, `business_nature`, `pickup_date`, `requested_at`, `status`, `gender`, `purok`) VALUES
(1, 2, 'Sanitary', 'Jun Gil Casquejo', 'Health Check', NULL, NULL, NULL, '2025-10-20', '2025-10-16 15:42:02', 'Pending', NULL, NULL),
(2, 2, 'Business', NULL, NULL, 'Jun\'s Cafe', 'Jun Gil Casquejo', 'Food & Beverages', '2025-10-22', '2025-10-16 15:43:31', 'Pending', NULL, NULL),
(3, 2, 'Barangay', 'Jun Gil Casquejo', 'For Ayuda', NULL, NULL, NULL, '2025-10-16', '2025-10-16 15:51:53', 'Pending', NULL, NULL),
(4, 2, 'Sanitary', 'Honey Kate Padilla', 'For Job Application', NULL, NULL, NULL, '2025-10-17', '2025-10-16 15:53:25', 'Pending', NULL, NULL),
(5, 2, 'Business', NULL, NULL, 'Renz ComShop', 'Renz Kayle Ando', 'Computer Shop Parts', '2025-10-18', '2025-10-16 15:55:36', 'Processing', NULL, NULL),
(6, 3, 'Barangay', 'Romnick Premacio', 'For Work', NULL, NULL, NULL, '2025-10-16', '2025-10-16 18:18:33', 'Pending', NULL, NULL),
(7, 3, 'Sanitary', 'Renz Abando', 'Food Business', NULL, NULL, NULL, '2025-10-16', '2025-10-16 18:29:06', 'Pending', NULL, NULL),
(8, 3, 'Business', NULL, NULL, 'Inday\'s Flower Shop', 'Maloi Recalde', 'Flower Shop', '2025-10-17', '2025-10-16 19:01:49', 'Processing', NULL, NULL),
(9, 3, 'Barangay', 'Jose Rizal', 'Scholarship', NULL, NULL, NULL, '2025-10-16', '2025-10-16 20:11:44', 'Pending', NULL, NULL),
(10, 3, 'Sanitary', 'Maria Labo', 'Laundry Shop', NULL, NULL, NULL, '2025-10-16', '2025-10-16 20:12:16', 'Pending', NULL, NULL),
(11, 3, 'Sanitary', 'Dexter Casquejo', 'Com Shop', NULL, NULL, NULL, '2025-10-16', '2025-10-16 20:15:00', 'Pending', NULL, NULL),
(12, 3, 'Business', NULL, NULL, 'Janes Retail Shop', 'Jane Doe', 'General Retail', '2025-10-24', '2025-10-16 20:22:20', 'Pending', NULL, NULL),
(13, 3, 'Barangay', 'Lebron James', 'For School', NULL, NULL, NULL, '2025-10-16', '2025-10-16 20:27:06', 'Processing', NULL, NULL),
(15, 2, 'Barangay', 'Jun Gil Casquejo', 'Wara', NULL, NULL, NULL, '2025-10-18', '2025-10-16 21:03:41', 'For Pickup', NULL, NULL),
(25, 3, 'Barangay', 'Maria Labo', 'For Job', NULL, NULL, NULL, '2025-10-17', '2025-10-17 04:09:40', 'Pending', 'Female', 'Sili'),
(28, 4, 'Barangay', 'Renz Ando', 'waragud', NULL, NULL, NULL, '2025-10-20', '2025-10-17 06:42:12', 'Processing', NULL, NULL),
(29, 4, 'Business', NULL, NULL, 'Shabu-shabu', 'Renz Kayle Ando', 'Foods ', '2025-10-24', '2025-10-17 08:32:39', 'Pending', NULL, NULL),
(30, 4, 'Business', NULL, NULL, 'Shabu-shabu', 'Renz Kayle Ando', 'Foods ', '2025-10-24', '2025-10-17 08:34:16', 'Pending', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `officials`
--

CREATE TABLE `officials` (
  `id` int(11) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `chairmanship` varchar(255) DEFAULT NULL,
  `position` varchar(255) NOT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `officials`
--

INSERT INTO `officials` (`id`, `fullname`, `chairmanship`, `position`, `status`, `created_at`) VALUES
(1, 'Steping Curry', 'Committee on Sport', 'Konsehal', 'Active', '2025-10-16 17:42:34'),
(2, 'Celine Dayday', 'N/A', 'Chairman', 'Active', '2025-10-16 17:43:27');

-- --------------------------------------------------------

--
-- Table structure for table `residents`
--

CREATE TABLE `residents` (
  `id` int(11) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `age` int(11) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `status` varchar(50) NOT NULL,
  `purok` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `residents`
--

INSERT INTO `residents` (`id`, `fullname`, `age`, `gender`, `status`, `purok`) VALUES
(1, 'Ivon Pacaldo Aro', 25, 'Male', 'Single', 'Nangka'),
(2, 'Jose Marie Chan', 70, 'Male', 'Married', 'Mansanitas'),
(3, 'Stephen Curry', 45, 'Male', 'Married', 'Sambag');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `civil_status` varchar(50) DEFAULT NULL,
  `purok` varchar(100) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `valid_id` varchar(255) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_type` enum('admin','user') NOT NULL DEFAULT 'user',
  `status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_exp` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `middle_name`, `last_name`, `age`, `gender`, `civil_status`, `purok`, `address`, `email`, `valid_id`, `username`, `password`, `created_at`, `user_type`, `status`, `reset_token`, `reset_token_exp`) VALUES
(2, 'Jun Gil', 'Mananquil', 'Casquejo', 21, 'Male', 'Single', 'Nangka', 'Bang Bang Cordova Cebu', 'jungilcasquejo5@gmail.com', '1760631269894.jpg', 'jungil', '$2b$10$jM7HkQo528/CNKAj7sY/O.29AWd6pSHgo7CKFKa4D94GDuNEmYi0u', '2025-10-16 14:40:35', 'user', 'Approved', NULL, NULL),
(3, 'Juan ', 'Mautganon', 'De La Cruz', 21, 'Male', 'Single', 'Mansanitas', 'Bang Bang Cordova Cebu', 'juan@gmail.com', '1760631413281.jpg', 'admin', '$2b$10$ce.uCXHYtQnUXkcLb413l.a.43/uzRr5tAts2EocIX8x.aok5zsHW', '2025-10-16 16:16:53', 'admin', 'Approved', NULL, NULL),
(4, 'Renz', 'Kayle', 'Ando', 25, 'Male', 'Single', 'Bayabas', 'Bang-bang', 'renz@gmail.com', '1760682249525.jpg', 'renz', '$2b$10$X7ZwH9gd6tdup/SyTgjP2uI0/7eYiX24sVA81bbGSCFCMO2Hw6ZBa', '2025-10-17 06:24:09', 'user', 'Approved', NULL, NULL),
(5, 'Don Don', 'Borres ', 'Casquejo', 45, 'Male', 'Married', 'Sikwati', 'Bang bang', 'dondonborres1@gmail.com', '1760690309028.jpg', 'dondon', '$2b$10$/.w/u7ZJL1Lqfy5qcia2auhMS4aRJEc.cjmZm.lV/YJhYLW88mmpS', '2025-10-17 08:38:29', 'user', 'Approved', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `clearances`
--
ALTER TABLE `clearances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `officials`
--
ALTER TABLE `officials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `residents`
--
ALTER TABLE `residents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `clearances`
--
ALTER TABLE `clearances`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `officials`
--
ALTER TABLE `officials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `residents`
--
ALTER TABLE `residents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `clearances`
--
ALTER TABLE `clearances`
  ADD CONSTRAINT `clearances_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

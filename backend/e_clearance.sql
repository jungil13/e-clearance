-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 16, 2025 at 08:07 PM
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
  `user_id` int(11) NOT NULL,
  `type` enum('Sanitary','Barangay','Business') NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `purpose` varchar(255) DEFAULT NULL,
  `business_name` varchar(255) DEFAULT NULL,
  `business_owner` varchar(255) DEFAULT NULL,
  `business_nature` varchar(255) DEFAULT NULL,
  `pickup_date` date NOT NULL,
  `requested_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('Pending','Processing','For Pickup','Released','Approved','Denied') DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clearances`
--

INSERT INTO `clearances` (`id`, `user_id`, `type`, `full_name`, `purpose`, `business_name`, `business_owner`, `business_nature`, `pickup_date`, `requested_at`, `status`) VALUES
(1, 2, 'Sanitary', 'Jun Gil Casquejo', 'Health Check', NULL, NULL, NULL, '2025-10-20', '2025-10-16 15:42:02', 'Pending'),
(2, 2, 'Business', NULL, NULL, 'Jun\'s Cafe', 'Jun Gil Casquejo', 'Food & Beverages', '2025-10-22', '2025-10-16 15:43:31', 'Pending'),
(3, 2, 'Barangay', 'Jun Gil Casquejo', 'For Ayuda', NULL, NULL, NULL, '2025-10-16', '2025-10-16 15:51:53', 'Pending'),
(4, 2, 'Sanitary', 'Honey Kate Padilla', 'For Job Application', NULL, NULL, NULL, '2025-10-17', '2025-10-16 15:53:25', 'Pending'),
(5, 2, 'Business', NULL, NULL, 'Renz ComShop', 'Renz Kayle Ando', 'Computer Shop Parts', '2025-10-18', '2025-10-16 15:55:36', 'Pending');

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
  `status` enum('Pending','Approved','Rejected') DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `middle_name`, `last_name`, `age`, `gender`, `civil_status`, `purok`, `address`, `email`, `valid_id`, `username`, `password`, `created_at`, `user_type`, `status`) VALUES
(2, 'Jun Gil', 'Mananquil', 'Casquejo', 21, 'Male', 'Single', 'Nangka', 'Bang Bang Cordova Cebu', 'jungilcasquejo5@gmail.com', '1760631269894.jpg', 'jungil', '$2b$10$YSHUyyY4rfzTIzer/FrA8OVRNdvCESiCjpBpPQ.cBRsrzZrCsbFEi', '2025-10-16 14:40:35', 'user', 'Approved'),
(3, 'Juan ', 'Mautganon', 'De La Cruz', 21, 'Male', 'Single', 'Tmbis', 'Bang Bang Cordova Cebu', 'juan@gmail.com', '1760631413281.jpg', 'admin', '$2b$10$ce.uCXHYtQnUXkcLb413l.a.43/uzRr5tAts2EocIX8x.aok5zsHW', '2025-10-16 16:16:53', 'admin', 'Approved');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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

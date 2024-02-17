-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 17, 2024 at 09:00 AM
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
-- Database: `hoteldb`
--

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `id` varchar(191) NOT NULL,
  `bookerName` varchar(191) NOT NULL,
  `bookerEmail` varchar(191) NOT NULL,
  `bookingDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `checkInDate` datetime(3) NOT NULL,
  `checkOutDate` datetime(3) NOT NULL,
  `guestName` varchar(191) NOT NULL,
  `totalRooms` int(11) NOT NULL,
  `bookingStatus` enum('new','checkIn','checkOut') NOT NULL DEFAULT 'new',
  `roomTypeId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bookingdetail`
--

CREATE TABLE `bookingdetail` (
  `id` varchar(191) NOT NULL,
  `bookingId` varchar(191) NOT NULL,
  `roomId` varchar(191) NOT NULL,
  `accessDate` datetime(3) NOT NULL,
  `price` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `room`
--

CREATE TABLE `room` (
  `id` varchar(191) NOT NULL,
  `number` int(11) NOT NULL,
  `roomTypeId` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `room`
--

INSERT INTO `room` (`id`, `number`, `roomTypeId`) VALUES
('clps1ogr00003dex0xswgje54', 101, 'clpmews8e000095i0vxy4utyu'),
('clps1ok150005dex0ujgiuh4l', 102, 'clpmews8e000095i0vxy4utyu'),
('clps1omuu0007dex0nrn2umyu', 103, 'clpmews8e000095i0vxy4utyu'),
('clps1opst0009dex0cgjdsuge', 104, 'clpmews8e000095i0vxy4utyu'),
('clps1ot6k000bdex0qhovwmvd', 105, 'clpmews8e000095i0vxy4utyu'),
('clps1p9bm000ddex03dzw7we5', 201, 'clpmex9p3000195i0s4cw4t13'),
('clps1pd1k000fdex0dlht8oeo', 202, 'clpmex9p3000195i0s4cw4t13'),
('clps1pfu3000hdex0vajkj15i', 203, 'clpmex9p3000195i0s4cw4t13'),
('clps1piiv000jdex00nhxdc36', 204, 'clpmex9p3000195i0s4cw4t13'),
('clps1pm4j000ldex013sdojwc', 205, 'clpmex9p3000195i0s4cw4t13'),
('clps1q2mm000ndex0phnkl4rg', 301, 'clpmexppx000295i0vdj77o4u'),
('clps1q5nw000pdex0ehla9pw4', 302, 'clpmexppx000295i0vdj77o4u'),
('clps1q8sv000rdex0arrdjbrl', 303, 'clpmexppx000295i0vdj77o4u'),
('clps1qbj4000tdex0kudhlp8j', 304, 'clpmexppx000295i0vdj77o4u'),
('clps1qeee000vdex07y2azt8u', 305, 'clpmexppx000295i0vdj77o4u'),
('clps1qs1l000xdex065iaicy7', 401, 'clpmey9yx000395i0umzuv0y1'),
('clps1qv0g000zdex0oiauoqd5', 402, 'clpmey9yx000395i0umzuv0y1'),
('clps1qy8l0011dex0lg9w8r82', 403, 'clpmey9yx000395i0umzuv0y1'),
('clps1r0qn0013dex0yidgekab', 404, 'clpmey9yx000395i0umzuv0y1'),
('clps1r3ly0015dex0vm6rp4s9', 405, 'clpmey9yx000395i0umzuv0y1');

-- --------------------------------------------------------

--
-- Table structure for table `roomtype`
--

CREATE TABLE `roomtype` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `price` varchar(191) NOT NULL,
  `desc` longtext NOT NULL,
  `image` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roomtype`
--

INSERT INTO `roomtype` (`id`, `name`, `price`, `desc`, `image`) VALUES
('clpmews8e000095i0vxy4utyu', 'Standard', '300000', 'Standard Room', 'http://localhost:8080/standard-1701422304475.jpg'),
('clpmex9p3000195i0s4cw4t13', 'Deluxe', '400000', 'Deluxe Room', 'http://localhost:8080/deluxe-1701422327122.jpeg'),
('clpmexppx000295i0vdj77o4u', 'Family', '500000', 'Family Room', 'http://localhost:8080/family-1701422347890.jpeg'),
('clpmey9yx000395i0umzuv0y1', 'Suite', '600000', 'Suite Room', 'http://localhost:8080/suite-1701422374133.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` varchar(191) NOT NULL,
  `username` varchar(191) NOT NULL,
  `photo` text NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `role` enum('user','admin','receptionist') NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `photo`, `email`, `password`, `role`) VALUES
('clspmgwys0000ixhy5dcysczw', 'Admin', 'http://localhost:8080/anastasiia-chaikovska-1708146746441.jpg', 'admin@gmail.com', '$2a$08$5ioyqIkmhmj.C7cbJHu5M.EODF5vakcnrYuVd1EeBkc32tnVusruq', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Booking_roomTypeId_fkey` (`roomTypeId`),
  ADD KEY `Booking_userId_fkey` (`userId`);

--
-- Indexes for table `bookingdetail`
--
ALTER TABLE `bookingdetail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `BookingDetail_roomId_fkey` (`roomId`);

--
-- Indexes for table `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Room_roomTypeId_fkey` (`roomTypeId`);

--
-- Indexes for table `roomtype`
--
ALTER TABLE `roomtype`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_username_key` (`username`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `booking`
--
ALTER TABLE `booking`
  ADD CONSTRAINT `Booking_roomTypeId_fkey` FOREIGN KEY (`roomTypeId`) REFERENCES `roomtype` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Booking_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `bookingdetail`
--
ALTER TABLE `bookingdetail`
  ADD CONSTRAINT `BookingDetail_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `room` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `room`
--
ALTER TABLE `room`
  ADD CONSTRAINT `Room_roomTypeId_fkey` FOREIGN KEY (`roomTypeId`) REFERENCES `roomtype` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

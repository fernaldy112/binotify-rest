-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: db:3306
-- Generation Time: Dec 02, 2022 at 12:36 AM
-- Server version: 8.0.31
-- PHP Version: 8.0.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db`
--

-- --------------------------------------------------------

--
-- Table structure for table `song`
--

CREATE TABLE `song` (
  `song_id` bigint UNSIGNED NOT NULL,
  `judul` char(64) NOT NULL,
  `penyanyi_id` bigint UNSIGNED NOT NULL,
  `audio_path` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `song`
--

INSERT INTO `song` (`song_id`, `judul`, `penyanyi_id`, `audio_path`) VALUES
(1, 'Kali Kedua', 2, 'Raisa - Kali Kedua (Official Music Video)-1669909230155.mp3'),
(2, 'Anganku-Anganmu', 2, 'Raisa - Anganku Anganmu-1669909486694.mp3'),
(3, 'Mantan Terindah', 2, 'Raisa - Mantan Terindah-1669909509491.mp3'),
(4, '1000 Tahun Lamanya', 4, 'TULUS - 1000 Tahun Lamanya-1669909563383.mp3'),
(5, 'Gajah', 4, 'TULUS - Gajah-1669909580571.mp3'),
(6, 'Manusia Kuat', 4, 'TULUS - Manusia Kuat-1669909591095.mp3'),
(7, 'Monokrom', 4, 'TULUS - Monokrom-1669909605378.mp3'),
(8, 'Sepatu', 4, 'TULUS - Sepatu-1669909618031.mp3'),
(9, 'Matahariku', 5, 'Agnes Monica - Matahariku-1669909820054.mp3'),
(10, 'Rindu', 5, 'Agnes Monica - Rindu-1669909830882.mp3'),
(11, 'Tak Ada Logika', 5, 'Agnes Monica - Tak Ada Logika-1669909846127.mp3'),
(12, 'Hati-Hati di Jalan', 4, 'TULUS - Hati-Hati di Jalan-1669910124133.mp3');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` bigint UNSIGNED NOT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL,
  `username` text NOT NULL,
  `name` text NOT NULL,
  `isAdmin` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `email`, `password`, `username`, `name`, `isAdmin`) VALUES
(1, 'example@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', 'example', 'exampleName', 0),
(2, 'raisa@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', 'raisa_cantik', 'Raisa', 0),
(4, 'tulus@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', 'tulus_banget', 'TULUS', 0),
(5, 'agnes@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', 'agnezmo', 'Agnes Monica', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `song`
--
ALTER TABLE `song`
  ADD PRIMARY KEY (`song_id`),
  ADD UNIQUE KEY `song_id` (`song_id`),
  ADD UNIQUE KEY `song_id_2` (`song_id`),
  ADD KEY `penyanyi_id` (`penyanyi_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `song`
--
ALTER TABLE `song`
  MODIFY `song_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `song`
--
ALTER TABLE `song`
  ADD CONSTRAINT `lagu_penyanyi` FOREIGN KEY (`penyanyi_id`) REFERENCES `user` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

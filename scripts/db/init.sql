-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: db:3306
-- Generation Time: Nov 19, 2022 at 05:55 AM
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
-- Table structure for table `Song`
--

CREATE TABLE `song` (`song_id` int NOT NULL,
                                   `judul` char(64) NOT NULL,
                                                    `penyanyi_id` int NOT NULL,
                                                                      `audio_path` text NOT NULL) ENGINE=InnoDB DEFAULT
CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------
 --
-- Table structure for table `User`
--

CREATE TABLE `user` (`user_id` int NOT NULL,
                                   `email` text NOT NULL,
                                                `password` text NOT NULL,
                                                                `username` text NOT NULL,
                                                                                `name` text NOT NULL,
                                                                                            `isAdmin` tinyint(1) NOT NULL) ENGINE=InnoDB DEFAULT
CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--
 --
-- Indexes for table `Song`
--

ALTER TABLE `song` ADD PRIMARY KEY (`song_id`);

--
-- Indexes for table `User`
--

ALTER TABLE `user` ADD PRIMARY KEY (`user_id`);


COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;

/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


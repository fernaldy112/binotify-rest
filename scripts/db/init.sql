
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


CREATE TABLE `song` (`song_id` bigint UNSIGNED NOT NULL,
                                               `judul` char(64) NOT NULL,
                                                                `penyanyi_id` int NOT NULL,
                                                                                  `audio_path` text NOT NULL) ENGINE=InnoDB DEFAULT
CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (`user_id` bigint UNSIGNED NOT NULL,
                                               `email` text NOT NULL,
                                                            `password` text NOT NULL,
                                                                            `username` text NOT NULL,
                                                                                            `name` text NOT NULL,
                                                                                                        `isAdmin` tinyint(1) NOT NULL) ENGINE=InnoDB DEFAULT
CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


ALTER TABLE `song` ADD PRIMARY KEY (`song_id`), ADD UNIQUE KEY `song_id` (`song_id`),
                                                               ADD UNIQUE KEY `song_id_2` (`song_id`);


ALTER TABLE `user` ADD PRIMARY KEY (`user_id`), ADD UNIQUE KEY `user_id` (`user_id`);


ALTER TABLE `song` MODIFY `song_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;


ALTER TABLE `user` MODIFY `user_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;


COMMIT;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: facebook_db
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `profiles`
--

DROP TABLE IF EXISTS `profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profiles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `register_id` int DEFAULT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `birthday` date NOT NULL,
  `address` varchar(100) DEFAULT NULL,
  `school` varchar(100) DEFAULT NULL,
  `biography` text,
  `relationshipstatus` enum('Not in a Relationship','In a Relationship','Married') DEFAULT NULL,
  `username` varchar(20) DEFAULT NULL,
  `occupation` varchar(45) DEFAULT NULL,
  `sex` enum('M','F','Other') DEFAULT NULL,
  `userimages` mediumtext,
  `userposts` json DEFAULT NULL,
  `friends` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`email`),
  UNIQUE KEY `username_2` (`email`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  KEY `register_id` (`register_id`),
  CONSTRAINT `profiles_ibfk_1` FOREIGN KEY (`register_id`) REFERENCES `register` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profiles`
--

LOCK TABLES `profiles` WRITE;
/*!40000 ALTER TABLE `profiles` DISABLE KEYS */;
INSERT INTO `profiles` VALUES (69,85,'מתן','חיימוב','matanhaimov@gmail.com','2004-03-04','אהרון בוגנים 10, רמלה','אורט לילינטל','אוהב לתכנת בזמני הפנוי ולנגן בגיטרה','Not in a Relationship','matanhaimov2','צה\"ל','M','https://i.ibb.co/CMjBqd6/matan.jpg','[\"{\\\"Text\\\": \\\"DO NOT DRINK AND GO TO THE BUS\\\", \\\"Image\\\": \\\"https://i.ibb.co/BwsfLmY/Whats-App-Image-2023-12-03-at-13-17-00.jpg\\\", \\\"Privacy\\\": \\\"only me\\\", \\\"date\\\": \\\"2023-12-03 13:53:31.563397\\\"}\", \"{\\\"Text\\\": \\\"DO NOT DRINK AND GO TO THE BUS\\\", \\\"Image\\\": \\\"https://i.ibb.co/Hh2bkNN/Whats-App-Image-2023-12-03-at-13-17-00-1.jpg\\\", \\\"Privacy\\\": \\\"public\\\", \\\"date\\\": \\\"2023-12-03 13:53:43.668191\\\"}\", \"{\\\"Text\\\": \\\"Prom 2022\\\", \\\"Image\\\": \\\"https://i.ibb.co/CspQ2Qm/Whats-App-Image-2023-12-03-at-13-17-01.jpg\\\", \\\"Privacy\\\": \\\"public\\\", \\\"date\\\": \\\"2023-12-03 13:53:56.799931\\\"}\", \"{\\\"Text\\\": \\\"Trio\\\", \\\"Image\\\": \\\"https://i.ibb.co/mCYSfKj/Whats-App-Image-2023-12-03-at-13-17-01-1.jpg\\\", \\\"Privacy\\\": \\\"public\\\", \\\"date\\\": \\\"2023-12-03 13:54:45.212794\\\"}\"]',NULL),(70,86,'שלומי','חיימוב','shlomihaimov@gmail.com','2000-10-04','אהרון בוגנים 10, רמלה','תיכון מדעים לוד','אוהב לעסוק בפולסטאק בזמני הפנוי ולנגן בגיטרה','Not in a Relationship','shlomihaimov1','DevOps Engineer','M','https://i.ibb.co/hLY14WH/shlomi.jpg','[\"{\\\"Text\\\": \\\"Me and my sister:)\\\", \\\"Image\\\": \\\"https://i.ibb.co/S5HzYjR/Whats-App-Image-2023-12-03-at-13-50-39.jpg\\\", \\\"Privacy\\\": \\\"public\\\", \\\"date\\\": \\\"2023-12-03 13:51:10.142068\\\"}\", \"{\\\"Text\\\": \\\"4X4\\\", \\\"Image\\\": \\\"https://i.ibb.co/zHC5zvC/Whats-App-Image-2023-12-03-at-13-50-39-1.jpg\\\", \\\"Privacy\\\": \\\"public\\\", \\\"date\\\": \\\"2023-12-03 13:51:27.215030\\\"}\"]',NULL),(71,87,'יאזן','חמוד','yazenhamoud@gmail.com','2004-06-23','יבנה 14, רמלה','אורט לילינטל רמלה','אוהב לשמוע שירים ולא לישון כל היום','Not in a Relationship','fire4fire','נתב\"ג','M','https://i.ibb.co/Ld0cBy6/yazen.jpg','[\"{\\\"Text\\\": \\\"\\\", \\\"Image\\\": \\\"https://i.ibb.co/MpGZZtT/Whats-App-Image-2023-12-03-at-13-16-58.jpg\\\", \\\"Privacy\\\": \\\"public\\\", \\\"date\\\": \\\"2023-12-03 13:49:14.251886\\\"}\", \"{\\\"Text\\\": \\\"Got myself so drunk!\\\", \\\"Image\\\": \\\"https://i.ibb.co/C1YcdR8/Whats-App-Image-2023-12-03-at-13-17-02.jpg\\\", \\\"Privacy\\\": \\\"public\\\", \\\"date\\\": \\\"2023-12-03 13:49:38.183875\\\"}\"]',NULL),(72,88,'אתגר','ברבי','etgarb1237@gmail.com','2004-01-25','בן צבי, רמלה','אורט לילינטל','אוהב לערוך סרטונים, לשמוע שירים ולעצב','In a Relationship','etgarb1237','צה\"ל','Other','https://i.ibb.co/b5xg10L/etgar.jpg','[\"{\\\"Text\\\": \\\"Prom 2022!!\\\", \\\"Image\\\": \\\"https://i.ibb.co/dpKDXK4/Whats-App-Image-2023-12-03-at-13-17-01.jpg\\\", \\\"Privacy\\\": \\\"public\\\", \\\"date\\\": \\\"2023-12-03 13:17:54.274867\\\"}\", \"{\\\"Text\\\": \\\"brother from another mother!\\\", \\\"Image\\\": \\\"https://i.ibb.co/z2GbF4v/Whats-App-Image-2023-12-03-at-13-16-57.jpg\\\", \\\"Privacy\\\": \\\"public\\\", \\\"date\\\": \\\"2023-12-03 13:19:27.108535\\\"}\"]',NULL);
/*!40000 ALTER TABLE `profiles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-03 13:56:46

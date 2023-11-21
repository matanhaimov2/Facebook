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
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profiles`
--

LOCK TABLES `profiles` WRITE;
/*!40000 ALTER TABLE `profiles` DISABLE KEYS */;
INSERT INTO `profiles` VALUES (59,75,'מתן','חיימוב','matanhaimov2@gmail.com','2004-03-04','אהרון בוגנים 10, רמלה','אורט לילינטל','מנהל רשת בחיל המודיעין, לומד פולסטאק בזמני הפנוי ואוהב לנגן בגיטרה','Not in a Relationship','matanhaimov2','צה\"ל','M',NULL,'[\"{\\\"Text\\\": \\\"photo by me\\\", \\\"Image\\\": \\\"https://i.ibb.co/c34wvbx/facebook-icon.png\\\", \\\"Privacy\\\": \\\"only me\\\", \\\"date\\\": \\\"2023-11-07 14:14:40.450266\\\"}\"]',NULL),(60,76,'מתן','חיימוב','matanhaimov@gmail.com','2023-01-01',NULL,NULL,NULL,'Not in a Relationship','matanhaimov',NULL,'M',NULL,NULL,NULL),(61,77,'matan','haimov','matanhaimov20@gmail.com','2023-01-01',NULL,NULL,NULL,'Not in a Relationship','matanhaimov20',NULL,'M',NULL,NULL,NULL),(62,78,'matan','haimov','matanhaimov2000@gmail.com','2023-01-01',NULL,NULL,NULL,'Not in a Relationship','matanhaimov2000',NULL,'M',NULL,NULL,NULL),(63,79,'matan','haimov','matanhaimov200@gmail.com','2023-01-01',NULL,NULL,NULL,'Not in a Relationship','matanhaimov200',NULL,'M',NULL,NULL,NULL),(64,80,'גלי','עבאדה','gali@gmail.com','2023-01-01','asfdasfsdfggf','sadfadsf','im gay','Not in a Relationship','gali123','idf','F',NULL,NULL,NULL),(66,82,'shlomi','haimov','shlomihaimov@gmail.com','2023-01-01','אהרון בוגנים 10','תיכון מדעים לוד','מנגן בגיטרה ואוהב לתכנת וללמוד דבאופס בזמני הפנוי','Not in a Relationship','shlomihaimov','מובטל','M',NULL,NULL,NULL),(67,83,'noa','haimov','noahaimov@gmail.com','2023-01-01','אהרון בוגנים 10','משה שרת רמלה','חופרת שאוהבת לרקוד ','Not in a Relationship','noahaimv','בית ספר','F',NULL,NULL,NULL);
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

-- Dump completed on 2023-11-21 11:11:20

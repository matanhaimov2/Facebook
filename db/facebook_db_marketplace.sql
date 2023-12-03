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
-- Table structure for table `marketplace`
--

DROP TABLE IF EXISTS `marketplace`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `marketplace` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_email` varchar(100) DEFAULT NULL,
  `products` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `marketplace`
--

LOCK TABLES `marketplace` WRITE;
/*!40000 ALTER TABLE `marketplace` DISABLE KEYS */;
INSERT INTO `marketplace` VALUES (4,'matanhaimov@gmail.com','[\"{\\\"Category\\\": \\\"games\\\", \\\"Text\\\": \\\"Call Of Duty MW 3\\\", \\\"Image\\\": \\\"https://i.ibb.co/fq8LbC9/codmwiii.webp\\\", \\\"Price\\\": \\\"330\\\", \\\"City\\\": \\\"Ramle\\\", \\\"date\\\": \\\"2023-12-03 14:23:12.081058\\\"}\", \"{\\\"Category\\\": \\\"games\\\", \\\"Text\\\": \\\"Marvels SpiderMan 2\\\", \\\"Image\\\": \\\"https://i.ibb.co/BZVVW2z/asas.jpg\\\", \\\"Price\\\": \\\"330\\\", \\\"City\\\": \\\"Ramle\\\", \\\"date\\\": \\\"2023-12-03 14:25:20.444997\\\"}\", \"{\\\"Category\\\": \\\"electronics\\\", \\\"Text\\\": \\\"Galaxy s21 5G good as new\\\", \\\"Image\\\": \\\"https://i.ibb.co/58RD70W/galxys21.webp\\\", \\\"Price\\\": \\\"1,499\\\", \\\"City\\\": \\\"Ramle\\\", \\\"date\\\": \\\"2023-12-03 14:29:52.345348\\\"}\", \"{\\\"Category\\\": \\\"electronics\\\", \\\"Text\\\": \\\"PS4 good as new\\\", \\\"Image\\\": \\\"https://i.ibb.co/JqNpvTL/ps4.jpg\\\", \\\"Price\\\": \\\"999\\\", \\\"City\\\": \\\"Ramle\\\", \\\"date\\\": \\\"2023-12-03 14:31:33.208449\\\"}\", \"{\\\"Category\\\": \\\"games\\\", \\\"Text\\\": \\\"PS4 Controller\\\", \\\"Image\\\": \\\"https://i.ibb.co/cXgQYSs/ps4asda.webp\\\", \\\"Price\\\": \\\"199\\\", \\\"City\\\": \\\"Ramle\\\", \\\"date\\\": \\\"2023-12-03 14:33:03.457570\\\"}\", \"{\\\"Category\\\": \\\"games\\\", \\\"Text\\\": \\\"GTA V PS5\\\", \\\"Image\\\": \\\"https://i.ibb.co/wydPKJp/71rm-Y66nqo-L.jpg\\\", \\\"Price\\\": \\\"149\\\", \\\"City\\\": \\\"Ramle\\\", \\\"date\\\": \\\"2023-12-03 14:34:02.161443\\\"}\", \"{\\\"Category\\\": \\\"instruments\\\", \\\"Text\\\": \\\"Piano NEW\\\", \\\"Image\\\": \\\"https://i.ibb.co/hgSbYtN/download.jpg\\\", \\\"Price\\\": \\\"10,000\\\", \\\"City\\\": \\\"Petah Tikva\\\", \\\"date\\\": \\\"2023-12-03 14:35:21.024096\\\"}\", \"{\\\"Category\\\": \\\"games\\\", \\\"Text\\\": \\\"FIFA 24 PS5\\\", \\\"Image\\\": \\\"https://i.ibb.co/vkZcvz1/download-1.jpg\\\", \\\"Price\\\": \\\"249\\\", \\\"City\\\": \\\"Ramle\\\", \\\"date\\\": \\\"2023-12-03 14:36:25.864631\\\"}\"]'),(5,'shlomihaimov@gmail.com','[\"{\\\"Category\\\": \\\"instruments\\\", \\\"Text\\\": \\\"New Guitars\\\", \\\"Image\\\": \\\"https://i.ibb.co/prxcydy/guitar.jpg\\\", \\\"Price\\\": \\\"3599\\\", \\\"City\\\": \\\"Ramle\\\", \\\"date\\\": \\\"2023-12-03 14:21:26.279844\\\"}\"]'),(6,'yazenhamoud@gmail.com','[\"{\\\"Category\\\": \\\"vehicles\\\", \\\"Text\\\": \\\"hyundai I20\\\", \\\"Image\\\": \\\"https://i.ibb.co/fSW6F45/hyundai-i20.jpg\\\", \\\"Price\\\": \\\"20,000\\\", \\\"City\\\": \\\"Ramle\\\", \\\"date\\\": \\\"2023-12-03 14:26:35.912252\\\"}\", \"{\\\"Category\\\": \\\"electronics\\\", \\\"Text\\\": \\\"Xbox One Series X \\\", \\\"Image\\\": \\\"https://i.ibb.co/N7fkSkd/xboxone.jpg\\\", \\\"Price\\\": \\\"2099\\\", \\\"City\\\": \\\"Ramle\\\", \\\"date\\\": \\\"2023-12-03 14:27:17.825138\\\"}\", \"{\\\"Category\\\": \\\"instruments\\\", \\\"Text\\\": \\\"New Drums\\\", \\\"Image\\\": \\\"https://i.ibb.co/37PwDxb/drums.jpg\\\", \\\"Price\\\": \\\"15,999\\\", \\\"City\\\": \\\"Ramle\\\", \\\"date\\\": \\\"2023-12-03 14:27:59.464970\\\"}\"]'),(7,'etgarb1237@gmail.com','[\"{\\\"Category\\\": \\\"electronics\\\", \\\"Text\\\": \\\"ps5 new condition\\\", \\\"Image\\\": \\\"https://i.ibb.co/cxKGnHm/ps5.webp\\\", \\\"Price\\\": \\\"2099\\\", \\\"City\\\": \\\"Ramle\\\", \\\"date\\\": \\\"2023-12-03 13:29:04.664433\\\"}\"]');
/*!40000 ALTER TABLE `marketplace` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-03 14:37:56

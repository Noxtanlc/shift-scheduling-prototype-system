CREATE DATABASE  IF NOT EXISTS `shift-scheduler` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `shift-scheduler`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: shift-scheduler
-- ------------------------------------------------------
-- Server version	8.0.37

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
-- Table structure for table `assigned_staff`
--

DROP TABLE IF EXISTS `assigned_staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assigned_staff` (
  `as_id` int NOT NULL AUTO_INCREMENT,
  `as_FKstaffID` int DEFAULT NULL,
  `as_FKgroupID` int DEFAULT NULL,
  PRIMARY KEY (`as_id`),
  KEY `as_FKGroupID_idx` (`as_FKgroupID`),
  KEY `as_FKstaffUIID_idx` (`as_FKstaffID`),
  CONSTRAINT `as_FKGroupID` FOREIGN KEY (`as_FKgroupID`) REFERENCES `group` (`groupID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `as_FKstaffUIID` FOREIGN KEY (`as_FKstaffID`) REFERENCES `staff_list` (`staff_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assigned_staff`
--

LOCK TABLES `assigned_staff` WRITE;
/*!40000 ALTER TABLE `assigned_staff` DISABLE KEYS */;
INSERT INTO `assigned_staff` VALUES (28,200213163,63),(29,200213166,63),(31,200213164,63),(32,200213156,63),(34,200213162,63),(36,200213169,63),(37,200213168,63),(42,200213158,63),(46,200213157,63);
/*!40000 ALTER TABLE `assigned_staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `control_area`
--

DROP TABLE IF EXISTS `control_area`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `control_area` (
  `ca_id` int NOT NULL AUTO_INCREMENT,
  `ca_desc` longtext,
  `ca_alias` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ca_id`),
  UNIQUE KEY `ca_id_UNIQUE` (`ca_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `control_area`
--

LOCK TABLES `control_area` WRITE;
/*!40000 ALTER TABLE `control_area` DISABLE KEYS */;
INSERT INTO `control_area` VALUES (1,'Gate A','GA');
/*!40000 ALTER TABLE `control_area` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group`
--

DROP TABLE IF EXISTS `group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group` (
  `groupID` int NOT NULL AUTO_INCREMENT,
  `groupName` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`groupID`),
  UNIQUE KEY `groupName_UNIQUE` (`groupName`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group`
--

LOCK TABLES `group` WRITE;
/*!40000 ALTER TABLE `group` DISABLE KEYS */;
INSERT INTO `group` VALUES (63,'Doe');
/*!40000 ALTER TABLE `group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shift`
--

DROP TABLE IF EXISTS `shift`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shift` (
  `id` int NOT NULL AUTO_INCREMENT,
  `FKstaffID` int NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `st_id` int DEFAULT '0',
  `ca_id` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FKca_ID_idx` (`ca_id`),
  KEY `FKstaffID_idx` (`FKstaffID`,`st_id`),
  KEY `FKst_ID_idx` (`st_id`),
  CONSTRAINT `FKca_ID` FOREIGN KEY (`ca_id`) REFERENCES `control_area` (`ca_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKst_ID` FOREIGN KEY (`st_id`) REFERENCES `shift_category` (`id`),
  CONSTRAINT `FKstaff_uid` FOREIGN KEY (`FKstaffID`) REFERENCES `staff_list` (`staff_id`)
) ENGINE=InnoDB AUTO_INCREMENT=120 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shift`
--

LOCK TABLES `shift` WRITE;
/*!40000 ALTER TABLE `shift` DISABLE KEYS */;
INSERT INTO `shift` VALUES (1,200213156,'2024-03-11','2024-03-11',1,1),(2,200213156,'2024-03-12','2024-03-13',2,NULL),(3,200213157,'2024-03-11','2024-03-11',2,NULL),(4,200213157,'2024-03-12','2024-03-12',1,1),(5,200213157,'2024-03-13','2024-03-15',1,NULL),(6,200213158,'2024-03-13','2024-03-15',1,NULL),(12,200213156,'2024-04-06','2024-04-08',3,NULL),(14,200213156,'2024-03-10','2024-03-12',2,NULL),(43,200213156,'2024-04-09','2024-04-09',2,NULL),(44,200213156,'2024-04-11','2024-04-11',3,NULL),(70,200213157,'2024-05-01','2024-05-01',3,NULL),(114,200213159,'2024-05-02','2024-05-02',1,NULL),(116,200213157,'2024-05-02','2024-05-02',1,NULL),(117,200213157,'2024-05-03','2024-05-03',1,NULL),(118,200213159,'2024-05-01','2024-05-01',2,NULL),(119,200213158,'2024-05-01','2024-05-01',3,NULL);
/*!40000 ALTER TABLE `shift` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shift_category`
--

DROP TABLE IF EXISTS `shift_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shift_category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `st_name` varchar(255) DEFAULT '',
  `st_alias` varchar(45) DEFAULT '',
  `color-coding` varchar(45) DEFAULT '#ffffff',
  `start_time` time DEFAULT '00:00:00',
  `end_time` time DEFAULT '00:00:00',
  `active` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idshift_type_id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shift_category`
--

LOCK TABLES `shift_category` WRITE;
/*!40000 ALTER TABLE `shift_category` DISABLE KEYS */;
INSERT INTO `shift_category` VALUES (1,'SHIFT A','SHIFT A','#ff0000','00:00:00','00:00:00',0),(2,'SHIFT B','SHIFT B','#ac59ff','12:00:00','08:00:00',1),(3,'SHIFT C','SHIFT C','#005eff','08:00:00','16:00:00',1),(30,'Apple','AAA','#ab6d6d','00:00:00','05:00:00',1);
/*!40000 ALTER TABLE `shift_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff_list`
--

DROP TABLE IF EXISTS `staff_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff_list` (
  `staff_no` int NOT NULL AUTO_INCREMENT,
  `staff_id` int DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`staff_no`),
  UNIQUE KEY `staff_no_UNIQUE` (`staff_no`),
  UNIQUE KEY `staff_uid_UNIQUE` (`staff_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff_list`
--

LOCK TABLES `staff_list` WRITE;
/*!40000 ALTER TABLE `staff_list` DISABLE KEYS */;
INSERT INTO `staff_list` VALUES (1,200213156,'Adam','Bright'),(2,200213157,'John','Saddler'),(3,200213158,'Buckler','Doe'),(4,200213159,'Saddie','Doe'),(5,200213160,'James','Doe'),(6,200213161,'Johnny','Sand'),(7,200213162,'Amy','Sand'),(8,200213163,'Roger','Rodney'),(9,200213164,'Amelia','Doe'),(10,200213165,'Ethan','Doe'),(11,200213166,'Connor','Doe'),(12,200213167,'Sammy','Doe'),(13,200213168,'Thomas','Doe'),(14,200213169,'Sebestian','Doe'),(15,200213170,'Ivy','Doe');
/*!40000 ALTER TABLE `staff_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(15) DEFAULT NULL,
  `isAdmin` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Admin','admin','admin',1),(2,'User','user','user',0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'shift-scheduler'
--

--
-- Dumping routines for database 'shift-scheduler'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-15  7:29:13

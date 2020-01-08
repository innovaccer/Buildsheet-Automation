-- MySQL dump 10.13  Distrib 8.0.17, for Win64 (x86_64)
--
-- Host: 10.4.1.123    Database: buildsheet_project_staging
-- ------------------------------------------------------
-- Server version	5.6.43

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
-- Table structure for table `buildsheet_master`
--

DROP TABLE IF EXISTS `buildsheet_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `buildsheet_master` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `val_id` int(11) DEFAULT NULL,
  `parent_id` int(10) unsigned DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `parent_id_idx` (`parent_id`)
) ENGINE=InnoDB AUTO_INCREMENT=446 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `buildsheet_proj_stg_testing`
--

DROP TABLE IF EXISTS `buildsheet_proj_stg_testing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `buildsheet_proj_stg_testing` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `unique_flag` tinyint(4) DEFAULT '0',
  `buildsheet_workspaces_id` int(11) DEFAULT NULL,
  `aco_id` int(11) DEFAULT NULL,
  `source_id` int(11) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `l1_schema` varchar(50) DEFAULT NULL,
  `source_table` varchar(100) DEFAULT NULL,
  `source_column` varchar(100) DEFAULT NULL,
  `alias` varchar(4) DEFAULT NULL,
  `l2_schema` varchar(50) DEFAULT NULL,
  `destination_table` text,
  `destination_column` varchar(100) DEFAULT NULL,
  `data_type` varchar(50) DEFAULT NULL,
  `data_type_2` varchar(20) DEFAULT NULL,
  `rule_type` varchar(20) DEFAULT NULL,
  `rule` text,
  `meta_id` int(10) unsigned DEFAULT NULL,
  `l1_total_cnt_wf_q` text,
  `l1_total_cnt_wf` int(11) DEFAULT NULL,
  `l1_unq_cnt_wf_q` text,
  `l1_unq_cnt_wf` int(11) DEFAULT NULL,
  `l1_total_cnt_q` text,
  `l1_total_cnt` int(11) DEFAULT NULL,
  `l1_unq_cnt_q` text,
  `l1_unq_cnt` int(11) DEFAULT NULL,
  `l2_total_cnt_q` text,
  `l2_total_cnt` int(11) DEFAULT NULL,
  `l2_unq_cnt_q` text,
  `l2_unq_cnt` int(11) DEFAULT NULL,
  `semantic_q` varchar(1000) DEFAULT NULL,
  `semantic_match` int(11) DEFAULT NULL,
  `ontology_q` varchar(1000) DEFAULT NULL,
  `ontology_match` int(11) DEFAULT NULL,
  `semantic_load_q` text,
  `npi_q` varchar(1000) DEFAULT NULL,
  `npi_match` int(11) DEFAULT NULL,
  `comment` text,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete_flag` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `category_idx` (`category`),
  KEY `rule_type_idx` (`rule_type`),
  KEY `source_column_idx` (`source_column`),
  KEY `meta_id_idx` (`meta_id`),
  KEY `buildsheet_workspaces_id_idx` (`buildsheet_workspaces_id`),
  CONSTRAINT `buildsheet_proj_stg_testing_ibfk_1` FOREIGN KEY (`meta_id`) REFERENCES `meta_data_stg_testing` (`id`),
  CONSTRAINT `buildsheet_proj_stg_testing_ibfk_2` FOREIGN KEY (`buildsheet_workspaces_id`) REFERENCES `buildsheet_workspaces` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12969 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `buildsheet_workspaces`
--

DROP TABLE IF EXISTS `buildsheet_workspaces`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `buildsheet_workspaces` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `olap_version` tinyint(4) DEFAULT NULL,
  `workspace_name` varchar(255) DEFAULT NULL,
  `aco_id` int(11) DEFAULT NULL,
  `aco_name` varchar(255) DEFAULT NULL,
  `source_id` int(11) DEFAULT NULL,
  `source_name` varchar(255) DEFAULT NULL,
  `vendor_name` varchar(255) DEFAULT NULL,
  `vendor_version` varchar(255) DEFAULT NULL,
  `delete_flag` tinyint(4) DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `casee_proc`
--

DROP TABLE IF EXISTS `casee_proc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `casee_proc` (
  `id` tinyint(4) DEFAULT NULL,
  `alias` varchar(4) DEFAULT NULL,
  `l1_schema` varchar(20) DEFAULT NULL,
  `source_table` varchar(100) DEFAULT NULL,
  `source_column` varchar(50) DEFAULT NULL,
  `rule_typ` varchar(50) DEFAULT NULL,
  `rule` text,
  `meta_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `l2_mandatory_columns`
--

DROP TABLE IF EXISTS `l2_mandatory_columns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `l2_mandatory_columns` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `olap_version` tinyint(4) DEFAULT NULL,
  `l2_table_id` int(10) unsigned DEFAULT NULL,
  `columns_name` varchar(255) DEFAULT NULL,
  `mandatory_flag` enum('0','1') DEFAULT NULL COMMENT '0=false,1=true',
  `semantic_ontology_flag` enum('0','1') DEFAULT NULL COMMENT '0=false,1=true',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `l2_table_id_idx` (`l2_table_id`),
  CONSTRAINT `l2_mandatory_columns_ibfk_1` FOREIGN KEY (`l2_table_id`) REFERENCES `buildsheet_master` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1024 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `l2_test_cases`
--

DROP TABLE IF EXISTS `l2_test_cases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `l2_test_cases` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `category` varchar(255) DEFAULT NULL,
  `columnname` varchar(255) DEFAULT NULL,
  `test_cases` varchar(1000) DEFAULT NULL,
  `test_queries` text,
  `expected_result` tinyint(4) DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `active_flag` enum('0','1') DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=531 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `meta_data_stg_testing`
--

DROP TABLE IF EXISTS `meta_data_stg_testing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meta_data_stg_testing` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `data_source` varchar(20) DEFAULT NULL,
  `data_source_version` varchar(20) DEFAULT NULL,
  `buildsheet_workspaces_id` int(11) DEFAULT NULL,
  `buildsheet_name` varchar(255) DEFAULT NULL,
  `source_id` varchar(10) DEFAULT NULL,
  `l1_schema` varchar(50) DEFAULT NULL,
  `l2_schema` varchar(30) DEFAULT NULL,
  `l2_table` varchar(30) DEFAULT NULL,
  `source_name` varchar(200) DEFAULT NULL,
  `source_type` varchar(100) DEFAULT NULL,
  `workflow_id` varchar(100) DEFAULT NULL,
  `author` varchar(200) DEFAULT NULL,
  `ingestion_datetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `vendor_version` varchar(55) DEFAULT NULL,
  `vendor_name` varchar(100) DEFAULT NULL,
  `aco_id` varchar(10) DEFAULT NULL,
  `aco_name` varchar(200) DEFAULT NULL,
  `source_file_name` varchar(512) DEFAULT NULL,
  `workspace_id` varchar(100) DEFAULT NULL,
  `indata_created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `pipeline_id` varchar(100) DEFAULT NULL,
  `buildsheet_last_update` datetime DEFAULT NULL,
  `semantic_last_run` datetime DEFAULT NULL,
  `test_cases_last_run` datetime DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete_flag` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `buildsheet_workspaces_id` (`buildsheet_workspaces_id`),
  CONSTRAINT `meta_data_stg_testing_ibfk_1` FOREIGN KEY (`buildsheet_workspaces_id`) REFERENCES `buildsheet_workspaces` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=329 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `num`
--

DROP TABLE IF EXISTS `num`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `num` (
  `n` mediumint(9) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`n`)
) ENGINE=InnoDB AUTO_INCREMENT=1001 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `test_cases_result`
--

DROP TABLE IF EXISTS `test_cases_result`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test_cases_result` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `aco_id` int(10) unsigned DEFAULT NULL,
  `source_id` int(10) unsigned DEFAULT NULL,
  `meta_id` int(10) unsigned DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `columnname` varchar(255) DEFAULT NULL,
  `test_case` varchar(2000) DEFAULT NULL,
  `test_query` text,
  `result` varchar(5) DEFAULT NULL,
  `sample_data` text,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `meta_id_idx` (`meta_id`),
  CONSTRAINT `test_cases_result_ibfk_1` FOREIGN KEY (`meta_id`) REFERENCES `meta_data_stg_testing` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=449 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `unique_entity`
--

DROP TABLE IF EXISTS `unique_entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unique_entity` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `aco_id` int(10) unsigned DEFAULT NULL,
  `meta_id` int(10) unsigned DEFAULT NULL,
  `source_id` int(10) unsigned DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `l1_query` text,
  `l2_query` text,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `meta_id_idx` (`meta_id`)
) ENGINE=InnoDB AUTO_INCREMENT=470 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-12-24 11:18:30

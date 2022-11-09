-- MariaDB dump 10.19  Distrib 10.5.15-MariaDB, for debian-linux-gnu (x86_64)
--
-- ------------------------------------------------------
-- Server version	8.0.26-google

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `alfred_bot`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `alfred_bot` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `alfred_bot`;

--
-- Table structure for table `botao`
--

DROP TABLE IF EXISTS `botao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `botao` (
  `botao_id` int NOT NULL AUTO_INCREMENT,
  `buttonText` varchar(500) DEFAULT NULL,
  `displayText` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`botao_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `botao`
--

LOCK TABLES `botao` WRITE;
/*!40000 ALTER TABLE `botao` DISABLE KEYS */;
/*!40000 ALTER TABLE `botao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cliente` (
  `nome` varchar(200) DEFAULT NULL,
  `telefone` varchar(50) DEFAULT NULL,
  `cpf` varchar(50) DEFAULT NULL,
  `endereco` varchar(200) DEFAULT NULL,
  `cliente_id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`cliente_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
INSERT INTO `cliente` VALUES ('Lucas','556599740272',NULL,NULL,10);
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mensagem`
--

DROP TABLE IF EXISTS `mensagem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mensagem` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo` varchar(255) DEFAULT NULL,
  `texto` varchar(2000) DEFAULT NULL,
  `ativo` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mensagem`
--

LOCK TABLES `mensagem` WRITE;
/*!40000 ALTER TABLE `mensagem` DISABLE KEYS */;
INSERT INTO `mensagem` VALUES (1,'botao','teste',1);
/*!40000 ALTER TABLE `mensagem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu`
--

DROP TABLE IF EXISTS `menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `menu` (
  `menu_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(500) DEFAULT NULL,
  `rowTitle` varchar(500) DEFAULT NULL,
  `rowDescription` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`menu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produtos`
--

DROP TABLE IF EXISTS `produtos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `produtos` (
  `produto_id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `valor` decimal(15,2) NOT NULL,
  `categoria` varchar(255) NOT NULL,
  `ativo` tinyint DEFAULT NULL,
  `descricao` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`produto_id`),
  UNIQUE KEY `produto_id_UNIQUE` (`produto_id`)
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produtos`
--

LOCK TABLES `produtos` WRITE;
/*!40000 ALTER TABLE `produtos` DISABLE KEYS */;
INSERT INTO `produtos` VALUES (17,'Peixada Completa 02 Pessoas',110.90,'À la carte',1,'Arroz branco, pirão, farofa de banana, ventrecha de pacu frito, posta de pintado frito, mojica de pintado, pacu escabeche e salada'),(18,'Peixada Completa 03 Pessoas',152.90,'À la carte',1,'Arroz branco, pirão, farofa de banana, ventrecha de pacu frito, posta de pintado frito, mojica de pintado, pacu escabeche e salada'),(19,'Moda da casa 02 pessoas',115.90,'À la carte',1,'Arroz branco, filé de pintado e molho, leite de coco, champignon, azeitonas, farofa de banana, mandioca dorê e salada'),(20,'Moda da casa 03 pessoas',153.90,'À la carte',1,'Arroz branco, filé de pintado e molho, leite de coco, champignon, azeitonas, farofa de banana, mandioca dorê e salada'),(21,'Pintado à milanesa 02 pessoas',110.90,'À la carte',1,'Arroz branco, filé à milanesa, farofa de banana, pirão,  mandioca dorê e salada'),(22,'Pintado à milanesa 03 pessoas',147.90,'À la carte',1,'Arroz branco, filé à milanesa, farofa de banana, pirão,  mandioca dorê e salada'),(23,'Filé Pintado Grelhado 02 pessoas',110.90,'À la carte',1,'Arroz branco, filé de pintado grelhado na chapa, farofa de banana, pirão, mandioca dorê e salada'),(24,'Filé Pintado Grelhado 03 pessoas',146.90,'À la carte',1,'Arroz branco, filé de pintado grelhado na chapa, farofa de banana, pirão, mandioca dorê e salada'),(25,'Pacu Seco com Arroz 03 pessoas',117.90,'À la carte',1,NULL),(26,'Pacu Seco com Arroz 05 pessoas',148.00,'À la carte',1,NULL),(27,'Galinha com Arroz 03 pessoas',114.90,'À la carte',1,NULL),(28,'Galinha com Arroz 05 pessoas',143.90,'À la carte',1,NULL),(29,'Costelinha de Porco com Arroz 03 pessoas',116.90,'À la carte',1,NULL),(30,'Costelinha de Porco com Arroz 05 pessoas',154.90,'À la carte',1,NULL),(31,'Pacu assado 04 pessoas',169.90,'À la carte',1,NULL),(32,'Filé Bovino Acebolado',149.90,'À la carte',1,NULL),(33,'Filé Pintado à Palito Inteira',69.90,'Porções',1,NULL),(34,'Filé Pintado à Palito Meia',54.90,'Porções',1,NULL),(35,'Filé de Pacu Inteira',63.90,'Porções',1,NULL),(36,'Filé de Pacu Meia',40.90,'Porções',1,NULL),(37,'Ventrecha de Pacu Inteira',54.90,'Porções',1,NULL),(38,'Ventrecha de Pacu Meia',42.90,'Porções',1,NULL),(39,'Frango à passarinho',30.00,'Porções',1,NULL),(40,'Filé Bovino à palito c/ fritas',63.90,'Porções',1,NULL),(41,'Costelinha Suína Frita',46.90,'Porções',1,NULL),(42,'Pirão de Peixe',16.90,'Porções',1,NULL),(43,'Mojica de Pintado',49.90,'Porções',1,NULL),(44,'Mojica e Arroz',56.90,'Porções',1,NULL),(45,'Banana frita',20.90,'Porções',1,NULL),(46,'Arroz',15.90,'Porções',1,NULL),(47,'Mandioca frita',25.90,'Porções',1,NULL),(48,'Vinagrete',18.90,'Porções',1,NULL),(49,'Farofa de Banana',21.90,'Porções',1,NULL),(50,'Salada Especial',30.90,'Porções',1,NULL),(51,'Heineken 600ml',17.50,'Cervejas',1,NULL),(52,'Eisenbahn 600ml',15.00,'Cervejas',1,NULL),(53,'Amstel 600ml',13.00,'Cervejas',1,NULL),(54,'Devassa 600ml',11.00,'Cervejas',1,NULL),(55,'Original 600ml',15.00,'Cervejas',1,NULL),(56,'Brahma 600ml',13.00,'Cervejas',1,NULL),(57,'Heineken Long Neck',10.80,'Cervejas',1,NULL),(58,'Heineken 0.0 Long Neck',10.80,'Cervejas',1,NULL),(59,'Eisenbahn Pilsen Long Neck',8.00,'Cervejas',1,NULL),(60,'Eisenbahn Unfiltered Long Neck',8.00,'Cervejas',1,NULL),(61,'Malzbier Long Neck',10.00,'Cervejas',1,NULL),(62,'Sol Long Neck',8.00,'Cervejas',1,NULL),(63,'Eisenbahn Weizenbier',11.80,'Cervejas Especiais',1,NULL),(64,'Eisenbahn Pale Ale',11.80,'Cervejas Especiais',1,NULL),(65,'Eisenbahn Ipa',11.80,'Cervejas Especiais',1,NULL),(66,'Baden Baden Cristal',20.00,'Cervejas Especiais',1,NULL),(67,'Eisenbahn Weizenbier',11.80,'Cervejas Especiais',1,NULL),(68,'Cozumel',20.00,'Drinks, vinhos e outros',1,NULL),(69,'Cozumel sem álcool',22.00,'Drinks, vinhos e outros',1,NULL),(70,'Aguardente Dose',5.90,'Drinks, vinhos e outros',1,NULL),(71,'Caipirinha Limão',20.00,'Drinks, vinhos e outros',1,NULL),(72,'Caipirinha Abacaxi',22.00,'Drinks, vinhos e outros',1,NULL),(73,'Caipirinha Maracujá',22.00,'Drinks, vinhos e outros',1,NULL),(74,'Caipiroska Limão',23.90,'Drinks, vinhos e outros',1,NULL),(75,'Caipiroska Abacaxi',24.90,'Drinks, vinhos e outros',1,NULL),(76,'Caipiroska Maracujá',24.90,'Drinks, vinhos e outros',1,NULL),(77,'Coquetel de Fruta',25.90,'Drinks, vinhos e outros',1,NULL),(78,'Coquetel de Fruta sem Álcool',24.90,'Drinks, vinhos e outros',1,NULL),(79,'Vinho Taça Suave ou Seco',20.00,'Drinks, vinhos e outros',1,NULL);
/*!40000 ALTER TABLE `produtos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-10-25 19:03:17

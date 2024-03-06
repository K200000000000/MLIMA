-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 04, 2023 at 11:15 AM
-- Server version: 8.0.33-0ubuntu0.22.04.2
-- PHP Version: 8.1.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mutall_mlima`
--

-- --------------------------------------------------------

--
-- Table structure for table `member`
--

CREATE TABLE `member` (
  `member` int NOT NULL,
  `photo` varchar(35) DEFAULT NULL,
  `name` varchar(30) DEFAULT NULL,
  `title` varchar(4) DEFAULT NULL,
  `registration_id` varchar(4) DEFAULT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `national_id` varchar(10) DEFAULT NULL,
  `email` varchar(30) DEFAULT NULL,
  `occupation` varchar(10) DEFAULT NULL,
  `business_url` varchar(255) DEFAULT NULL,
  `verified` tinyint(1) NOT NULL DEFAULT '0',
  `comment` tinytext
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `member`
--

INSERT INTO `member` (`member`, `photo`, `name`, `title`, `registration_id`, `mobile`, `national_id`, `email`, `occupation`, `business_url`, `verified`, `comment`) VALUES
(1, 'lucy ngendo nyachomba.jpg', 'Lucy Ngendo Nyachomba', 'm/s', '', '722547571', '', '', '', '{\"text\":\"\",\"href\":\"\"}', 1, ''),
(2, '', 'Samuel Gachiri', 'mr', '', '720461363', '', '', '', '{\"text\":\"\",\"href\":\"\"}', 1, ''),
(3, 'DSC03339.png', 'Rachael Gachiri', 'm/s', '', '720461363', '', '', '', '{\"text\":\"\",\"href\":\"\"}', 1, 'testing'),
(4, '', 'John Njihia', 'mr', '', '721202206', '', '', '', '{\"text\":\"\",\"href\":\"\"}', 1, 'just a test'),
(5, '', 'Virginia Maina', 'm/s', '', '724855591', '', '', '', '{\"text\":\"\",\"href\":\"\"}', 1, ''),
(6, '', 'Justus Ichura', 'mr', NULL, '720247858', NULL, NULL, NULL, NULL, 0, NULL),
(7, '', 'Michael Macharia', 'mr', NULL, '723106072', NULL, NULL, NULL, NULL, 0, NULL),
(8, '', 'Cyrus Thuo', 'mr', NULL, '722819923', NULL, NULL, NULL, NULL, 0, NULL),
(10, '', 'Ken Kimani', 'mr', NULL, '722922678', NULL, NULL, NULL, NULL, 0, NULL),
(11, '', 'Geoffrey Waiharo', 'mr', NULL, '719489170', NULL, NULL, NULL, NULL, 0, NULL),
(12, '', 'Purity Njambi', 'm/s', NULL, '722436614', NULL, NULL, NULL, NULL, 0, NULL),
(13, '', 'Esther N. Magondu', 'm/s', '0055', '722382836', '9241211', NULL, NULL, NULL, 0, NULL),
(14, '', 'Dedan K. Macharia', 'mr', '0058', '722684381', '3466703', NULL, NULL, NULL, 0, NULL),
(15, '', 'Josephat Kimani', 'mr ', NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(16, '', 'Elizabeth W. Kamau', 'm/s ', '0061', '724773444', '2954942', NULL, NULL, NULL, 0, NULL),
(17, 'photo.JPG', 'Zachary K. Muchangi', 'Mr.', '0062', '722422434', '977490', 'kinyuazachary@yahoo.com', 'Accountant', '{\"text\":\"Mountain Top Safaris\",\"href\":\"http://mountaintopsafarisadventures.co.ke/\"}', 1, NULL),
(18, '', 'Stephen M. Ndiritu', 'mr', NULL, '722896496', NULL, NULL, NULL, NULL, 0, NULL),
(19, '', 'Jane Kagiri', 'm/s', NULL, '727043655', NULL, NULL, NULL, NULL, 0, NULL),
(20, '', 'Vemanzio Irungu', 'mr', NULL, '722286701', NULL, NULL, NULL, NULL, 0, NULL),
(21, 'evelyne kemunto.jpg', 'Evelyne Kemunto', 'm/s', '0041', '722532887', '13877801', NULL, NULL, NULL, 0, NULL),
(22, 'joseph n. gitonga.jpg', 'Joseph N. Gitonga', 'eng', '0003', '722219555', '4830126', NULL, NULL, '{\"text\":\"\",\"href\":\"\"}', 1, NULL),
(23, '', 'Johnstone Wachira', 'mr', NULL, '721491361', NULL, NULL, NULL, NULL, 0, NULL),
(24, 'frank gachau.jpg', 'Frank Gachau', 'mr', '0016', '721729442', '328179', NULL, NULL, NULL, 0, NULL),
(25, 'milton gatahi mwango.jpg', 'Milton Gatahi Mwango', 'mr', '0006', '722365516', '3490623', NULL, NULL, NULL, 0, NULL),
(26, 'frank msafiri.jpg', 'Frank Msafiri', 'mr', '0001', '721344707', '1072060', 'frank_msafiri@yahoo.com', '', '{\"text\":\"\",\"href\":\"\"}', 1, ''),
(27, 'helen mwihaki gacheche.jpg', 'Hellen Mwihaki Gacheche', 'm/s', '0015', '724264673', '21993100', 'ghelenmwihaki@gmail.com', '', '{\"text\":\"\",\"href\":\"\"}', 1, 'Look for a better profile hapo ni kama sio mimi. \n\nChange it to what you like. I used the only picture I had. Muraya'),
(28, 'PhotoGrid_1495790419449.png', 'Eunice Nasephae Kango', 'm/s ', '0021', '722725757', '6854834', NULL, NULL, '{\"text\":\"\",\"href\":\"\"}', 1, NULL),
(29, 'florence wariara.jpg', 'Florence Wariara', 'm/s', '0027', '721743658', '22762370', NULL, NULL, NULL, 0, NULL),
(30, 'emily gondosio.jpg', 'Emily Gondosio', 'm/s ', '0033', '723925208', '10005465', NULL, NULL, NULL, 0, NULL),
(32, 'george githui.jpg', 'George Githui', 'mr', '0008', '722807834', '4441396', '', '', '', 0, ''),
(33, 'samuel k. maina.jpg', 'Samuel K. Maina', 'Mr.', '0029', '0722762072', '10609742', 'samymaina2013@gmail.com', NULL, '{\"text\":\"Prompt Solutions Ltd\",\"href\":\"\"}', 1, NULL),
(34, 'james gathuri.jpg', 'James Gathuri', 'mr', '0044', '720845108', '9717447', NULL, NULL, NULL, 0, NULL),
(35, '', 'David K. Mwago', 'mr', '0012', '722627240', '13320904', 'dkmwago@gmail.com', NULL, '{\"text\":\"\",\"href\":\"\"}', 1, NULL),
(36, 'paul gitungo.jpg', 'Paul Gitungo', 'mr', '0036', '722339152', '1350226', '', '', '', 0, ''),
(37, 'cyprian kanake.jpg', 'Cyprian Kanake Ambao', 'mr', '0025', '722745261', '1892939', NULL, NULL, NULL, 0, NULL),
(38, 'carol buluma.jpg', 'Carol Buluma', 'm/s', '0031', '723008885', '20689724', NULL, NULL, NULL, 0, NULL),
(39, '20170327_082027-1-1.jpg', 'Philomena Sungu', 'm/s', '0030', '727813976', '3276958', 'sunguphilomena@gmail.com', 'Teacher', '{\"text\":\"Langata West\",\"href\":\"\"}', 1, NULL),
(40, 'robert murimi.jpg', 'Robert Murimi', 'Mr ', '0004', '720644887', '3414758', 'robert.n.murimi@gmail.com', 'Management', '{\"text\":\"lmpact Change Ltd. \",\"href\":\"Http://www.robert.murimi@impactchangeltd.com\"}', 1, 'I have corrected your business address. Now the hyperlink should work'),
(41, 'aisha wambui gacheru.jpg', 'Aisha Wambui Gacheru', 'm/s', '0037', '723156710', '228780', '', '', '', 0, ''),
(43, 'margaret wairimu kiragu.jpg', 'Margaret Wairimu Kiragu', 'm/s', '0032', '722325029', '4400626', '', '', '', 1, ''),
(45, 'peter k. muraya.jpg', 'Peter K. Muraya', 'mr', '0019', '733903289', '2302589', 'peterkmuraya@gmail.com', 'Data Manag', '{\"text\":\"Mutall Business Center\",\"href\":\"http://mutall.co.ke\"}', 1, 'Please let me know what additional registration data is needed. Use the comment box for any suggestions '),
(48, 'chicjoint.png', 'Agnes Ngendo', 'm/s', NULL, NULL, NULL, NULL, NULL, '{\"text\":\"\",\"href\":\"\"}', 1, NULL),
(50, 'mary kimotho.jpg', 'Mary Wanjiku Kimotho', 'm/s', NULL, NULL, NULL, NULL, NULL, '{\"text\":\"\",\"href\":\"\"}', 1, NULL),
(52, '', 'Sammy Nyamongo', 'mr', NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(53, '', 'Mary Mureithi', 'm/s', '0054', NULL, '1189307', NULL, NULL, NULL, 0, NULL),
(54, 'kimondo mutambuki.jpg', 'Kimondo Mutambuki', 'mr', '0005', '722656579', '4831546', NULL, NULL, NULL, 0, NULL),
(55, 'martin muchoki.jpg', 'Martin Muchoki', 'mr', '0017', NULL, '13405511', NULL, NULL, NULL, 0, NULL),
(56, 'james njenga.jpg', 'James Njenga', 'mr', '0042', '722236207', '1062969', NULL, NULL, NULL, 0, NULL),
(57, '', 'Stephen Njenga', 'mr ', NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(58, 'stephen kanyi.jpg', 'Stephen Kanyi', 'mr', '0018', '722577480', '3496392', NULL, NULL, NULL, 0, NULL),
(59, 'alice muthoni njenga.jpg', 'Alice Muthoni Njenga', 'mrs', '0023', '727875 141', '6854920', NULL, NULL, '{\"text\":\"\",\"href\":\"\"}', 1, NULL),
(60, 'john gitu chege.jpg', 'John Gitu Chege', 'mr', NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL),
(63, 'nderi muriithi.jpg', 'Nderi Mureithi', 'mr', '0026', '722524702', '8797504', NULL, NULL, '{\"text\":\"\",\"href\":\"\"}', 1, 'Is your registration no. 0026 or 0056?'),
(64, 'benjamin ndegwa.jpg', 'benjamin ndegwa', NULL, '0022', '723737013', '1120533', NULL, NULL, NULL, 0, NULL),
(66, 'grace wamuyu.jpg', 'Grace Wamuyu', 'Mrs.', '0045', '716289539', '24682668', NULL, NULL, '{\"text\":\"\",\"href\":\"\"}', 1, NULL),
(68, 'kimani nduruko.jpg', 'kimani ndurungo', NULL, '0043', '770002027', '8149468', NULL, NULL, NULL, 0, NULL),
(69, 'mary kihanya.jpg', 'Mary Kihanya', NULL, '0011', '720955345', '7564839', NULL, NULL, NULL, 0, NULL),
(71, 'muchiri wachira.jpg', 'muchiri wachira', NULL, '0002', '721497136', '8978669', NULL, NULL, NULL, 0, NULL),
(73, 'samuel machua.jpg', 'Samuel Machua', 'mr', '0009', '722589382', '722075??', 'smmachua@meteo.go.ke', '', '{\"text\":\"\",\"href\":\"\"}', 1, ''),
(75, 'alice muthoni wangondu.jpg', 'alice muthoni wangondu', NULL, '0024', '0722784548', '1827793', 'alice.muthoni93@yahoo.com', 'Bussiness', '{\"text\":\"\",\"href\":\"\"}', 1, NULL),
(76, 'anastasia wamuyu githae.jpg', 'Anastasia Wamuyu Githae', NULL, '0035', '722621929', '7323650', NULL, NULL, NULL, 0, NULL),
(78, NULL, 'john g. mwango', NULL, '0007', '722821729', '4831198', NULL, NULL, NULL, 0, NULL),
(79, 'stephen njomo kanogo.jpg', 'stephen jomo kanogo', NULL, '0013', '722784591', '4435534', NULL, NULL, '{\"text\":\"\",\"href\":\"\"}', 1, NULL),
(80, NULL, 'mary n. kinuthia', NULL, '0014', '722864257', '3112676', NULL, NULL, NULL, 0, NULL),
(81, 'gerald murithi waiguchu.jpg', 'gerald mureithi waiguchu', '', '0020', '727467775', '23613', 'details', '', '{\"text\":\"\",\"href\":\"\"}', 1, 'testting'),
(82, 'samuel itahanyu gitau.jpg', 'Samuel Itahanyu Gitau', 'mr', '0028', '722685497', '8433695', 'rainierltd@yahoo.com', 'businessma', '{\"text\":\"\",\"href\":\"\"}', 1, NULL),
(83, 'stephen saitoti kapaiko.jpg', 'Stephen Saitot Kapaiko', NULL, '0034', '722489781', '4554851', NULL, NULL, '{\"text\":\"\",\"href\":\"\"}', 1, NULL),
(84, 'patrick wakori.jpg', 'Patrick Wakori', 'mr', '0038', '725307610', '4423195', NULL, NULL, '{\"text\":\"\",\"href\":\"\"}', 1, NULL),
(85, NULL, 'steve njuguna', NULL, '0048', '722484416', '8763037', 'Steve.njuguna@yahoo.com', NULL, '{\"text\":\"Mantrac logistics ltd\",\"href\":\"\"}', 1, NULL),
(86, NULL, 'vanessa mwangi', NULL, '0049', '722286701', '9825152', NULL, NULL, NULL, 0, NULL),
(87, NULL, 'John Kahihia Ngugi', 'capt', '0050', '722519609', '3493865', NULL, NULL, '{\"text\":\"\",\"href\":\"\"}', 1, NULL),
(88, NULL, 'George Kamau', 'capt', '0051', '719489206', '4243564', NULL, NULL, '{\"text\":\"\",\"href\":\"\"}', 1, NULL),
(89, NULL, 'geoffrey kinuthia', NULL, '0052', '719489206', '1065783', NULL, NULL, NULL, 0, NULL),
(91, NULL, 'joseph n. kimani', NULL, '0057', '722524702', '7274284', NULL, NULL, NULL, 0, NULL),
(92, NULL, 'jeremiah turere', NULL, '0060', NULL, '9022551', NULL, NULL, NULL, 0, NULL),
(93, '1494589815998-528139181.jpg', 'patrick gitonga', 'Mr', '0010', '722436859', '11678226', 'brelogs15@gmail.com', 'Businessme', '{\"text\":\"\",\"href\":\"\"}', 1, NULL),
(95, NULL, 'lucy ngendo', NULL, '0040', '722357955', '12763663', NULL, NULL, NULL, 0, NULL),
(96, NULL, 'cyrus mbuthia', NULL, '0046', '722819923', '11706445', NULL, NULL, NULL, 0, NULL),
(97, NULL, 'emmanuel saruni', NULL, '0047', '720325962', '31592945', NULL, NULL, NULL, 0, NULL),
(98, NULL, 'virginia wanjiru', NULL, '0053', NULL, '24776786', NULL, NULL, NULL, 0, NULL),
(99, NULL, 'silas k. koech', NULL, '0059', '722590809', '25720248', NULL, NULL, NULL, 0, NULL),
(102, 'IMG_20170322_102941.jpg', 'Silas shangu', 'mr', '', '0710330948', '28516028', '', '', '{\"text\":\"\",\"href\":\"\"}', 1, ''),
(106, 'tmp-cam-116919839.jpg', 'mbuthia gichuki', 'mr', '1106', '07240009', '11060143', 'mbuthia.gichuki@gmail.com', 'car dealer', '{\"text\":\"mbumar auto world\",\"href\":\"\"}', 1, 'Is your registration id correct?'),
(107, NULL, 'Stephen nduati', NULL, NULL, '0722858562', '3058155', 'nduati.Stephen @yahoo.com', 'Business', '{\"text\":\"\",\"href\":\"\"}', 0, NULL),
(108, 'tmp-cam-1767070886.jpg', 'Gabriel G Kimotho ', 'Mr ', NULL, '722868642', '7002396', 'ggwanjata @yahoo.com', 'translator', '{\"text\":\"starlink translation centre \",\"href\":\"\"}', 0, 'Great site'),
(109, 'IMG_1337.JPG', 'Isiah Mutonyi Marindany', 'MR', '', '0721 220918', '10273500', 'Immaridany@yahoo.com', '', '{\"text\":\"\",\"href\":\"\"}', 1, 'Kindly provide me with reg no.\n[Muraya. Find out from the secretary]'),
(110, NULL, 'Robert weru', 'mr', NULL, '0724749297', '10379304', 'githungoweru@gmail.com', 'businessma', '{\"text\":\"\",\"href\":\"\"}', 1, NULL),
(111, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{\"text\":\"\",\"href\":\"\"}', 0, NULL),
(112, '15720112188282102976225.jpg', 'Solomon', 'Mr', 'Xx', '0718332326', '34459574', NULL, NULL, '{\"text\":\"\",\"href\":\"\"}', 0, 'Test member');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `member`
--
ALTER TABLE `member`
  ADD PRIMARY KEY (`member`),
  ADD UNIQUE KEY `id` (`name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `member`
--
ALTER TABLE `member`
  MODIFY `member` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

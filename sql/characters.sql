-- Database export via SQLPro (https://www.sqlprostudio.com/allapps.html)
-- Exported by xen at 05-02-2024 14:31.
-- WARNING: This file may contain descructive statements such as DROPs.
-- Please ensure that you are running the script at the proper location.


-- BEGIN TABLE characters
DROP TABLE IF EXISTS characters;
CREATE TABLE `characters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `race` varchar(255) NOT NULL,
  `background` varchar(255) DEFAULT NULL,
  `alignment` varchar(255) DEFAULT NULL,
  `experience` int(11) DEFAULT 0,
  `strength` int(11) DEFAULT NULL,
  `dexterity` int(11) DEFAULT NULL,
  `constitution` int(11) DEFAULT NULL,
  `intelligence` int(11) DEFAULT NULL,
  `wisdom` int(11) DEFAULT NULL,
  `charisma` int(11) DEFAULT NULL,
  `hit_points` int(11) DEFAULT NULL,
  `temp_hit_points` int(11) DEFAULT 0,
  `armor_class` int(11) DEFAULT NULL,
  `initiative` int(11) DEFAULT NULL,
  `speed` int(11) DEFAULT NULL,
  `proficiency_bonus` int(11) DEFAULT NULL,
  `saving_throws` longtext DEFAULT NULL,
  `skills` longtext DEFAULT '{\n  "Acrobatics": {"proficient": false, "expertise": false},\n  "Animal Handling": {"proficient": false, "expertise": false},\n  "Arcana": {"proficient": false, "expertise": false},\n  "Athletics": {"proficient": false, "expertise": false},\n  "Deception": {"proficient": false, "expertise": false},\n  "History": {"proficient": false, "expertise": false},\n  "Insight": {"proficient": false, "expertise": false},\n  "Intimidation": {"proficient": false, "expertise": false},\n  "Investigation": {"proficient": false, "expertise": false},\n  "Medicine": {"proficient": false, "expertise": false},\n  "Nature": {"proficient": false, "expertise": false},\n  "Perception": {"proficient": false, "expertise": false},\n  "Performance": {"proficient": false, "expertise": false},\n  "Persuasion": {"proficient": false, "expertise": false},\n  "Religion": {"proficient": false, "expertise": false},\n  "Sleight of Hand": {"proficient": false, "expertise": false},\n  "Stealth": {"proficient": false, "expertise": false},\n  "Survival": {"proficient": false, "expertise": false}\n}',
  `features_traits` text DEFAULT NULL,
  `languages` text DEFAULT NULL,
  `equipment` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `spellcasting_ability` varchar(255) DEFAULT NULL,
  `spell_save_dc` int(11) DEFAULT NULL,
  `spell_attack_bonus` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `characters_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- END TABLE characters

-- BEGIN TABLE character_classes
DROP TABLE IF EXISTS character_classes;
CREATE TABLE `character_classes` (
  `character_id` int(11) NOT NULL,
  `class_name` varchar(255) NOT NULL,
  `class_level` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`character_id`,`class_name`),
  CONSTRAINT `fk_character` FOREIGN KEY (`character_id`) REFERENCES `characters` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- END TABLE character_classes
-- explorer.asset_stat definition

CREATE TABLE `asset_stat` (
  `chain_id` char(32) NOT NULL,
  `active_coins` char(40) NOT NULL DEFAULT '0',
  `stakes` char(40) NOT NULL DEFAULT '0',
  `delegates` char(40) NOT NULL DEFAULT '0',
  PRIMARY KEY (`chain_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- explorer.s_protocol definition

CREATE TABLE `s_protocol` (
  `chain_id` char(32) NOT NULL,
  `height` int(11) NOT NULL,
  `version` int(11) NOT NULL,
  PRIMARY KEY (`chain_id`,`height`,`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- explorer.c_blocks definition

CREATE TABLE `c_blocks` (
  `chain_id` char(32) NOT NULL,
  `height` int(11) NOT NULL,
  `time` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `hash` char(64) DEFAULT NULL,
  `num_txs` int(11) NOT NULL DEFAULT 0,
  `interval` float NOT NULL DEFAULT 0,
  `proposer` char(40) NOT NULL,
  `num_txs_valid` int(11) NOT NULL DEFAULT 0,
  `num_txs_invalid` int(11) NOT NULL DEFAULT 0,
  `validator_updates` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' CHECK (json_valid(`validator_updates`)),
  `events_begin` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]',
  `events_end` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' CHECK (json_valid(`events_end`)),
  PRIMARY KEY (`chain_id`,`height`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- explorer.c_genesis definition

CREATE TABLE `c_genesis` (
  `chain_id` char(32) NOT NULL,
  `genesis` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`genesis`)),
  PRIMARY KEY (`chain_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- explorer.play_stat definition

CREATE TABLE `play_stat` (
  `chain_id` char(32) NOT NULL,
  `height` int(11) NOT NULL,
  PRIMARY KEY (`chain_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- explorer.s_accounts definition

CREATE TABLE `s_accounts` (
  `chain_id` char(32) NOT NULL,
  `address` char(40) NOT NULL,
  `balance` char(40) NOT NULL DEFAULT '0',
  `stake` char(40) NOT NULL DEFAULT '0',
  `stake_locked` char(40) NOT NULL DEFAULT '0',
  `val_addr` char(40) DEFAULT NULL,
  `delegate` char(40) NOT NULL DEFAULT '0',
  `del_addr` char(40) DEFAULT NULL,
  `val_pubkey` char(64) DEFAULT NULL,
  `val_power` char(40) NOT NULL DEFAULT '0',
  `eff_stake` char(40) NOT NULL DEFAULT '0',
  PRIMARY KEY (`chain_id`,`address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- explorer.s_udcs definition

CREATE TABLE `s_udcs` (
  `chain_id` char(32) NOT NULL,
  `udc_id` int(11) NOT NULL,
  `owner` char(40) NOT NULL DEFAULT '',
  `desc` varchar(100) NOT NULL DEFAULT '',
  `operators` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' CHECK (json_valid(`operators`)),
  `total` char(40) NOT NULL DEFAULT '0',
  PRIMARY KEY (`chain_id`,`udc_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- explorer.s_incentives definition

CREATE TABLE `s_incentives` (
  `chain_id` char(32) NOT NULL,
  `height` int(11) NOT NULL,
  `address` char(40) NOT NULL,
  `amount` char(40) NOT NULL DEFAULT '0',
  PRIMARY KEY (`chain_id`,`height`,`address`),
  CONSTRAINT `inc_block_FK` FOREIGN KEY (`chain_id`, `height`) REFERENCES `c_blocks` (`chain_id`, `height`),
  CONSTRAINT `inc_account_FK` FOREIGN KEY (`chain_id`, `address`) REFERENCES `s_accounts` (`chain_id`, `address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- explorer.s_penalties definition

CREATE TABLE `s_penalties` (
  `chain_id` char(32) NOT NULL,
  `height` int(11) NOT NULL,
  `address` char(40) NOT NULL,
  `amount` char(40) NOT NULL DEFAULT '0',
  PRIMARY KEY (`chain_id`,`height`,`address`),
  CONSTRAINT `pen_block_FK` FOREIGN KEY (`chain_id`, `height`) REFERENCES `c_blocks` (`chain_id`, `height`),
  CONSTRAINT `pen_account_FK` FOREIGN KEY (`chain_id`, `address`) REFERENCES `s_accounts` (`chain_id`, `address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- explorer.c_txs definition

CREATE TABLE `c_txs` (
  `chain_id` char(32) NOT NULL,
  `height` int(11) NOT NULL,
  `index` int(11) NOT NULL,
  `hash` char(64) NOT NULL,
  `code` int(11) NOT NULL,
  `info` varchar(128) DEFAULT NULL,
  `type` char(32) NOT NULL,
  `sender` char(40) NOT NULL,
  `fee` char(40) NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `last_height` int(11) NOT NULL,
  `tx_bytes` int(11) NOT NULL,
  `events` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' CHECK (json_valid(`events`)),
  PRIMARY KEY (`chain_id`,`height`,`index`),
  KEY `txs_hash` (`chain_id`,`hash`) USING BTREE,
  KEY `txs_sender` (`chain_id`,`sender`) USING BTREE,
  CONSTRAINT `block_FK` FOREIGN KEY (`chain_id`, `height`) REFERENCES `c_blocks` (`chain_id`, `height`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- explorer.r_account_block definition

CREATE TABLE `r_account_block` (
  `seq` int(11) NOT NULL AUTO_INCREMENT,
  `chain_id` char(32) NOT NULL,
  `address` char(40) NOT NULL,
  `height` int(11) NOT NULL,
  `amount` char(40) NOT NULL DEFAULT '0',
  PRIMARY KEY (`seq`),
  KEY `r_account_block_FK` (`chain_id`,`address`),
  KEY `r_account_block_FK_1` (`chain_id`,`height`),
  CONSTRAINT `r_account_block_FK` FOREIGN KEY (`chain_id`, `address`) REFERENCES `s_accounts` (`chain_id`, `address`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `r_account_block_FK_1` FOREIGN KEY (`chain_id`, `height`) REFERENCES `c_blocks` (`chain_id`, `height`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1109313 DEFAULT CHARSET=utf8mb4;


-- explorer.r_account_tx definition

CREATE TABLE `r_account_tx` (
  `seq` int(11) NOT NULL AUTO_INCREMENT,
  `chain_id` char(32) NOT NULL,
  `address` char(40) NOT NULL,
  `height` int(11) NOT NULL,
  `index` int(11) NOT NULL,
  `amount` char(40) NOT NULL DEFAULT '0',
  PRIMARY KEY (`seq`),
  KEY `r_account_tx_FK` (`chain_id`,`address`),
  KEY `r_account_tx_FK_1` (`chain_id`,`height`,`index`),
  CONSTRAINT `r_account_tx_FK` FOREIGN KEY (`chain_id`, `address`) REFERENCES `s_accounts` (`chain_id`, `address`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `r_account_tx_FK_1` FOREIGN KEY (`chain_id`, `height`, `index`) REFERENCES `c_txs` (`chain_id`, `height`, `index`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6453 DEFAULT CHARSET=utf8mb4;


-- explorer.s_drafts definition

CREATE TABLE `s_drafts` (
  `chain_id` char(32) NOT NULL,
  `draft_id` int(11) NOT NULL,
  `proposer` char(40) NOT NULL DEFAULT '',
  `config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '{}' CHECK (json_valid(`config`)),
  `desc` varchar(100) NOT NULL DEFAULT '',
  `open_count` int(11) NOT NULL DEFAULT 0,
  `close_count` int(11) NOT NULL DEFAULT 0,
  `apply_count` int(11) NOT NULL DEFAULT 0,
  `deposit` char(40) NOT NULL DEFAULT '0',
  `tally_approve` char(40) NOT NULL DEFAULT '0',
  `tally_reject` char(40) NOT NULL DEFAULT '0',
  `proposed_at` int(11) NOT NULL DEFAULT 0,
  `closed_at` int(11) NOT NULL DEFAULT 0,
  `applied_at` int(11) NOT NULL DEFAULT 0,
  `tally_quorum` char(40) NOT NULL DEFAULT '0',
  PRIMARY KEY (`chain_id`,`draft_id`),
  KEY `s_storages_FK` (`chain_id`,`proposer`) USING BTREE,
  CONSTRAINT `s_storages_FK_copy` FOREIGN KEY (`chain_id`, `proposer`) REFERENCES `s_accounts` (`chain_id`, `address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- explorer.s_storages definition

CREATE TABLE `s_storages` (
  `chain_id` char(32) NOT NULL,
  `storage_id` int(11) NOT NULL,
  `url` varchar(100) DEFAULT NULL,
  `registration_fee` char(40) NOT NULL DEFAULT '0',
  `hosting_fee` char(40) NOT NULL DEFAULT '0',
  `owner` char(40) NOT NULL DEFAULT '',
  `active` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`chain_id`,`storage_id`),
  KEY `s_storages_FK` (`chain_id`,`owner`),
  CONSTRAINT `s_storages_FK` FOREIGN KEY (`chain_id`, `owner`) REFERENCES `s_accounts` (`chain_id`, `address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- explorer.s_udc_balances definition

CREATE TABLE `s_udc_balances` (
  `chain_id` char(32) NOT NULL,
  `udc_id` int(11) NOT NULL,
  `address` char(40) NOT NULL,
  `balance` char(40) NOT NULL DEFAULT '0',
  `balance_lock` char(40) NOT NULL DEFAULT '0',
  PRIMARY KEY (`chain_id`,`udc_id`,`address`),
  CONSTRAINT `s_udc_balances_FK` FOREIGN KEY (`chain_id`, `udc_id`) REFERENCES `s_udcs` (`chain_id`, `udc_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- explorer.s_votes definition

CREATE TABLE `s_votes` (
  `chain_id` char(32) NOT NULL,
  `draft_id` int(11) NOT NULL,
  `voter` char(40) NOT NULL,
  `approve` tinyint(1) NOT NULL DEFAULT 0,
  `tally` char(40) NOT NULL DEFAULT '0',
  PRIMARY KEY (`chain_id`,`draft_id`,`voter`),
  KEY `s_storages_FK` (`chain_id`,`voter`) USING BTREE,
  CONSTRAINT `s_votes_FK` FOREIGN KEY (`chain_id`, `draft_id`) REFERENCES `s_drafts` (`chain_id`, `draft_id`),
  CONSTRAINT `s_votes_FK_1` FOREIGN KEY (`chain_id`, `voter`) REFERENCES `s_accounts` (`chain_id`, `address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- explorer.s_parcels definition

CREATE TABLE `s_parcels` (
  `chain_id` char(32) NOT NULL,
  `parcel_id` char(72) NOT NULL,
  `storage_id` int(11) NOT NULL,
  `owner` char(40) NOT NULL DEFAULT '',
  `custody` varchar(100) NOT NULL DEFAULT '',
  `proxy_account` char(40) DEFAULT NULL,
  `extra` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '{}' CHECK (json_valid(`extra`)),
  `on_sale` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`chain_id`,`parcel_id`),
  KEY `s_parcels_FK` (`chain_id`,`storage_id`),
  KEY `s_parcels_FK_1` (`chain_id`,`owner`),
  CONSTRAINT `s_parcels_FK` FOREIGN KEY (`chain_id`, `storage_id`) REFERENCES `s_storages` (`chain_id`, `storage_id`),
  CONSTRAINT `s_parcels_FK_1` FOREIGN KEY (`chain_id`, `owner`) REFERENCES `s_accounts` (`chain_id`, `address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- explorer.s_requests definition

CREATE TABLE `s_requests` (
  `chain_id` char(32) NOT NULL,
  `parcel_id` char(72) NOT NULL,
  `buyer` char(40) NOT NULL,
  `payment` char(40) NOT NULL DEFAULT '0',
  `dealer` char(40) DEFAULT NULL,
  `dealer_fee` char(40) NOT NULL DEFAULT '0',
  `extra` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '{}' CHECK (json_valid(`extra`)),
  PRIMARY KEY (`chain_id`,`parcel_id`,`buyer`),
  KEY `s_requests_FK_1` (`chain_id`,`buyer`),
  CONSTRAINT `s_requests_FK` FOREIGN KEY (`chain_id`, `parcel_id`) REFERENCES `s_parcels` (`chain_id`, `parcel_id`),
  CONSTRAINT `s_requests_FK_1` FOREIGN KEY (`chain_id`, `buyer`) REFERENCES `s_accounts` (`chain_id`, `address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- explorer.s_usages definition

CREATE TABLE `s_usages` (
  `chain_id` char(32) NOT NULL,
  `parcel_id` char(72) NOT NULL,
  `grantee` char(40) NOT NULL,
  `custody` varchar(100) NOT NULL DEFAULT '',
  `extra` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '{}',
  PRIMARY KEY (`chain_id`,`parcel_id`,`grantee`),
  KEY `s_requests_FK_1` (`chain_id`,`grantee`) USING BTREE,
  CONSTRAINT `s_requests_FK_1_copy` FOREIGN KEY (`chain_id`, `grantee`) REFERENCES `s_accounts` (`chain_id`, `address`),
  CONSTRAINT `s_requests_FK_copy` FOREIGN KEY (`chain_id`, `parcel_id`) REFERENCES `s_parcels` (`chain_id`, `parcel_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- explorer.nodes definition (insert, update)

CREATE TABLE `nodes` (
  `chain_id` char(32) NOT NULL,
  `node_id` char(40) NOT NULL,
  `timestamp` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `moniker` varchar(40) NOT NULL,
  `ip_addr` int(11) unsigned NOT NULL default 0,
  PRIMARY KEY (`chain_id`, `node_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- explorer.node_history definition (insert)

CREATE TABLE `node_history` (
  `chain_id` char(32) NOT NULL,
  `node_id` char(40) NOT NULL,
  `timestamp` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `n_peers` int(11) NOT NULL default 0,
  `val_addr` char(40) NOT NULL,
  `latest_block_time` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `latest_block_height` int(11) NOT NULL,
  `catching_up` boolean NOT NULL default false,
  `elapsed` float(8,6) NOT NULL default 0,
  `online` boolean NOT NULL default false,
  PRIMARY KEY (`chain_id`, `node_id`, `timestamp`),
  CONSTRAINT `nodes_FK` FOREIGN KEY (`chain_id`, `node_id`) REFERENCES `nodes` (`chain_id`, `node_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- explorer.r_parcel_tx definition

CREATE TABLE `r_parcel_tx` (
  `seq` int(11) NOT NULL AUTO_INCREMENT,
  `chain_id` char(32) NOT NULL,
  `parcel_id` char(72) NOT NULL,
  `height` int(11) NOT NULL,
  `index` int(11) NOT NULL,
  PRIMARY KEY (`seq`),
  KEY `r_parcel_tx_FK` (`chain_id`,`parcel_id`),
  KEY `r_parcel_tx_FK_1` (`chain_id`,`height`,`index`),
  CONSTRAINT `r_parcel_tx_FK` FOREIGN KEY (`chain_id`, `parcel_id`) REFERENCES `s_parcels` (`chain_id`, `parcel_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `r_parcel_tx_FK_1` FOREIGN KEY (`chain_id`, `height`, `index`) REFERENCES `c_txs` (`chain_id`, `height`, `index`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

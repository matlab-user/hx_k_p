
CREATE DATABASE IF NOT EXISTS `hx_k_db` DEFAULT CHARACTER SET `utf8`;

CREATE TABLE IF NOT EXISTS hx_k_db.user_t (
	`id` BIGINT NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(60) DEFAULT 'Anonymous',
	`passwd` VARCHAR(32) NOT NULL DEFAULT 'NULL',
	`type` ENUM('admin','normal') NOT NULL DEFAULT 'normal',
	`valid` BOOLEAN DEFAULT 1,
	PRIMARY KEY ( `id` )
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS hx_k_db.dev_t (
	`gid` CHAR(32) UNIQUE DEFAULT '',
	`name` VARCHAR(32) DEFAULT '肾移植箱',
	`intv` INT DEFAULT 60,	
	`d_ip` VARCHAR(65) DEFAULT '',
	`d_port` INT DEFAULT -1,
	`l_ip` VARCHAR(65) DEFAULT '',
	`l_port` INT DEFAULT -1,
	PRIMARY KEY ( `gid` )
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS hx_k_db.data_t (
	`id` BIGINT NOT NULL AUTO_INCREMENT,
	`dev_id` CHAR(32) NOT NULL,
	`value` DOUBLE DEFAULT 0,
	`v_name` VARCHAR(50) DEFAULT '',
	`time` BIGINT NOT NULL,
	PRIMARY KEY ( `id` )
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO hx_k_db.user_t ( id, name, passwd, type ) VALUES ( 1, 'admin', MD5('adminadmin'), 'admin' );
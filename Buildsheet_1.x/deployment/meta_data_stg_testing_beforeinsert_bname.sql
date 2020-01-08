DROP TRIGGER IF EXISTS meta_data_beforeinsert_bname;
DELIMITER $$
CREATE
TRIGGER meta_data_beforeinsert_bname
BEFORE INSERT ON `meta_data` FOR EACH ROW
BEGIN
 SET NEW.buildsheet_name = lower(concat(NEW.aco_name,'_',NEW.source_name,'_',IFNULL(NEW.l2_table,'')));
END$$
DELIMITER ;
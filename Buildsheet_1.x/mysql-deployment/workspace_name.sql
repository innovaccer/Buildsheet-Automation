DROP TRIGGER IF EXISTS buildsheet_workspaces_beforeinsert;
DELIMITER $$
CREATE
TRIGGER buildsheet_workspaces_beforeinsert
BEFORE INSERT ON `buildsheet_workspaces` FOR EACH ROW
BEGIN
 SET NEW.workspace_name = lower(concat(NEW.aco_name,'_',NEW.source_name));
END$$
DELIMITER ;
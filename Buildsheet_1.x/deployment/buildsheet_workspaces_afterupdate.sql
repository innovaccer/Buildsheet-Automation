DROP TRIGGER IF EXISTS buildsheet_workspaces_afterupdate;
DELIMITER $$
CREATE
TRIGGER buildsheet_workspaces_afterupdate
AFTER UPDATE ON `buildsheet_workspaces` FOR EACH ROW
BEGIN

UPDATE meta_data
SET 
    source_id = NEW.source_id,
    source_name = NEW.source_name,
    vendor_name = NEW.vendor_name,
    vendor_version = NEW.vendor_version,
    aco_id = NEW.aco_id,
    aco_name = NEW.aco_name
    WHERE buildsheet_workspaces_id = NEW.id;
    
UPDATE buildsheet_data
SET rule = NEW.aco_id WHERE buildsheet_workspaces_id = NEW.id AND destination_column = 'aco_id';

UPDATE buildsheet_data
SET rule = NEW.aco_name WHERE buildsheet_workspaces_id = NEW.id AND destination_column = 'aco_name';

UPDATE buildsheet_data
SET rule = NEW.source_id WHERE buildsheet_workspaces_id = NEW.id AND destination_column = 'source_id';

UPDATE buildsheet_data
SET rule = NEW.source_name WHERE buildsheet_workspaces_id = NEW.id AND destination_column = 'source_name';

UPDATE buildsheet_data
SET rule = NEW.vendor_name WHERE buildsheet_workspaces_id = NEW.id AND destination_column = 'vendor_name';

UPDATE buildsheet_data
SET rule = NEW.vendor_version WHERE buildsheet_workspaces_id = NEW.id AND destination_column = 'vendor_version';

END$$
DELIMITER ;
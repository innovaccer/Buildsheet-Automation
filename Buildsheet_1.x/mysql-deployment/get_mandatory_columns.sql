DROP PROCEDURE IF EXISTS `get_mandatory_columns`;

DELIMITER $$
CREATE PROCEDURE `get_mandatory_columns`
(
IN olap_ver CHAR(1),
IN category_var varchar(255)
)

BEGIN

IF olap_ver = '6' THEN SET olap_ver = '7'; END IF;

SET @l2_tbl_var = (SELECT 
    id
FROM
    buildsheet_master
WHERE
    parent_id = 61 AND `name` = category_var);

SELECT 
    columns_name
FROM
    l2_mandatory_columns
WHERE
    mandatory_flag = '1'
        AND olap_version = olap_ver
        AND l2_table_id = @l2_tbl_var;

END$$
DELIMITER ;
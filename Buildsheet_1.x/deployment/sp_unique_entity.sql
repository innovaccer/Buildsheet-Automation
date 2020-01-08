DROP PROCEDURE IF EXISTS `sp_unique_entity`;

DELIMITER $$
CREATE PROCEDURE `sp_unique_entity`
(
IN aco_var varchar(5),
IN source_var varchar(20),
IN meta_var  varchar(20),
IN typ_var CHAR(2)
)

BEGIN

IF (select count(*) from buildsheet_data where meta_id = meta_var and unique_flag = '1') > 0 THEN

SET SQL_SAFE_UPDATES = 0;
DELETE from unique_entity where aco_id LIKE aco_var;
DELETE from unique_entity where source_id LIKE source_var;
DELETE from unique_entity where meta_id LIKE meta_var;
SET SQL_SAFE_UPDATES = 1;

IF aco_var = '' THEN SET aco_var = '%'; END IF;
IF source_var = '' THEN SET source_var = '%'; END IF;
IF meta_var = '' THEN SET meta_var = '%'; END IF; 
########################################################################L1 QUERY####################################################################
SET @no_rule = (SELECT 
   GROUP_CONCAT(CONCAT('(',alias,
            '.',
            source_column,')') SEPARATOR '||') from buildsheet_data 
            where unique_flag = '1' and aco_id like aco_var and source_id like source_var and meta_id like meta_var and rule_type = 'no_rule');

SET @concat = (SELECT group_concat(rule separator '||') from buildsheet_data 
where aco_id like aco_var and source_id like source_var and meta_id = meta_var and unique_flag = '1' and rule_type = 'concat');

SET @replacee = (SELECT group_concat(CONCAT('replace(TRIM(',alias,'.',source_column,'),',TRIM(SUBSTRING_INDEX(rule, 'with', 1)),',',
TRIM(SUBSTRING_INDEX(rule, 'with', - 1)),')')SEPARATOR '||') from buildsheet_data 
where aco_id like aco_var and source_id like source_var and meta_id = meta_var and unique_flag = '1' and rule_type = 'REPLACE');
            
SET @custom = (SELECT GROUP_CONCAT(CONCAT('(',rule,')')SEPARATOR '||') from buildsheet_data 
where aco_id like aco_var and source_id like source_var and meta_id = meta_var and unique_flag = '1' and rule_type = 'custom');

IF @custom is not null or @replacee is not null or @concat is not null then set @no_rule = concat(@no_rule,'||'); END IF;
IF @replacee is not null or @concat is not null then set @custom = concat(@custom,'||'); end if;
IF @concat is not null then set @replacee = concat(@replacee,'||'); end if;


SET @q = (select concat('SELECT COUNT(DISTINCT ',IFNULL(@no_rule,''),IFNULL(@custom,''),IFNULL(@replacee,''),IFNULL(@concat,''),')'));

SET @frm = (SELECT CONCAT('FROM ',l1_schema,'.',source_table,' AS ',alias,' ') FROM buildsheet_data WHERE rule_type = 'from' AND meta_id = meta_var);

SET @joinn = (SELECT GROUP_CONCAT(val SEPARATOR ' ') FROM (SELECT CONCAT(rule_type, ' ', l2_schema, '.', destination_table, ' AS ', alias, ' ON ', rule) val FROM buildsheet_data
WHERE meta_id = meta_var AND l2_schema != 'subquery' AND rule_type LIKE '%join%' ORDER BY id) x);

SET @sq = (SELECT GROUP_CONCAT(CONCAT(rule_type,' (',destination_table,') AS ',alias,' ON ',rule) SEPARATOR ' ')
FROM buildsheet_data WHERE l2_schema = 'subquery' AND meta_id = meta_var);

SET @wheree = (SELECT CONCAT(' WHERE ', rule) FROM buildsheet_data WHERE meta_id = meta_var AND rule_type = 'where');
########################################################################L2 QUERY####################################################################

SET @q_l2 = (select concat('SELECT COUNT(DISTINCT (',group_concat(concat('nvl(',destination_column,','''')') separator '||'),'))') from buildsheet_data where meta_id = meta_var and unique_flag = 1);

SET @frm_l2 = (select CONCAT(l2_schema,'.',destination_table) from buildsheet_data where meta_id = meta_var and unique_flag = 1 and rule_type not in('from','left join','right join','where') group by destination_table);

########################################################################DATA INSERT####################################################################

insert into unique_entity(aco_id,source_id,category,meta_id,l1_query,l2_query)
select aco_id,source_id,category,meta_id,concat(@q,IFNULL(@frm,''),IFNULL(@joinn,''),IFNULL(@sq,''),IFNULL(@wheree,''),';'),concat(@q_l2,' from ',@frm_l2,';')
from buildsheet_data where aco_id like aco_var and source_id like source_var and meta_id like meta_var
group by aco_id,source_id,meta_id;

IF typ_var = 'l1' THEN

select aco_id,source_id,category,meta_id,l1_query from unique_entity where aco_id like aco_var and source_id like source_var and meta_id like meta_var;

ELSEIF typ_var = 'l2' THEN

select aco_id,source_id,category,meta_id,l2_query from unique_entity where aco_id like aco_var and source_id like source_var and meta_id like meta_var;

END IF;

ELSE SELECT '';

END IF;

END$$
DELIMITER ;
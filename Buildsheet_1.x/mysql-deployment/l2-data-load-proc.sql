DROP PROCEDURE IF EXISTS `l2_data_load`;

DELIMITER $$
CREATE PROCEDURE `l2_data_load`(
IN alias_var varchar(4),
IN l1_schema_var varchar(20),
IN source_table_var  varchar(50),
IN source_column_var varchar(50),
IN rule_typ_var varchar(50),
IN rule_var text,
IN meta_id_var INT
)

BEGIN
#################################################################
SET
		@frm = 
(SELECT 
    CONCAT('FROM ',
            l1_schema,
            '.',
            source_table,
            ' AS ',
            alias,
            '
                                    ')
FROM
    buildsheet_proj_stg_testing
WHERE
    rule_type = 'from'
        AND meta_id = meta_id_var);

#################################################################
SET
		@joinn = 
(SELECT 
    GROUP_CONCAT(val
        SEPARATOR '
                                ')
FROM
    (SELECT 
        CONCAT(rule_type, ' ', l2_schema, '.', destination_table, ' AS ', alias, ' ON ', rule) val
    FROM
        buildsheet_proj_stg_testing
    WHERE
        meta_id = meta_id_var
            AND l2_schema != 'subquery'
            AND rule_type LIKE '%join%'
    ORDER BY id) x);

#################################################################

SET @sq = 
(SELECT 
    GROUP_CONCAT(CONCAT(rule_type,
                ' (',
                destination_table,
                ') AS ',
                alias,
                ' ON ',
                rule)
        SEPARATOR '
                ')
FROM
    buildsheet_proj_stg_testing
WHERE
    l2_schema = 'subquery'
        AND meta_id = meta_id_var);
        
#################################################################


IF rule_typ_var = 'no_rule' THEN
SELECT 
    CONCAT('select distinct (',
            alias_var,
            '.',
            source_column_var,
            ' :: varchar) ',
            @frm,
            ' ',
            IFNULL(@joinn, ''),
            ' ',
            IFNULL(@sq, '')) AS qry;
            
#################################################################
ELSEIF rule_typ_var = 'to_date' THEN
SELECT 
    CONCAT('select distinct (',
            rule_typ_var,
            '(',
            alias_var,
            '.',
            source_column_var,
            ',',
            rule_var,
            ') :: varchar)  ',
            @frm,
            ' ',
            IFNULL(@joinn, ''),
            ' ',
            IFNULL(@sq, '')) qry;

#################################################################
ELSEIF rule_typ_var = 'concat' THEN
SELECT 
    CONCAT('select distinct (',
            rule_var,
            ')  ',
            @frm,
            ' ',
            IFNULL(@joinn, ''),
            ' ',
            IFNULL(@sq, '')) qry;

#################################################################
ELSEIF rule_typ_var = 'REPLACE' THEN
SELECT 
    CONCAT('select distinct (replace(TRIM(',
            alias_var,
            '.',
            source_column_var,
            '),',
            TRIM(SUBSTRING_INDEX(rule_var, 'with', 1)),
            ',',
            TRIM(SUBSTRING_INDEX(rule_var, 'with', - 1)),
            '))  ',
            @frm,
            ' ',
            IFNULL(@joinn, ''),
            ' ',
            IFNULL(@sq, '')) qry;

#################################################################
ELSEIF rule_typ_var = 'custom' THEN    
SELECT 
    CONCAT('select distinct ',
            rule_var,
            ' ',
            @frm,
            ' ',
            IFNULL(@joinn, ''),
            ' ',
            IFNULL(@sq, '')) qry;

#################################################################
ELSEIF rule_typ_var = 'case' THEN

TRUNCATE TABLE casee_proc;
INSERT INTO casee_proc(id,alias,l1_schema,source_table,source_column,rule_typ,rule,meta_id)
SELECT '1',alias_var,l1_schema_var,source_table_var,source_column_var,rule_typ_var,rule_var,meta_id_var;

SELECT 
    CONCAT('select distinct ',
            z.val,
            ' from ',
            l1_schema_var,
            '.',
            source_table_var,
            ' as ',
            alias_var) qry
FROM
    (SELECT 
        (CONCAT('CASE ', GROUP_CONCAT(y.val
                SEPARATOR ' '), IFNULL(t2.val2, ''), '
                                     END ')) val
    FROM
        (SELECT 
        t.id,
            t.source_column,
            CONCAT('
                                     WHEN TRIM(', t.alias, '.', t.source_column, ') = ', TRIM(SUBSTRING_INDEX(t.rule, 'with', 1)), ' THEN ', SUBSTRING_INDEX(SUBSTRING_INDEX(t.rule, 'with', - 1), 'else', 1)) val
    FROM
        (SELECT 
        casee_proc.id,
            casee_proc.source_column,
            casee_proc.alias,
            SUBSTRING_INDEX(SUBSTRING_INDEX(casee_proc.rule, '|', num.n), '|', - 1) rule
    FROM
        num
    INNER JOIN casee_proc ON CHAR_LENGTH(casee_proc.rule) - CHAR_LENGTH(REPLACE(casee_proc.rule, '|', '')) >= num.n - 1
    ORDER BY id , n) t) y
    LEFT JOIN (SELECT 
        id,
            CONCAT('
                                    ELSE ', SUBSTRING_INDEX(LOWER(rule), 'else', - 1)) val2
    FROM
        casee_proc
    WHERE
        LOWER(rule) LIKE '%else%') t2 ON y.id = t2.id
    GROUP BY y.id) z;
    
#################################################################
ELSEIF rule_typ_var = 'hardcode' THEN
SELECT CONCAT('select distinct ', rule_var) qry;

#################################################################
ELSEIF rule_typ_var = 'GETDATE()' THEN
SELECT CONCAT('select distinct GETDATE() :: varchar') qry;

END IF;

END$$
DELIMITER ;
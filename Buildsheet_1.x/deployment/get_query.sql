DROP PROCEDURE IF EXISTS `dyn_query`;

DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `dyn_query`
(
IN meta_id_var int
)

BEGIN
DECLARE casee TEXT;
DECLARE query_var TEXT;
###########################################################################################################################################
#####################################################INSERT COLUMN VALUES##################################################################
#########################################################HARDCODE##########################################################################
	set
		@inst_hardcode =(
		select
			group_concat(destination_column SEPARATOR ', \n')
		from
			buildsheet_data
		where
			meta_id = meta_id_var
			and rule_type = 'hardcode'
		order by
			id);
	set
		@inst_hardcode = CONCAT(@inst_hardcode, ',\n');
########################################################CASE##################################################################################
	set
		@inst_case =(
		select
			group_concat(destination_column SEPARATOR ', \n')
		from
			buildsheet_data
		where
			meta_id = meta_id_var
			and rule_type = 'case'
		order by
			id);
	set
		@inst_case = CONCAT(@inst_case, ',\n');
######################################################REPLACE###################################################################################
	set
		@inst_replace =(
		select
			group_concat(destination_column SEPARATOR ', \n')
		from
			buildsheet_data
		where
			meta_id = meta_id_var
			and rule_type = 'replace'
		order by
			id);
	set
		@inst_replace = CONCAT(@inst_replace, ',\n');
######################################################REGEXP1############################################################################
	set
		@inst_regexp1 =(
		select
			group_concat(destination_column SEPARATOR ', \n')
		from
			buildsheet_data
		where
			meta_id = meta_id_var
			and rule_type LIKE 'regexp%'
			AND rule LIKE '%with%'
		order by
			id);
	set
		@inst_regexp1 = CONCAT(@inst_regexp1, ',\n');
####################################################REGEXP2###########################################################################
	set
		@inst_regexp2 =(
		select
			group_concat(destination_column SEPARATOR ', \n')
		from
			buildsheet_data
		where
			meta_id = meta_id_var
			and rule_type LIKE 'regexp%'
			AND rule NOT LIKE '%with%'
		order by
			id);
	set
		@inst_regexp2 = CONCAT(@inst_regexp2, ',\n');
######################################################TRIM#############################################################################
	set
		@inst_trim =(
		select
			group_concat(destination_column SEPARATOR ', \n')
		from
			buildsheet_data
		where
			meta_id = meta_id_var
			and rule_type = 'trim'
		order by
			id);
	set
		@inst_trim = CONCAT(@inst_trim, ',\n');
###############################################TO_DATE###############################################################################
	set
		@inst_todate =(
		select
			group_concat(destination_column SEPARATOR ', \n')
		from
			buildsheet_data
		where
			meta_id = meta_id_var
			and rule_type = 'to_date'
		order by
			id);
	set
		@inst_todate = CONCAT(@inst_todate, ',\n');
###############################################CONCAT####################################################################################
	set
		@concattt =(
		select
			group_concat(destination_column SEPARATOR ', \n')
		from
			buildsheet_data
		where
			meta_id = meta_id_var
			and rule_type = 'concat'
		order by
			id);
	set
		@concattt = CONCAT(@concattt, ',\n');
###################################################NO RULE#################################################################################
	set
		@inst_norule =(
		select
			group_concat(destination_column SEPARATOR ', \n')
		from
			buildsheet_data
		where
			meta_id = meta_id_var
			and rule_type = 'no_rule'
		order by
			id);
	set
		@inst_norule = CONCAT(@inst_norule, ',\n');
###################################################CUSTOM#################################################################################
	set
		@inst_custom =(
		select
			group_concat(destination_column SEPARATOR ', \n')
		from
			buildsheet_data
		where
			meta_id = meta_id_var
			and rule_type = 'custom'
		order by 
			id);
	set
		@inst_custom = CONCAT(@inst_custom, ',\n');
###################################################GETDATE#################################################################################
	set
		@inst_getdate =(
		select
			group_concat(destination_column SEPARATOR ', \n')
		from
			buildsheet_data
		where
			meta_id = meta_id_var
			and rule_type = 'GETDATE()'
		order by
			id);
	set
		@inst_getdate = CONCAT(@inst_getdate, ',\n');
###########################################################################################################################################
###########################################################################################################################################
###########################################################################################################################################

###########################################################################################################################################
#####################################################SELECT COLUMN VALUES##################################################################
###########################################################################################################################################
####################################################HARDCODE################################################################################
	SET
		@hardcode = 
        (SELECT 
    GROUP_CONCAT(CONCAT(rule,
                ' :: ',
                data_type_2,
                ' AS ',
                destination_column)
        SEPARATOR ', 
        ')
FROM
    buildsheet_data
WHERE
    rule_type = 'hardcode'
        AND meta_id = meta_id_var
ORDER BY id);
	SET
		@hardcode = CONCAT(@hardcode, ',\n');
##################################################REPLACE####################################################################################
	SET
		@replacee = 
(SELECT 
    GROUP_CONCAT(CONCAT('replace(TRIM(',
                alias,
                '.',
                source_column,
                '),\'',
                TRIM(SUBSTRING_INDEX(rule, 'with', 1)),
                '\',\'',
                TRIM(SUBSTRING_INDEX(rule, 'with', - 1)),
                '\') :: ',
                data_type_2,
                ' AS ',
                destination_column)
        SEPARATOR ', 
        ') str
FROM
    buildsheet_data
WHERE
    rule_type = 'replace'
        AND meta_id = meta_id_var
ORDER BY id);
	SET
		@replacee = CONCAT(@replacee, ',\n');
##################################################CASE###################################################################################
	SET
		casee = 
        (SELECT 
    GROUP_CONCAT(z.val
        SEPARATOR ', 
                ')
FROM
    (SELECT 
        (CONCAT('CASE ', GROUP_CONCAT(y.val
                SEPARATOR ' '), IFNULL(t2.val2, ''), '
                         END :: ', data_type_2, ' AS ', destination_column)) val
    FROM
        (SELECT 
        t.id,
            t.source_column,
            t.destination_column,
            t.data_type_2,
            CONCAT('
                         WHEN TRIM(', t.alias, '.', t.source_column, ') = ', TRIM(SUBSTRING_INDEX(t.rule, 'with', 1)), ' THEN ', SUBSTRING_INDEX(SUBSTRING_INDEX(t.rule, 'with', - 1), 'else', 1)) val
    FROM
        (SELECT 
        buildsheet_data.id,
            buildsheet_data.source_column,
            buildsheet_data.alias,
            buildsheet_data.destination_column,
            buildsheet_data.data_type_2,
            SUBSTRING_INDEX(SUBSTRING_INDEX(buildsheet_data.rule, '|', num.n), '|', - 1) rule
    FROM
        num
    INNER JOIN buildsheet_data ON CHAR_LENGTH(buildsheet_data.rule) - CHAR_LENGTH(REPLACE(buildsheet_data.rule, '|', '')) >= num.n - 1
    WHERE
        buildsheet_data.meta_id = meta_id_var
            AND buildsheet_data.rule_type = 'case'
    ORDER BY id , n) t) y
    LEFT JOIN (SELECT 
        id,
            CONCAT('
                        ELSE ', SUBSTRING_INDEX(LOWER(rule), 'else', - 1)) val2
    FROM
        buildsheet_data
    WHERE
        meta_id = meta_id_var
            AND rule_type = 'case'
            AND LOWER(rule) LIKE '%else%') t2 ON y.id = t2.id
    GROUP BY y.id) z);
	SET
		casee = CONCAT(casee, ',\n');
####################################################REGEX################################################################################
	SET
		@regex1 = 
(SELECT 
    GROUP_CONCAT(CONCAT(rule_type,
                '(',
                alias,
                '.',
                source_column,
                ',\'',
                TRIM(SUBSTRING_INDEX(rule, 'with', 1)),
                '\',',
                TRIM(SUBSTRING_INDEX(rule, 'with', - 1)),
                ') ::',
                data_type_2,
                ' AS ',
                destination_column)
        SEPARATOR ', 
        ')
FROM
    buildsheet_data
WHERE
    rule_type LIKE 'regexp%'
        AND rule LIKE '%with%'
        AND meta_id = meta_id_var
ORDER BY id);
	SET
		@regex1 = CONCAT(@regex1, ',\n');
###################################################REGEXP2#################################################################################
	SET
		@regex2 = 
(SELECT 
    GROUP_CONCAT(CONCAT(rule_type,
                '(',
                alias,
                '.',
                source_column,
                ',\'',
                rule,
                '\') :: ',
                data_type_2,
                ' AS ',
                destination_column)
        SEPARATOR ', 
        ')
FROM
    buildsheet_data
WHERE
    rule_type LIKE 'regexp%'
        AND rule NOT LIKE '%with%'
        AND meta_id = meta_id_var
ORDER BY id);
	SET
		@regex2 = CONCAT(@regex2, ',\n');
#####################################################TRIM##############################################################################
	SET
		@trimm = 
(SELECT 
    GROUP_CONCAT(CONCAT(' TRIM(',
                alias,
                '.',
                source_column,
                ') :: ',
                data_type_2,
                ' AS ',
                destination_column)
        SEPARATOR ', 
        ')
FROM
    buildsheet_data
WHERE
    rule_type = 'trim'
        AND meta_id = meta_id_var
ORDER BY id);
	SET
		@trimm = CONCAT(@trimm, ',\n');
###################################################TO_DATE################################################################################
	SET
		@todate = 
(SELECT 
    GROUP_CONCAT(CONCAT(rule_type,
                '(',
                alias,
                '.',
                source_column,
                ',\'',
                rule,
                '\') :: ',
                data_type_2,
                ' AS ',
                destination_column)
        SEPARATOR ', 
        ')
FROM
    buildsheet_data
WHERE
    rule_type = 'to_date'
        AND meta_id = meta_id_var
ORDER BY id);
	SET
		@todate = CONCAT(@todate, ',\n');
######################################################CONCAT############################################################################
	set
		@concatt =
(SELECT 
    GROUP_CONCAT(CONCAT(rule,
                ' :: ',
                data_type_2,
                ' AS ',
                destination_column)
        SEPARATOR ', 
        ')
FROM
    buildsheet_data
WHERE
    meta_id = meta_id_var
        AND rule_type = 'concat'
ORDER BY id);
	SET
		@concatt = CONCAT(@concatt, ',\n');
#####################################################NO_RULE############################################################################
	set
		@no_rule = 
(SELECT 
    GROUP_CONCAT(CONCAT('TRIM(',
                alias,
                '.',
                source_column,
                ') :: ',
                data_type_2,
                ' AS ',
                destination_column)
        SEPARATOR ', 
        ')
FROM
    buildsheet_data
WHERE
    rule_type = 'no_rule'
        AND meta_id = meta_id_var
ORDER BY id);
	SET
		@no_rule = CONCAT(@no_rule, ',\n');
#####################################################CUSTOM############################################################################
SET @custom = 
(SELECT 
    GROUP_CONCAT(CONCAT('(',
                rule,
                ') :: ',
                data_type_2,
                ' AS ',
                destination_column)
        SEPARATOR ',
                ')
FROM
    buildsheet_data
WHERE
    meta_id = meta_id_var
        AND rule_type = 'custom');
        
SET @custom = CONCAT(@custom, ',\n');
#####################################################GETDATE############################################################################
SET @getdate = 
(SELECT 
    GROUP_CONCAT(CONCAT('GETDATE() :: datetime AS ',
                destination_column)
        SEPARATOR ',
                ')
FROM
    buildsheet_data
WHERE
    meta_id = meta_id_var
        AND rule_type = 'GETDATE()');
        
SET @getdate = CONCAT(@getdate, ',\n');
###########################################################################################################################################
###########################################################################################################################################
###########################################################################################################################################

########################################################################FROM###############################################################
/*	SET
		@frm = (
SELECT
			CONCAT('FROM ',a.l1_schema,'.', a.source_table,' AS ',b.rule, '\n')
		FROM
			buildsheet_data a join 
            (select source_table,rule from buildsheet_data where meta_id = meta_id_var and rule_type = 'alias')b
            on a.source_table = b.source_table
		WHERE
			rule_type = 'from'
			and meta_id = meta_id_var); */
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
    buildsheet_data
WHERE
    rule_type = 'from'
        AND meta_id = meta_id_var);
###########################################################################################################################################
############################################################JOIN###########################################################################
/*	SET
		@joinn = (SELECT 
    GROUP_CONCAT(val
        SEPARATOR '
                ') val
FROM
    (SELECT 
        CONCAT(rule_type, ' ', l2_schema, '.', destination_table, ' AS ', d_alias, ' ON ', val) val
    FROM
        (SELECT 
        id,
            l1_schema,
            source_table,
            l2_schema,
            destination_table,
            s_alias,
            d_alias,
            rule_type,
            GROUP_CONCAT(CONCAT(s_alias, '.', SUBSTRING_INDEX(rule, '=', 1), ' = ', d_alias, '.', SUBSTRING_INDEX(rule, '=', - 1))
                SEPARATOR ' AND ') val
    FROM
        (SELECT 
        buildsheet_data.id,
            buildsheet_data.l1_schema,
            buildsheet_data.source_table,
            buildsheet_data.l2_schema,
            buildsheet_data.destination_table,
            rule_type,
            SUBSTRING_INDEX(SUBSTRING_INDEX(buildsheet_data.rule, '|', num.n), '|', - 1) rule,
            t1.s_alias,
            t2.d_alias
    FROM
        num
    INNER JOIN buildsheet_data ON CHAR_LENGTH(buildsheet_data.rule) - CHAR_LENGTH(REPLACE(buildsheet_data.rule, '|', '')) >= num.n - 1
    INNER JOIN (SELECT 
        source_table, rule AS s_alias
    FROM
        buildsheet_data
    WHERE
        meta_id = meta_id_var
            AND rule_type = 'alias') t1 ON buildsheet_data.source_table = t1.source_table
    INNER JOIN (SELECT 
        source_table, rule AS d_alias
    FROM
        buildsheet_data
    WHERE
        meta_id = meta_id_var
            AND rule_type = 'alias') t2 ON buildsheet_data.destination_table = t2.source_table
    WHERE
        buildsheet_data.meta_id = meta_id_var
            AND buildsheet_data.rule_type LIKE '%join%'
    ORDER BY id , n) x
    GROUP BY id) y) z);
    */
    
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
        buildsheet_data
    WHERE
        meta_id = meta_id_var
            AND l2_schema != 'subquery'
            AND rule_type LIKE '%join%'
    ORDER BY id) x);

###########################################################################################################################################
############################################################SUBQUERY#######################################################################

SET @sq = (SELECT 
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
    buildsheet_data
WHERE
    l2_schema = 'subquery'
        AND meta_id = meta_id_var);

###########################################################################################################################################
#########################################################WHERE#############################################################################
	SET
		@wheree = 
(SELECT 
    CONCAT('WHERE ', rule)
FROM
    buildsheet_data
WHERE
    meta_id = meta_id_var
        AND rule_type = 'where');
###########################################################################################################################################
####################################################DESTINATION TABLE######################################################################
	SET
		@destn_tbl = 
(SELECT DISTINCT
    destination_table
FROM
    buildsheet_data
WHERE
    meta_id = meta_id_var
        AND rule_type NOT IN ('where' , 'from', '')
        AND LOWER(rule_type) NOT LIKE '%join%'
        AND destination_table IS NOT NULL
LIMIT 1);
###########################################################################################################################################
#####################################################SET VARIABLES#########################################################################
	SET
		@instr_clmns = CONCAT(IFNULL(@inst_hardcode, ''), IFNULL(@inst_getdate,''),IFNULL(@inst_replace, ''), IFNULL(@inst_trim, ''), IFNULL(@inst_regexp1, ''), IFNULL(@inst_regexp2, ''), IFNULL(@inst_todate, ''), IFNULL(@concattt, ''), IFNULL(@inst_case, ''),IFNULL(@inst_custom,''), IFNULL(@inst_norule, ''));
    SET
		@select_clmns = CONCAT(IFNULL(@hardcode, ''),IFNULL(@getdate,''), IFNULL(@replacee, ''), IFNULL(@trimm, ''), IFNULL(@regex1, ''), IFNULL(@regex2, ''), IFNULL(@todate, ''), IFNULL(@concatt, ''), IFNULL(casee, ''),IFNULL(@custom,''), IFNULL(@no_rule, ''));
	SET
		@instr_clmns = TRIM(TRAILING ',\n' FROM @instr_clmns);
	SET
		@select_clmns = TRIM(TRAILING ',\n' FROM @select_clmns);
	SET
		query_var = CONCAT('INSERT INTO ', @destn_tbl, '\n(\n', @instr_clmns, '\n)\n', 'SELECT DISTINCT \n', @select_clmns,'\n', IFNULL(@frm, ''), ' ', IFNULL(@joinn, ''), IFNULL(@sq,''),'\n' ,IFNULL(@wheree, ''), ';');
    SELECT
		query_var;
###########################################################################################################################################
END$$
DELIMITER ;
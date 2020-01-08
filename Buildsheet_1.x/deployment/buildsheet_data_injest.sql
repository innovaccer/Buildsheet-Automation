use buildsheet_project;

DROP PROCEDURE IF EXISTS `buildsheet_data_ingest`;

DELIMITER $$
CREATE PROCEDURE `buildsheet_data_ingest`
(
IN meta_var  int,
IN typ tinyint
)

BEGIN
DECLARE col_var text;

SET @@group_concat_max_len = 18446744073709551615;

SET @l2_schema = (select l2_schema from meta_data where id = meta_var);

SET @aco_id = (SELECT 
    aco_id
FROM
    buildsheet_data
WHERE
    meta_id = meta_var
LIMIT 1);

SET @source_id = (SELECT 
    source_id
FROM
    buildsheet_data
WHERE
    meta_id = meta_var
LIMIT 1);

SET @cat_var = (SELECT 
    category
FROM
    buildsheet_data
WHERE
    meta_id = meta_var
LIMIT 1);

SET col_var = (SELECT 
    GROUP_CONCAT(CONCAT(destination_column, ' ', data_type))
FROM
    buildsheet_data
WHERE
    meta_id = meta_var
        AND rule_type NOT IN ('where' , 'left join',
        'inner join',
        'right join',
        'from'));
        
SET @col_insrt_var = (SELECT 
    (GROUP_CONCAT(destination_column))
FROM
    buildsheet_data
WHERE
    meta_id = meta_var
        AND rule_type NOT IN ('where' , 'left join',
        'inner join',
        'right join',
        'from'));
        
SET @col_select_var = (SELECT 
    (GROUP_CONCAT(@l2_schema,'.',@cat_var,'_',@aco_id,
                        '_',
                        @source_id,'.',destination_column))
FROM
    buildsheet_data
WHERE
    meta_id = meta_var
        AND rule_type NOT IN ('where' , 'left join',
        'inner join',
        'right join',
        'from'));
        
SET @join_b = (SELECT 
    CONCAT('(',
            GROUP_CONCAT(CONCAT( @l2_schema,'.',@cat_var,'_',@aco_id,
                        '_',
                        @source_id,
                        '.',
                        destination_column)
                SEPARATOR '||'),
            ')')
FROM
    buildsheet_data
WHERE
    meta_id = meta_var AND unique_flag = '1');
    
SET @join_a = (SELECT 
    CONCAT('(',
            GROUP_CONCAT(CONCAT(@l2_schema,'.',@cat_var, '.', destination_column)
                SEPARATOR '||'),
            ')')
FROM
    buildsheet_data
WHERE
    meta_id = meta_var AND unique_flag = '1');
    
SET @update_col = (SELECT 
    GROUP_CONCAT(CONCAT(
                destination_column,
                ' = ',
                @cat_var,'_',
                @aco_id,
                '_',
                @source_id,
                '.',
                destination_column))
FROM
    buildsheet_data
WHERE
    meta_id = meta_var
        AND rule_type NOT IN ('where' , 'left join',
        'inner join',
        'right join',
        'from'));

IF typ = 1 THEN

SELECT 
    CONCAT('drop table if exists ',
            @l2_schema,
            '.',
            @cat_var,
            '_',
            @aco_id,
            '_',
            @source_id,
            '; create table ',
            @l2_schema,
            '.',
            @cat_var,
            '_',
            @aco_id,
            '_',
            @source_id,
            '(',
            col_var,
            ');') qry;

ELSEIF typ = 2 THEN

CALL dyn_query_data_injest(meta_var);

ELSEIF typ = 3 THEN

SELECT 
    CONCAT('update ',
            @l2_schema,
            '.',
            @cat_var,
            ' set ',
            @update_col,
            ' from ',
            @l2_schema,
            '.',
            @cat_var,
            '_',
            @aco_id,
            '_',
            @source_id,
            ' where ',
            @join_a,
            ' = ',
            @join_b,
            ';') qry;

ELSEIF typ = 4 THEN
-- select @l2_schema,@cat_var,@col_insrt_var,@col_select_var,@aco_id,@source_id,@join_b,@join_a;
SELECT 
    CONCAT('insert into ',
            @l2_schema,
            '.',
            @cat_var,
            '(',
            @col_insrt_var,
            ') select ',
            @col_select_var,
            ' from ',
            @l2_schema,
            '.',
            @cat_var,
            '_',
            @aco_id,
            '_',
            @source_id,
            ' left join ',
            @l2_schema,
            '.',
            @cat_var,
            ' on ',
            IFNULL(@join_b, ''),
            ' = ',
            IFNULL(@join_a, ''),
            ' where ',
            IFNULL(@join_a, ''),
            ' is null ;') qry;

ELSEIF typ = 5 THEN

SELECT 
    CONCAT('drop table ',
            @l2_schema,
            '.',
            @cat_var,
            '_',
            @aco_id,
            '_',
            @source_id,
            ';') qry;

END IF;
END$$
DELIMITER ;

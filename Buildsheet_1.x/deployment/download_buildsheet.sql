DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `dwn_buildsheet`(IN aco_id_var varchar(10),IN source_id_var  varchar(10),meta_id_var varchar(20),IN rep_typ varchar(20))
BEGIN
IF aco_id_var = '' THEN SET aco_id_var = '%'; END IF;
IF source_id_var = '' THEN SET source_id_var = '%'; END IF;
IF meta_id_var = '' THEN SET meta_id_var = '%'; END IF;
-- IF workflow_var = '' THEN set workflow_var = '%'; end if;
-- IF workflow_var = '' THEN set workflow_var = '%'; end if;
-- IF vendor_var = '' THEN set vendor_var = '%'; end if;
-- IF v_ver = '' THEN set v_ver = '%'; end if;
/*
SET @f_id=(SELECT 
    id
FROM
    meta_data_stg_testing
WHERE
    aco_id LIKE aco_var
        AND source_id LIKE source_var
        AND workflow_id LIKE workflow_var
        AND vendor_name LIKE vendor_var
        AND vendor_version LIKE v_ver);
        */
        
IF rep_typ = 'download' THEN

SELECT 
    category,
    alias,
    l1_schema,
    source_table,
    source_column,
    unique_flag,
    rule_type AS rule,
    rule AS transformation,
    l2_schema,
    destination_table,
    destination_column,
    data_type,
    created,
    modified
FROM
    buildsheet_data
WHERE
    aco_id LIKE aco_id_var
        AND source_id LIKE source_id_var
        AND meta_id LIKE meta_id_var;
    
ELSEIF rep_typ = 'report' THEN

SELECT 
    category,
    source_table,
    source_column,
    rule_type AS rule,
    rule AS transformation,
    destination_table,
    destination_column,
    IFNULL(l1_total_cnt_wf, 0) l1_total_cnt_wf,
    IFNULL(l1_unq_cnt_wf, 0) l1_unq_cnt_wf,
    IFNULL(l1_total_cnt, 0) l1_total_cnt,
    IFNULL(l1_unq_cnt, 0) l1_unq_cnt,
    IFNULL(l2_total_cnt, 0) l2_total_cnt,
    IFNULL(l2_unq_cnt, 0) l2_unq_cnt,
    (IFNULL(l1_total_cnt, 0) - IFNULL(l2_total_cnt, 0)) pre_post_diff,
    (IFNULL(l1_unq_cnt, 0) - IFNULL(l2_unq_cnt, 0)) pre_post_unq_diff,
    IFNULL(semantic_match, 'NA') semantic_match,
    (CASE
        WHEN semantic_match IS NOT NULL THEN (IFNULL(l2_total_cnt, 0) - IFNULL(semantic_match, 0))
        ELSE 'NA'
    END) AS semantic_mismatch,
    (CASE
        WHEN
            semantic_match IS NOT NULL
        THEN
            CONCAT((((100 * IFNULL(semantic_match, 0))) / IFNULL(l2_total_cnt, 0)),
                    '%')
        ELSE 'NA'
    END) AS semantic_fill_rate,
    IFNULL(ontology_match, 'NA') ontology_match,
    (CASE
        WHEN ontology_match IS NOT NULL THEN (IFNULL(l2_total_cnt, 0) - IFNULL(ontology_match, 0))
        ELSE 'NA'
    END) AS ontology_mismatch,
    (CASE
        WHEN
            ontology_match IS NOT NULL
        THEN
            CONCAT((((100 * IFNULL(ontology_match, 0))) / IFNULL(l2_total_cnt, 0)),
                    '%')
        ELSE 'NA'
    END) AS ontology_fill_rate
FROM
    buildsheet_data
WHERE
    aco_id LIKE aco_id_var
        AND source_id LIKE source_id_var
        AND meta_id LIKE meta_id_var
        AND rule_type NOT IN ('hardcode' , 'where',
        'from',
        'inner join',
        'left join',
        'right join');
    
END IF;
END$$
DELIMITER ;

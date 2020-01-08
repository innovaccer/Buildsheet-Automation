DROP PROCEDURE IF EXISTS `buildsheet_semont_report`;

DELIMITER $$
CREATE PROCEDURE `buildsheet_semont_report`
(
IN aco_id_var varchar(20),
IN source_id_var  varchar(20),
IN meta_var  varchar(20)
)

BEGIN
IF aco_id_var = '' then set aco_id_var = '%'; end if;
IF source_id_var = '' then set source_id_var = '%'; end if;
IF meta_var = '' then set meta_var = '%'; end if;

SELECT 
    category,
    destination_column,
    l1_total_cnt,
    l1_unq_cnt,
    l2_total_cnt,
    l2_unq_cnt,
    semantic_match,
    semantic_mismatch,
    CONCAT(IFNULL(fill_rate, 0), '%')
FROM
    (SELECT 
        category,
            destination_column,
            l1_total_cnt,
            l1_unq_cnt,
            IFNULL(l2_total_cnt, 0) l2_total_cnt,
            IFNULL(l2_unq_cnt, 0) l2_unq_cnt,
            IFNULL(semantic_match, 'NA') semantic_match,
            (IFNULL(l2_total_cnt, 0) - IFNULL(semantic_match, 0)) semantic_mismatch,
            TRUNCATE((((100 * IFNULL(semantic_match, 0))) / IFNULL(l2_total_cnt, 0)), 2) fill_rate
    FROM
        buildsheet_data
    WHERE
        aco_id LIKE aco_id_var
            AND source_id LIKE source_id_var
            AND meta_id LIKE meta_var
            AND source_table != 'Meta Column'
            AND semantic_match IS NOT NULL UNION ALL SELECT 
        category,
            destination_column,
            l1_total_cnt,
            l1_unq_cnt,
            IFNULL(l2_total_cnt, 0) l2_total_cnt,
            IFNULL(l2_unq_cnt, 0) l2_unq_cnt,
            IFNULL(ontology_match, 'NA') ontology_match,
            (IFNULL(l2_total_cnt, 0) - IFNULL(ontology_match, 0)) ontology_mismatch,
            TRUNCATE((((100 * IFNULL(ontology_match, 0))) / IFNULL(l2_total_cnt, 0)), 2) fill_rate
    FROM
        buildsheet_data
    WHERE
        aco_id LIKE aco_id_var
            AND source_id LIKE source_id_var
            AND meta_id LIKE meta_var
            AND source_table != 'Meta Column'
            AND ontology_match IS NOT NULL) t
ORDER BY t.fill_rate ASC;


END$$
DELIMITER ;
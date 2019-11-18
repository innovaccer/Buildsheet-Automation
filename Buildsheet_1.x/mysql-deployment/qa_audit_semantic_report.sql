DROP PROCEDURE IF EXISTS `qa_audit_semantic_report`;

DELIMITER $$
CREATE PROCEDURE `qa_audit_semantic_report`
(
aco_id_var varchar(20),
source_id_var  varchar(20),
IN meta_var varchar(20)
)

BEGIN
IF aco_id_var = '' then set aco_id_var = '%'; end if;
IF source_id_var = '' then set source_id_var = '%'; end if;
IF meta_var = '' then set meta_var = '%'; end if;

SELECT 
    CONCAT('To Verify if data is matching with semantic and ontology dataset') AS test_scenario,
    CONCAT('To Verify Total Count of l2.',
            destination_table,
            '.',
            destination_column,
            ' from semantic and ontology dataset') AS test_case,
    category,
    IFNULL(l2_total_cnt, 0) l2_unq_cnt,
    IFNULL(semantic_match, 'NA') semantic_match,
    (CASE
        WHEN semantic_match IS NOT NULL THEN (IFNULL(l2_total_cnt, 0) - IFNULL(semantic_match, 0))
        ELSE 'NA'
    END) AS semantic_mismatch,
    ROUND((CASE
                WHEN
                    semantic_match IS NOT NULL
                THEN
                    CONCAT((((100 * IFNULL(semantic_match, 0))) / IFNULL(l2_total_cnt, 0)),
                            '%')
                ELSE 'NA'
            END)) AS semantic_fill_rate,
    (CASE
        WHEN (IFNULL(l2_total_cnt, 0) - IFNULL(semantic_match, 0)) = 0 THEN 'Pass'
        ELSE 'Fail'
    END) AS semantic_test,
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
    END) AS ontology_fill_rate,
    (CASE
        WHEN (IFNULL(l2_total_cnt, 0) - IFNULL(ontology_match, 0)) = 0 THEN 'Pass'
        ELSE 'Fail'
    END) AS ontology_test
FROM
    buildsheet_proj_stg_testing
WHERE
    aco_id LIKE aco_id_var
        AND source_id LIKE source_id_var
        AND meta_id LIKE meta_var
        AND source_table != 'Meta Column'
        AND (semantic_match IS NOT NULL
        OR ontology_match IS NOT NULL);
-- To Verify Total Count of Diagnosis code from L2 Diagnosis table to Source Table	
-- Verify Total Count from L2 - Diagnosis Table - diagnosis_code column from SOURCECOLUMNNAME - SOURCETABLENAME

END$$
DELIMITER ;

select * from buildsheet_proj_stg_testing where meta_id = 2;
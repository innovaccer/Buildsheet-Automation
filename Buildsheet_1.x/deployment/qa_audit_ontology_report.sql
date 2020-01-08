DROP PROCEDURE IF EXISTS `qa_audit_ontology_report`;

DELIMITER $$
CREATE PROCEDURE `qa_audit_ontology_report`
(
IN meta_var INT
)

BEGIN

SELECT 
    CONCAT('To Verify if data is matching with ontology dataser') AS test_scenario,
    CONCAT('To Verify Total Count of l2.',
            destination_table,
            '.',
            destination_column,
            ' from ontology dataset') AS test_case,
    IFNULL(l2_total_cnt, 0) l2_unq_cnt,
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
    buildsheet_data
WHERE
    meta_id = meta_var
        AND source_table != 'Meta Column'
        AND ontology_match IS NOT NULL;
-- To Verify Total Count of Diagnosis code from L2 Diagnosis table to Source Table	
-- Verify Total Count from L2 - Diagnosis Table - diagnosis_code column from SOURCECOLUMNNAME - SOURCETABLENAME

END$$
DELIMITER ;
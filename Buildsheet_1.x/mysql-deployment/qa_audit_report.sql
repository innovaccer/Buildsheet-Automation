DROP PROCEDURE IF EXISTS `qa_audit_report`;

DELIMITER $$
CREATE PROCEDURE `qa_audit_report`
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
   /* CONCAT('To Verify Total Count of ',
            destination_column,
            ' from l2 ',
            destination_table,
            ' to ',
            source_table,
            ' table') AS test_scenario,
    CONCAT('Verify Total Count from column ',
            source_column,
            ' of l1.',
            source_table,
            ' with ',
            destination_column,
            ' column of l2.',
            destination_table) AS test_case,*/
    category,
    IFNULL(l1_total_cnt_wf, 0) AS l1_total_cnt,
    IFNULL(l2_total_cnt, 0) l2_total_cnt,
    (IFNULL(l1_total_cnt_wf, 0) - IFNULL(l2_total_cnt, 0)) total_cnt_diff,
    (CASE
        WHEN l2_total_cnt = 0 THEN 'NO'
        ELSE 'YES'
    END) AS data_present_total,
    (CASE
        WHEN l1_total_cnt_wf = l2_total_cnt THEN 'Pass'
        ELSE 'Fail'
    END) AS total_test,
    IFNULL(l1_unq_cnt_wf, 0) l1_unq_cnt,
    IFNULL(l2_unq_cnt, 0) l2_unq_cnt,
    (IFNULL(l1_unq_cnt_wf, 0) - IFNULL(l2_unq_cnt, 0)) unq_cnt_diff,
    (CASE
        WHEN l2_unq_cnt = 0 THEN 'No'
        ELSE 'Yes'
    END) AS data_present_unq,
    (CASE
        WHEN l1_unq_cnt_wf = l2_unq_cnt THEN 'Pass'
        ELSE 'Fail'
    END) AS unq_test
FROM
    buildsheet_data
WHERE
    aco_id LIKE aco_id_var
        AND source_id LIKE source_id_var
        AND meta_id LIKE meta_var
        AND source_table != 'Meta Column';
-- To Verify Total Count of Diagnosis code from L2 Diagnosis table to Source Table	
-- Verify Total Count from L2 - Diagnosis Table - diagnosis_code column from SOURCECOLUMNNAME - SOURCETABLENAME

END$$
DELIMITER ;
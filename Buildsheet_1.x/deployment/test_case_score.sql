DROP PROCEDURE IF EXISTS test_case_score;
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `test_case_score`(
IN aco_var int,
IN source_var int,
IN meta_var  int,
IN rep_typ tinyint
)
BEGIN

IF rep_typ = 0 THEN

SET @total_rows = (SELECT 
    COUNT(*) cnt
FROM
    test_cases_result
WHERE
    meta_id = meta_var);
    
SET @pass_rows = (SELECT 
    COUNT(*) cnt
FROM
    test_cases_result
WHERE
    meta_id = meta_var AND result = 'Pass');

SELECT 
    CONCAT(IFNULL(TRUNCATE(((IFNULL(@pass_rows, 0) * 100) / IFNULL(@total_rows, 0)),
                        1),
                    0),
            '%') val;

ELSEIF rep_typ = 1 THEN

SELECT 
    category, columnname, test_case, result, sample_data
FROM
    test_cases_result
WHERE
    meta_id = meta_var
ORDER BY result;

ELSEIF rep_typ = 2 THEN

SET @total_rows = (SELECT 
    COUNT(*) cnt
FROM
    test_cases_result
WHERE
    aco_id = aco_var
        AND source_id = source_var);

SET @pass_rows = (SELECT 
    COUNT(*) cnt
FROM
    test_cases_result
WHERE
    aco_id = aco_var
        AND source_id = source_var
        AND result = 'Pass');

SELECT 
    CONCAT(IFNULL(TRUNCATE(((IFNULL(@pass_rows, 0) * 100) / IFNULL(@total_rows, 0)),
                        1),
                    0),
            '%') val;

END IF;

END$$
DELIMITER ;

call test_case_score('1','48','0',2);
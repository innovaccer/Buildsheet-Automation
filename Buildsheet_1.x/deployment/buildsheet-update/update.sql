select * from buildsheet_data;

set sql_safe_updates = 0;
update buildsheet_data set semantic_q = replace(semantic_q,'semantics.semantics.','semantics.')
where category = 'member_contact' and destination_column = 'contact_type';

update buildsheet_data set semantic_q = replace(semantic_q,' s00',' semantics.s00')
where category = 'insurance';

update buildsheet_data set semantic_q = replace(semantic_q,' rocedure',' procedure')
where category = 'procedure';


 alter table meta_data add `buildsheet_last_update` datetime DEFAULT NULL,
 add `semantic_last_run` datetime DEFAULT NULL,
 add `test_cases_last_run` datetime DEFAULT NULL;
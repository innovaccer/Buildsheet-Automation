DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_semantic_load`(
IN meta_var  int,
IN category_var varchar(50),
IN col_var varchar(50)
)
BEGIN

IF category_var = 'member' THEN
 
 IF col_var = 'gender' THEN
SELECT 
    CONCAT('SELECT gender,count(*)count FROM l2."member" LEFT JOIN semantics.s0001 ON "member".gender = semantics.s0001.code WHERE l2."member".aco_id = ',
            aco_id,
            ' AND l2."member".source_id = ',
            source_id,
            ' group by l2."member".gender;') qry
FROM
    buildsheet_data
WHERE
    meta_id = meta_var
        AND category = category_var
        AND destination_column = col_var;
  ELSEIF col_var = 'ethnicity' THEN
select concat('SELECT ethnicity,count(*)count FROM l2."member" LEFT JOIN semantics.s0002 ON l2."member".ethnicity = semantics.s0002.code WHERE l2."member".aco_id = ',aco_id,' AND l2."member".source_id = ',source_id,' group by l2."member".ethnicity;')qry
from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
ELSEIF col_var = 'race' THEN
select concat('SELECT race,count(*)count FROM l2."member" LEFT JOIN semantics.s0003 ON l2."member".race = semantics.s0003.code WHERE l2."member".aco_id = ',aco_id,' AND l2."member".source_id = ',source_id,' group by l2."member".race;')
from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
ELSEIF col_var = 'marital_status' THEN
select concat('SELECT marital_status,count(*)count FROM l2."member" LEFT JOIN semantics.s0004 ON l2."member".marital_status = semantics.s0004.code WHERE l2."member".aco_id = ',aco_id,' AND l2."member".source_id = ',source_id,' group by l2."member".marital_status;')
from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
ELSEIF col_var = 'primary_language' THEN
select concat('SELECT primary_language,count(*)count FROM l2."member" LEFT JOIN semantics.s0005 ON l2."member".primary_language = semantics.s0005.code WHERE l2."member".aco_id = ',aco_id,' AND l2."member".source_id = ',source_id,' group by l2."member".primary_language;')
from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
ELSEIF col_var = 'cms_status' THEN
select concat('SELECT cms_status,count(*)count FROM l2."member" LEFT JOIN semantics.s0006 ON l2."member".cms_status = semantics.s0006.code WHERE l2."member".aco_id = ',aco_id,' AND l2."member".source_id = ',source_id,' group by l2."member".cms_status;')
from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
ELSEIF col_var = 'deceased_flag' THEN
select concat('SELECT deceased_flag,count(*)count FROM l2."member" LEFT JOIN semantics.s0014 ON l2."member".deceased_flag = semantics.s0014.code WHERE l2."member".aco_id = ',aco_id,' AND l2."member".source_id = ',source_id,' group by l2."member".deceased_flag;')
from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
ELSEIF col_var = 'reason_entitlement' THEN
select concat('SELECT reason_entitlement,count(*)count FROM l2."member" LEFT JOIN semantics.s0086 ON l2."member".reason_entitlement = semantics.s0086.code WHERE l2."member".aco_id = ',aco_id,' AND l2."member".source_id = ',source_id,' group by l2."member".reason_entitlement;')
from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
ELSEIF col_var = 'buy_in' THEN
select concat('SELECT buy_in,count(*)count FROM l2."member" LEFT JOIN semantics.s0087 ON l2."member".buy_in = semantics.s0087.code WHERE l2."member".aco_id = ',aco_id,' AND l2."member".source_id = ',source_id,' group by l2."member".buy_in;')
from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
END IF;

ELSEIF category_var = 'vital' THEN

 IF col_var = 'normalcy_flag' THEN
select concat('SELECT normalcy_flag,count(normalcy_flag)count FROM l2.vital LEFT JOIN semantics.s0014 ON l2.vital.normalcy_flag = semantics.s0014.code WHERE l2.vital.aco_id = ',aco_id,' AND l2.vital.source_id = ',source_id,' group by l2.vital.normalcy_flag;')
from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
 ELSEIF col_var = 'coding_system' THEN
select concat('SELECT coding_system,count(coding_system)count FROM l2.vital LEFT JOIN semantics.s0027 ON l2.vital.coding_system = semantics.s0027.code WHERE l2.vital.aco_id = ',aco_id,' AND l2.vital.source_id = ',source_id,' group by l2.vital.coding_system;')
from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
 ELSEIF col_var = 'body_site' THEN
select concat('SELECT body_site,count(body_site)count FROM l2.vital LEFT JOIN semantics.s0076 ON l2.vital.body_site = semantics.s0076.code WHERE l2.vital.aco_id = ',aco_id,' AND l2.vital.source_id = ',source_id,' group by vital.body_site;')
from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
END IF;

ELSEIF category_var = 'social_history' THEN
 IF col_var = 'social_factor_code' THEN
select concat('SELECT social_factor_code,count(social_factor_code)count FROM l2.social_history left JOIN semantics.s0039 ON l2.social_history.social_factor_code = semantics.s0039.code WHERE l2.social_history.aco_id = ',aco_id,' AND l2.social_history.source_id = ',source_id,' group by l2.social_history.social_factor_code;')
from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
 ELSEIF col_var = 'social_factor_name' THEN
select concat('SELECT social_factor_name,count(social_factor_name)count FROM l2.social_history left JOIN semantics.s0039 ON l2.social_history.social_factor_name = semantics.s0039.name WHERE l2.social_history.aco_id = ',aco_id,' AND l2.social_history.source_id = ',source_id,' group by l2.social_history.social_factor_name;')
from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
 ELSEIF col_var = 'status' THEN
select concat('SELECT status,count(status)count FROM l2.social_history left JOIN semantics.s0040 ON l2.social_history.status = semantics.s0040.code WHERE l2.social_history.aco_id = ',aco_id,' AND l2.social_history.source_id = ',source_id,' group by l2.social_history.status;')
from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
END IF;

ELSEIF category_var = 'provider_org_hierarchy' THEN

 IF col_var = 'state_name' THEN
select concat('SELECT count(state_name) FROM l2.provider_org_hierarchy left JOIN semantics.s0008 ON l2.provider_org_hierarchy.state_name = semantics.s0008.code WHERE l2.provider_org_hierarchy.aco_id = ',aco_id,' AND l2.provider_org_hierarchy.source_id = ',source_id,' groyp by l2.provider_org_hierarchy.state_name;')
 from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
 ELSEIF col_var = 'preferred_practice_flag' THEN
select concat('SELECT count(preferred_practice_flag)count FROM l2.provider_org_hierarchy left JOIN semantics.s0014 ON l2.provider_org_hierarchy.preferred_practice_flag = semantics.s0014.code WHERE provider_org_hierarchy.aco_id = ',aco_id,' AND l2.provider_org_hierarchy.source_id = ',source_id,' group by l2.provider_org_hierarchy.preferred_practice_flag;')
 from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
 ELSEIF col_var = 'status' THEN
 select concat('SELECT status,count(status)count FROM l2.provider_org_hierarchy left JOIN semantics.s0014 ON l2.provider_org_hierarchy.pcp_flag = semantics.s0014.codeS0008.code WHERE l2.provider_org_hierarchy.aco_id = ',aco_id,' AND l2.provider_org_hierarchy.source_id = ',source_id,' group by l2.provider_org_hierarchy.pcp_flag;')
 from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
 ELSEIF col_var = 'practice_type' THEN
select concat('SELECT status,count(practice_type)count FROM l2.provider_org_hierarchy left JOIN semantics.s0077 ON l2.provider_org_hierarchy.practice_type = semantics.s0077.code WHERE l2.provider_org_hierarchy.aco_id = ',aco_id,' AND l2.provider_org_hierarchy.source_id = ',source_id,' group by l2.provider_org_hierarchy.practice_type;')
  from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
END IF;

ELSEIF category_var = 'procedure' THEN

 IF col_var = 'surgical_history_flag' THEN
select concat('SELECT surgical_history_flag,count(*)count FROM l2.procedure left JOIN semantics.s0014 ON l2.procedure.surgical_history_flag = semantics.s0014.code WHERE procedure.aco_id = ',aco_id,' AND procedure.source_id = ',source_id,' group by l2.procedure.surgical_history_flag;')
  from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
 ELSEIF col_var = 'coding_system' THEN
select concat('SELECT coding_system,count(*)count FROM l2.procedure left JOIN semantics.s0027 ON l2.procedure.coding_system = semantics.s0027.code WHERE l2.procedure.aco_id = ',aco_id,' AND l2.procedure.source_id = ',source_id,' group by l2.procedure.coding_system;')
  from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
 ELSEIF col_var = 'procedure_type' THEN
select concat('SELECT procedure_type,count(*)count FROM l2.procedure left JOIN semantics.s0033 ON l2.procedure.procedure_type = semantics.s0033.code WHERE l2.procedure.aco_id = ',aco_id,' AND l2.procedure.source_id = ',source_id,' group by l2.procedure.procedure_type;')
  from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
 ELSEIF col_var = 'modifier_code_1' THEN
select concat('SELECT modifier_code_1,count(*)count FROM l2.procedure left JOIN semantics.s0068 ON l2.procedure.modifier_code_1 = semantics.s0068.code WHERE l2.procedure.aco_id = ',aco_id,' AND l2.procedure.source_id = ',source_id,' group by l2.procedure.modifier_code_1;')
  from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
  ELSEIF col_var = 'modifier_code_2' THEN
select concat('SELECT modifier_code_2,count(*)count FROM l2.procedure left JOIN semantics.s0068 ON l2.procedure.modifier_code_2 = semantics.s0068.code WHERE l2.procedure.aco_id = ',aco_id,' AND l2.procedure.source_id = ',source_id,' group by l2.procedure.modifier_code_2;')
  from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
  ELSEIF col_var = 'modifier_code_3' THEN
select concat('SELECT modifier_code_3,count(*)count FROM l2.procedure left JOIN semantics.s0068 ON l2.procedure.modifier_code_3 = semantics.s0068.code WHERE l2.procedure.aco_id = ',aco_id,' AND l2.procedure.source_id = ',source_id,' group by l2.procedure.modifier_code_3;')
  from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
  ELSEIF col_var = 'modifier_code_4' THEN
select concat('SELECT modifier_code_4,count(*)count FROM l2.procedure left JOIN semantics.s0068 ON l2.procedure.modifier_code_4 = semantics.s0068.code WHERE l2.procedure.aco_id = ',aco_id,' AND l2.procedure.source_id = ',source_id,' group by l2.procedure.modifier_code_4;')
  from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
  ELSEIF col_var = 'modifier_code_5' THEN
select concat('SELECT modifier_code_5,count(*)count FROM l2.procedure left JOIN semantics.s0068 ON l2.procedure.modifier_code_5 = semantics.s0068.code WHERE l2.procedure.aco_id = ',aco_id,' AND l2.procedure.source_id = ',source_id,' group by l2.procedure.modifier_code_5;')
  from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
  ELSEIF col_var = 'medication_code' THEN
select concat('select code,SUM(c1)count from (SELECT code,count(code)count FROM l2.procedure left JOIN l2.pd_ontology ON l2.procedure.code = l2.pd_ontology.cval WHERE aco_id = ',aco_id,' AND source_id = ',source_id,' and pd_ontology.dtp=''procedure'' and pd_ontology.csys in (''HCPCS'',''CPT'') group by l2.pd_ontology.cval union ALL SELECT code,count(*)c1 FROM l2.procedure JOIN l2.pd_ontology ON procedure.code = pd_ontology.cvald WHERE aco_id = ',aco_id,' AND source_id = ',source_id,' and pd_ontology.dtp=''procedure'' and pd_ontology.csys in (''ICD-10'',''ICD-9'') group by code) group by code;')
  from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
END IF;

 IF col_var = 'generic_flag' THEN
select concat('SELECT count(generic_flag) FROM prescription left JOIN s0014 ON prescription.generic_flag = s0014.code WHERE prescription.aco_id = ',aco_id,' AND prescription.source_id = ',source_id,' group by generic_flag;')
  from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
 ELSEIF col_var = 'coding_system' THEN
select  concat('SELECT count(coding_system) FROM prescription left JOIN s0027 ON prescription.coding_system = s0027.code WHERE prescription.aco_id = ',aco_id,' AND prescription.source_id = ',source_id,' group by coding_system;')
  from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
 ELSEIF col_var = 'route_of_administration' THEN
select  concat('SELECT count(route_of_administration) FROM prescription left JOIN s0031 ON prescription.route_of_administration = s0031.code WHERE prescription.aco_id = ',aco_id,' AND prescription.source_id = ',source_id,' group by route_of_administration;')
  from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
 ELSEIF col_var = 'usage_frequency' THEN
select  concat('SELECT count(usage_frequency) FROM prescription left JOIN s0037 ON prescription.usage_frequency = s0037.code WHERE prescription.aco_id = ',aco_id,' AND prescription.source_id = ',source_id,' group by usage_frequency;')
  from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
   ELSEIF col_var = 'ndc_code' THEN
select  concat('SELECT ndc_code,count(*)count FROM prescription left JOIN pd_ontology ON prescription.ndc_code = pd_ontology.cval WHERE aco_id = ',aco_id,' AND source_id = ',source_id,'  and pd_ontology.dtp=''medication'' and csys = ''ndc''  group by ndc_code;')
  from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
  ELSEIF col_var = 'medication_code' THEN
select  concat('select medication_code,SUM(c1)count from (SELECT medication_code,count(*)c1 FROM l2.prescription left JOIN l2.pd_ontology ON prescription.medication_code = pd_ontology.cval WHERE aco_id = ',aco_id,' AND source_id = ',source_id,' and pd_ontology.dtp=''medication'' group by medication_code union ALL SELECT medication_code,count(*)c1 FROM l2.prescription left JOIN l2.pd_ontology ON prescription.medication_code = pd_ontology.gpi_code WHERE aco_id = ',aco_id,' AND prescription.source_id = ',source_id,' and pd_ontology.dtp=''medication'' group by medication_code) group by medication_code;')
  from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
 END IF;
 
   ELSEIF category_var = 'member_add' THEN
 IF col_var = 'state' THEN
select concat('select state,count(*) from l2.member_add left join semantics.s0008 on member_add.state=s0008.code WHERE member_add.aco_id = ',aco_id,' AND member_add.source_id = ',source_id,' group by state;')
   from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
 ELSEIF col_var = 'address_type' THEN
select concat('select address_type,count(*) from l2.member_add left join semantics.s0007 on member_add.address_type=s0007.code WHERE member_add.aco_id = ',aco_id,' AND member_add.source_id = ',source_id,' group by address_type;')
   from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
 ELSEIF col_var = 'country' THEN
select concat('select country,count(*) from l2.member_add left join semantics.s0009 on member_add.country=s0009.code WHERE member_add.aco_id = ',aco_id,' AND member_add.source_id = ',source_id,' group by country;')
   from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
 ELSEIF col_var = 'address_type' THEN
select concat('select address_type,count(*) from l2.member_add left join semantics.s0007 on member_add.address_type=s0007.code WHERE member_add.aco_id = ',aco_id,' AND member_add.source_id = ',source_id,' group by address_type;')
   from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
 END IF;
 
 ELSEIF category_var = 'member_contact' THEN

 IF col_var = 'contact_type' THEN
select concat('select contact_type,count(*) from l2.member_contact left join semantics.s0010 on member_contact.contact_type=s0010.code WHERE member_contact.aco_id = ',aco_id,' AND member_contact.source_id = ',source_id,' group by contact_type;')
   from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
 END IF;
 
 
 ELSEIF category_var = 'member_email' THEN
 
  IF col_var = 'email_type' THEN
 select concat('select email_type,count(*)count from l2.member_email left join semantics.s0011 on member_email.email_type=s0011.code WHERE member_email.aco_id = ',aco_id,' AND member_email.source_id = ',source_id,' group by email_type;')
    from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
 END IF;
 
 
  ELSEIF category_var = 'member_lang' THEN
  
    IF col_var = 'language' THEN
 select concat('select language,count(*)count from l2.member_lang left join semantics.s0005 on member_lang.language=s0005.code WHERE member_lang.aco_id = ',aco_id,' AND member_lang.source_id = ',source_id,' group by language;')
    from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
     ELSEIF col_var = 'language_preference' THEN
 select concat('select language_preference,count(*)count from l2.member_lang left join semantics.s0012 on member_lang.language_preference=s0012.code WHERE member_lang.aco_id = ',aco_id,' AND member_lang.source_id = ',source_id,' group by member_lang;')
    from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
 END IF;
 
 
   ELSEIF category_var = 'allergy' THEN
     IF col_var = 'coding_system' THEN
 select concat('select coding_system,count(*)count from l2.allergy left join semantics.s0027 on allergy.coding_system=s0027.code WHERE allergy.aco_id = ',aco_id,' AND allergy.source_id = ',source_id,' group by coding_system;')
    from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
     ELSEIF col_var = 'status' THEN
 select concat('select status,count(*)count from l2.allergy left join semantics.s0040 on allergy.status=s0040.code WHERE allergy.aco_id = ',aco_id,' AND allergy.source_id = ',source_id,' group by status;')
    from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
      ELSEIF col_var = 'allergen_type' THEN
 select concat('select allergen_type,count(*)count from l2.allergy left join semantics.s0042 on allergy.allergen_type=s0042.code WHERE allergy.aco_id = ',aco_id,' AND allergy.source_id = ',source_id,' group by allergen_type;')
    from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
 END IF;
 
     ELSEIF category_var = 'encounter' THEN
     IF col_var = 'vip_indicator' THEN
   select concat('select vip_indicator,count(*)count from l2.encounter left join semantics.s0014 on encounter.vip_indicator=s0014.code WHERE encounter.aco_id = ',aco_id,' AND encounter.source_id = ',source_id,' group by vip_indicator;')
       from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
     ELSEIF col_var = 'admission_type' THEN
   select concat('select admission_type,count(*)count from l2.encounter left join semantics.s0017 on encounter.admission_type=s0017.code WHERE encounter.aco_id = ',aco_id,' AND encounter.source_id = ',source_id,' group by admission_type;')
       from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
      ELSEIF col_var = 'place_of_service' THEN
   select concat('select place_of_service,count(*)count from l2.encounter left join semantics.s0023 on encounter.place_of_service=s0023.code WHERE encounter.aco_id = ',aco_id,' AND encounter.source_id = ',source_id,' group by place_of_service;')
       from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
      ELSEIF col_var = 'referral_code' THEN
   select concat('select referral_code,count(*)count from l2.encounter left join semantics.s0025 on encounter.referral_code=s0025.code WHERE encounter.aco_id = ',aco_id,' AND encounter.source_id = ',source_id,' group by referral_code;')
       from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
      ELSEIF col_var = 'encounter_type' THEN
   select concat('select encounter_type,count(*)count from l2.encounter left join semantics.s0032 on encounter.encounter_type=s0032.code WHERE encounter.aco_id = ',aco_id,' AND encounter.source_id = ',source_id,' group by encounter_type;')
       from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
        ELSEIF col_var = 'financial_class' THEN
   select concat('select financial_class,count(*)count from l2.encounter left join semantics.s0069 on encounter.financial_class=s0069.code WHERE encounter.aco_id = ',aco_id,' AND encounter.source_id = ',source_id,' group by financial_class;')
       from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
      ELSEIF col_var = 'disposition_code' THEN
   select concat('select disposition_code,count(*)count from l2.encounter left join semantics.s0074 on encounter.disposition_code=s0074.code WHERE encounter.aco_id = ',aco_id,' AND encounter.source_id = ',source_id,' group by disposition_code;')
       from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
 END IF;
 
      ELSEIF category_var = 'family_circle' THEN
      IF col_var = 'vip_indicator' THEN
   select concat('select vip_indicator,count(*)count from family_circle join s0014 on family_circle.caretaker_flag=s0014.code WHERE family_circle.aco_id = ',aco_id,' AND family_circle.source_id = ',source_id,' group by vip_indicator;')
   from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
     ELSEIF col_var = 'relationship' THEN
select concat('select relationship,count(*)count from family_circle join s0041 on family_circle.relationship=s0041.name WHERE family_circle.aco_id = ',aco_id,' AND family_circle.source_id = ',source_id,' group by relationship;')
   from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
      ELSEIF col_var = 'relationship_code' THEN
select concat('select relationship_code,count(*)count from family_circle join s0041 on family_circle.relationship_code=s0041.code WHERE family_circle.aco_id = ',aco_id,' AND family_circle.source_id = ',source_id,' group by relationship_code;')
   from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
    END IF; 
    
     ELSEIF category_var = 'family_history' THEN
       IF col_var = 'disease_status' THEN
select concat('select disease_status,count(*)count from family_history join s0040 on family_history.disease_status=s0040.code WHERE family_history.aco_id = ',aco_id,' AND family_history.source_id = ',source_id,' group by disease_status;')
   from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
     ELSEIF col_var = 'relationship' THEN
select concat('select relationship,count(*)count from family_history join s0041 on family_history.relationship=s0041.name  WHERE family_history.aco_id = ',aco_id,' AND family_history.source_id = ',source_id,' group by relationship;')
   from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
      ELSEIF col_var = 'relationship_code' THEN
select concat('select relationship_code,count(*)count from family_history join s0041 on family_history.relationship_code=s0041.code WHERE family_history.aco_id = ',aco_id,' AND family_history.source_id = ',source_id,' group by relationship_code;')
   from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
    END IF; 
    
     ELSEIF category_var = 'immunization' THEN
	IF col_var = 'disease_status' THEN
select concat('select coding_system,count(*)count from immunization join semantics.s0027 on immunization.coding_system=semantics.s0027.code WHERE aco_id = ',aco_id,' AND source_id = ',source_id,' group by coding_system;')
   from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
     ELSEIF col_var = 'relationship' THEN
select concat('select status,count(*)count from immunization join semantics.s0040 on immunization.status=semantics.s0040.code WHERE aco_id = ',aco_id,' AND source_id = ',source_id,' group by status;')
   from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
 --     ELSEIF col_var = 'relationship_code' THEN
-- select concat('select relationship_code,count(*)count from immunization join semantics.s0044 on immunization.immunization_code=semantics.s0044.code WHERE aco_id = ',aco_id,' AND source_id = ',source_id,' group by ;')
 --  from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
    ELSEIF col_var = 'immunization_code' THEN
select concat('SELECT immunization_code,SUM(c1)count FROM (SELECT immunization_code,count(immunization_code)c1 FROM immunization JOIN pd_ontology ON immunization.immunization_code = pd_ontology.cval WHERE aco_id = ',aco_id,' AND source_id = ',source_id,' and pd_ontology.dtp=''vaccination'' group by immunization_code union ALL SELECT immunization_code,count(immunization_code)c1 FROM immunization JOIN pd_ontology ON immunization.immunization_code = pd_ontology.cval WHERE immunization.aco_id = ',aco_id,' AND source_id = ',source_id,' and csys=''ndc'' and pd_ontology.odsc6=''vaccine'' group by immunization_code) group by immunization_code;')
   from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
    END IF; 
    
     ELSEIF category_var = 'insurance' THEN
     IF col_var = 'subscriber_gender' THEN
select concat('select subscriber_gender,count(*)count from insurance join semantics.s0001 on insurance.subscriber_gender=semantics.s0001.code WHERE aco_id = ',aco_id,' AND source_id = ',source_id,' group by subscriber_gender;')
   from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
     ELSEIF col_var = 'relationship' THEN
select concat('SELECT subscriber_relationship,count(*)count FROM insurance JOIN semantics.s0041 ON insurance.subscriber_relationship = semantics.s0041.code WHERE aco_id = ',aco_id,' AND source_id = ',source_id,' group by subscriber_relationship;')
   from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
      ELSEIF col_var = 'subscriber_relationship_code' THEN
select concat('SELECT subscriber_relationship_code,count(*)count FROM insurance JOIN semantics.s0041 ON insurance.subscriber_relationship_code = semantics.s0041.code WHERE aco_id = ',aco_id,' AND source_id = ',source_id,' group by subscriber_relationship_code;')
   from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
        ELSEIF col_var = 'plan_type' THEN
select concat('SELECT plan_type,count(*)count FROM insurance JOIN semantics.s0049 ON insurance.plan_type = semantics.s0049.code WHERE aco_id = ',aco_id,' AND source_id = ',source_id,' group by plan_type;')
   from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
END IF;

     ELSEIF category_var = 'appoinment' THEN
      IF col_var = 'appointment_type' THEN
select concat('SELECT appointment_type,count(*)count FROM appointment JOIN semantics.s0050 ON appointment.appointment_type = semantics.s0050.code WHERE aco_id = ',aco_id,' AND source_id = ',source_id,' group by appointment_type;')
     from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
     ELSEIF col_var = 'resource_location_type' THEN
select concat('SELECT resource_location_type,count(*)count FROM appointment JOIN semantics.s0072 ON appointment.resource_location_type = semantics.s0072.code WHERE aco_id = ',aco_id,' AND source_id = ',source_id,' group by resource_location_type;')
      from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
END IF;

     ELSEIF category_var = 'attachment' THEN
      IF col_var = 'attachment_type' THEN
select concat('SELECT attachment_type,count(*)count FROM attachment JOIN semantics.s0047 ON attachment.attachment_type = semantics.s0047.code WHERE aco_id = ',aco_id,' AND source_id = ',source_id,' group by attachment_type;')
      from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
     ELSEIF col_var = 'doc_type' THEN
select concat('SELECT doc_type,count(*)count FROM attachment JOIN semantics.s0048 ON attachment.doc_type = semantics.s0048.code WHERE aco_id = ',aco_id,' AND source_id = ',source_id,' group by doc_type;')
      from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
END IF;

     ELSEIF category_var = 'diagnosis' THEN
      IF col_var = 'attachment_type' THEN
select concat('SELECT coding_system,count(*)count FROM diagnosis JOIN semantics.s0027 ON diagnosis.coding_system = semantics.s0027.code WHERE aco_id = ',aco_id,' AND source_id = ',source_id,' group by coding_system;')
      from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
  ELSEIF col_var = 'diagnosis_code' THEN
select concat('SELECT diagnosis_code,count(*)count FROM diagnosis JOIN pd_ontology ON diagnosis.diagnosis_code = pd_ontology.cvald WHERE aco_id = ',aco_id,' AND source_id = ',source_id,' and pd_ontology.dtp=''diagnosis'' group by diagnosis_code;')
      from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
END IF;

     ELSEIF category_var = 'lab_result' THEN
        IF col_var = 'normalcy_flag' THEN
select concat('SELECT normalcy_flag,count(*)count FROM lab_result JOIN semantics.s0014 ON lab_result.normalcy_flag = semantics.s0014.code WHERE aco_id = ',NEW.aco_id,' AND source_id = ',NEW.source_id,' group by normalcy_flag;')
      from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
     ELSEIF col_var = 'coding_system' THEN
select concat('SELECT coding_system,count(*)count FROM lab_result JOIN semantics.s0027 ON lab_result.coding_system = semantics.s0027.code WHERE aco_id = ',NEW.aco_id,' AND source_id = ',NEW.source_id,' group by coding_system;')
      from buildsheet_data where meta_id = meta_var and category = category_var and destination_column = col_var;
  ELSEIF col_var = 'medication_code' THEN
SELECT 
    CONCAT('SELECT result_code,count(*)count FROM lab_result JOIN pd_ontology ON lab_result.result_code = pd_ontology.cval WHERE aco_id = ',
            NEW.aco_id,
            ' AND prescription.source_id = ',
            NEW.source_id,
            '  and pd_ontology.dtp=\'result\'  group by result_code;')
FROM
    buildsheet_data
WHERE
    meta_id = meta_var
        AND category = category_var
        AND destination_column = col_var;
END IF; 

END IF;
END$$
DELIMITER ;

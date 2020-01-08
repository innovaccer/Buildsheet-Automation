DROP TRIGGER IF EXISTS buildsheet_data_beforeinsert_prepost;
DELIMITER $$
CREATE
TRIGGER buildsheet_data_beforeinsert_prepost 
BEFORE INSERT ON `buildsheet_data` FOR EACH ROW
BEGIN
#################################################################DQT####################################################################

 set NEW.data_type_2 = (select case when NEW.data_type like 'character varying(%' THEN replace (NEW.data_type,'character varying','varchar')
when NEW.data_type like 'timestamp%' THEN 'timestamp' else NEW.data_type end);
 
 SET NEW.l2_total_cnt_q = concat('select count(',NEW.destination_column,') from ',NEW.destination_table,' where aco_id = ',NEW.aco_id,' and source_id = ',NEW.source_id,' ;');
 SET NEW.l2_unq_cnt_q = concat('select count(distinct ',NEW.destination_column,') from ',NEW.destination_table,' where aco_id = ',NEW.aco_id,' and source_id = ',NEW.source_id,' ;');
 
 SET NEW.l1_total_cnt_wf_q  = concat('select count(',NEW.source_column,') from ',NEW.source_table,';');
 SET NEW.l1_unq_cnt_wf_q  = concat('select count(distinct ',NEW.source_column,') from ',NEW.source_table,';');
 
 -- SET @joinn = (select group_concat(concat(' ',rule_type,' ',source_table,' ON ',source_table,'.',substring_index(rule,'=',1),' = ',destination_table,'.',substring_index(rule,'=',-1)) separator '\n')str
-- from buildsheet_proj_stg where meta_id = NEW.meta_id and rule_type like '%join' and destination_table = NEW.source_table);

SET @frm = (SELECT CONCAT('FROM ',l1_schema,'.',source_table,' AS ',alias,' ') FROM buildsheet_data WHERE rule_type = 'from' AND meta_id = NEW.meta_id);

SET @joinn = (SELECT GROUP_CONCAT(val SEPARATOR ' ') FROM (SELECT CONCAT(rule_type, ' ', l2_schema, '.', destination_table, ' AS ', alias, ' ON ', rule) val FROM buildsheet_data
WHERE meta_id = NEW.meta_id AND l2_schema != 'subquery' AND rule_type LIKE '%join%' ORDER BY id) x);


SET @sq = (SELECT GROUP_CONCAT(CONCAT(rule_type,' (',destination_table,') AS ',alias,' ON ',rule) SEPARATOR ' ')
FROM buildsheet_data WHERE l2_schema = 'subquery' AND meta_id = NEW.meta_id);

-- SET NEW.l1_total_cnt_q = concat('select count(',NEW.source_table,'.',NEW.source_column,') from ',NEW.source_table,' ',IFNULL(@joinn,''),' ;');
-- SET NEW.l1_unq_cnt_q = concat('select count(distinct ',NEW.source_table,'.',NEW.source_column,') from ',NEW.source_table,' ',IFNULL(@joinn,''),' ;');
 
 SET NEW.l1_total_cnt_q = CONCAT('select count(',NEW.alias,'.',NEW.source_column,') ',@frm,' ' ,IFNULL(@joinn,''),' ',IFNULL(@sq,''));
 SET NEW.l1_unq_cnt_q = CONCAT('select count(distinct ',NEW.alias,'.',NEW.source_column,') ',@frm,' ' ,IFNULL(@joinn,''),' ',IFNULL(@sq,''));
 #######################################################################################################################################
 #################################################################DQR####################################################################
 IF NEW.category = 'member' THEN
 
 IF NEW.destination_column = 'gender' THEN
 SET NEW.semantic_q = concat('SELECT count(gender) FROM "member" JOIN s0001 ON "member".gender = s0001.code WHERE "member".aco_id = ',NEW.aco_id,' AND "member".source_id = ',NEW.source_id,';');
 ELSEIF NEW.destination_column = 'ethnicity' THEN
 SET NEW.semantic_q = concat('SELECT count(ethnicity) FROM "member" JOIN s0002 ON "member".ethnicity = s0002.code WHERE "member".aco_id = ',NEW.aco_id,' AND "member".source_id = ',NEW.source_id,';');
ELSEIF NEW.destination_column = 'race' THEN
SET NEW.semantic_q = concat('SELECT count(race) FROM "member" JOIN s0003 ON "member".race = s0003.code WHERE "member".aco_id = ',NEW.aco_id,' AND "member".source_id = ',NEW.source_id,';');
ELSEIF NEW.destination_column = 'marital_status' THEN
SET NEW.semantic_q = concat('SELECT count(marital_status) FROM "member" JOIN s0004 ON "member".marital_status = s0004.code WHERE "member".aco_id = ',NEW.aco_id,' AND "member".source_id = ',NEW.source_id,';');
ELSEIF NEW.destination_column = 'primary_language' THEN
SET NEW.semantic_q = concat('SELECT count(primary_language) FROM "member" JOIN s0005 ON "member".primary_language = s0005.code WHERE "member".aco_id = ',NEW.aco_id,' AND "member".source_id = ',NEW.source_id,';');
ELSEIF NEW.destination_column = 'cms_status' THEN
SET NEW.semantic_q = concat('SELECT count(cms_status) FROM "member" JOIN s0006 ON "member".cms_status = s0006.code WHERE "member".aco_id = ',NEW.aco_id,' AND "member".source_id = ',NEW.source_id,';');
ELSEIF NEW.destination_column = 'deceased_flag' THEN
SET NEW.semantic_q = concat('SELECT count(deceased_flag) FROM "member" JOIN s0014 ON "member".deceased_flag = s0014.code WHERE "member".aco_id = ',NEW.aco_id,' AND "member".source_id = ',NEW.source_id,';');
ELSEIF NEW.destination_column = 'reason_entitlement' THEN
SET NEW.semantic_q = concat('SELECT count(reason_entitlement) FROM "member" JOIN s0086 ON "member".reason_entitlement = s0086.code WHERE "member".aco_id = ',NEW.aco_id,' AND "member".source_id = ',NEW.source_id,';');
ELSEIF NEW.destination_column = 'buy_in' THEN
SET NEW.semantic_q = concat('SELECT count(buy_in) FROM "member" JOIN s0087 ON "member".buy_in = s0087.code WHERE "member".aco_id = ',NEW.aco_id,' AND "member".source_id = ',NEW.source_id,';');
END IF;

 ELSEIF NEW.category = 'vital' THEN
 
 IF NEW.destination_column = 'normalcy_flag' THEN
 SET NEW.semantic_q = concat('SELECT count(normalcy_flag) FROM vital JOIN s0014 ON vital.normalcy_flag = s0014.code WHERE vital.aco_id = ',NEW.aco_id,' AND vital.source_id = ',NEW.source_id,';');
 ELSEIF NEW.destination_column = 'coding_system' THEN
 SET NEW.semantic_q = concat('SELECT count(coding_system) FROM vital JOIN s0027 ON vital.coding_system = s0027.code WHERE vital.aco_id = ',NEW.aco_id,' AND vital.source_id = ',NEW.source_id,';');
 ELSEIF NEW.destination_column = 'body_site' THEN
  SET NEW.semantic_q = concat('SELECT count(body_site) FROM vital JOIN s0076 ON vital.body_site = s0076.code WHERE vital.aco_id = ',NEW.aco_id,' AND vital.source_id = ',NEW.source_id,';');
END IF;


ELSEIF NEW.category = 'social_history' THEN

 IF NEW.destination_column = 'social_factor_code' THEN
 SET NEW.semantic_q = concat('SELECT count(social_factor_code) FROM social_history JOIN s0039 ON social_history.social_factor_code = s0039.code WHERE social_history.aco_id = ',NEW.aco_id,' AND social_history.source_id = ',NEW.source_id,';');
 ELSEIF NEW.destination_column = 'social_factor_name' THEN
 SET NEW.semantic_q = concat('SELECT count(social_factor_name) FROM social_history JOIN s0039 ON social_history.social_factor_name = s0039.name WHERE social_history.aco_id = ',NEW.aco_id,' AND social_history.source_id = ',NEW.source_id,';');
 ELSEIF NEW.destination_column = 'status' THEN
 SET NEW.semantic_q = concat('SELECT count(status) FROM social_history JOIN s0040 ON social_history.status = s0040.code = s0039.code WHERE social_history.aco_id = ',NEW.aco_id,' AND social_history.source_id = ',NEW.source_id,';');
END IF;


ELSEIF NEW.category = 'provider_org_hierarchy' THEN

 IF NEW.destination_column = 'state_name' THEN
 SET NEW.semantic_q = concat('SELECT count(state_name) FROM provider_org_hierarchy JOIN s0008 ON provider_org_hierarchy.state_name = s0008.code WHERE provider_org_hierarchy.aco_id = ',NEW.aco_id,' AND provider_org_hierarchy.source_id = ',NEW.source_id,';');
 ELSEIF NEW.destination_column = 'preferred_practice_flag' THEN
 SET NEW.semantic_q = concat('SELECT count(preferred_practice_flag) FROM provider_org_hierarchy JOIN s0014 ON provider_org_hierarchy.preferred_practice_flag = s0014.code WHERE provider_org_hierarchy.aco_id = ',NEW.aco_id,' AND provider_org_hierarchy.source_id = ',NEW.source_id,';');
 ELSEIF NEW.destination_column = 'status' THEN
 SET NEW.semantic_q = concat('SELECT count(status) FROM provider_org_hierarchy JOIN s0014 ON provider_org_hierarchy.pcp_flag = s0014.codeS0008.code WHERE provider_org_hierarchy.aco_id = ',NEW.aco_id,' AND provider_org_hierarchy.source_id = ',NEW.source_id,';');
 ELSEIF NEW.destination_column = 'practice_type' THEN
  SET NEW.semantic_q = concat('SELECT count(practice_type) FROM provider_org_hierarchy JOIN s0077 ON provider_org_hierarchy.practice_type = s0077.code WHERE provider_org_hierarchy.aco_id = ',NEW.aco_id,' AND provider_org_hierarchy.source_id = ',NEW.source_id,';');
END IF;


ELSEIF NEW.category = 'procedure' THEN

 IF NEW.destination_column = 'surgical_history_flag' THEN
 SET NEW.semantic_q = concat('SELECT count(surgical_history_flag) FROM procedure JOIN s0014 ON procedure.surgical_history_flag = s0014.code WHERE procedure.aco_id = ',NEW.aco_id,' AND rocedure.source_id = ',NEW.source_id,';');
 ELSEIF NEW.destination_column = 'coding_system' THEN
 SET NEW.semantic_q = concat('SELECT count(coding_system) FROM procedure JOIN s0027 ON procedure.coding_system = s0027.code WHERE procedure.aco_id = ',NEW.aco_id,' AND rocedure.source_id = ',NEW.source_id,';');
 ELSEIF NEW.destination_column = 'procedure_type' THEN
 SET NEW.semantic_q = concat('SELECT count(procedure_type) FROM procedure JOIN s0033 ON procedure.procedure_type = s0033.code WHERE procedure.aco_id = ',NEW.aco_id,' AND rocedure.source_id = ',NEW.source_id,';');
 ELSEIF NEW.destination_column = 'modifier_code_1' THEN
 SET NEW.semantic_q = concat('SELECT count(modifier_code_1) FROM procedure JOIN s0068 ON procedure.modifier_code_1 = s0068.code WHERE procedure.aco_id = ',NEW.aco_id,' AND rocedure.source_id = ',NEW.source_id,';');
  ELSEIF NEW.destination_column = 'modifier_code_2' THEN
 SET NEW.semantic_q = concat('SELECT count(modifier_code_2) FROM procedure JOIN s0068 ON procedure.modifier_code_2 = s0068.code WHERE procedure.aco_id = ',NEW.aco_id,' AND rocedure.source_id = ',NEW.source_id,';');
  ELSEIF NEW.destination_column = 'modifier_code_3' THEN
 SET NEW.semantic_q = concat('SELECT count(modifier_code_3) FROM procedure JOIN s0068 ON procedure.modifier_code_3 = s0068.code WHERE procedure.aco_id = ',NEW.aco_id,' AND rocedure.source_id = ',NEW.source_id,';');
  ELSEIF NEW.destination_column = 'modifier_code_4' THEN
 SET NEW.semantic_q = concat('SELECT count(modifier_code_4) FROM procedure JOIN s0068 ON procedure.modifier_code_4 = s0068.code WHERE procedure.aco_id = ',NEW.aco_id,' AND rocedure.source_id = ',NEW.source_id,';');
  ELSEIF NEW.destination_column = 'modifier_code_5' THEN
 SET NEW.semantic_q = concat('SELECT count(modifier_code_5) FROM procedure JOIN s0068 ON procedure.modifier_code_5 = s0068.code WHERE procedure.aco_id = ',NEW.aco_id,' AND rocedure.source_id = ',NEW.source_id,';');
  ELSEIF NEW.destination_column = 'medication_code' THEN
 SET NEW.ontology_q = concat('select SUM(c1) from (SELECT count(code)c1 FROM procedure JOIN pd_ontology ON procedure.code = pd_ontology.cval WHERE aco_id = ',NEW.aco_id,' AND source_id = ',NEW.source_id,' and pd_ontology.dtp=''procedure'' and pd_ontology.csys in (''HCPCS'',''CPT'') union ALL SELECT count(code)c1 FROM procedure JOIN pd_ontology ON procedure.code = pd_ontology.cvald WHERE aco_id = ',NEW.aco_id,' AND source_id = ',NEW.source_id,' and pd_ontology.dtp=''procedure'' and pd_ontology.csys in (''ICD-10'',''ICD-9'')) ;');

END IF;


ELSEIF NEW.category = 'prescription' THEN

 IF NEW.destination_column = 'generic_flag' THEN
 SET NEW.semantic_q = concat('SELECT count(generic_flag) FROM prescription JOIN s0014 ON prescription.generic_flag = s0014.code WHERE prescription.aco_id = ',NEW.aco_id,' AND prescription.source_id = ',NEW.source_id,';');
 ELSEIF NEW.destination_column = 'coding_system' THEN
  SET NEW.semantic_q = concat('SELECT count(coding_system) FROM prescription JOIN s0027 ON prescription.coding_system = s0027.code WHERE prescription.aco_id = ',NEW.aco_id,' AND prescription.source_id = ',NEW.source_id,';');
 ELSEIF NEW.destination_column = 'route_of_administration' THEN
 SET NEW.semantic_q = concat('SELECT count(route_of_administration) FROM prescription JOIN s0031 ON prescription.route_of_administration = s0031.code WHERE prescription.aco_id = ',NEW.aco_id,' AND prescription.source_id = ',NEW.source_id,';');
 ELSEIF NEW.destination_column = 'usage_frequency' THEN
  SET NEW.semantic_q = concat('SELECT count(usage_frequency) FROM prescription JOIN s0037 ON prescription.usage_frequency = s0037.code WHERE prescription.aco_id = ',NEW.aco_id,' AND prescription.source_id = ',NEW.source_id,';');
   ELSEIF NEW.destination_column = 'ndc_code' THEN
 SET NEW.ontology_q = concat('SELECT count(prescription.*) FROM prescription JOIN pd_ontology ON prescription.ndc_code = pd_ontology.cval WHERE aco_id = ',NEW.aco_id,' AND source_id = ',NEW.source_id,'  and pd_ontology.dtp=''medication'' and csys = ''ndc'' ;');
  ELSEIF NEW.destination_column = 'medication_code' THEN
 SET NEW.ontology_q = concat('select SUM(c1) from (SELECT count(medication_code)c1 FROM prescription JOIN pd_ontology ON prescription.medication_code = pd_ontology.cval WHERE aco_id = ',NEW.aco_id,' AND source_id = ',NEW.source_id,' and pd_ontology.dtp=''medication'' union ALL SELECT count(medication_code)c1 FROM prescription JOIN pd_ontology ON prescription.medication_code = pd_ontology.gpi_code WHERE aco_id = ',NEW.aco_id,' AND prescription.source_id = ',NEW.source_id,' and pd_ontology.dtp=''medication'');');

 END IF;
 
 
  ELSEIF NEW.category = 'member_add' THEN
  
 IF NEW.destination_column = 'state' THEN
 SET NEW.semantic_q = concat('select count(state) from member_add join s0008 on member_add.state=s0008.code WHERE member_add.aco_id = ',NEW.aco_id,' AND member_add.source_id = ',NEW.source_id,';');
 ELSEIF NEW.destination_column = 'address_type' THEN
 SET NEW.semantic_q = concat('select count(address_type) from member_add join s0007 on member_add.address_type=s0007.code WHERE member_add.aco_id = ',NEW.aco_id,' AND member_add.source_id = ',NEW.source_id,';');
 ELSEIF NEW.destination_column = 'country' THEN
 SET NEW.semantic_q = concat('select count(country) from member_add join s0009 on member_add.country=s0009.code WHERE member_add.aco_id = ',NEW.aco_id,' AND member_add.source_id = ',NEW.source_id,';');
 ELSEIF NEW.destination_column = 'address_type' THEN
 SET NEW.semantic_q = concat('select count(address_type) from member_add join s0007 on member_add.address_type=s0007.code WHERE member_add.aco_id = ',NEW.aco_id,' AND member_add.source_id = ',NEW.source_id,';');
 END IF;
 
 
ELSEIF NEW.category = 'member_contact' THEN

 IF NEW.destination_column = 'contact_type' THEN
  SET NEW.semantic_q = concat('select count(contact_type) from member_contact join s0010 on member_contact.contact_type=s0010.code WHERE member_contact.aco_id = ',NEW.aco_id,' AND member_contact.source_id = ',NEW.source_id,';');
 END IF;
 
 
 ELSEIF NEW.category = 'member_email' THEN
 
  IF NEW.destination_column = 'email_type' THEN
   SET NEW.semantic_q = concat('select count(email_type) from member_email join s0011 on member_email.email_type=s0011.code WHERE member_email.aco_id = ',NEW.aco_id,' AND member_email.source_id = ',NEW.source_id,';');
 END IF;
 
 
  ELSEIF NEW.category = 'member_lang' THEN
  
    IF NEW.destination_column = 'email_type' THEN
   SET NEW.semantic_q = concat('select count(email_type) from member_lang join s0005 on member_lang.language=s0005.code WHERE member_lang.aco_id = ',NEW.aco_id,' AND member_lang.source_id = ',NEW.source_id,';');
     ELSEIF NEW.destination_column = 'language_preference' THEN
   SET NEW.semantic_q = concat('select count(language_preference) from member_lang join s0012 on member_lang.language_preference=s0012.code WHERE member_lang.aco_id = ',NEW.aco_id,' AND member_lang.source_id = ',NEW.source_id,';');
 END IF;
 
 
   ELSEIF NEW.category = 'allergy' THEN
     IF NEW.destination_column = 'coding_system' THEN
   SET NEW.semantic_q = concat('select count(coding_system) from allergy join s0027 on allergy.coding_system=s0027.code WHERE allergy.aco_id = ',NEW.aco_id,' AND allergy.source_id = ',NEW.source_id,';');
     ELSEIF NEW.destination_column = 'status' THEN
   SET NEW.semantic_q = concat('select count(status) from allergy join s0040 on allergy.status=s0040.code WHERE allergy.aco_id = ',NEW.aco_id,' AND allergy.source_id = ',NEW.source_id,';');
      ELSEIF NEW.destination_column = 'allergen_type' THEN
   SET NEW.semantic_q = concat('select count(allergen_type) from allergy join s0042 on allergy.allergen_type=s0042.code WHERE allergy.aco_id = ',NEW.aco_id,' AND allergy.source_id = ',NEW.source_id,';');
 END IF;
 
    ELSEIF NEW.category = 'encounter' THEN
     IF NEW.destination_column = 'vip_indicator' THEN
   SET NEW.semantic_q = concat('select count(vip_indicator) from encounter join s0014 on encounter.vip_indicator=s0014.code WHERE encounter.aco_id = ',NEW.aco_id,' AND encounter.source_id = ',NEW.source_id,';');
     ELSEIF NEW.destination_column = 'admission_type' THEN
   SET NEW.semantic_q = concat('select count(admission_type) from encounter join s0017 on encounter.admission_type=s0017.code WHERE encounter.aco_id = ',NEW.aco_id,' AND encounter.source_id = ',NEW.source_id,';');
      ELSEIF NEW.destination_column = 'place_of_service' THEN
   SET NEW.semantic_q = concat('select count(place_of_service) from encounter join s0023 on encounter.place_of_service=s0023.code WHERE encounter.aco_id = ',NEW.aco_id,' AND encounter.source_id = ',NEW.source_id,';');
      ELSEIF NEW.destination_column = 'referral_code' THEN
   SET NEW.semantic_q = concat('select count(referral_code) from encounter join s0025 on encounter.referral_code=s0025.code WHERE encounter.aco_id = ',NEW.aco_id,' AND encounter.source_id = ',NEW.source_id,';');
      ELSEIF NEW.destination_column = 'encounter_type' THEN
   SET NEW.semantic_q = concat('select count(encounter_type) from encounter join s0032 on encounter.encounter_type=s0032.code WHERE encounter.aco_id = ',NEW.aco_id,' AND encounter.source_id = ',NEW.source_id,';');
        ELSEIF NEW.destination_column = 'financial_class' THEN
   SET NEW.semantic_q = concat('select count(financial_class) from encounter join s0069 on encounter.financial_class=s0069.code WHERE encounter.aco_id = ',NEW.aco_id,' AND encounter.source_id = ',NEW.source_id,';');
      ELSEIF NEW.destination_column = 'disposition_code' THEN
   SET NEW.semantic_q = concat('select count(disposition_code) from encounter join s0074 on encounter.disposition_code=s0074.code WHERE encounter.aco_id = ',NEW.aco_id,' AND encounter.source_id = ',NEW.source_id,';');
 END IF;
 
     ELSEIF NEW.category = 'family_circle' THEN
      IF NEW.destination_column = 'vip_indicator' THEN
   SET NEW.semantic_q = concat('select count(vip_indicator) from family_circle join s0014 on family_circle.caretaker_flag=s0014.code WHERE family_circle.aco_id = ',NEW.aco_id,' AND family_circle.source_id = ',NEW.source_id,';');
     ELSEIF NEW.destination_column = 'relationship' THEN
   SET NEW.semantic_q = concat('select count(relationship) from family_circle join s0041 on family_circle.relationship=s0041.name WHERE family_circle.aco_id = ',NEW.aco_id,' AND family_circle.source_id = ',NEW.source_id,';');
      ELSEIF NEW.destination_column = 'relationship_code' THEN
   SET NEW.semantic_q = concat('select count(relationship_code) from family_circle join s0041 on family_circle.relationship_code=s0041.code WHERE family_circle.aco_id = ',NEW.aco_id,' AND family_circle.source_id = ',NEW.source_id,';');
    END IF; 
    
     ELSEIF NEW.category = 'family_history' THEN
       IF NEW.destination_column = 'disease_status' THEN
   SET NEW.semantic_q = concat('select count(disease_status) from family_history join s0040 on family_history.disease_status=s0040.code WHERE family_history.aco_id = ',NEW.aco_id,' AND family_history.source_id = ',NEW.source_id,';');
     ELSEIF NEW.destination_column = 'relationship' THEN
   SET NEW.semantic_q = concat('select count(relationship) from family_history join s0041 on family_history.relationship=s0041.name  WHERE family_history.aco_id = ',NEW.aco_id,' AND family_history.source_id = ',NEW.source_id,';');
      ELSEIF NEW.destination_column = 'relationship_code' THEN
   SET NEW.semantic_q = concat('select count(relationship_code) from family_history join s0041 on family_history.relationship_code=s0041.code WHERE family_history.aco_id = ',NEW.aco_id,' AND family_history.source_id = ',NEW.source_id,';');
    END IF; 

     ELSEIF NEW.category = 'immunization' THEN
	IF NEW.destination_column = 'disease_status' THEN
   SET NEW.semantic_q = concat('select count(coding_system) from immunization join s0027 on immunization.coding_system=s0027.code WHERE aco_id = ',NEW.aco_id,' AND source_id = ',NEW.source_id,';');
     ELSEIF NEW.destination_column = 'relationship' THEN
   SET NEW.semantic_q = concat('select count(status) from immunization join s0040 on immunization.status=s0040.code WHERE aco_id = ',NEW.aco_id,' AND source_id = ',NEW.source_id,';');
      ELSEIF NEW.destination_column = 'relationship_code' THEN
   SET NEW.semantic_q = concat('select count(immunization_code) from immunization join s0044 on immunization.immunization_code=s0044.code WHERE aco_id = ',NEW.aco_id,' AND source_id = ',NEW.source_id,';');
    ELSEIF NEW.destination_column = 'immunization_code' THEN
   SET NEW.ontology_q = concat('SELECT SUM(c1) FROM (SELECT count(immunization_code)c1 FROM immunization JOIN pd_ontology ON immunization.immunization_code = pd_ontology.cval WHERE aco_id = ',NEW.aco_id,' AND source_id = ',NEW.source_id,' and pd_ontology.dtp=''vaccination'' union ALL SELECT count(immunization_code)c1 FROM immunization JOIN pd_ontology ON immunization.immunization_code = pd_ontology.cval WHERE immunization.aco_id = ',NEW.aco_id,' AND source_id = ',NEW.source_id,' and csys=''ndc'' and pd_ontology.odsc6=''vaccine'');');
    END IF; 

     ELSEIF NEW.category = 'insurance' THEN
     IF NEW.destination_column = 'subscriber_gender' THEN
  SET NEW.semantic_q = concat('select count(subscriber_gender) from insurance join s0001 on insurance.subscriber_gender=s0001.code WHERE aco_id = ',NEW.aco_id,' AND source_id = ',NEW.source_id,';');
     ELSEIF NEW.destination_column = 'relationship' THEN
   SET NEW.semantic_q = concat('SELECT count(subscriber_relationship) FROM insurance JOIN s0041 ON insurance.subscriber_relationship = s0041.code WHERE aco_id = ',NEW.aco_id,' AND source_id = ',NEW.source_id,';');
      ELSEIF NEW.destination_column = 'subscriber_relationship_code' THEN
   SET NEW.semantic_q = concat('SELECT count(subscriber_relationship_code) FROM insurance JOIN s0041 ON insurance.subscriber_relationship_code = s0041.code WHERE aco_id = ',NEW.aco_id,' AND source_id = ',NEW.source_id,';');
        ELSEIF NEW.destination_column = 'plan_type' THEN
   SET NEW.semantic_q = concat('SELECT count(plan_type) FROM insurance JOIN s0049 ON insurance.plan_type = s0049.code WHERE aco_id = ',NEW.aco_id,' AND source_id = ',NEW.source_id,';'); 
END IF;

     ELSEIF NEW.category = 'appoinment' THEN
      IF NEW.destination_column = 'appointment_type' THEN
  SET NEW.semantic_q = concat('SELECT count(appointment_type) FROM appointment JOIN s0050 ON appointment.appointment_type = s0050.code WHERE aco_id = ',NEW.aco_id,' AND source_id = ',NEW.source_id,';');
     ELSEIF NEW.destination_column = 'resource_location_type' THEN
   SET NEW.semantic_q = concat('SELECT count(resource_location_type) FROM appointment JOIN s0072 ON appointment.resource_location_type = s0072.code WHERE aco_id = ',NEW.aco_id,' AND source_id = ',NEW.source_id,';');
END IF;

     ELSEIF NEW.category = 'attachment' THEN
      IF NEW.destination_column = 'attachment_type' THEN
  SET NEW.semantic_q = concat('SELECT count(attachment_type) FROM attachment JOIN s0047 ON attachment.attachment_type = s0047.code WHERE aco_id = ',NEW.aco_id,' AND source_id = ',NEW.source_id,';');
     ELSEIF NEW.destination_column = 'doc_type' THEN
   SET NEW.semantic_q = concat('SELECT count(doc_type) FROM attachment JOIN s0048 ON attachment.doc_type = s0048.code WHERE aco_id = ',NEW.aco_id,' AND source_id = ',NEW.source_id,';');
END IF;

     ELSEIF NEW.category = 'diagnosis' THEN
      IF NEW.destination_column = 'attachment_type' THEN
  SET NEW.semantic_q = concat('SELECT count(coding_system) FROM diagnosis JOIN s0027 ON diagnosis.coding_system = s0027.code WHERE aco_id = ',NEW.aco_id,' AND source_id = ',NEW.source_id,';');
  ELSEIF NEW.destination_column = 'diagnosis_code' THEN
 SET NEW.ontology_q = concat('SELECT count(diagnosis_code) FROM diagnosis JOIN pd_ontology ON diagnosis.diagnosis_code = pd_ontology.cvald WHERE aco_id = ',NEW.aco_id,' AND source_id = ',NEW.source_id,' and pd_ontology.dtp=''diagnosis'' ;');
END IF;
   
     ELSEIF NEW.category = 'lab_result' THEN
        IF NEW.destination_column = 'normalcy_flag' THEN
  SET NEW.semantic_q = concat('SELECT count(normalcy_flag) FROM lab_result JOIN s0014 ON lab_result.normalcy_flag = s0014.code WHERE aco_id = ',NEW.aco_id,' AND source_id = ',NEW.source_id,';');
     ELSEIF NEW.destination_column = 'coding_system' THEN
   SET NEW.semantic_q = concat('SELECT count(coding_system) FROM lab_result JOIN s0027 ON lab_result.coding_system = s0027.code WHERE aco_id = ',NEW.aco_id,' AND source_id = ',NEW.source_id,';');
  ELSEIF NEW.destination_column = 'medication_code' THEN
 SET NEW.ontology_q = concat('SELECT count(result_code) FROM lab_result JOIN pd_ontology ON lab_result.result_code = pd_ontology.cval WHERE aco_id = ',NEW.aco_id,' AND prescription.source_id = ',NEW.source_id,'  and pd_ontology.dtp=''result'';');
END IF; 

ELSEIF NEW.category = 'claim_header' THEN

 IF NEW.destination_column = 'present_at_admission' THEN
 SET NEW.semantic_q = concat('SELECT count(present_at_admission) FROM claim_header JOIN s0014 ON claim_header.out_network_flag = s0014.code WHERE procedure.aco_id = ',NEW.aco_id,' AND rocedure.source_id = ',NEW.source_id,';');
 ELSEIF NEW.destination_column = 'out_network_flag' THEN
 SET NEW.semantic_q = concat('SELECT count(out_network_flag) FROM claim_header JOIN s0014 ON claim_header.out_network_flag = s0014.code  WHERE procedure.aco_id = ',NEW.aco_id,' AND rocedure.source_id = ',NEW.source_id,';');
 ELSEIF NEW.destination_column = 'admission_type' THEN
 SET NEW.semantic_q = concat('SELECT count(admission_type) FROM claim_header JOIN s0017 ON claim_header.admission_type = s0017.code WHERE procedure.aco_id = ',NEW.aco_id,' AND rocedure.source_id = ',NEW.source_id,';');
 ELSEIF NEW.destination_column = 'claim_type' THEN
 SET NEW.semantic_q = concat('SELECT count(claim_type) FROM claim_header JOIN s0018 ON claim_header.claim_type = s0018.code WHERE procedure.aco_id = ',NEW.aco_id,' AND rocedure.source_id = ',NEW.source_id,';');
  ELSEIF NEW.destination_column = 'service_type' THEN
 SET NEW.semantic_q = concat('SELECT count(service_type) FROM claim_header JOIN s0020 ON claim_header.service_type = s0020.code WHERE procedure.aco_id = ',NEW.aco_id,' AND rocedure.source_id = ',NEW.source_id,';');
  ELSEIF NEW.destination_column = 'frequency_type' THEN
 SET NEW.semantic_q = concat('SELECT count(frequency_type) FROM claim_header JOIN s0021 ON claim_header.frequency_type = s0021.code WHERE procedure.aco_id = ',NEW.aco_id,' AND rocedure.source_id = ',NEW.source_id,';');
  ELSEIF NEW.destination_column = 'type_of_bill' THEN
 SET NEW.semantic_q = concat('SELECT count(type_of_bill) FROM claim_header JOIN s0022 ON claim_header.type_of_bill = s0022.code WHERE procedure.aco_id = ',NEW.aco_id,' AND rocedure.source_id = ',NEW.source_id,';');
  ELSEIF NEW.destination_column = 'place_of_service' THEN
 SET NEW.semantic_q = concat('SELECT count(place_of_service) FROM claim_header JOIN s0023 ON claim_header.place_of_service = s0023.code WHERE procedure.aco_id = ',NEW.aco_id,' AND rocedure.source_id = ',NEW.source_id,';');
  ELSEIF NEW.destination_column = 'adjustment_status' THEN
 SET NEW.ontology_q = concat('SELECT count(adjustment_status) FROM claim_header JOIN s0024 ON claim_header.adjustment_status = s0024.code WHERE aco_id = ',NEW.aco_id,' AND source_id = ',NEW.source_id,';');
  ELSEIF NEW.destination_column = 'adjustment_reason' THEN
 SET NEW.semantic_q = concat('SELECT count(adjustment_reason) FROM claim_header JOIN s0024 ON claim_header.adjustment_reason = s0024.code WHERE procedure.aco_id = ',NEW.aco_id,' AND rocedure.source_id = ',NEW.source_id,';');
  ELSEIF NEW.destination_column = 'referral_source_code' THEN
 SET NEW.semantic_q = concat('SELECT count(referral_source_code) FROM claim_header JOIN s0025 ON claim_header.referral_source_code = s0025.code WHERE procedure.aco_id = ',NEW.aco_id,' AND rocedure.source_id = ',NEW.source_id,';');
  ELSEIF NEW.destination_column = 'diagnosis_coding_system' THEN
 SET NEW.semantic_q = concat('SELECT count(diagnosis_coding_system) FROM claim_header JOIN s0026 ON claim_header.diagnosis_coding_system = s0026.code  WHERE procedure.aco_id = ',NEW.aco_id,' AND rocedure.source_id = ',NEW.source_id,';');
  ELSEIF NEW.destination_column = 'diagnosis_coding_system' THEN
 SET NEW.semantic_q = concat('SELECT count(diagnosis_coding_system) FROM claim_header JOIN s0027 ON claim_header.diagnosis_coding_system = s0027.code WHERE procedure.aco_id = ',NEW.aco_id,' AND rocedure.source_id = ',NEW.source_id,';');
  ELSEIF NEW.destination_column = 'denial_reason' THEN
 SET NEW.ontology_q = concat('SELECT count(denial_reason) FROM claim_header JOIN s0071 ON claim_header.denial_reason = s0071.code  WHERE aco_id = ',NEW.aco_id,' AND source_id = ',NEW.source_id,';');
  ELSEIF NEW.destination_column = 'claim_charge_flag' THEN
 SET NEW.semantic_q = concat('SELECT count(claim_charge_flag) FROM claim_header JOIN s0082 ON claim_header.claim_charge_flag = s0082.code WHERE procedure.aco_id = ',NEW.aco_id,' AND rocedure.source_id = ',NEW.source_id,';');
  ELSEIF NEW.destination_column = 'claim_nch_code' THEN
 SET NEW.ontology_q = concat('SELECT count(claim_nch_code) FROM claim_header JOIN s0088 ON claim_header.claim_nch_code = s0088.code WHERE aco_id = ',NEW.aco_id,' AND source_id = ',NEW.source_id,';');
   ELSEIF NEW.destination_column = 'claim_query_code' THEN
 SET NEW.semantic_q = concat('SELECT count(claim_query_code) FROM claim_header JOIN s0089 ON claim_header.claim_query_code = s0089.code WHERE procedure.aco_id = ',NEW.aco_id,' AND rocedure.source_id = ',NEW.source_id,';');
END IF;

ELSEIF NEW.category = 'claim_line' THEN

IF NEW.destination_column = 'out_network_flag' THEN
 SET NEW.semantic_q = concat('SELECT count(out_network_flag) FROM claim_header JOIN s0014 ON claim_header.out_network_flag = s0014.code WHERE procedure.aco_id = ',NEW.aco_id,' AND rocedure.source_id = ',NEW.source_id,';');
 ELSEIF NEW.destination_column = 'service_type' THEN
 SET NEW.semantic_q = concat('SELECT count(service_type) FROM claim_header JOIN s0020 ON claim_header.service_type = s0020.code  WHERE procedure.aco_id = ',NEW.aco_id,' AND rocedure.source_id = ',NEW.source_id,';');
 ELSEIF NEW.destination_column = 'place_of_service' THEN
 SET NEW.semantic_q = concat('SELECT count(place_of_service) FROM claim_header JOIN s0023 ON claim_header.place_of_service = s0023.code WHERE procedure.aco_id = ',NEW.aco_id,' AND rocedure.source_id = ',NEW.source_id,';');
 ELSEIF NEW.destination_column = 'revenue_center_code' THEN
 SET NEW.semantic_q = concat('SELECT count(revenue_center_code) FROM claim_header JOIN s0028 ON claim_header.claim_type = s0028.code WHERE procedure.aco_id = ',NEW.aco_id,' AND rocedure.source_id = ',NEW.source_id,';');
END IF;


END IF;
END$$
DELIMITER ;
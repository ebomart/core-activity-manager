const ACTIVITY_TEMPALTE = {
  NAME: "activity_template",
  COLUMNS: {
    ACTIVITY_TEMPLATE_ID: "activity_template_id",
    ACTIVITY_NAME: "activity_name",
    DESCRIPTION: "description",
    CATEGORY: "category",
    PRIORITY: "priority",
    ACTIVITY_ROLE: "activity_role",
    TYPE: "type",
    REPEAT_INFO: "repeat_info",
    ACTIVITY_DAY_SLOT: "activity_day_slot",
    START_TIME: "start_time",
    END_BY_TIME: "end_by_time",
    EXPIRY_TIME: "expiry_time",
    ACTIVITY_DURATION_IN_MINS: "activity_duration_in_mins",
    ACTIVITY_EVIDENCE_TYPE: "activity_evidence_type",
    IS_EVIDENCE_MANDATORY: "is_evidence_mandatory",
    CHECKLIST: "checklist",
    ESCALATION: "escalation",
    IS_ACTIVE: "is_active",
    AUDIT: "audit"
  }
};

const ACTIVITY_TEMPLATE_CHECKLIST = {
  NAME: "activity_template_checklist",
  COLUMNS: {
    QUESTION_ID: "question_id",
    ACTIVITY_TEMPLATE_ID: "activity_template_id",
    QUESTION_TEXT: "question_text",
    TYPE: "type",
    OPTIONS: "options",
    CREATED_AT: "created_at"
  }
};

module.exports = {
  ACTIVITY_TEMPALTE,
  ACTIVITY_TEMPLATE_CHECKLIST
};

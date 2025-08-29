const { v5: uuidV5 } = require("uuid");
const {
  getListOfAcitivityDateAndTimeFromTemplate,
  getOneTimeAcitivityDateAndTimeFromTemplate
} = require("../helpers/createActivitiesFromTemplate");
const { getAuditInfo } = require("../../commons/helpers");

const getAcitivitiesForAllOutlets = ({
  acitvityList,
  outlet_ids,
  activity_template_id,
  activity_name,
  expiry_time,
  activity_duration_in_mins,
  audit
}) => {
  return outlet_ids.flatMap(outlet_id => {
    return acitvityList.map(val => {
      return {
        activity_id: uuidV5(
          `${activity_template_id}_${outlet_id}_${val.activity_date}`,
          uuidV5.URL
        ),
        activity_template_id,
        activity_name,
        outlet_id,
        activity_date: val.activity_date,
        start_time: val.start_time,
        end_by_time: val.end_by_time,
        expiry_time,
        activity_duration_in_mins,
        activity_start_datetime: val.activity_start_datetime,
        escalation: JSON.stringify([]),
        checklist: JSON.stringify([]),
        status: "PENDING",
        audit
      };
    });
  });
};

const getTransformedListOfAcitivitiesFromTemplate = ({
  template,
  outlet_ids
}) => {
  const {
    type,
    repeat_info,
    start_time,
    end_by_time,
    expiry_time,
    activity_template_id,
    activity_name,
    // escalation,
    activity_duration_in_mins,
    audit
  } = template;

  let { start_datetime } = template;

  if (new Date(start_datetime).getTime() < new Date().getTime()) {
    start_datetime = new Date().toISOString();
  }

  if (type === "REPEATING") {
    const acitvityList = getListOfAcitivityDateAndTimeFromTemplate({
      start_datetime,
      repeat_info,
      start_time,
      end_by_time
    });
    return getAcitivitiesForAllOutlets({
      acitvityList,
      outlet_ids,
      activity_template_id,
      activity_name,
      expiry_time,
      activity_duration_in_mins,
      audit: getAuditInfo({ audit })
    });
  }

  const acitvityList = getOneTimeAcitivityDateAndTimeFromTemplate({
    start_datetime,
    start_time,
    end_by_time
  });
  return getAcitivitiesForAllOutlets({
    acitvityList,
    outlet_ids,
    activity_template_id,
    activity_name,
    expiry_time,
    activity_duration_in_mins,
    audit: getAuditInfo({ audit })
  });
};

module.exports = { getTransformedListOfAcitivitiesFromTemplate };

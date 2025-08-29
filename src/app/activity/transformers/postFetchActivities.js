const momentTimezone = require("moment-timezone");

const groupAcivitiesByOutletIdAndAcitivityDate = input => {
  const ACTIVITY_STATUS_PRIO = ["PENDING", "LAPSED", "COMPLETED"];

  // Sort Input Based on PRio
  const sortedInput = input.sort(
    (a, b) =>
      ACTIVITY_STATUS_PRIO.indexOf(a.status) -
        ACTIVITY_STATUS_PRIO.indexOf(b.status) ||
      a.activity_start_datetime - b.activity_start_datetime
  );

  const outletPlusActvtyDateWisemap = {};

  sortedInput.forEach(activity => {
    const {
      outlet_id,
      activity_date,
      start_time,
      expiry_time,
      end_by_time,
      checklist_template,
      ...restProps
    } = activity;

    const formattedDate = momentTimezone(activity_date).format("YYYY-MM-DD");

    const key = `${outlet_id}_${formattedDate}`;
    if (Object.hasOwnProperty.call(outletPlusActvtyDateWisemap, key)) {
      outletPlusActvtyDateWisemap[key].activities.push({
        ...restProps,
        checklist_count: checklist_template.length,
        start_time: start_time.slice(0, 5),
        expiry_time: expiry_time.slice(0, 5),
        end_by_time: end_by_time.slice(0, 5)
      });
    } else {
      outletPlusActvtyDateWisemap[key] = {
        outlet_id,
        activity_date: formattedDate,
        activities: [
          {
            ...restProps,
            checklist_count: checklist_template.length,
            start_time: start_time.slice(0, 5),
            expiry_time: expiry_time.slice(0, 5),
            end_by_time: end_by_time.slice(0, 5)
          }
        ]
      };
    }
  });

  return Object.values(outletPlusActvtyDateWisemap);
};

module.exports = { groupAcivitiesByOutletIdAndAcitivityDate };

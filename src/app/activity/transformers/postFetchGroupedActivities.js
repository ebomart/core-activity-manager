/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
const momentTimezone = require("moment-timezone");

function groupActivitiesByDaySlot(data, categories) {
  const daySlotMap = {};

  data.forEach(activity => {
    const daySlot = activity.activity_day_slot;

    if (
      !categories?.includes("ALL") &&
      !categories.includes(activity.category)
    ) {
      return;
    }

    const checklistCount = activity.checklist_template
      ? activity.checklist_template.length
      : 0;

    const activityDetails = {
      ...activity,
      start_time: activity.start_time.slice(0, 5),
      end_by_time: activity.end_by_time.slice(0, 5),
      checklist_count: checklistCount
    };

    if (!daySlotMap[daySlot]) {
      daySlotMap[daySlot] = {
        activity_day_slot: daySlot,
        activities: []
      };
    }
    daySlotMap[daySlot].activities.push(activityDetails);
  });
  Object.values(daySlotMap).forEach(slot => {
    slot.activities.sort((a, b) => a.start_time.localeCompare(b.start_time));
  });
  return {
    grouped_activities: Object.values(daySlotMap)
  };
}

function getCategoryMetadataMap(data) {
  const categoryStatsMap = {};

  let totalActivities = 0;
  let completedActivities = 0;

  data.forEach(({ category, status }) => {
    totalActivities++;
    if (status === "COMPLETED") {
      completedActivities++;
    }

    if (!categoryStatsMap[category]) {
      categoryStatsMap[category] = {
        name: category,
        completed: 0,
        total: 0
      };
    }

    categoryStatsMap[category].total++;
    if (status === "COMPLETED") {
      categoryStatsMap[category].completed++;
    }
  });

  // Add the "ALL" category with totals from all categories
  categoryStatsMap.ALL = {
    name: "ALL",
    completed: completedActivities,
    total: totalActivities
  };

  return Object.values(categoryStatsMap).map(category => {
    const completedPercentage =
      category.total > 0
        ? Math.round((category.completed / category.total) * 100)
        : 0;
    return {
      name: category.name,
      completed_percentage: completedPercentage
    };
  });
}

const groupAcivitiesByOutletIdAndAcitivityDateWithActivitySlot = (
  activities,
  categories
) => {
  const { grouped_activities } = groupActivitiesByDaySlot(
    activities,
    categories
  );
  const metadata = getCategoryMetadataMap(activities);

  const finalResult = {
    outlet_id: activities[0]?.outlet_id,
    activity_date: momentTimezone(activities[0]?.activity_date).format(
      "YYYY-MM-DD"
    ),
    grouped_activities,
    metadata: {
      categories: Object.values(metadata)
    }
  };

  return [finalResult];
};

module.exports = { groupAcivitiesByOutletIdAndAcitivityDateWithActivitySlot };

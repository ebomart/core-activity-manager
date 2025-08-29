const transformActivityResponse = ({
  activityResponse,
  activityTemplateResponse
}) => {
  const {
    checklist,
    start_time,
    expiry_time,
    end_by_time,
    activity_evidence,
    ...restProps
  } = activityResponse;
  const { checklist: checklistTemplate, activity_evidences } =
    activityTemplateResponse;

  const checkListMap = checklist.reduce((acc, val) => {
    acc[val.question_id] = {
      ...val,
      option_ids: val.options?.length
        ? val.options.map(option => option.option_id)
        : []
    };

    return acc;
  }, {});

  return {
    ...restProps,
    submitted_activity_evidence: activity_evidence,
    start_time: start_time.slice(0, 5),
    expiry_time: expiry_time.slice(0, 5),
    end_by_time: end_by_time.slice(0, 5),
    activity_evidences,
    checklist: checklistTemplate.map(value => {
      const { type, question_id, question_text, options } = value;

      if (type === "TEXT") {
        return {
          question_id,
          question_text,
          type,
          answer_text: checkListMap[question_id]?.answer_text || "",
          options: []
        };
      }
      return {
        question_id,
        question_text,
        type,
        answer_text: null,
        options: options.map(option => {
          const { option_id, option_text } = option;
          return {
            option_id,
            option_text,
            selected:
              checkListMap[question_id]?.option_ids?.includes(option_id) ||
              false
          };
        })
      };
    })
  };
};

module.exports = { transformActivityResponse };

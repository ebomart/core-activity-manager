const { v4: uuidV4 } = require("uuid");

const transformChecklist = ({ inputChecklist, activity_template_id }) => {
  return inputChecklist.map(val => {
    const { question_text, type, options } = val;

    return {
      activity_template_id,
      question_text,
      type,
      options: JSON.stringify(
        options?.length
          ? options.map(option => ({ option_id: uuidV4(), ...option }))
          : []
      )
    };
  });
};

module.exports = {
  transformChecklist
};

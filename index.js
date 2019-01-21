const prompts = require("prompts");
const {
  generateAuthHeader,
  getAxiosInstance,
  getJIRADateFormat,
  requiredValidator,
  getWorkLogPromptFields
} = require("./utils");
const main = async () => {
  try {
    const axiosInstance = await getAxiosInstance();
    const { ISSUE_KEY, TIME_SPENT, COMMENT } = await getWorkLogPromptFields();

    const response = await axiosInstance.post(`/issue/${ISSUE_KEY}/worklog`, {
      started: getJIRADateFormat(),
      timeSpent: TIME_SPENT,
      comment: COMMENT || `Working on issue ${ISSUE_KEY}`
    });
    console.log("Worklog has been added");
  } catch (error) {
    console.log("Failed Status code ", error);
  }
};

main();

require("dotenv").config();
const axios = require("axios");
const prompts = require("prompts");
const moment = require("moment");

const generateAuthHeader = (username, password) => {
  const AUTH_HEADER_PLAIN = `${username}:${password}`;
  const AUTH_HEADER_ENCODED = Buffer.from(AUTH_HEADER_PLAIN).toString("base64");
  return AUTH_HEADER_ENCODED;
};

const getAxiosInstance = async () => {
  let JIRA_EMAIL = process.env.JIRA_EMAIL;
  let JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
  if (!JIRA_EMAIL) {
    const response = await prompts({
      type: "text",
      name: "JIRA_EMAIL",
      validate: value => requiredValidator(value, "Enter email"),
      message: `Enter email associated with JIRA`
    });
    JIRA_EMAIL = response.JIRA_EMAIL;
  } else if (!JIRA_API_TOKEN) {
    const response = await prompts({
      type: "text",
      name: "JIRA_API_TOKEN",
      validate: value => requiredValidator(value, "Enter API token"),
      message: `Enter JIRA API Token key`
    });
    JIRA_API_TOKEN = response.JIRA_API_TOKEN;
  }
  const AUTH_BASIC_HEADER = generateAuthHeader(JIRA_EMAIL, JIRA_API_TOKEN);

  return axios.create({
    baseURL: process.env.ROOT_URL,
    headers: {
      Authorization: `Basic ${AUTH_BASIC_HEADER}`,
      "Content-Type": "application/json"
    }
  });
};

const getJIRADateFormat = (momentDate = moment()) => {
  return momentDate.format("YYYY-MM-DDTHH:mm:ss.SSSZZ");
};
const requiredValidator = (value, message) => {
  if (value) {
    return true;
  } else {
    return message;
  }
};
const getWorkLogPromptFields = () => {
  return prompts([
    {
      type: "text",
      name: "ISSUE_KEY",
      validate: value => requiredValidator(value, "Enter Issue Key"),
      message: `Enter Issue Key eg. REEL-2906`
    },
    {
      type: "text",
      name: "TIME_SPENT",
      validate: value => requiredValidator(value, "Enter Time spent"),
      message: `Enter Time Spent eg. 1h, 30m, 2s`
    },
    {
      type: "text",
      name: "COMMENT",
      message: `Enter description (optional)`
    }
  ]);
};
module.exports = {
  generateAuthHeader,
  getAxiosInstance,
  getJIRADateFormat,
  requiredValidator,
  getWorkLogPromptFields
};

require("dotenv").config();
var os = require("os");
const axios = require("axios");
const prompts = require("prompts");
const ENV_FILE_PATH = "./.env";
const moment = require("moment");
const fs = require("fs");

const generateAuthHeader = (username, password) => {
  const AUTH_HEADER_PLAIN = `${username}:${password}`;
  const AUTH_HEADER_ENCODED = Buffer.from(AUTH_HEADER_PLAIN).toString("base64");
  return AUTH_HEADER_ENCODED;
};

const getAxiosInstance = async () => {
  let JIRA_EMAIL = process.env.JIRA_EMAIL;
  let JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
  if (!JIRA_EMAIL) {
    JIRA_EMAIL = await initializeEmail();
  }
  if (!JIRA_API_TOKEN) {
    JIRA_API_TOKEN = await initializeAPIToken();
  }
  const AUTH_BASIC_HEADER = generateAuthHeader(JIRA_EMAIL, JIRA_API_TOKEN);

  return axios.create({
    baseURL: process.env.ROOT_URL || "https://reelo8.atlassian.net/rest/api/2/",
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
const initializeAPIToken = async () => {
  const { JIRA_API_TOKEN } = await prompts({
    type: "text",
    name: "JIRA_API_TOKEN",
    validate: value => requiredValidator(value, "Enter API token"),
    message: `Enter JIRA API Token key`
  });
  const dataToAppend = `JIRA_API_TOKEN=${JIRA_API_TOKEN}${os.EOL}`;
  fs.appendFile(ENV_FILE_PATH, dataToAppend, function(err) {
    if (err) {
      console.log(err);
      return;
    }
  });
  return JIRA_API_TOKEN;
};

const initializeEmail = async () => {
  const { JIRA_EMAIL } = await prompts({
    type: "text",
    name: "JIRA_EMAIL",
    validate: value => requiredValidator(value, "Enter email"),
    message: `Enter email associated with JIRA`
  });
  const dataToAppend = `JIRA_EMAIL=${JIRA_EMAIL}${os.EOL}`;
  fs.appendFile(ENV_FILE_PATH, dataToAppend, function(err) {
    if (err) {
      console.log(err);
      return;
    }
  });
  return JIRA_EMAIL;
};

module.exports = {
  generateAuthHeader,
  getAxiosInstance,
  getJIRADateFormat,
  requiredValidator,
  getWorkLogPromptFields
};

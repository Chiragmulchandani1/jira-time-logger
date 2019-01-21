#! /usr/bin/env node
const fs = require("fs");
const prompts = require("prompts");
const opn = require("opn");
const projects = JSON.parse(fs.readFileSync("projects.json"));
const {
    generateAuthHeader,
    getAxiosInstance,
    getJIRADateFormat,
    requiredValidator,
    getWorkLogPromptFields,
    getStatusPrompt
} = require("./utils");
const main = async () => {
    try {
        const axiosInstance = await getAxiosInstance();
        const {
            ISSUE_KEY,
            TIME_SPENT,
            COMMENT
        } = await getWorkLogPromptFields();
        let baseurl = projects[ISSUE_KEY.split("-")[0]]["url"];
        const url = `${baseurl}/rest/api/2/`;
        axiosInstance.defaults.baseURL = url;
        const response = await axiosInstance.post(
            `/issue/${ISSUE_KEY}/worklog`,
            {
                started: getJIRADateFormat(),
                timeSpent: TIME_SPENT,
                comment: COMMENT || `Working on issue ${ISSUE_KEY}`
            }
        );
        console.log("Worklog has been added");
        const { STATUS } = await getStatusPrompt();
        if (STATUS) {
            opn(`${baseurl}/browse/${ISSUE_KEY}`);
        }
    } catch (error) {
        console.log("Failed Status code ", error.response.status);
    }
};

main();

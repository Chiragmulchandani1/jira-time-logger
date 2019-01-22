### Getting started

- Generate API token in JIRA. [Click here to read more](https://confluence.atlassian.com/cloud/api-tokens-938839638.html)

- Install dependencies and symlink the project folder.

```
 npm install
 npm link
```

- Set/Reset credentials

```
log-time --cred
```

- Start logging

```
log-time
```

### Notes

- The minimum amount of logging time must be a minute, anything below that will fail.
- Edit the projects.json as per you need. Currently we have supported two major projects that are on JIRA namely 1)Reelo 2)ADD
- For any failed status codes, please check the .env file that's being created and ensure correct credentials are being inputted.

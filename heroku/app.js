require("dotenv").config();
const client = require("./connection/connection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");
// const config = require("config");
const app = express();

app.use(express.json({limit: '50mb'}));


const users = require("./router/users.js");
app.use("/users", users);

const projects = require("./router/projects.js");
app.use("/projects", projects);

const backed_projects = require("./router/backed_projects.js");
app.use("/backed_projects", backed_projects);

const profile = require("./router/profile.js");
app.use("/profile", profile);

const user_campaign = require("./router/user_campaign.js");
app.use("/user_campaign", user_campaign);

module.exports = app;

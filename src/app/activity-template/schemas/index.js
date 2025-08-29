const createActivityTemplate = require("./createActivityTemplate");
const getActivityTemplateById = require("./getActivityTemplateById");
const getActivityTemplateList = require("./getActivityTemplateList");
const postActivityTemplatePublish = require("./postActivityTemplatePublish");
const postActivityTemplateUnPublish = require("./postActivityTemplateUnPublish");
const getCategoryRoleList = require("./getCategoryRoleList");
const postFetchActivityTemplateList = require("./postFetchActivityTemplateList");

module.exports = {
  createActivityTemplate,
  getActivityTemplateById,
  getActivityTemplateList,
  postActivityTemplatePublish,
  postActivityTemplateUnPublish,
  getCategoryRoleList,
  postFetchActivityTemplateList
};

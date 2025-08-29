const basic = require("./basic");
const paramsValidation = require("./paramsValidation");
const unstructuredError = require("./unstructuredError");
const postgressError = require("./postgressError");
const dataStoreError = require("./dataStoreError");
const cloudBucketError = require("./cloudBucketError");

module.exports = {
  paramsValidation,
  unstructuredError,
  postgressError,
  DEFAULT_MAPPERS: [
    basic,
    paramsValidation,
    postgressError,
    dataStoreError,
    cloudBucketError,
    unstructuredError
  ]
};

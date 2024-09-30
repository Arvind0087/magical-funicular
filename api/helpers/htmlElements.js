const _ = require("lodash");

exports.removeTdTags = (htmlString) => {
  const regex = /<td>(.*?)<\/td>/g; // Regular expression to match <td> tags and their contents
  const result = _.replace(htmlString, regex, "$1"); // Replace all matches with the contents of the <td> tag
  return result;
};

exports.removeHtmlTags = (htmlString) => {
  const regex = /<\/?[\w\s="/.':;#-\/\?]+>/gi; // Regular expression to match HTML tags
  const result = _.replace(htmlString, regex, ""); // Replace all matches with an empty string
  return result;
};

exports.removeParentheses = (htmlString) => {
  const regex = /[()]/g; // Regular expression to match parentheses
  const result = _.replace(htmlString, regex, ""); // Replace all matches with an empty string
  return result;
};

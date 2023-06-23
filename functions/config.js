require("dotenv").config();

module.exports = {
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  TEMPLATE_KEY_PROGRESS: process.env.TEMPLATE_KEY_PROGRESS,
  TEMPLATE_KEY_NOPROGRESS: process.env.TEMPLATE_KEY_NOPROGRESS,
};

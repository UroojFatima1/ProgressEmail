const functions = require("firebase-functions");
// init admin firebase
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");
const config = require("./config");
const moment = require("moment");
sgMail.setApiKey(config.SENDGRID_API_KEY);
let data = "";
admin.initializeApp();
const db = admin.database();
const userRef = db.ref("users");
const msg = {
  to: "",
  from: {
    name: "AutiKidz",
    email: "autikidz@gmail.com",
  },
  templateId: "",
  dynamic_template_data: {
    name: "",
    date: "",
  },
};
exports.progressEmail = functions.pubsub
    .schedule("every Saturday 09:00")
    .onRun(async (context) => {
      userRef.once("value", (snapshot) => {
        if (snapshot.exists) {
          snapshot.forEach((child) => {
            data = child.val();
            setTid(data.date);
            let progress = "";
            for (const key in data.progress) {
              if (key != "") {
                progress += `${key} Level ${data.progress[key]}<br>`;
              }
            }
            sendmail(msg, child.val().email, data["child's name"],
                data.date, progress);
          });
        }
      }, {
        onlyOnce: true,
      });
    });
const sendmail = (msg, email, user, date, progress) => {
  msg.to = email;
  msg.dynamic_template_data.name = toTitleCase(user);
  msg.dynamic_template_data.progress = progress;
  msg.dynamic_template_data.date = date;
  sgMail
      .send(msg)
      .then((response) => {
        console.log("ok");
      })
      .catch((error) => {
        console.error(error);
      });
};
const setTid = (date) => {
  const lastweek = moment().subtract(7, "days").format("MM/DD/YYYY");
  if (date <= lastweek) {
    msg.templateId = config.TEMPLATE_KEY_NOPROGRESS;
  } else {
    msg.templateId = config.TEMPLATE_KEY_PROGRESS;
  }
};

const toTitleCase = (str) => {
  return str.toLowerCase().split(" ").map((word) => {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(" ");
};

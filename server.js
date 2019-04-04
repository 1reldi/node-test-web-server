const express = require("express");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

const port = process.env.PORT || 3000;

hbs.registerPartials(__dirname + "/views/partials");
app.set("view engine", "hbs");
app.use(express.static(__dirname + "/public"));
hbs.registerHelper("getYear", () => {
  return new Date().getFullYear();
});

// app.use((req, res, next) => {
//   res.render('maintance.hbs', {
//     pageTitle: 'Support'
//   });
// });

app.get("/", (req, res) => {
  res.render("welcome.hbs", {
    pageTitle: "Home Hello Hello10",
    welcomeMessage: "Hello World"
  });
});

app.get("/about", (req, res) => {
  res.render("about.hbs", {
    pageTitle: "About Page"
  });
});

app.get("/bad", (req, res) => {
  res.send({ error: "Unable to handle request" });
});

app.get("/fields", (req, res) => {
  res.send({
    fields: [
      {
        label: "Name",
        key: "contact_name",
        type: "text",
        error: "You must include a name",
        placeholder: "Write a name..."
      },
      {
        label: "Surname",
        key: "contact_surname",
        type: "text",
        error: "You must include a name",
        placeholder: "Write a surname..."
      },
      {
        label: "Email",
        key: "contact_email",
        type: "email",
        error: "You must include an email",
        placeholder: "Write an email..."
      },
      {
        label: "Descriptions",
        key: "contact_description",
        type: "textarea",
        error: "You must include a description",
        placeholder: "Write a description..."
      },
      {
        label: "Phone Number",
        key: "contact_phone_number",
        type: "number",
        error: "You must include a number",
        rules: [
          {
            len: 10,
            message: "The phone number must be only 10 digits"
          }
        ],
        placeholder: "Write a number..."
      },
      {
        label: "Employment status",
        key: "contact_employment_status",
        type: "select",
        error: "You must include an employment status",
        options: ["Employee", "Worker", "Self-employed"],
        placeholder: "Select..."
      }
    ]
  });
});

app.post("/submit-data", (req, res) => {
  console.log(req.body);
  const data = (req.body || {}).data;
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: data.contact_email || "reldi.cela@fshnstudent.info",
    from: "reldi.cela@gmail.com",
    subject: "Contact Form Data",
    text: JSON.stringify(data || {})
  };
  sgMail.send(msg);
  res.status(200).send({ success: 1 });
});

app.listen(port, () => {
  console.log(`Server is up to ${port}`);
});

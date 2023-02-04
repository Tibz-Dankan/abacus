const Email = require("../utils/email");
const { baseUrl } = require("../utils/constants");

const contact = async (req, res) => {
  await new Email(
    process.env.ADMIN_EMAIL,
    "Contact us message",
    req.body.message
  ).sendContactUs(
    req.body.name,
    req.body.message,
    req.body.email,
    req.body.subject
  );
  console.log("contact email sent!");
  res.render("contact", {
    message: "Your message has successfully been submitted",
    baseUrl: baseUrl(),
  });
};

module.exports = { contact };

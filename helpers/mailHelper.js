const nodemailer = require("nodemailer");

let transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "skandaaithal1@gmail.com",
    pass: "jtzbpqijawlwdtxx",
  },
});

let invitationMail = async (email, name) => {
  let sendmail = await transport.sendMail({
    from: "skandaaithal1@gmail.com",
    to: email,
    subject: "Invitation Mail",
    html: `hi there! <br> Welcome to Task Manager <span style=font-size:1rem;text-transform:capitalize>${name}</span> Your account is created`,
  });
};
let otpMail = async (email, name, otp) => {
  let sendmail = await transport.sendMail({
    from: "skandaaithal1@gmail.com",
    to: email,
    subject: "Invitation Mail",
    html: `  <span style=font-size:1rem;text-transform:capitalize>hi ${name}!</span> <br><br>  
      Your OTP is : ${otp}`,
  });
};

module.exports = { invitationMail, otpMail };

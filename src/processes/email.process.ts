import { Job } from "bull";
import nodemailer from "nodemailer";

const emailProcess = async (job: Job) => {
  const testAccount = await nodemailer.createTestAccount();
  console.log(job.data);
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // send mail with defined transport object
  const info = await transporter.sendMail(job.data);

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  return nodemailer.getTestMessageUrl(info);
};

export default emailProcess;

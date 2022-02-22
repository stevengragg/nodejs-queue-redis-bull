import Bull from "bull";
import emailProcess from "../processes/email.process";
import { setQueues, BullAdapter } from "bull-board";

// https://optimalbits.github.io/bull

const emailQueue = new Bull("email", {
  redis: { port: 6379, host: "127.0.0.1", password: "" }
});

setQueues([new BullAdapter(emailQueue)]);

emailQueue.process(100, emailProcess);

const sendNewEmail = (data: any) => {
  console.log("Send new email queue");
  emailQueue.add(data, {
    attempts: 5
  });
};

emailQueue.on("completed", (job: any, result: any) => {
  // Job completed with output result!
  console.log("job: output", { job });
  console.log("result: output", { result });
  console.log("Email task completed");
});

emailQueue.on("failed", (error: any) => {
  // An error occured.
  console.log("Error occured", { errorMessage: error.failedReason });
});

export { sendNewEmail };

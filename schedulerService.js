const mongoose = require("mongoose");
require("mongoose-function")(mongoose);
const Job = mongoose.model("jobs");
const EventEmitter = require("events");
const eventEmitter = new EventEmitter();

eventEmitter.on("done", (jobId) =>
  Job.deleteOne({ _id: jobId })
    .then(() => console.log("job, ", jobId, " completed"))
    .catch((err) => console.error("Error: Couldn't complete job"))
);
eventEmitter.on("error", (err) => {
  console.log("An error occured while scheduling the job. Please try again.");
  console.error(err);
});

exports.getAllJobs = () => {
  Job.find()
    .then((jobs) =>
      jobs.map((job) => {
        setTimeout(async function () {
          job.run();
          await eventEmitter.emit("done", job._id);
        }, job.time);
      })
    )
    .catch((err) => eventEmitter.emit("error", err));
};

exports.scheduleJob = async function (job, time) {
  if (job instanceof Function) {
    const newJob = new Job({
      run: job,
      time: time,
    });

    newJob.save();
  } else {
    eventEmitter.emit("error", "Error: Invalid job type");
  }
};

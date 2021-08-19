const EventEmitter = require("events");
const eventEmitter = new EventEmitter();
const mongoose = require("mongoose");
const keys = require("./config/keys");

mongoose.connect(keys.mongoURI);

require("./models/Job");
require("./schedulerService");

const Job = mongoose.model("jobs");

function seedData() {
  require("./schedulerService").scheduleJob(function () {
    console.log("running job 1");
  }, 1000);
  require("./schedulerService").scheduleJob(function () {
    console.log("running job 2");
  }, 3000);
  require("./schedulerService").scheduleJob(function () {
    console.log("running job 3");
  }, 5000);
  require("./schedulerService").scheduleJob(function () {
    console.log("running job 4");
  }, 7000);
}

eventEmitter.on("seeded", (count) => {
  console.log("Jobs scheduled: ", count);
  require("./schedulerService").getAllJobs();
});

Job.countDocuments().then((count) => {
  if (count === 0) {
    seedData(count);
  }
  eventEmitter.emit("seeded", count);
});

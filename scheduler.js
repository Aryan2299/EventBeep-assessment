const EventEmitter = require("events");
const eventEmitter = new EventEmitter();

eventEmitter.on("done", () => console.log("done"));
eventEmitter.on("error", () =>
  console.log("an error occured while running the job")
);

function Job(executor, time) {
  new Promise(function (resolve, reject) {
    if (time) {
      setTimeout(() => executor(), time);
      resolve(eventEmitter.emit("done"));
    } else {
      executor();
      resolve(eventEmitter.emit("done"));
    }
  }).catch((err) => eventEmitter.emit("error"));
}

new Job(function () {
  console.log("running job...");
});

new Job(function () {
  console.log("running job after 5 seconds");
}, 5000);

new Job(function () {
  throw new Error();
});

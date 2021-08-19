const mongoose = require("mongoose");
require("mongoose-function")(mongoose);
const { Schema } = mongoose;

const jobSchema = Schema({
  run: {
    type: Function,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
});

mongoose.model("jobs", jobSchema);

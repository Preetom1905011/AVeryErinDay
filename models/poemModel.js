const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// defines the structure of data
const poemSchema = new Schema(
  {
    header: { type: String, required: true },
    body: { type: String, required: true },
    signature: { type: String, required: true },
    time: { type: Number, required: true },
    font: { type: String, required: true },
  }, { collection: "poems" }
);

// automatically makes the collection
module.exports = mongoose.model('Poem', poemSchema)
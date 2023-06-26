const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
});

const GameModel = mongoose.model("games", GameSchema);
module.exports = GameModel;

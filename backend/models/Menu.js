const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  availability: { type: Boolean, default: true }
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;

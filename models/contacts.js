const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, { versionKey: false });

contactSchema.statics.listContactsByOwner = async function (userId) {
  return this.find({ owner: userId });
};

contactSchema.statics.getContactByIdByOwner = async function (contactId, userId) {
  return this.findOne({ _id: contactId, owner: userId });
};

contactSchema.statics.addContactByOwner = async function (contact, userId) {
  return this.create({ ...contact, owner: userId });
};

contactSchema.statics.removeContactByOwner = async function (contactId, userId) {
  return this.findOneAndRemove({ _id: contactId, owner: userId });
};

contactSchema.statics.updateContactByOwner = async function (contactId, update, userId) {
  return this.findOneAndUpdate({ _id: contactId, owner: userId }, update, {
    new: true,
  });
};

contactSchema.statics.updateFavoriteContactByOwner = async function (contactId, favorite, userId) {
  return this.findOneAndUpdate(
    { _id: contactId, owner: userId },
    { favorite },
    {
      new: true,
    }
  );
};

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;





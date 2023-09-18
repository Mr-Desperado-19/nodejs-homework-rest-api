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
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const Contact = mongoose.model("Contact", contactSchema);

const listContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  return contact || null;
};

const addContact = async (body) => {
  const contact = await Contact.create(body);
  return contact;
};

const removeContact = async (contactId) => {
  const result = await Contact.findByIdAndDelete(contactId);
  return result ? "Success removing" : null;
};

const updateContact = async (contactId, body) => {
  const contact = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  });
  return contact || null;
};

const updateFavorite = async (contactId, favorite) => {
  const contact = await Contact.findByIdAndUpdate(
    contactId,
    { favorite },
    { new: true }
  );
  return contact || null;
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateFavorite,
};


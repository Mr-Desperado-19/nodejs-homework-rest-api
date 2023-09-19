const contacts = require("../models/contacts");
const { HttpError, ctrlWrapper } = require("../helpers");
const validateBody = require("../middlewares/validateBody");
const { schema } = require("../schemas/contacts");
const Joi = require("joi");
const mongoose = require("mongoose");

const listContacts = async (req, res) => {
  try {
    const result = await contacts.listContacts();
    res.json(result);
  } catch (error) {
    throw HttpError(500, "Server error");
  }
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  
  if (!mongoose.isValidObjectId(contactId)) {
    throw HttpError(400, "Invalid contactId");
  }
  
  try {
    const result = await contacts.getContactById(contactId);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    throw HttpError(500, "Server error");
  }
};

const addContact = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, "Missing fields");
  }
  try {
    const result = await contacts.addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    throw HttpError(500, "Server error");
  }
};

const removeContact = async (req, res) => {
  const { contactId } = req.params;
  
  if (!mongoose.isValidObjectId(contactId)) {
    throw HttpError(400, "Invalid contactId");
  }
  
  try {
    const result = await contacts.removeContact(contactId);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json({ message: "Contact deleted" });
  } catch (error) {
    throw HttpError(500, "Server error");
  }
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  
  if (!mongoose.isValidObjectId(contactId)) {
    throw HttpError(400, "Invalid contactId");
  }
  
  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, "Missing fields");
  }
  try {
    const result = await contacts.updateContact(contactId, req.body);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    throw HttpError(500, "Server error");
  }
};

const updateFavoriteContact = async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  
  if (!mongoose.isValidObjectId(contactId)) {
    throw HttpError(400, "Invalid contactId");
  }
  
  if (favorite === undefined) {
    throw HttpError(400, "Missing field favorite");
  }
  try {
    const result = await contacts.updateFavorite(contactId, favorite);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    throw HttpError(500, "Server error");
  }
};

module.exports = {
  listContacts: ctrlWrapper(listContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: [validateBody(schema), ctrlWrapper(addContact)],
  removeContact: ctrlWrapper(removeContact),
  updateContact: [validateBody(schema), ctrlWrapper(updateContact)],
  updateFavoriteContact: ctrlWrapper(updateFavoriteContact),
};

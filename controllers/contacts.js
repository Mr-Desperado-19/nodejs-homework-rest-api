const contacts = require("../models/contacts");
const { HttpError, ctrlWrapper } = require("../helpers");
const Joi = require("joi");
const mongoose = require("mongoose");

const listContacts = async (req, res) => {
  try {
    console.log("Received GET request to /api/contacts");
    const result = await contacts.listContactsByOwner(req.user._id);
    res.json(result);
  } catch (error) {
    console.error("Error:", error);
    throw HttpError(500, "Server error");
  }
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    console.error("Invalid contact ID:", contactId);
    throw HttpError(404, "Not found");
  }

  try {
    console.log(`Received GET request to /api/contacts/${contactId}`);
    const result = await contacts.getContactByIdByOwner(contactId, req.user._id);
    if (!result) {
      console.error("Contact not found:", contactId);
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    console.error("Error:", error);
    throw HttpError(500, "Server error");
  }
};

const addContact = async (req, res) => {
  try {
    console.log("Received POST request to /api/contacts with data:", req.body);
    if (Object.keys(req.body).length === 0) {
      console.error("Missing fields in request body");
      throw HttpError(400, "Missing fields");
    }
    const result = await contacts.addContactByOwner(req.body, req.user._id);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error:", error);
    throw HttpError(500, "Server error");
  }
};

const removeContact = async (req, res) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    console.error("Invalid contact ID:", contactId);
    throw HttpError(404, "Not found");
  }

  try {
    console.log(`Received DELETE request to /api/contacts/${contactId}`);
    const result = await contacts.removeContactByOwner(contactId, req.user._id);
    if (!result) {
      console.error("Contact not found:", contactId);
      throw HttpError(404, "Not found");
    }
    res.json({ message: "Contact deleted" });
  } catch (error) {
    console.error("Error:", error);
    throw HttpError(500, "Server error");
  }
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    console.error("Invalid contact ID:", contactId);
    throw HttpError(404, "Not found");
  }

  try {
    console.log(`Received PUT request to /api/contacts/${contactId} with data:`, req.body);
    if (Object.keys(req.body).length === 0) {
      console.error("Missing fields in request body");
      throw HttpError(400, "Missing fields");
    }
    const result = await contacts.updateContactByOwner(contactId, req.body, req.user._id);
    if (!result) {
      console.error("Contact not found:", contactId);
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    console.error("Error:", error);
    throw HttpError(500, "Server error");
  }
};

const updateFavoriteContact = async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    console.error("Invalid contact ID:", contactId);
    throw HttpError(404, "Not found");
  }

  if (favorite === undefined) {
    console.error("Missing field 'favorite' in request body");
    throw HttpError(400, "Missing field favorite");
  }

  try {
    console.log(`Received PATCH request to /api/contacts/${contactId}/favorite with data:`, req.body);
    const result = await contacts.updateFavoriteContactByOwner(contactId, favorite, req.user._id);
    if (!result) {
      console.error("Contact not found:", contactId);
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    console.error("Error:", error);
    throw HttpError(400, "Validation error");
  }
};

module.exports = {
  listContacts: ctrlWrapper(listContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  removeContact: ctrlWrapper(removeContact),
  updateContact: ctrlWrapper(updateContact),
  updateFavoriteContact: ctrlWrapper(updateFavoriteContact),
};


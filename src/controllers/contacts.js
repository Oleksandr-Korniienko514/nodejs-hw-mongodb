import * as contactServices from "../services/contacts.js";
import createHttpError from "http-errors";
import mongoose from "mongoose";
export const getContactsController = async (req, res) => {
    const data = await contactServices.getContacts();
    res.json({
        status: 200,
        message: "Successfully found contacts!",
        data,
    });
};

export const getContactByIdController = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).json({ status: 404, message: "Contact not found" });
    }

    const data = await contactServices.getContactById(_id);
    if (!data) {
        throw createHttpError(404, "Contact not found");
    }
    res.json({
        status: 200,
        message: `Successfully found contact with id ${_id}!`,
        data,
    });
};

export const addContactController = async (req, res) => {
    const data = await contactServices.addContact(req.body);
    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data,
    });
};

export const upsertContactController = async (req, res) => {
    const { id: _id } = req.params;
    const data = await contactServices.updateContact({ _id, payload: req.body });
    res.json({ status: 200, message: "Successfully apdated the contact", data });
};
export const patchContactController = async (req, res) => {
    const { id: _id } = req.params;
    const result = await contactServices.updateContact({
        _id,
        payload: req.body,
    });
    if (!result) {
        throw createHttpError(404, "Contact not found");
    }

    res.json({
        status: 200,
        message: "Successfully patched the contact!",
        data: result.data,
    });
};

export const deleteContactController = async (req, res) => {
    const { id: _id } = req.params;
    const data = await contactServices.deleteContact({ _id });
    if (!data) {
        throw createHttpError(404, "Contact not found");
    }
    res.status(204).send();
};

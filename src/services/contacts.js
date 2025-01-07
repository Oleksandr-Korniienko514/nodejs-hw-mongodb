import ContactCollection from "../db/models/Contacts.js";

export const getContacts = () => ContactCollection.find();
export const getContactById = (id) => ContactCollection.findById(id);
export const addContact = (payload) => ContactCollection.create(payload);
export const updateContact = async ({ _id, payload, options = {} }) => {
    const rawResult = await ContactCollection.findOneAndUpdate(
        { _id: _id },
        payload,
        {
            ...options,
            new: true,
            includeResultMetadata: true,
        }
    );
    if (!rawResult || !rawResult.value) return null;

    return {
        data: rawResult.value,
        isNew: Boolean(rawResult.lastErrorObject.upserted),
    };
};
export const deleteContact = async (filter) =>
    ContactCollection.findOneAndDelete(filter);

import { Contact } from '../db/models/Contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../contacts/index.js';

export const getAllContacts = async ({
    page = 1,
    perPage = 10,
    sortOrder = SORT_ORDER.ASC,
    sortBy = '_id',
    filter = {},
    userId,
}) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;

    const contactsQuery = Contact.find({ userId });

    if (filter.isFavourite) {
        contactsQuery.where('isFavourite').equals(filter.isFavourite);
    }
    if (filter.contactType) {
        contactsQuery.where('contactType').equals(filter.contactType);
    }

    const [contactCount, contacts] = await Promise.all([
        Contact.find().merge(contactsQuery).countDocuments(),
        contactsQuery
            .skip(skip)
            .limit(limit)
            .sort({ [sortBy]: sortOrder })
            .exec(),
    ]);

    const paginationData = calculatePaginationData(contactCount, perPage, page);
    return {
        data: contacts,
        ...paginationData,
    };
};

export const getContactById = async (contactId, userId) => {
    return await Contact.findOne({ _id: contactId, userId });
};

export const createContact = async (contact, user) => {
    const newContact = await Contact.create({
        ...contact,
        userId: user._id,
    });
    return newContact;
};
export const updateContact = async (
    contactId,
    contact,
    userId,
    options = {},
) => {
    const updatedContact = await Contact.findOneAndUpdate(
        {
            _id: contactId,
            userId,
        },
        contact,
        {
            new: true,
            ...options,
        },
    );

    return updatedContact || null;
};
export const deleteContact = async (contactId, userId) => {
    return await Contact.findOneAndDelete({ _id: contactId, userId });
};

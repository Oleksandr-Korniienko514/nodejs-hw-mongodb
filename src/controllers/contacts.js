import * as contactsService from '../services/contacts.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const getAllContactsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);

    const contacts = await contactsService.getAllContacts({
        userId: req.user._id,
        page,
        perPage,
        sortBy,
        sortOrder,
        filter,
    });
    res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
    });
};
export const getContactByIdController = async (req, res, next) => {
    const { contactId } = req.params;
    try {
        const contact = await contactsService.getContactById(
            contactId,
            req.user._id,
        );
        if (!contact) {
            return res.status(400).json({
                status: 400,
                message: 'Contact not found',
                data: {
                    message: 'Id is not valid',
                },
            });


        }
        res.status(200).json({
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data: contact,
        });
    } catch (error) {

        next(error);
    }
};
export const createContactController = async (req, res, next) => {
    const newContact = await contactsService.createContact(req.body, req.user);
    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: newContact,
    });
};
export const updateContactController = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const { name, phoneNumber, email, isFavourite, contactType } = req.body;

        const updatedContact = await contactsService.updateContact(
            contactId,
            { name, phoneNumber, email, isFavourite, contactType },
            req.user._id,
        );

        if (!updatedContact) {
            return res.status(404).json({
                status: 404,
                message: 'Contact not found',
                data: null,
            });
        }

        res.status(200).json({
            status: 200,
            message: 'Successfully patched a contact!',
            data: updatedContact,
        });
    } catch (error) {
        next(error);
    }
};
export const deleteContactController = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const deleteContact = await contactsService.deleteContact(
            contactId,
            req.user._id,
        );
        if (!deleteContact) {
            return res.status(404).json({
                status: 404,
                message: 'Contact not found',
                data: null,
            });
        }


        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

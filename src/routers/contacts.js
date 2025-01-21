import express from 'express';
import {
    getAllContactsController,
    getContactByIdController,
    createContactController,
    deleteContactController,
    updateContactController,
} from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
    createContactSchema,
    updateContactSchema,
} from '../validation/validationSchemas.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();
const jsonParser = express.json();
router.use(authenticate);

router.get('/', ctrlWrapper(getAllContactsController));
router.get(
    '/:contactId',

    isValidId,
    ctrlWrapper(getContactByIdController),
);
router.post(
    '/',

    jsonParser,
    validateBody(createContactSchema),
    ctrlWrapper(createContactController),
);
router.patch(
    '/:contactId',

    jsonParser,
    isValidId,
    validateBody(updateContactSchema),
    ctrlWrapper(updateContactController),
);
router.delete(
    '/:contactId',

    isValidId,
    ctrlWrapper(deleteContactController),
);

export default router;

import express from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import {
    registerUserSchema,
    loginUserSchema,
    requestResetEmailSchema,
    resetPasswordSchema,
} from '../validation/auth.js';
import {
    registerUserController,
    loginUserController,
    logoutUserController,
    refreshUsersSessionController,
    requestResetEmailController,
    resetPasswordController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';

const router = express.Router();
const jsonParser = express.json();

router.post(
    '/register',
    jsonParser,
    validateBody(registerUserSchema),
    ctrlWrapper(registerUserController),
);

router.post(
    '/login',
    jsonParser,
    validateBody(loginUserSchema),
    ctrlWrapper(loginUserController),
);

router.post('/logout', ctrlWrapper(logoutUserController));

router.post('/refresh', ctrlWrapper(refreshUsersSessionController));

router.post(
    '/send-reset-email',
    jsonParser,
    validateBody(requestResetEmailSchema),
    ctrlWrapper(requestResetEmailController),
);

router.post(
    '/reset-pwd',
    jsonParser,
    validateBody(resetPasswordSchema),
    ctrlWrapper(resetPasswordController),
);

export default router;

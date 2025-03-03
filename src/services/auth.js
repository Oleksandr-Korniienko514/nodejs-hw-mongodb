import createHttpError from 'http-errors';
import { User } from '../db/models/user.js';
import { Session } from '../db/models/Session.js';
import bcrypt from 'bcrypt';
import {
    FIFTEEN_MINUTES,
    SMTP,
    TEMPLATES_DIR,
    THIRTY_DAYS,
} from '../contacts/index.js';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

import {
    getFullNameFromGoogleTokenPayload,
    validateCode,
} from '../utils/googleOAuth2.js';

export const registerUser = async (payload) => {
    const user = await User.findOne({ email: payload.email });

    if (user) throw createHttpError(409, 'Email in use');

    payload.password = await bcrypt.hash(payload.password, 10);

    return User.create(payload);
};

export const loginUser = async (payload) => {
    const user = await User.findOne({ email: payload.email });
    if (!user) {
        throw createHttpError(404, 'User not found');
    }
    const isEqual = await bcrypt.compare(payload.password, user.password);

    if (!isEqual) {
        throw createHttpError(401, 'Unauthorized');
    }

    await Session.deleteOne({ userId: user._id });
    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    return await Session.create({
        userId: user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
    });
};


export const logoutUser = async (sessionId) => {
    await Session.deleteOne({ _id: sessionId });  
};


const createSession = () => {
    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    return {
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
    };
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
    const session = await Session.findOne({
        _id: sessionId,
        refreshToken,
    });

    if (!session) {  
        throw createHttpError(401, 'Session token expired');
    }

    const isSessionTokenExpired =
        new Date() > new Date(session.refreshTokenValidUntil);

    if (isSessionTokenExpired) {
        throw createHttpError(401, 'Session token expired');
    }

    const newSession = createSession();

    await Session.deleteOne({ _id: sessionId, refreshToken });

    return await Session.create({
        userId: session.userId,
        ...newSession,
    });
};

export const requestResetToken = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw createHttpError(404, 'User not found');
    }

    const resetToken = jwt.sign(
        {
            sub: user._id,
            email: user.email,
        },
        env('JWT_SECRET'),
        {
            expiresIn: '5m',
        },
    );

    const resetPasswordTemplatePath = path.join(
        TEMPLATES_DIR,
        'reset-password-email.html',
    );

    const templateSource = (
        await fs.readFile(resetPasswordTemplatePath)
    ).toString();

    const template = handlebars.compile(templateSource);
    const html = template({
        name: user.name,
        link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
    });

    await sendEmail({
        from: env(SMTP.SMTP_FROM),
        to: email,
        subject: 'Reset your password',
        html,
    });
};

export const resetPassword = async (payload) => {
    let entries;

    try {
        entries = jwt.verify(payload.token, env('JWT_SECRET'));
    } catch (err) {
        if (err instanceof Error) {
            throw createHttpError(401, 'Token is expired or invalid.');
        }
        throw err;
    }

    const user = await User.findOne({
        email: entries.email,
        _id: entries.sub,
    });

    if (!user) {
        throw createHttpError(404, 'User not found');
    }

    const encryptedPassword = await bcrypt.hash(payload.password, 10);

    await User.updateOne({ _id: user._id }, { password: encryptedPassword });
};

// Добавлена функция для аутентификации через Google
export const loginOrSignupWithGoogle = async (code) => {
    const loginTicket = await validateCode(code);
    const payload = loginTicket.getPayload();
    if (!payload) throw createHttpError(401);

    let user = await User.findOne({ email: payload.email });
    if (!user) {
        const password = await bcrypt.hash(randomBytes(10), 10);
        user = await User.create({
            email: payload.email,
            name: getFullNameFromGoogleTokenPayload(payload),
            password,
            role: 'parent',
        });
    }
    const newSession = createSession();
    return await Session.create({
        userId: user._id,
        ...newSession,
    });
};

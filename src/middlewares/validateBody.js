export const validateBody = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const formattedErrors = error.details.map((err) => ({
                message: err.message,
                path: err.path,
                type: err.type,
                context: err.context,
            }));

            return res.status(400).json({
                status: 400,
                message: 'BadRequestError',
                data: {
                    message: 'Bad Request',
                    errors: formattedErrors,
                },
            });
        }
        next();
    };
};

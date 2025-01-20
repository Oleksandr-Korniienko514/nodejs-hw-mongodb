export default function ctrlWrapper(ctrl) {
    return async (req, res, next) => {
        try {
            await ctrl(req, res, next);
        } catch (err) {
            if (err.isJoi) {
                return;
            }
        }
    };
}

const parseContactType = (type) => {
    const isString = typeof type === 'string';
    if (!isString) return;
    const isContactType = (type) => ['work', 'home', 'personal'].includes(type);
    if (isContactType(type)) return type;
};

const parseBoolean = (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
        if (value.toLowerCase() === 'true') return true;
        if (value.toLocaleLowerCase() === 'false') return false;
    }
    return;
};

export const parseFilterParams = (query) => {
    const { isFavourite, contactType } = query;

    const parsedIsFavourite = parseBoolean(isFavourite);
    const parsedContactType = parseContactType(contactType);
    return {
        isFavourite: parsedIsFavourite,
        contactType: parsedContactType,
    };
};

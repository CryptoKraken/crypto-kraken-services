import * as dotenv from 'dotenv';

export const load = () => {
    const result = dotenv.config();
    if (result.error)
        throw new Error('It is impossible to load the .ENV file');
    return result.parsed;
};

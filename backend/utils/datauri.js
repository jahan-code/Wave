import path from 'path';
import DatauriParser from 'datauri/parser.js';

const parser = new DatauriParser();

const getDataUri = (file) => {
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer).content;
};

export default getDataUri;

import { dbConnection } from './mongoConnection.js';

const getCollectionFn = (collection) => {
    let _col = undefined;

    return async () => {
        if (!_col) {
            const db = await dbConnection();
            _col = await db.collection(collection);
        }

        return _col;
    };
};


export const books = getCollectionFn('books');
export const authors = getCollectionFn('authors');
export const users = getCollectionFn('users');
export const blogs = getCollectionFn('blogs')

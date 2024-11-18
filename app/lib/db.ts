import mysql from 'mysql2/promise';

var connection: mysql.Connection | null = null;

 export const createConnection = async () => {
    if (!connection) {
        connection = await mysql.createConnection({
            host: 'ctv-church-fellowship.cluxslktfpl7.us-west-1.rds.amazonaws.com',
            user: 'johnsimp',
            password: 'ConfessWithYourMouth3',
            database: 'dbname',
            port: 3306
        });
    }

    return connection;
}
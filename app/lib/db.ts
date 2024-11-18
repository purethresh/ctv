import mysql from 'mysql2/promise';

var connection: mysql.Connection | null = null;

 export const createConnection = async () => {
    if (!connection) {
        connection = await mysql.createConnection({
            host: 'TODO JLS',
            user: 'TODO JLS',
            password: 'TODO JLS',
            database: 'TODO JLS',
            port: 3306
        });
    }

    return connection;
}
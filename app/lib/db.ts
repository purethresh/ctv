import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

var connection: mysql.Connection | null = null;

 export const createConnection = async () => {
    if (!connection) {
        connection = await mysql.createConnection({
            host: process.env.CTV_SCHED_DB || '',
            user: process.env.CTV_SCHED_DB_USER || '',
            password: process.env.CTV_SCHED_DB_PASS || '',
            database: process.env.CTV_SCHED_DB_NAME || '',
            port: Number(process.env.CTV_SCHED_DB_PORT) || 3306
        });
    }

    return connection;
}

export const runQuery = async (query: string, params: any[]) : Promise<any> => {
    try {
        const db = await createConnection();
        const results = await db.query(query, params);
        return results;
    }
    catch (e:any) {
        console.error(e);
        return { error: e.message  };
    }
}
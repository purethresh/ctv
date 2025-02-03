import mysql from 'mysql2/promise';

var pool = mysql.createPool({
    host: process.env.REACT_APP_SCHED_DB || '',
    user: process.env.REACT_APP_CTV_SCHED_DB_USER || '',
    password: process.env.REACT_APP_CTV_SCHED_DB_PASS || '',
    database: process.env.REACT_APP_CTV_SCHED_DB_NAME || '',
    port: Number(process.env.REACT_APP_CTV_SCHED_DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
});

export const getConnection = async () => {
    const connection = await pool.getConnection();
    return connection;
}

export const runQuery = async (query: string, params: any[]) : Promise<any> => {
    var results:any = {error: 'nothing happened'};
    const db = await getConnection();

    try {
        results = await db.query(query, params);        
    }
    catch (e:any) {
        console.error(e);
        results = { error: e.message  };
    }
    finally {
        db.release();
    }

    return results;
}
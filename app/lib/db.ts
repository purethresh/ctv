import mysql from 'mysql2/promise';

var pool = mysql.createPool({
    host: process.env.CTV_SCHED_DB || 'ctv.cluxslktfpl7.us-west-1.rds.amazonaws.com',
    user: process.env.CTV_SCHED_DB_USER || 'admin',
    password: process.env.CTV_SCHED_DB_PASS || 'Romans9:10',
    database: process.env.CTV_SCHED_DB_NAME || 'ctv',
    port: Number(process.env.CTV_SCHED_DB_PORT) || 3306,
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
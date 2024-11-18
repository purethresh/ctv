import { createConnection } from '../../lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const db = await createConnection();
        const [results] = await db.query('SELECT * FROM member', []);
        return NextResponse.json(results);
    }
    catch (e:any) {
        console.error(e);
        return NextResponse.json({ error: e.message  }, { status: 500 });
    }
}
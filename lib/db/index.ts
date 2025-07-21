import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/lib/db/schema';

config({ path: '.env' });

const sql = postgres(process.env.DATABASE_URL!, {
    types: {
        numeric: {
            from: [1700],
            parse: (value: string) => parseFloat(value),
            serialize: (value: number) => value.toString(),
            to: 0,
        },
        int: {
            from: [20, 23],
            parse: (value: string) => parseInt(value, 10),
            serialize: (value: number) => value.toString(),
            to: 0,
        },
    }
});
export const db = drizzle(sql, { schema });

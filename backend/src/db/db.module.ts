import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';
import { ensureEnvLoaded } from '../config/env';

ensureEnvLoaded();

@Global()
@Module({
    providers: [
        {
            provide: 'DB_POOL',
            useFactory: () => {
                const connectionString = process.env.DATABASE_URL;

                if (connectionString) {
                    return new Pool({
                        connectionString,
                        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
                    });
                }

                return new Pool({
                    user: process.env.DB_USER,
                    host: process.env.DB_HOST,
                    database: process.env.DB_NAME,
                    password: process.env.DB_PASSWORD,
                    port: parseInt(process.env.DB_PORT || '5432', 10),
                    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
                });
            },
        },
    ],
    exports: ['DB_POOL'],
})
export class DbModule { }

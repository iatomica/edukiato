import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';

@Global()
@Module({
    providers: [
        {
            provide: 'DB_POOL',
            useFactory: () => {
                return new Pool({
                    user: process.env.DB_USER || 'postgres',
                    host: process.env.DB_HOST || 'localhost',
                    database: process.env.DB_NAME || 'edukidDB',
                    password: process.env.DB_PASSWORD || 'password', // Typically postgres or empty in local pg
                    port: parseInt(process.env.DB_PORT || '5432', 10),
                });
            },
        },
    ],
    exports: ['DB_POOL'],
})
export class DbModule { }

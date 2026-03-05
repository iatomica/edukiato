import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

let envLoaded = false;

export function ensureEnvLoaded(): void {
    if (envLoaded) {
        return;
    }

    const candidates = [
        path.resolve(__dirname, '../../.env'),
        path.resolve(__dirname, '../../../.env'),
        path.resolve(process.cwd(), '.env'),
        path.resolve(process.cwd(), 'backend/.env'),
    ];

    for (const envPath of candidates) {
        if (fs.existsSync(envPath)) {
            dotenv.config({ path: envPath });
            break;
        }
    }

    envLoaded = true;
}
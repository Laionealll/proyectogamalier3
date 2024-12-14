import sqlite3 from '@vscode/sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '../../database.sqlite');

const sqlite = sqlite3.verbose();
export const db = new sqlite.Database(dbPath);


db.run('PRAGMA foreign_keys = ON');
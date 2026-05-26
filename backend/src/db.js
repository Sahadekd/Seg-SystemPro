"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
const query = async (text, params) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        // console.log('executed query', { text, duration, rows: res.rowCount });
        return {
            rows: res.rows,
            rowCount: res.rowCount,
            query: text,
            params,
            duration
        };
    }
    catch (err) {
        console.error('Database query error', err);
        throw {
            message: err.message,
            query: text,
            params
        };
    }
};
exports.query = query;
exports.default = pool;
//# sourceMappingURL=db.js.map
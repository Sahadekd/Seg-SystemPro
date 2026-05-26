"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Middleware to simulate network latency if needed (for Time-Based)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// --- 1. LOGIN BYPASS & ENUMERATION ---
app.post('/api/login', async (req, res) => {
    const { email, password, isVulnerable } = req.body;
    let sql = '';
    let result;
    try {
        if (isVulnerable) {
            // VULNERABLE: Direct string concatenation
            sql = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;
            result = await (0, db_1.query)(sql);
        }
        else {
            // PROTECTED: Parameterized query
            sql = `SELECT * FROM users WHERE email = $1 AND password = $2`;
            result = await (0, db_1.query)(sql, [email, password]);
        }
        if (result.rows.length > 0) {
            res.json({
                success: true,
                user: result.rows[0],
                query: sql,
                mode: isVulnerable ? 'VULNERABLE' : 'PROTECTED'
            });
        }
        else {
            // USER ENUMERATION DEMO
            if (isVulnerable) {
                // In vulnerable mode, we might reveal if the user exists
                const checkUserSql = `SELECT * FROM users WHERE email = '${email}'`;
                const userExists = await (0, db_1.query)(checkUserSql);
                if (userExists.rows.length > 0) {
                    res.status(401).json({
                        success: false,
                        message: 'Incorrect password',
                        query: sql,
                        mode: 'VULNERABLE'
                    });
                }
                else {
                    res.status(401).json({
                        success: false,
                        message: 'User not found',
                        query: sql,
                        mode: 'VULNERABLE'
                    });
                }
            }
            else {
                // Protected: Generic message
                res.status(401).json({
                    success: false,
                    message: 'Invalid credentials',
                    query: sql,
                    mode: 'PROTECTED'
                });
            }
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: isVulnerable ? error.message : 'Internal Server Error',
            query: sql,
            mode: isVulnerable ? 'VULNERABLE' : 'PROTECTED',
            error: isVulnerable ? error : undefined
        });
    }
});
// --- 2. UNION SELECT & ERROR-BASED ---
app.get('/api/users/search', async (req, res) => {
    const { name, isVulnerable } = req.query;
    let sql = '';
    try {
        if (isVulnerable === 'true') {
            sql = `SELECT name, email, role FROM users WHERE name LIKE '%${name}%'`;
            const result = await (0, db_1.query)(sql);
            res.json({ success: true, data: result.rows, query: sql });
        }
        else {
            sql = `SELECT name, email, role FROM users WHERE name LIKE $1`;
            const result = await (0, db_1.query)(sql, [`%${name}%`]);
            res.json({ success: true, data: result.rows, query: sql });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: isVulnerable === 'true' ? error.message : 'Internal Server Error',
            query: sql,
            mode: isVulnerable === 'true' ? 'VULNERABLE' : 'PROTECTED',
            error: isVulnerable === 'true' ? error : undefined
        });
    }
});
// --- 3. BLIND & TIME-BASED ---
app.get('/api/check-email', async (req, res) => {
    const { email, isVulnerable } = req.query;
    let sql = '';
    try {
        if (isVulnerable === 'true') {
            sql = `SELECT email FROM users WHERE email = '${email}'`;
            // Simulate Time-Based Injection vulnerability
            // If the query contains a sleep command, pg driver will naturally wait.
            // But for better control in demo, we can manually check for typical time-based patterns
            const startTime = Date.now();
            const result = await (0, db_1.query)(sql);
            const duration = Date.now() - startTime;
            res.json({
                success: result.rows.length > 0,
                query: sql,
                duration
            });
        }
        else {
            sql = `SELECT email FROM users WHERE email = $1`;
            const result = await (0, db_1.query)(sql, [email]);
            res.json({ success: result.rows.length > 0, query: sql });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: isVulnerable === 'true' ? error.message : 'Internal Server Error',
            query: sql
        });
    }
});
// --- 4. AUTHORIZATION BYPASS ---
app.get('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { isVulnerable } = req.query;
    let sql = '';
    try {
        if (isVulnerable === 'true') {
            // VULNERABLE: Direct access via ID without proper auth check
            sql = `SELECT * FROM users WHERE id = '${id}'`;
            const result = await (0, db_1.query)(sql);
            res.json({ success: true, data: result.rows[0], query: sql });
        }
        else {
            // PROTECTED: Parameterized + simulated auth check
            sql = `SELECT id, name, email, role FROM users WHERE id = $1`;
            const result = await (0, db_1.query)(sql, [id]);
            res.json({ success: true, data: result.rows[0], query: sql });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: isVulnerable === 'true' ? error.message : 'Internal Server Error',
            query: sql
        });
    }
});
// --- 5. DROP TABLE SIMULATION ---
app.post('/api/simulate-drop', async (req, res) => {
    const { isVulnerable, payload } = req.body;
    if (isVulnerable) {
        // We DON'T actually drop the table. We simulate it for safety.
        res.json({
            success: true,
            message: "SIMULATED: Table 'users' would have been dropped!",
            query: `DROP TABLE users; -- ${payload}`,
            impact: "CRITICAL: Data loss and service disruption."
        });
    }
    else {
        res.json({
            success: false,
            message: "PROTECTED: DROP TABLE command blocked or ignored by parameterized query.",
            query: "SELECT * FROM users WHERE email = $1",
            mitigation: "The input was treated as a literal string value, not part of the SQL command structure."
        });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map
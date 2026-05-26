import { Pool } from 'pg';
declare const pool: Pool;
export declare const query: (text: string, params?: any[]) => Promise<{
    rows: any[];
    rowCount: number | null;
    query: string;
    params: any[] | undefined;
    duration: number;
}>;
export default pool;
//# sourceMappingURL=db.d.ts.map
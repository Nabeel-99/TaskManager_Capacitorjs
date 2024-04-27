import { sql } from "drizzle-orm";
import { sqliteTable, int, text } from "drizzle-orm/sqlite-core";

export const tasksTable = sqliteTable('tasks', {
    id: int('id').primaryKey(),
    title: text('title'),
    description: text('description'),
    category: text('category'),
    priority: text('priority'),
    createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
    progress: int('progress').default(0)
});
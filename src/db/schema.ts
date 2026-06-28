import { pgTable, text, timestamp, uuid, varchar, json, decimal, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  uid: uuid('uid').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  displayName: varchar('displayName', { length: 255 }),
  role: varchar('role', { length: 50 }).notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const articles = pgTable('articles', {
  id: uuid('id').primaryKey(),
  title: json('title').notNull(),
  content: json('content').notNull(),
  authorId: uuid('authorId'),
  status: varchar('status', { length: 50 }).notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const violations = pgTable('violations', {
  id: uuid('id').primaryKey(),
  victimName: varchar('victimName', { length: 255 }),
  description: text('description'),
  status: varchar('status', { length: 50 }).notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 50 }).notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
});

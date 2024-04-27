CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text,
	`description` text,
	`category` text,
	`priority` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`progress` integer DEFAULT 0
);

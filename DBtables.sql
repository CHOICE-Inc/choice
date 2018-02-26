----- 1. Create New Database -----

create database choice_db;


----- 2. Create STAFF table. -----
-- Staff table of the employees. Needed for user validation on registration.

CREATE TABLE "staff"(
	"id" serial primary key,
	"staff_name" varchar(50) not null,
	"email" varchar(50) not null,
	"role" integer DEFAULT 0,
  "employed" boolean DEFAULT true
);


----- 3. Create initial "ADMIN" in STAFF table. -----

INSERT INTO "staff" ("staff_name", "email", "role", "employed")
VALUES ('Admin', 'admin@choiceinc.org', 1, true);


----- 4. Create "USER" table for user registration and authentication. -----
-- login authentication and roles of the user

CREATE TABLE "users" (
  "id" serial primary key,
  "username" varchar(80) not null UNIQUE,
  "password" varchar(240) not null,
  "staff_id" integer references staff(id)
);


----- 5. Create "CLIENT" table. -----
--name of clients assigned to a staff member

CREATE TABLE "client" (
	"id" serial primary key,
	"staff_id" integer not null references staff(id),
	"client_name" varchar(50) not null,
	"active" boolean DEFAULT true
);


----- 6. Create "JOB_SITE" table. -----
--locations of jobs located and descriptions

CREATE TABLE "job_site" (
	"id" serial primary key,
	"business_name" varchar(50) not null,
	"address" varchar(100) null,
	"phone" varchar(20) null,
	"contact" varchar(30) null,
	"jobsite_status" boolean DEFAULT true
);


----- 7. Create "GOAL" table. -----
--goals assigned to a client and assigned to a case manager

CREATE TABLE "goal" (
	"id" serial primary key,
	"client_id" integer not null references client(id),
	"jobsite_id" integer not null references job_site(id),
	"goal_name" varchar(250) not null,
	"goal_summary" varchar(500) not null,
	"implementation_date" date not null,
	"review_dates" varchar(50) null,
	"completion_date" date null,
	"service_outcome" varchar(500) not null,
	"objective" varchar(500) not null,
	"behavior_techniques" varchar(1000) not null,
	"modifications" varchar(500) not null,
	"equipment" varchar(500) not null,
	"jobsite_details" varchar(500) not null,
	"when_notes" varchar(500) not null,
	"plan_steps" varchar(1000) not null,
	"goal_status" boolean DEFAULT TRUE
);


----- 8. Create "GOAL TRACKING" table. -----
--submitted goals, tracking completion data

CREATE TABLE "goal_tracking" (
	"id" serial primary key,
	"goal_id" integer not null references goal(id),
	"date_tracked" date not null,
	"am_or_pm" varchar(2) not null,
	"complete_or_not" varchar(20) not null,
	"notes" varchar(300) null,
	"entered_by" varchar(100) null
);

# Goal Tracker CI

Goal Tracker CI is a full-stack web application that will allow the staff at Choice’s three locations to track the personal and professional goals of the participants in their day program services, while also providing data on goal completion over a set period of time. At the basic staff level, users will be able to enter morning and afternoon goal completion, view previous days’ entries, and mark a participant absent. Case managers will also be able to create and edit personalized goals for participants and review summary data for three month and six month periods in order to write reports. Location administrators will be able to manage staff, including add and delete staff accounts; manage participants, including adding and removing participants and assigning case managers; and managing job site information.


## Built With

- SEAN Stack: PostgreSQL, Express, AngularJS, Node.js
- Angular Material for styling
- Angular-xeditable for in-line editing
- Passport for user authentication
- SweetAlert2 for user notifications and modals
- Google Font and Font Awesome for text and icon styling
- Trello for project management

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Link to software that is required to install the app (e.g. node).

- [Node.js](https://nodejs.org/en/)
- [AngularJS](https://angularjs.org/)
- [PostgreSQL] (https://www.postgresql.org/)
- [Express](http://expressjs.com/)
- [Angular Material](https://material.angularjs.org/latest/)
- [Angular-xeditable](https://vitalets.github.io/angular-xeditable/)
- [SweetAlert2] (https://limonte.github.io/sweetalert2/)


### Installing

Steps to get the development environment running.

```sql
CREATE TABLE "users" (
  "id" serial primary key,
  "username" varchar(80) not null UNIQUE,
  "password" varchar(240) not null
);
```

## Screen Shot

Include one or two screen shots of your project here (optional). Remove if unused.

## Documentation

Link to a read-only version of your scope document or other relevant documentation here (optional). Remove if unused.

### Completed Features

High level list of items completed.

- [x] Feature a
- [x] Feature b

### Next Steps

Features that you would like to add at some point in the future.

- [ ] Feature c

## Deployment

Add additional notes about how to deploy this on a live system

## Authors

* Amanda Kirchner, Chase Whitney, Nicole Martin, Ted Cross


## Acknowledgments

* Hat tip to anyone who's code was used

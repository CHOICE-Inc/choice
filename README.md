# Goal Tracker CI

Goal Tracker CI is a full-stack web application that will allow the staff at Choice’s three locations to track the personal and professional goals of the participants in their day program services, while also providing data on goal completion over a set period of time. At the basic staff level, users will be able to enter morning and afternoon goal completion, view previous days’ entries, and mark a participant absent. Case managers will also be able to create and edit personalized goals for participants and review summary data for three month and six month periods in order to write reports. Location administrators will be able to manage staff, including add and delete staff accounts; manage participants, including adding and removing participants and assigning case managers; and managing job site information.


## Built With

- SEAN Stack: PostgreSQL, Express, AngularJS, Node.js
- Angular Material for styling
- Material Design Data Table for data table styling and pagination
- Passport for user authentication
- SweetAlert2 for user notifications and modals
- Font Awesome for icons
- Trello for project management
- Nodemailer for email notifications
- apiDoc for route documentation

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Link to software that is required to install the app (e.g. node).

- [Node.js](https://nodejs.org/en/)
- [AngularJS](https://angularjs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Express](http://expressjs.com/)
- [Angular Material](https://material.angularjs.org/latest/)
- [SweetAlert2](https://limonte.github.io/sweetalert2/)
- [Nodemailer](https://nodemailer.com/about/)
- [Material Design Data Table](https://github.com/daniel-nagy/md-data-table)
- [apiDoc](http://apidocjs.com/)


### Installing

Steps to get the development environment running.

- Use DBtables.sql to set up database and tables using SQL and PostgreSQL
- Use mockData.sql to place temporary, fake data into the database tables for testing [Delete this before moving into production]

## Screen Shot
(https://user-images.githubusercontent.com/17738567/31908092-650b287a-b7fb-11e7-973a-22c4d82fd29c.PNG)
https://user-images.githubusercontent.com/17738567/31908275-f0e0217a-b7fb-11e7-8b0d-9d482198d2fc.PNG
https://user-images.githubusercontent.com/17738567/31908281-f3de3542-b7fb-11e7-8de1-8ad6c18b992c.PNG

## Documentation

- Project's Scope document: ChoiceScope.pdf (located in project folder)
- Routes API documentation: index.html in apidocs folder

### Completed Features

High level list of items completed.

- [x] Create new goal criteria
- [x] Edit / Disable goal criteria
- [x] Select a participant and display their goals
- [x] Enter AM & PM goal tracking data (complete, incomplete, notes, etc.)
- [x] View a goal's completion rate and overall history of tracking via a table
- [x] Admin can add, update, and inactivate participants, staff, and job sites
- [x] User access is limited based on their staff role: admin, case manager, or general staff
- [x] Can send an email to the Admin from the Goal Tracking page

### Next Steps

Features that you would like to add at some point in the future.

- [ ] Filter by goals that are uncompleted for the day on the goal tracking page
- [ ] Email notifications & in-app notifications for multiple days of missing goal tracking data
- [ ] Create a Reports Page of goal data compiled over the reporting period and make it printable or exportable as a PDF.

## Deployment

- Set up hosting with a HIPPA-compliant web hosting service
  - Web hosting for all Choice locations will require additional coding work, if all three sites are sharing the same database.
- Establish HIPPA-compliant local server for non-web hosting

## Authors

* Amanda Kirchner, Chase Whitney, Nicole Martin, Ted Cross


## Acknowledgments

- Daniel Nagy for Material Design Data Table (md-data-table)

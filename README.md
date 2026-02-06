# Hiring Assignment

Welcome to the Momo hiring assignment! You are tasked with implementing some basic functionality for a Nurse Call System.
This system is responsible for sending alerts to nurses when residents of a nursing home need assistance.
Some functionality is still missing, and you are expected to implement it.

During this assignment, it is important to make sure all code is versioned. Therefore: make sure to commit your code often!
Start off by setting up `git` by running `git init`.

## Part 1—Modeling

In order to send an alert to nurses, a lot of information is needed to make sure that Notifications end up at the correct users and the correct phones.
This data is contained in the following domain objects:

- Notification
- Organisation
- Bed
- User
- UserDevice
- UserConfirmation
- AutoConfirmation

Your first task is to map out all the relationships between these objects and create a class diagram. You can use any tool you like to create the diagram.
Make sure to commit your diagram to the assignment.

## Part 2—Structuring

Now that you have a better understanding of the domain, you can start structuring the code.
The `src` folder contains all the source files belonging to this application, but it is currently unstructured.
Reorganize the files in appropriate folders using a layered architecture approach.

## Part 3—Implementing

The Notification entity is missing functionality outlined in the `src/Notification.spec.ts` file. Using Test-Driven Development,
you are expected to implement the missing functionality.

## Part 4—Integrating

In order to get the application to work, you need to extend the domain layer with an application layer.
Using the existing integration tests in `src/app.spec.ts` you are expected to implement the missing functionality.
In order to achieve this, you should use Express to implement the endpoints.

## Part 5—Documenting

Now that you have a good understanding of what the application is supposed to do, make a sequence diagram of the application logic.

## Part 6—Wrapping up

The application should now be fully up and running. Make sure that all your code and diagrams are committed,
and check if the tests still work with `yarn test`.

# Additional information

## Evaluation rubric
The evaluation rubric is available in the [EVALUATION.md](EVALUATION.md) file.

## Use of AI

During this assignment the use of code assistance using LLMs is allowed but definitely not required.
We expect you to use your own knowledge and skills to complete the assignment.

## Setup Instructions

1. Unzip the assignment.
2. Install node 20.0.0 or later.
3. Enable `corepack`: `corepack enable`
4. Install dependencies: `yarn`

## Running the tests

Run the tests with `yarn test`.

## Making a new release

(only relevant for assignment maintainers)

- Prepare the assignment by checking out the reference solution and modifying it so that it is a good starting point for the candidate.
- Commit the assignment starting point
- Create a new tag that starts with `assignment/` (for example: `assignment/1.0.0`)
- Push the tag
- A release with a zipped code assignment will be created

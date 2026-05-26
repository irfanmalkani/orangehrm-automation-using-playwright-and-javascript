# OrangeHRM Automation using Playwright and JavaScript

## Project Overview

This project automates the OrangeHRM web application using Playwright with JavaScript. The objective of this project is to validate critical functionalities of the Human Resource Management system through automated end-to-end testing.

The framework is developed using industry-standard practices such as Page Object Model (POM), reusable methods, assertions, reporting, and organized test structure for maintainability and scalability.

This automation suite helps reduce manual effort, improve testing efficiency, and ensure application stability.

Application URL:

https://opensource-demo.orangehrmlive.com/web/index.php/auth/login

---

## Project Testing Scenarios

### Authentication Module
- Verify successful login with valid credentials
- Verify login with invalid credentials
- Verify required field validations
- Verify logout functionality

### Dashboard Module
- Verify dashboard page loading
- Verify dashboard widgets visibility

### PIM Module
- Add new employee
- Search employee details
- Update employee information
- Delete employee records

### Admin Module
- Search user by username
- Add new user
- Update user details
- Delete existing user

### Leave Module
- Apply leave request
- Verify leave status
- Validate leave details

### Recruitment Module
- Add candidate details
- Search candidate records

### My Info Module
- Update personal details
- Upload profile image

---

## Prerequisites

Before running the project, make sure the following software is installed:

- Node.js
- Visual Studio Code
- Playwright
- Git
- JavaScript Basics
- Internet Connection

---

## Setup Instructions

### Clone Repository

```bash
git clone <repository-url>
```

### Open Project Directory

```bash
cd OrangeHRM-Automation
```

### Install Dependencies

```bash
npm install
```

### Install Playwright Browsers

```bash
npx playwright install
```

### Execute Test Cases

```bash
npx playwright test
```

### Generate HTML Report

```bash
npx playwright show-report
```

---

## Tools and Frameworks Used

- Playwright
- JavaScript
- Node.js
- Visual Studio Code
- Git & GitHub
- Page Object Model (POM)
- Playwright HTML Reports
- Assertions
- Locator Strategies

---

## Project Structure

```text
OrangeHRM-Automation
│
├── tests
├── pages
├── fixtures
├── utils
├── test-data
├── screenshots
├── reports
├── TestCases
│   ├── OrangeHRM_TestCases.xlsx
│   └── OrangeHRM_TestCases.csv
│
├── HTMLReport
│   └── Report.zip
│
├── playwright.config.js
├── package.json
└── README.md
```

---

## Project Artifacts Included

This repository includes the following supporting documents and reports:

- Test Cases (.xlsx)
- Test Cases (.csv)
- HTML Test Execution Report
- Report ZIP File
- Screenshots
- Automation Framework
- Reusable Utilities

---

## Features

- Page Object Model (POM)
- Reusable Methods
- Assertions
- Reporting
- Organized Folder Structure
- Easy Maintenance
- Scalable Framework Design

---

## Author

Irfan Malkani

QA Engineer | Manual Testing | Playwright | JavaScript | Automation Testing

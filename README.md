### **OCR Expense Tracker** – AI-Powered Receipt & Budget Management

**OCR Expense Tracker** is a full-stack web application that helps users track and manage their expenses with ease. Users can scan receipts using Optical Character Recognition (OCR) or manually log transactions, categorize spending, and gain insights through real-time analytics.

---

## Core Features

### 1. Receipt Scanning with OCR

* Users can upload or take photos of receipts
* Integrated with **Azure Computer Vision API** to extract total amounts, dates, and vendors automatically

### 2.  Manual Entry

* Users can also manually add expenses for flexibility
* Fields include amount, category, description, and date

### 3. Analytics Dashboard

* Visualizes expenses by category, month, and vendor
* Helps users identify spending patterns and budget leaks

### 4. Export Reports

* Generate and download reports in **PDF** or **CSV**
* Useful for financial reviews or reimbursement

### 5. Authentication & Security

* Secured with **JWT authentication** and **token blacklisting**
* Backend supports secure REST APIs using Express.js

---

##  Tech Stack

| Layer       | Tech Used                            |
| ----------- | ------------------------------------ |
| Frontend    | React.js, Tailwind CSS, TypeScript   |
| Backend/API | Node.js, Express.js                  |
| OCR Engine  | Azure Computer Vision API            |
| Auth        | JWT with blacklisting                |
| Database    | MongoDB                              |
| Export      | jsPDF, CSV parser                    |

---

## Example Use Case

1. User uploads a grocery receipt
2. App extracts total, store name, date, and auto-fills form
3. User confirms → added to dashboard
4. Over time, app shows where most spending happens
5. At month’s end, user downloads expense report for budget tracking

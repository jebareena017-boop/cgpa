# SJC MCA CGPA Calculator

A web-based SGPA and CGPA Calculator developed for **St. Joseph's College (Autonomous), Tiruchirappalli**, integrated with **Firebase Authentication** and **Cloud Firestore Database**.

## Features

- **SGPA Calculator**: Enter subject names, marks (0-100), and credit weightages. Automatically computes letter grades and grade points according to St. Joseph's College PG grading rules.
- **CGPA Calculator**: Compute cumulative GPA across semesters weighted by semester credits.
- **Dedicated Student Authentication (`login.html`)**: Register and sign in using your college email and password.
- **Cloud Firestore Database**:
  - Save SGPA calculations with subject details and credits.
  - Save CGPA records to your cloud profile.
  - View calculation history in real-time under "My Cloud Saved Calculations".
  - Delete past saved records.
- **One-Click Local Server (`start.bat` / `server.js`)**: Built-in zero-dependency Node.js server for testing locally on `http://localhost:3000`.

## PG Grading System Reference

| Marks Range | Grade | Grade Point |
| :--- | :---: | :---: |
| 90 and above | **O** | 10 |
| 80 - 89 | **A+** | 9 |
| 70 - 79 | **A** | 8 |
| 60 - 69 | **B+** | 7 |
| 50 - 59 | **B** | 6 |
| Below 50 | **RA** | 0 |

## Formulas

- **SGPA** = $\frac{\sum(\text{Credit} \times \text{Grade Point})}{\sum(\text{Credit})}$
- **CGPA** = $\frac{\sum(\text{SGPA} \times \text{Semester Credit})}{\sum(\text{Semester Credit})}$

## Getting Started

1. **Direct in Browser**: Open `login.html` or `index.html` in any web browser.
2. **Localhost Server**: Double-click `start.bat` (or run `node server.js`) and visit `http://localhost:3000`.

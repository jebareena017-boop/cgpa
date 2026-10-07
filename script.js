function getGrade(marks) {

    if (marks >= 90) {
        return ["O", 10];
    }

    if (marks >= 80) {
        return ["A+", 9];
    }

    if (marks >= 70) {
        return ["A", 8];
    }

    if (marks >= 60) {
        return ["B+", 7];
    }

    if (marks >= 50) {
        return ["B", 6];
    }

    return ["RA", 0];
}


/* Show Grade */

function calculateGrade(input) {

    let row = input.parentElement.parentElement;

    let marks = Number(input.value);

    let grade = row.querySelector(".grade");
    let point = row.querySelector(".point");

    if (input.value === "") {
        grade.innerHTML = "-";
        point.innerHTML = "-";
        return;
    }

    if (marks < 0 || marks > 100) {
        grade.innerHTML = "Invalid";
        point.innerHTML = "-";
        return;
    }

    let result = getGrade(marks);

    grade.innerHTML = result[0];
    point.innerHTML = result[1];
}


/* Add Subject */

function addSubject() {

    let table = document.getElementById("subjectTable");

    let row = table.insertRow();

    row.innerHTML = `
        <td>
            <input type="text" placeholder="Subject">
        </td>

        <td>
            <input type="number"
                   class="marks"
                   min="0"
                   max="100"
                   oninput="calculateGrade(this)">
        </td>

        <td>
            <input type="number"
                   class="credit"
                   min="0"
                   step="0.5">
        </td>

        <td class="grade">-</td>

        <td class="point">-</td>
    `;
}


/* Calculate SGPA */

let latestSGPA = null;
let latestSGPACredits = null;

function calculateSGPA() {

    let rows =
        document.querySelectorAll("#subjectTable tr");

    let totalCredits = 0;
    let totalPoints = 0;

    for (let i = 1; i < rows.length; i++) {

        let marks =
            Number(rows[i].querySelector(".marks").value);

        let credit =
            Number(rows[i].querySelector(".credit").value);

        if (
            isNaN(marks) ||
            isNaN(credit) ||
            marks < 0 ||
            marks > 100 ||
            credit <= 0
        ) {
            alert("Please enter valid marks and credits.");
            return null;
        }

        let result = getGrade(marks);

        totalCredits += credit;

        totalPoints += credit * result[1];
    }

    let sgpa = totalPoints / totalCredits;
    latestSGPA = sgpa.toFixed(2);
    latestSGPACredits = totalCredits;

    document.getElementById("sgpaResult").innerHTML =
        "Your SGPA: " + latestSGPA + " (Total Credits: " + totalCredits + ")";

    return { sgpa: latestSGPA, credits: totalCredits };
}


/* Add Semester */

function addSemester() {

    let table =
        document.getElementById("semesterTable");

    let semesterNumber = table.rows.length;

    let row = table.insertRow();

    row.innerHTML = `
        <td>Semester ${semesterNumber}</td>

        <td>
            <input type="number"
                   class="sgpa"
                   min="0"
                   max="10"
                   step="0.01">
        </td>

        <td>
            <input type="number"
                   class="semCredit"
                   min="0"
                   step="0.5">
        </td>
    `;
}


/* Calculate CGPA */

let latestCGPA = null;
let latestCGPACredits = null;

function calculateCGPA() {

    let sgpas =
        document.querySelectorAll(".sgpa");

    let credits =
        document.querySelectorAll(".semCredit");

    let totalCredits = 0;
    let totalPoints = 0;

    for (let i = 0; i < sgpas.length; i++) {

        let sgpa = Number(sgpas[i].value);
        let credit = Number(credits[i].value);

        if (
            isNaN(sgpa) ||
            isNaN(credit) ||
            sgpa < 0 ||
            sgpa > 10 ||
            credit <= 0
        ) {
            alert("Please enter valid SGPA and credits.");
            return null;
        }

        totalCredits += credit;

        totalPoints += sgpa * credit;
    }

    let cgpa = totalPoints / totalCredits;
    latestCGPA = cgpa.toFixed(2);
    latestCGPACredits = totalCredits;

    document.getElementById("cgpaResult").innerHTML =
        "Your CGPA: " + latestCGPA + " (Total Credits: " + totalCredits + ")";

    return { cgpa: latestCGPA, credits: totalCredits };
}


// ============================================================
// FIREBASE AUTHENTICATION & CLOUD FIRESTORE DATABASE
// ============================================================

let currentUser = null;

// Listen to user login status
if (window.auth) {
    window.auth.onAuthStateChanged((user) => {
        currentUser = user;
        const statusText = document.getElementById("userStatusText");
        const loginLink = document.getElementById("loginLinkBtn");
        const logoutBtn = document.getElementById("logoutBtn");
        const savedNotice = document.getElementById("savedNotice");
        const savedTable = document.getElementById("savedTable");

        if (user) {
            statusText.innerHTML = "Logged in as: <b>" + user.email + "</b>";
            loginLink.style.display = "none";
            logoutBtn.style.display = "inline-block";
            savedNotice.style.display = "none";
            savedTable.style.display = "table";

            // Load saved calculations from Firestore
            loadSavedRecords();
        } else {
            statusText.textContent = "Guest (Not Logged In)";
            loginLink.style.display = "inline-block";
            logoutBtn.style.display = "none";
            savedNotice.style.display = "block";
            savedTable.style.display = "none";
        }
    });
}

function showSaveStatus(msg, isError = false) {
    let el = document.getElementById("saveStatus");
    if (!el) {
        el = document.createElement("div");
        el.id = "saveStatus";
        el.style.position = "fixed";
        el.style.bottom = "20px";
        el.style.right = "20px";
        el.style.zIndex = "9999";
        el.style.padding = "12px 18px";
        el.style.borderRadius = "6px";
        el.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
        el.style.fontWeight = "bold";
        document.body.appendChild(el);
    }
    el.style.background = isError ? "#fee2e2" : "#d1fae5";
    el.style.color = isError ? "#b91c1c" : "#065f46";
    el.style.border = isError ? "1px solid #fca5a5" : "1px solid #a7f3d0";
    el.textContent = msg;
    el.style.display = "block";
    setTimeout(() => { if (el) el.style.display = "none"; }, 4000);
}

/* Save SGPA to Cloud Database */
async function saveSGPA() {
    if (!currentUser) {
        showSaveStatus("Please log in first to save your calculations.", true);
        setTimeout(() => { window.location.href = "login.html"; }, 1200);
        return;
    }

    // Calculate if not already calculated
    let result = calculateSGPA();
    if (!result) return;

    try {
        const docData = {
            type: "SGPA",
            result: result.sgpa,
            details: result.credits + " Credits",
            date: new Date().toLocaleString(),
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        await window.db.collection("users").doc(currentUser.uid).collection("records").add(docData);
        showSaveStatus("SGPA (" + result.sgpa + ") successfully saved to Cloud!");
        loadSavedRecords();
    } catch (err) {
        console.error("Save SGPA Error:", err);
        showSaveStatus("Failed to save: " + err.message, true);
    }
}

/* Save CGPA to Cloud Database */
async function saveCGPA() {
    if (!currentUser) {
        showSaveStatus("Please log in first to save your calculations.", true);
        setTimeout(() => { window.location.href = "login.html"; }, 1200);
        return;
    }

    // Calculate if not already calculated
    let result = calculateCGPA();
    if (!result) return;

    try {
        const docData = {
            type: "CGPA",
            result: result.cgpa,
            details: result.credits + " Total Credits",
            date: new Date().toLocaleString(),
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        await window.db.collection("users").doc(currentUser.uid).collection("records").add(docData);
        showSaveStatus("CGPA (" + result.cgpa + ") successfully saved to Cloud!");
        loadSavedRecords();
    } catch (err) {
        console.error("Save CGPA Error:", err);
        showSaveStatus("Failed to save: " + err.message, true);
    }
}

/* Load user's saved records from Cloud Firestore */
async function loadSavedRecords() {
    if (!currentUser || !window.db) return;

    const tbody = document.getElementById("savedTableBody");
    tbody.innerHTML = "<tr><td colspan='5'>Loading saved records...</td></tr>";

    try {
        const snapshot = await window.db
            .collection("users")
            .doc(currentUser.uid)
            .collection("records")
            .get();

        tbody.innerHTML = "";

        if (snapshot.empty) {
            tbody.innerHTML = "<tr><td colspan='5'>No saved calculations yet. Calculate and click 'Save SGPA' or 'Save CGPA' above!</td></tr>";
            return;
        }

        const docs = [];
        snapshot.forEach((doc) => docs.push({ id: doc.id, ...doc.data() }));

        // Sort latest first
        docs.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));

        docs.forEach((item) => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td><b>${item.type}</b></td>
                <td style="color: #173b75; font-size: 1.1em;"><b>${item.result}</b></td>
                <td>${item.details || '-'}</td>
                <td>${item.date || 'Recently'}</td>
                <td>
                    <button onclick="deleteRecord('${item.id}')" class="btn-delete-record">Delete</button>
                </td>
            `;
        });
    } catch (err) {
        console.error("Load Records Error:", err);
        tbody.innerHTML = "<tr><td colspan='5' style='color: red;'>Error loading records: " + err.message + "</td></tr>";
    }
}

/* Delete record from Cloud Firestore */
async function deleteRecord(recordId) {
    if (!currentUser || !window.db) return;

    if (!confirm("Are you sure you want to delete this saved calculation?")) {
        return;
    }

    try {
        await window.db.collection("users").doc(currentUser.uid).collection("records").doc(recordId).delete();
        alert("Record deleted successfully.");
        loadSavedRecords();
    } catch (err) {
        console.error("Delete Error:", err);
        alert("Failed to delete record: " + err.message);
    }
}

/* Logout function */
async function logout() {
    if (window.auth) {
        await window.auth.signOut();
        alert("You have logged out.");
        window.location.href = "login.html";
    }
}
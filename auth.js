// Authentication Logic for login.html

let isRegisterMode = false;

// Check if already logged in on page load
if (window.auth) {
    window.auth.onAuthStateChanged((user) => {
        if (user) {
            console.log("Already signed in as:", user.email);
            // Optional: redirect to index.html if already logged in
        }
    });
}

function toggleAuthMode() {
    isRegisterMode = !isRegisterMode;
    const formTitle = document.getElementById("formTitle");
    const formSubtitle = document.getElementById("formSubtitle");
    const submitBtn = document.getElementById("submitBtn");
    const toggleText = document.getElementById("toggleText");
    const toggleBtn = document.getElementById("toggleBtn");
    const messageBox = document.getElementById("authMessage");

    messageBox.style.display = "none";

    if (isRegisterMode) {
        formTitle.textContent = "Create Account";
        formSubtitle.textContent = "Register with your email to start saving your SGPA & CGPA calculations.";
        submitBtn.textContent = "Register";
        toggleText.textContent = "Already have an account?";
        toggleBtn.textContent = "Log In here";
    } else {
        formTitle.textContent = "Student Login";
        formSubtitle.textContent = "Enter your college email and password to access your saved calculations.";
        submitBtn.textContent = "Log In";
        toggleText.textContent = "Don't have an account?";
        toggleBtn.textContent = "Register here";
    }
}

async function handleAuth(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const submitBtn = document.getElementById("submitBtn");

    if (!email || !password) {
        showMessage("Please fill in both email and password.", "error");
        return;
    }

    if (password.length < 6) {
        showMessage("Password must be at least 6 characters.", "error");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = isRegisterMode ? "Registering..." : "Logging in...";

    try {
        if (isRegisterMode) {
            // Register new user
            await window.auth.createUserWithEmailAndPassword(email, password);
            showMessage("Account created successfully! Redirecting to calculator...", "success");
        } else {
            // Log in existing user
            await window.auth.signInWithEmailAndPassword(email, password);
            showMessage("Login successful! Redirecting to calculator...", "success");
        }

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);

    } catch (error) {
        console.error("Auth error:", error);
        submitBtn.disabled = false;
        submitBtn.textContent = isRegisterMode ? "Register" : "Log In";

        let errorText = "An error occurred. Please try again.";
        switch (error.code) {
            case "auth/invalid-email":
                errorText = "Please enter a valid email address.";
                break;
            case "auth/user-not-found":
            case "auth/wrong-password":
            case "auth/invalid-credential":
                errorText = isRegisterMode 
                    ? "Invalid credentials." 
                    : "Invalid email or password. If you don't have an account yet, click 'Register here' below.";
                break;
            case "auth/email-already-in-use":
                errorText = "An account with this email already exists. Please log in instead.";
                break;
            case "auth/weak-password":
                errorText = "Password is too weak. Please use at least 6 characters.";
                break;
            case "auth/network-request-failed":
                errorText = "Network error. Please check your internet connection.";
                break;
            default:
                errorText = error.message;
        }
        showMessage(errorText, "error");
    }
}

function showMessage(text, type) {
    const box = document.getElementById("authMessage");
    box.textContent = text;
    box.className = "auth-message " + (type === "success" ? "msg-success" : "msg-error");
    box.style.display = "block";
}

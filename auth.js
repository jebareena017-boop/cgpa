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

// --- SHA-256 Cryptographic Hashing Implementation ---

/**
 * Computes the 256-bit cryptographic SHA-256 hash of a given string.
 * Uses the native Web Cryptography API (crypto.subtle) when available,
 * with an integrated pure JavaScript SHA-256 fallback for 100% environment compatibility.
 * @param {string} str - The plaintext input string (e.g. password)
 * @returns {Promise<string>} 64-character hexadecimal SHA-256 hash
 */
async function sha256(str) {
    if (window.crypto && window.crypto.subtle) {
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(str);
            const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
        } catch (err) {
            console.warn("Web Crypto API failed, using pure JS fallback:", err);
        }
    }
    return sha256JsFallback(str);
}

/**
 * Pure JavaScript fallback implementation of the SHA-256 algorithm.
 * Guarantees zero-dependency operation in offline or file:// contexts.
 */
function sha256JsFallback(ascii) {
    function rightRotate(value, amount) {
        return (value >>> amount) | (value << (32 - amount));
    }
    let result = '';
    const words = [];
    let hash = [
        0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
        0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];
    const k = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];
    const bytes = (typeof TextEncoder !== "undefined")
        ? Array.from(new TextEncoder().encode(ascii))
        : (() => {
            const utf8 = unescape(encodeURIComponent(ascii));
            const b = [];
            for (let i = 0; i < utf8.length; i++) b.push(utf8.charCodeAt(i));
            return b;
        })();
    const bitLength = bytes.length * 8;
    bytes.push(0x80);
    while ((bytes.length % 64) !== 56) {
        bytes.push(0);
    }
    const hi = Math.floor(bitLength / 0x100000000);
    const lo = bitLength >>> 0;
    for (let i = 3; i >= 0; i--) bytes.push((hi >>> (i * 8)) & 0xff);
    for (let i = 3; i >= 0; i--) bytes.push((lo >>> (i * 8)) & 0xff);

    for (let i = 0; i < bytes.length; i += 4) {
        words.push((bytes[i] << 24) | (bytes[i + 1] << 16) | (bytes[i + 2] << 8) | bytes[i + 3]);
    }
    for (let i = 0; i < words.length; i += 16) {
        const w = words.slice(i, i + 16);
        let a = hash[0], b = hash[1], c = hash[2], d = hash[3];
        let e = hash[4], f = hash[5], g = hash[6], h = hash[7];
        for (let j = 0; j < 64; j++) {
            if (j >= 16) {
                const s0 = rightRotate(w[j - 15], 7) ^ rightRotate(w[j - 15], 18) ^ (w[j - 15] >>> 3);
                const s1 = rightRotate(w[j - 2], 17) ^ rightRotate(w[j - 2], 19) ^ (w[j - 2] >>> 10);
                w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
            }
            const s1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
            const ch = (e & f) ^ ((~e) & g);
            const temp1 = (h + s1 + ch + k[j] + w[j]) | 0;
            const s0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
            const maj = (a & b) ^ (a & c) ^ (b & c);
            const temp2 = (s0 + maj) | 0;
            h = g;
            g = f;
            f = e;
            e = (d + temp1) | 0;
            d = c;
            c = b;
            b = a;
            a = (temp1 + temp2) | 0;
        }
        hash[0] = (hash[0] + a) | 0;
        hash[1] = (hash[1] + b) | 0;
        hash[2] = (hash[2] + c) | 0;
        hash[3] = (hash[3] + d) | 0;
        hash[4] = (hash[4] + e) | 0;
        hash[5] = (hash[5] + f) | 0;
        hash[6] = (hash[6] + g) | 0;
        hash[7] = (hash[7] + h) | 0;
    }
    for (let i = 0; i < 8; i++) {
        for (let j = 3; j >= 0; j--) {
            const b = (hash[i] >>> (j * 8)) & 0xff;
            result += (b < 16 ? '0' : '') + b.toString(16);
        }
    }
    return result;
}

// Live Hash Display handler
let isHashVisible = false;

async function handlePasswordInput(value) {
    const hashValEl = document.getElementById("hashValue");
    if (!hashValEl) return;
    if (!value) {
        hashValEl.textContent = "Enter password to generate SHA-256 hash...";
        return;
    }
    const hash = await sha256(value);
    hashValEl.textContent = hash;
}

function toggleHashVisibility() {
    isHashVisible = !isHashVisible;
    const previewContent = document.getElementById("hashPreviewContent");
    const toggleBtn = document.getElementById("btnToggleHash");
    if (previewContent) {
        previewContent.style.display = isHashVisible ? "block" : "none";
    }
    if (toggleBtn) {
        toggleBtn.textContent = isHashVisible ? "Hide Hash" : "Show Hash";
    }
    const pwdInput = document.getElementById("password");
    if (pwdInput) {
        handlePasswordInput(pwdInput.value);
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
        // Compute cryptographic SHA-256 hash of password
        const hashedPassword = await sha256(password);
        console.log(`[Security] Computed SHA-256 Hash (${isRegisterMode ? 'Registration' : 'Login'}):`, hashedPassword);

        if (isRegisterMode) {
            // Register new user with SHA-256 hashed credentials
            await window.auth.createUserWithEmailAndPassword(email, hashedPassword);
            showMessage("Account created successfully with SHA-256 security! Redirecting to calculator...", "success");
        } else {
            // Log in existing user with SHA-256 hashed credentials
            try {
                await window.auth.signInWithEmailAndPassword(email, hashedPassword);
                showMessage("Login successful! Redirecting to calculator...", "success");
            } catch (hashLoginError) {
                // Backward compatibility: If account was created with plaintext prior to SHA-256
                if (hashLoginError.code === "auth/wrong-password" || hashLoginError.code === "auth/invalid-credential") {
                    try {
                        await window.auth.signInWithEmailAndPassword(email, password);
                        showMessage("Login successful! Redirecting to calculator...", "success");
                    } catch (fallbackError) {
                        throw hashLoginError;
                    }
                } else {
                    throw hashLoginError;
                }
            }
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

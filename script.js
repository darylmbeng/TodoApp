// Mock user database
const users = [];

// DOM Elements
const authSection = document.getElementById("authSection");
const todoSection = document.getElementById("todoSection");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popupMessage");
const closePopup = document.getElementById("closePopup");
const authTitle = document.getElementById("authTitle");
const authButton = document.getElementById("authButton");
const toggleAuth = document.getElementById("toggleAuth");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const taskTitleInput = document.getElementById("taskTitle");
const taskDescriptionInput = document.getElementById("taskDescription");
const taskTimeInput = document.getElementById("taskTime");
const addTaskButton = document.getElementById("addTaskButton");
const todoList = document.getElementById("todoList");
const logoutButton = document.getElementById("logoutButton");
const sunIcon = document.getElementById("sunIcon");
const moonIcon = document.getElementById("moonIcon");

// Get the audio element
const notificationSound = document.getElementById("notificationSound");

let isLogin = true;

// Theme Toggle
sunIcon.addEventListener("click", () => {
    document.body.classList.remove("dark"); // Remove dark mode
    document.body.classList.add("light");  // Add light mode
    sunIcon.style.display = "none";        // Hide sun icon
    moonIcon.style.display = "inline";     // Show moon icon
    localStorage.setItem("theme", "light"); // Save theme preference
});

moonIcon.addEventListener("click", () => {
    document.body.classList.remove("light"); // Remove light mode
    document.body.classList.add("dark");     // Add dark mode
    moonIcon.style.display = "none";         // Hide moon icon
    sunIcon.style.display = "inline";        // Show sun icon
    localStorage.setItem("theme", "dark");   // Save theme preference
});

// Apply saved theme on page load
window.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme") || "dark"; // Default to dark mode
    if (savedTheme === "light") {
        document.body.classList.add("light");
        sunIcon.style.display = "none";
        moonIcon.style.display = "inline";
    } else {
        document.body.classList.add("dark");
        moonIcon.style.display = "none";
        sunIcon.style.display = "inline";
    }
});

// Switch between Login and Signup
toggleAuth.addEventListener("click", () => {
    isLogin = !isLogin;
    authTitle.textContent = isLogin ? "Login" : "Sign Up";
    authButton.textContent = isLogin ? "Login" : "Sign Up";
    toggleAuth.innerHTML = isLogin
        ? "Don't have an account? <span id='switchToSignup'>Sign up</span>"
        : "Already have an account? <span id='switchToLogin'>Login</span>";
});

// Handle Login/Signup
authButton.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        showPopup("Please fill in all fields!");
        return;
    }

    if (isLogin) {
        const user = users.find((u) => u.username === username && u.password === password);
        if (user) {
            authSection.style.display = "none";
            todoSection.style.display = "block";
        } else {
            showPopup("Invalid username or password!");
        }
    } else {
        const userExists = users.some((u) => u.username === username);
        if (userExists) {
            showPopup("Username already exists!");
        } else {
            users.push({ username, password });
            showPopup("Signup successful! Redirecting to login...");
            setTimeout(() => {
                isLogin = true;
                authTitle.textContent = "Login";
                authButton.textContent = "Login";
            }, 2000);
        }
    }
});

// Add Task
addTaskButton.addEventListener("click", () => {
    const title = taskTitleInput.value.trim();
    const description = taskDescriptionInput.value.trim();
    const time = taskTimeInput.value;

    if (!title || !description || !time) {
        showPopup("Please fill in all fields!");
        return;
    }

    const li = document.createElement("li");
    li.innerHTML = `
        <strong>${title}</strong>
        <p>${description}</p>
        <small>Start Time: ${new Date(time).toLocaleString()}</small>
    `;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => li.remove());

    li.appendChild(deleteButton);
    todoList.appendChild(li);

    // Schedule Notification
    const taskTime = new Date(time).getTime();
    const now = Date.now();
    const delay = taskTime - now;

    if (delay > 0) {
        setTimeout(() => {
            // Play notification sound
            notificationSound.play();

            // Show pop-up notification
            showPopup(`Time to start: ${title}`);
        }, delay);
    }

    // Clear input fields
    taskTitleInput.value = "";
    taskDescriptionInput.value = "";
    taskTimeInput.value = "";
});

// Show Pop-up
function showPopup(message) {
    popupMessage.textContent = message;
    popup.style.display = "flex";
}

// Close Pop-up
closePopup.addEventListener("click", () => {
    popup.style.display = "none";
});

// Logout
logoutButton.addEventListener("click", () => {
    authSection.style.display = "block";
    todoSection.style.display = "none";
    usernameInput.value = "";
    passwordInput.value = "";
    taskTitleInput.value = "";
    taskDescriptionInput.value = "";
    taskTimeInput.value = "";
    todoList.innerHTML = "";
});
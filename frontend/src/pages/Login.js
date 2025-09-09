/**
 * @file login.js
 * @description Login form component built with pure JavaScript and TailwindCSS.
 * Handles user authentication via Fetch API.
 */

/**
 * Creates the login form component.
 * @returns {HTMLElement} Login section element.
 */
export const Login = () => {
  const section = document.createElement("section");
  section.className =
    "min-h-screen flex items-center justify-center bg-gray-900 px-4";

  const container = document.createElement("div");
  container.className = "w-full max-w-md bg-white/5 p-6 rounded-2xl shadow-lg";
  section.appendChild(container);

  // Title
  const title = document.createElement("h2");
  title.className =
    "text-center text-2xl font-bold tracking-tight text-white mb-6";
  title.textContent = "Sign in to your account";
  container.appendChild(title);

  // Form
  const form = document.createElement("form");
  form.className = "space-y-6";
  container.appendChild(form);

  // Email input
  const emailGroup = document.createElement("div");
  form.appendChild(emailGroup);

  const emailLabel = document.createElement("label");
  emailLabel.htmlFor = "email";
  emailLabel.className = "block text-sm font-medium text-gray-100";
  emailLabel.textContent = "Email address";
  emailGroup.appendChild(emailLabel);

  const emailInput = document.createElement("input");
  emailInput.type = "email";
  emailInput.id = "email";
  emailInput.name = "email";
  emailInput.required = true;
  emailInput.className =
    "block w-full rounded-md bg-white/5 px-3 py-2 text-white placeholder-gray-400 outline outline-1 outline-white/10 focus:outline-2 focus:outline-indigo-500 sm:text-sm";
  emailInput.placeholder = "you@example.com";
  emailGroup.appendChild(emailInput);

  // Password input
  const passwordGroup = document.createElement("div");
  form.appendChild(passwordGroup);

  const passwordLabel = document.createElement("label");
  passwordLabel.htmlFor = "password";
  passwordLabel.className = "block text-sm font-medium text-gray-100";
  passwordLabel.textContent = "Password";
  passwordGroup.appendChild(passwordLabel);

  const passwordInput = document.createElement("input");
  passwordInput.type = "password";
  passwordInput.id = "password";
  passwordInput.name = "password";
  passwordInput.required = true;
  passwordInput.className =
    "block w-full rounded-md bg-white/5 px-3 py-2 text-white placeholder-gray-400 outline outline-1 outline-white/10 focus:outline-2 focus:outline-indigo-500 sm:text-sm";
  passwordInput.placeholder = "********";
  passwordGroup.appendChild(passwordInput);

  // Submit button
  const button = document.createElement("button");
  button.type = "submit";
  button.className =
    "w-full rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500";
  button.textContent = "Sign in";
  form.appendChild(button);

  // Submit handler with Fetch
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      email: emailInput.value,
      password: passwordInput.value,
    };

    try {
      const response = await fetch(import.meta.env.VITE_API_URL + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Login failed");

      const data = await response.json();
      console.log("Login successful:", data);
      // TODO: save token in localStorage/sessionStorage
    } catch (err) {
      console.error("Error:", err.message);
    }
  });

  return section;
};

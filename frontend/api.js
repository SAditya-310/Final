const BASE_URL = "http://localhost:5000";
export async function signupUser({ name, email, password, role }) {
  try {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role })
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Signup API error:", err);
    return { message: "Server error. Try again." };
  }
}
export async function loginUser({ email, password }) {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Login API error:", err);
    return { message: "Server error. Try again." };
  }
}
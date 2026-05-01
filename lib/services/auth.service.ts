export async function loginUser(email: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  let payload: { data?: unknown; error?: string } = {};

  try {
    payload = await res.json();
  } catch {
    if (!res.ok) {
      throw new Error("Login failed. Please try again.");
    }
  }

  if (!res.ok) {
    throw new Error(payload.error || "Login failed");
  }

  return payload.data;
}

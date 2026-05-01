export async function signinUser(email: string, password: string) {
  const res = await fetch("/api/auth/signin", {
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

export async function signoutUser() {
  const res = await fetch("/api/auth/signout", { method: "POST" });

  let payload: { data?: unknown; error?: string } = {};

  try {
    payload = await res.json();
  } catch {
    if (!res.ok) {
      throw new Error("Signout failed. Please try again.");
    }
  }

  if (!res.ok) {
    throw new Error(payload.error || "Signout failed");
  }

  return payload.data;
}

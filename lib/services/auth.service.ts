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

export async function resetPassword(email: string) {
  const res = await fetch("/api/auth/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
    }),
  });

  let payload: { data?: unknown; success?: boolean; error?: string } = {};

  try {
    payload = await res.json();
    console.log(payload);
  } catch {
    if (!res.ok) {
      throw new Error("Send reset password failed. Please try again.");
    }
  }

  if (!res.ok) {
    throw new Error(payload.error || "Reset password failed");
  }

  return payload;
}

export async function updatePassword(password: string) {
  const res = await fetch("/api/auth/update-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password,
    }),
  });

  let payload: { data?: unknown; error?: string } = {};

  try {
    payload = await res.json();
  } catch {
    if (!res.ok) {
      throw new Error("Update password failed. Please try again.");
    }
  }

  if (!res.ok) {
    throw new Error(payload.error || "Update password failed");
  }

  return payload.data;
}

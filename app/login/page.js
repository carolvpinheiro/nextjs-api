"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const SESSION_KEY = "jamjar-session";
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

export default function LoginPage() {
  // use undefined while checking storage, null when signed out,
  // and a session object when the user is signed in
  const [session, setSession] = useState(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // restore the session after the page mounts so I can access browser storage.
    try {
      const savedSession = JSON.parse(sessionStorage.getItem(SESSION_KEY));
      setSession(
        typeof savedSession?.token === "string" && savedSession.token
          ? savedSession
          : null
      );
    } catch {
      setSession(null);
      setError("Could not restore your session. Please sign in again.");
    }
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    // read the fields on submit and keep the password exactly as entered.
    const fields = new FormData(event.currentTarget);
    const email = fields.get("email").trim();
    const password = fields.get("password");

    setError("");
    setIsSubmitting(true);

    try {
      // check the API URL before sending the request
      if (!API_URL) {
        throw new Error("The API URL is missing from the app configuration.");
      }
      // accept asks the API to respond with JSON
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      // send the form credentials to the login endpoint
      // converts the JavaScript object into the JSON text sent in the request
      // the first await waits for the HTTP response to become available
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          email,
          password,
          workspace_type: "project_management",
        }),
      });

      // still report the HTTP status if the response body is not JSON
      const result = await response.json().catch(() => null);

      // check if the response is not ok
      if (!response.ok) {
        throw new Error(
          result?.message || `Sign-in failed (${response.status}).`
        );
      }

      // use result.data when it exists, otherwise I use result itself
      // ?. operator permits read fields even if data is missing
      const data = result?.data ?? result;
      const token = data?.token ?? data?.access_token;

      if (typeof token !== "string" || !token.trim()) {
        throw new Error("The login response did not contain an access token.");
      }

      // save only the token and email, then update the page immediately
      const nextSession = { token, email };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
      setSession(nextSession);
    } catch (error) {
      // show the message from the failed
      setError(error instanceof Error ? error.message : "Could not sign in.");
    } finally {
      // clear the submitting state after either success or failure
      setIsSubmitting(false);
    }
  }

  if (session === undefined) {
    return <p role="status">Checking your session…</p>;
  }

  return (
    <section className="max-w-md rounded-xl border border-[#E9E1E7] bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-2xl font-bold">Sign in</h1>

      {error && (
        <p role="alert" className="mb-4 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* use a ternary to show the signed-in view or the login form */}
      {session ? (
        <div className="space-y-3">
          <p>Signed in as {session.email}.</p>
          <Link
            href="/projects"
            className="font-semibold text-[#21665E] underline"
          >
            View projects
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <fieldset disabled={isSubmitting} className="space-y-4">
            <label className="block text-sm font-medium">
              Email
              <input
                type="email"
                name="email"
                autoComplete="username"
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>

            <label className="block text-sm font-medium">
              Password
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>

            <button
              type="submit"
              className="rounded-lg bg-[#21665E] px-4 py-2 font-medium text-white hover:bg-[#174C48] disabled:opacity-60"
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>
          </fieldset>
        </form>
      )}
    </section>
  );
}

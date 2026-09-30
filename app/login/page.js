"use client";

import { useState } from "react";
import { getBrowserClient } from "../../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function up(mode) {
    setErr("");
    setMsg("");
    const sb = getBrowserClient();
    const fn = mode === "in" ? sb.auth.signInWithPassword : sb.auth.signUp;
    const { error } = await fn({ email, password });
    if (error) setErr(error.message);
    else {
      setMsg(mode === "up" ? "Account ready. You can sign in." : "Signed in.");
      if (mode === "in") window.location.href = "/desk";
    }
  }

  return (
    <main className="wrap">
      <p className="kicker">Keys</p>
      <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "2.4rem" }}>Sign in to the desk</h1>
      <p className="lede">Email and a password. Drafts stay private until you hang them on the wall.</p>
      <form onSubmit={(e) => { e.preventDefault(); up("in"); }}>
        <label>Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label>Password<input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        {err && <p className="err">{err}</p>}
        {msg && <p>{msg}</p>}
        <div className="cta-row">
          <button className="btn" type="submit">Sign in</button>
          <button className="btn ghost" type="button" onClick={() => up("up")}>Create account</button>
        </div>
      </form>
    </main>
  );
}

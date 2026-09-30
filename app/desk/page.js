"use client";

import { useEffect, useState } from "react";
import { getBrowserClient } from "../../lib/supabase";

export default function Desk() {
  const [session, setSession] = useState(undefined);
  const [mine, setMine] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const sb = getBrowserClient();
    sb.auth.getSession().then(({ data }) => setSession(data.session || null));
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    const sb = getBrowserClient();
    sb.from("notes").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false }).then(({ data }) => setMine(data || []));
  }, [session]);

  async function save(e) {
    e.preventDefault();
    setErr("");
    const sb = getBrowserClient();
    const { error } = await sb.from("notes").insert({
      user_id: session.user.id,
      title: title.trim() || "Untitled slip",
      body: body.trim(),
      is_public: isPublic,
    });
    if (error) setErr(error.message);
    else {
      setTitle(""); setBody(""); setIsPublic(false);
      const { data } = await sb.from("notes").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false });
      setMine(data || []);
    }
  }

  async function toggle(note) {
    const sb = getBrowserClient();
    await sb.from("notes").update({ is_public: !note.is_public }).eq("id", note.id);
    setMine((rows) => rows.map((r) => (r.id === note.id ? { ...r, is_public: !r.is_public } : r)));
  }

  async function remove(id) {
    const sb = getBrowserClient();
    await sb.from("notes").delete().eq("id", id);
    setMine((rows) => rows.filter((r) => r.id !== id));
  }

  if (session === undefined) return <main className="wrap">Checking keys…</main>;
  if (!session) {
    return (
      <main className="wrap">
        <h1 style={{ fontFamily: "Fraunces, Georgia, serif" }}>Desk is locked</h1>
        <p className="lede">Sign in first.</p>
        <a className="btn" href="/login">Get a key</a>
      </main>
    );
  }

  return (
    <main className="wrap">
      <p className="kicker">Your desk</p>
      <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "2.4rem" }}>Write a slip</h1>
      <form onSubmit={save}>
        <label>Title<input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
        <label>Body<textarea required value={body} onChange={(e) => setBody(e.target.value)} /></label>
        <label className="toggle">
          <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
          Hang this on the public wall
        </label>
        {err && <p className="err">{err}</p>}
        <button className="btn" type="submit">Save slip</button>
      </form>
      <section style={{ marginTop: "3rem" }}>
        <p className="kicker">Drawer</p>
        <div className="grid" style={{ padding: 0 }}>
          {mine.map((n) => (
            <article key={n.id} className="card">
              <p className="meta">{n.is_public ? "Public" : "Private"}</p>
              <h3>{n.title}</h3>
              <p className="body">{n.body}</p>
              <div className="cta-row">
                <button className="btn ghost" type="button" onClick={() => toggle(n)}>{n.is_public ? "Pull from wall" : "Make public"}</button>
                <button className="btn ghost" type="button" onClick={() => remove(n.id)}>Burn</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

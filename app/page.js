"use client";

import { useEffect, useState } from "react";
import { getBrowserClient } from "../lib/supabase";

export default function Wall() {
  const [notes, setNotes] = useState([]);
  const [hour, setHour] = useState(null);
  const [log, setLog] = useState([]);

  useEffect(() => {
    const sb = getBrowserClient();
    sb.from("notes")
      .select("id,title,body,created_at,user_id,profiles(handle,display_name)")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(48)
      .then(({ data }) => setNotes(data || []));

    sb.from("hours")
      .select("*")
      .order("slot", { ascending: false })
      .limit(1)
      .then(({ data }) => setHour(data?.[0] || null));

    sb.from("feature_log")
      .select("*")
      .order("shipped_at", { ascending: false })
      .limit(12)
      .then(({ data }) => setLog(data || []));
  }, []);

  return (
    <>
      <section className="hero">
        <p className="kicker">Printed on the hour</p>
        <h1>A broadsheet that keeps changing its mind.</h1>
        <p className="lede">
          Write a slip at the desk. Mark it public and it hangs on this wall.
          Every hour the press adds a new plate.
        </p>
        <div className="cta-row">
          <a className="btn" href="/desk">Open the desk</a>
          <a className="btn ghost" href="/login">Get a key</a>
        </div>
      </section>

      {hour && (
        <aside className="hour-strip">
          <p className="kicker">This hour</p>
          <h2>{hour.headline}</h2>
          <p className="lede" style={{ margin: 0 }}>{hour.editorial}</p>
        </aside>
      )}

      <section className="grid">
        {notes.map((n, i) => (
          <article key={n.id} className="card" style={{ animationDelay: `${i * 40}ms` }}>
            <p className="meta">
              {n.profiles?.display_name || n.profiles?.handle || "anon"} ·{" "}
              {new Date(n.created_at).toLocaleString()}
            </p>
            <h3>{n.title}</h3>
            <p className="body">{n.body}</p>
          </article>
        ))}
        {!notes.length && (
          <article className="card">
            <p className="meta">Empty wall</p>
            <h3>No public slips yet.</h3>
            <p className="body">Sign in, write something, and flip it public.</p>
          </article>
        )}
      </section>

      <section className="log">
        <p className="kicker">Press log</p>
        <ol>
          {log.map((row) => (
            <li key={row.id}>
              <span className="meta">{new Date(row.shipped_at).toLocaleString()}</span>
              <div>
                <strong>{row.title}</strong>
                <p className="body" style={{ margin: "0.3rem 0 0" }}>{row.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}

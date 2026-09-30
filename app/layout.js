import "./globals.css";

export const metadata = {
  title: "Field Press",
  description: "A living broadsheet. Public slips on the wall. Private drafts at the desk.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <header className="mast">
          <a className="wordmark" href="/">
            Field <span>Press</span>
          </a>
          <nav className="nav">
            <a href="/">Wall</a>
            <a href="/desk">Desk</a>
            <a href="/login">Sign in</a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}

export default function NotFound() {
  return (
    <html>
      <body className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <div className="max-w-md w-full p-8 rounded-lg shadow-lg bg-card border border-border">
          <h2 className="text-2xl font-bold mb-4">404 – Page Not Found</h2>
          <p className="mb-4 text-muted-foreground">Sorry, the page you are looking for does not exist.</p>
          <a href="/" className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition">Go Home</a>
        </div>
      </body>
    </html>
  );
}
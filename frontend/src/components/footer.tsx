export function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-slate-400">
      <div className="mx-auto max-w-7xl px-6 py-6 text-center text-sm">
        <p>
          © {new Date().getFullYear()} Cotações — Dados apenas para fins educacionais
        </p>
      </div>
    </footer>
  );
}

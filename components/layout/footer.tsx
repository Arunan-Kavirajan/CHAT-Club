export function Footer() {
  return (
    <footer className="border-t border-foreground/10">
      <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-xs text-foreground/50">
        
        {/* Left Side: Org Info */}
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <span>CHAT — Community of Hackers and Advanced Technologists</span>
          <span>SRMIST</span>
        </div>

        {/* Right Side: Developer Credits */}
        <div className="flex flex-col gap-2 text-center sm:text-right">
          <span>
            Built by <span className="text-foreground/80">Arunan Kavirajan</span>
          </span>
          <div className="flex items-center justify-center sm:justify-end gap-3">
            <a 
              href="https://github.com/arunan-kavirajan" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-foreground transition-colors duration-200"
            >
              [ GitHub ]
            </a>
            <a 
              href="https://linkedin.com/in/arunan-kavirajan" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-foreground transition-colors duration-200"
            >
              [ LinkedIn ]
            </a>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
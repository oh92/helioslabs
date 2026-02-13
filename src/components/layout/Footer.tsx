import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          {/* Brand and tagline */}
          <div className="flex flex-col items-center gap-2 md:items-start">
            <span className="text-sm font-medium text-foreground">
              Helios Labs
            </span>
            <p className="text-xs text-muted-foreground">
              AI-assisted algorithmic trading systems
            </p>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/oh92"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="GitHub"
            >
              <Github className="size-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/owen-hobbs/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="LinkedIn"
            >
              <Linkedin className="size-5" />
            </a>
            <a
              href="mailto:hello@owen-hobbs.com"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Contact email"
            >
              <Mail className="size-5" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} Helios Labs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

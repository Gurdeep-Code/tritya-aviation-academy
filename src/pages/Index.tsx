import { useState } from "react";
import { Phone, RotateCcw } from "lucide-react";
import { ChatFlow } from "@/components/chat/ChatFlow";
import logoFull from "@/assets/logo_full.webp";

const Index = () => {
  const [resetKey, setResetKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="h-[100dvh] flex flex-col bg-background overflow-hidden">
      {/* Top promo bar */}
      <div className="shrink-0 bg-secondary text-secondary-foreground text-center text-[11px] sm:text-sm font-semibold py-1.5 sm:py-2 px-3 sm:px-4">
        ✈️ Empowering the Next Generation of Aviation Leaders
      </div>

      {/* Sticky Header */}
      <header className="shrink-0 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <img
              src={logoFull}
              alt="Tritya Aviation Academy"
              className="w-32 sm:w-36 md:w-52 object-contain drop-shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="tel:+919910244265"
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 rounded-[8px] bg-primary text-primary-foreground text-[11px] sm:text-xs font-semibold hover:bg-primary/90 transition shadow-glow"
              aria-label="Call +91 9910244265"
            >
              <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              +91 9910244265
            </a>
            <button
              onClick={() => setResetKey((k) => k + 1)}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 rounded-[8px] bg-accent text-accent-foreground text-[11px] sm:text-xs font-semibold hover:bg-accent/90 transition shadow-glow disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Restart conversation"
            >
              <RotateCcw className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              Restart
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <ChatFlow
          resetKey={resetKey}
          onSubmittingChange={setIsSubmitting}
        />
      </main>
    </div>
  );
};

export default Index;

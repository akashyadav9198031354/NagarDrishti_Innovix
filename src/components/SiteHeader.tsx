import { Link } from "@tanstack/react-router";
import { Camera, LogOut, Search, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, useSignOut } from "@/lib/auth";
import { useLang, useT } from "@/lib/i18n";

export function SiteHeader() {
  const { lang, setLang } = useLang();
  const t = useT();
  const { user, displayName, ready } = useAuth();
  const signOut = useSignOut();

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-20">
      <div className="mx-auto max-w-6xl px-3 sm:px-4 min-h-16 py-2 flex items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid place-items-center h-9 w-9 rounded-full bg-primary text-primary-foreground text-lg">👁</span>
          <span className="leading-tight">
            <span className="block font-display text-xl text-foreground">नगरदृष्टि</span>
            <span className="block text-[11px] uppercase tracking-widest text-muted-foreground">NagarDrishti · UP</span>
          </span>
        </Link>
        <nav className="ml-auto flex min-w-0 flex-1 flex-wrap items-center justify-end gap-1 text-xs font-medium sm:text-sm">
          <Button asChild variant="ghost" size="sm" className="px-2 sm:px-3">
            <Link to="/report" aria-label={t("navReport")} activeProps={{ className: "bg-muted" }}>
              <Camera className="h-4 w-4" aria-hidden="true" />
              <span className="hidden min-[768px]:inline">{t("navReport")}</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="px-2 sm:px-3">
            <Link to="/track" aria-label={t("navTrack")} activeProps={{ className: "bg-muted" }}>
              <Search className="h-4 w-4" aria-hidden="true" />
              <span className="hidden min-[768px]:inline">{t("navTrack")}</span>
            </Link>
          </Button>
          <Button asChild variant="secondary" size="sm" className="px-2 sm:px-3">
            <Link to="/authority" aria-label={t("navAuthority")}>
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              <span className="hidden min-[768px]:inline">{t("navAuthority")}</span>
            </Link>
          </Button>
          {ready && (user ? (
            <>
              <Button asChild variant="ghost" size="sm" className="min-w-0 max-w-28 justify-start px-2">
                <Link to="/login" aria-label={`${t("navAccount")}: ${displayName}`} title={displayName}>
                  <UserRound className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{displayName}</span>
                </Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => void signOut()}
                aria-label={t("navSignOut")}
                title={t("navSignOut")}
              >
                <LogOut aria-hidden="true" />
              </Button>
            </>
          ) : (
            <Button asChild variant="outline" size="sm" className="px-2 sm:px-3">
              <Link to="/login" aria-label={t("navSignIn")}>
                <UserRound className="h-4 w-4" aria-hidden="true" />
                <span className="hidden min-[768px]:inline">{t("navSignIn")}</span>
              </Link>
            </Button>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setLang(lang === "hi" ? "en" : "hi")}
            aria-label="Switch language"
          >
            {lang === "hi" ? "EN" : "हिंदी"}
          </Button>
        </nav>
      </div>
    </header>
  );
}

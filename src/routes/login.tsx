import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowRight, LoaderCircle, LogOut, Mail, UserRound } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useSignOut } from "@/lib/auth";
import { useLang, useT } from "@/lib/i18n";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "नागरिक लॉगिन | NagarDrishti" },
      { name: "description", content: "Sign in or create a citizen account for NagarDrishti civic issue reporting." },
      { property: "og:title", content: "नागरिक लॉगिन | NagarDrishti" },
      { property: "og:description", content: "Sign in or create a citizen account to use NagarDrishti." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CitizenLoginPage,
});

type LoginMode = "sign-in" | "sign-up";

function CitizenLoginPage() {
  const t = useT();
  const { lang } = useLang();
  const { user, displayName, ready } = useAuth();
  const signOut = useSignOut();
  const navigate = useNavigate();
  const [mode, setMode] = useState<LoginMode>("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setBusy(true);

    try {
      const result = mode === "sign-in"
        ? await supabase.auth.signInWithPassword({ email: email.trim(), password })
        : await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
              data: { display_name: name.trim() },
              emailRedirectTo: window.location.origin,
            },
          });

      if (result.error) {
        const message = result.error.message.toLowerCase();
        if (message.includes("invalid login credentials")) setError(t("citizenInvalidCredentials"));
        else if (message.includes("email not confirmed")) setError(t("citizenEmailUnconfirmed"));
        else if (message.includes("already registered") || message.includes("already been registered")) setError(t("citizenEmailExists"));
        else setError(t("citizenAuthError"));
        return;
      }

      if (mode === "sign-up" && !result.data.session) {
        setNotice(t("citizenConfirmSent"));
        return;
      }

      toast.success(lang === "hi" ? "लॉगिन सफल रहा" : "Signed in successfully");
      await navigate({ to: "/", replace: true });
    } catch {
      setError(t("citizenAuthError"));
    } finally {
      setBusy(false);
    }
  }

  function changeMode(nextMode: LoginMode) {
    setMode(nextMode);
    setError("");
    setNotice("");
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
        <section className="mx-auto max-w-md">
          <p className="text-sm font-semibold text-secondary">{t("citizenAccount")}</p>
          <h1 className="mt-2 font-display text-4xl text-foreground">{t("citizenLoginTitle")}</h1>
          <p className="mt-2 text-muted-foreground">{t("citizenLoginSub")}</p>

          <div className="mt-7 border border-border bg-card p-5 shadow-sm sm:p-7">
            {!ready ? (
              <p className="flex items-center gap-2 text-muted-foreground" role="status">
                <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                {t("authLoading")}
              </p>
            ) : user ? (
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                  <UserRound aria-hidden="true" />
                </div>
                <h2 className="mt-4 text-xl font-semibold">{t("citizenSignedInAs")}</h2>
                <p className="mt-1 break-words text-foreground">{displayName}</p>
                <p className="mt-1 break-all text-sm text-muted-foreground">{user.email}</p>
                <Button type="button" variant="outline" className="mt-6" onClick={() => void signOut()}>
                  <LogOut aria-hidden="true" />
                  {t("navSignOut")}
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-6 flex border-b border-border" role="tablist" aria-label={t("citizenLoginTitle")}>
                  <Button
                    type="button"
                    variant="ghost"
                    role="tab"
                    aria-selected={mode === "sign-in"}
                    className={`rounded-none border-b-2 px-3 ${mode === "sign-in" ? "border-primary text-foreground" : "border-transparent text-muted-foreground"}`}
                    onClick={() => changeMode("sign-in")}
                  >
                    {t("citizenSignIn")}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    role="tab"
                    aria-selected={mode === "sign-up"}
                    className={`rounded-none border-b-2 px-3 ${mode === "sign-up" ? "border-primary text-foreground" : "border-transparent text-muted-foreground"}`}
                    onClick={() => changeMode("sign-up")}
                  >
                    {t("citizenCreate")}
                  </Button>
                </div>

                <form onSubmit={submit} className="space-y-4">
                  {mode === "sign-up" && (
                    <div className="space-y-2">
                      <Label htmlFor="citizen-name">{t("citizenName")}</Label>
                      <Input
                        id="citizen-name"
                        autoComplete="name"
                        maxLength={80}
                        required
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="citizen-email">{t("citizenEmail")}</Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                      <Input
                        id="citizen-email"
                        type="email"
                        autoComplete="email"
                        className="pl-9"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="citizen-password">{t("citizenPassword")}</Label>
                    <Input
                      id="citizen-password"
                      type="password"
                      autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
                      minLength={6}
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </div>

                  {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
                  {notice && <p className="text-sm text-secondary" role="status">{notice}</p>}

                  <Button type="submit" className="w-full" disabled={busy}>
                    {busy ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
                    {busy ? t("authLoading") : mode === "sign-in" ? t("citizenSignIn") : t("citizenCreate")}
                  </Button>
                </form>

                <div className="mt-5 text-center">
                  <Button
                    type="button"
                    variant="link"
                    className="h-auto whitespace-normal px-1 text-center"
                    onClick={() => changeMode(mode === "sign-in" ? "sign-up" : "sign-in")}
                  >
                    {mode === "sign-in" ? t("citizenToCreate") : t("citizenToSignIn")}
                  </Button>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
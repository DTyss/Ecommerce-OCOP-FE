import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useStorefrontAuthStore } from "@/features/account/store/authStore";

interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginSearch {
  redirect?: string;
}

const defaultValues: LoginFormValues = {
  email: "",
  password: "",
};

const glassInputClass =
  "h-12 rounded-xl border-ocop/20 bg-white/72 text-gray-900 shadow-inner shadow-white/50 placeholder:text-gray-500 focus-visible:border-ocop/60 focus-visible:ring-ocop/20 dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder:text-white/60";

const authIconClass = "absolute top-1/2 left-4 -translate-y-1/2 text-ocop/65 dark:text-white/55";

export default function StorefrontLoginPage() {
  const { t } = useTranslation("storefront");
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as LoginSearch;
  const login = useStorefrontAuthStore((state) => state.login);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      setError("");
      const success = await login(value);

      if (!success) {
        setError(t("auth.invalidCredentials"));
        return;
      }

      navigate({ to: search.redirect ?? "/" });
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    form.handleSubmit();
  };

  return (
    <div className="relative isolate -mx-4 flex min-h-[calc(100vh-156px)] items-center justify-center overflow-hidden px-4 py-8 sm:-mx-6 lg:-mx-8">
      <div className="w-full max-w-[480px]">
        <section className="relative mx-auto rounded-2xl border border-white/70 bg-white/58 p-6 text-gray-900 shadow-[0_24px_80px_rgba(11,107,58,0.16)] backdrop-blur-2xl sm:p-8 dark:border-white/20 dark:bg-gray-950/40 dark:text-white">
          <div className="to-ocop-50/24 pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/45 via-white/18 ring-1 ring-white/45 dark:from-white/10 dark:via-white/5 dark:to-green-950/20 dark:ring-white/10" />
          <div className="relative mb-7 text-center">
            <h1 className="text-2xl font-bold text-gray-950 dark:text-white">{t("auth.loginTitle")}</h1>
            <p className="mt-2 text-sm font-medium text-gray-600 dark:text-white/70">{t("auth.loginSubtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="relative space-y-4">
            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) => {
                  const email = value.trim();
                  if (!email) return t("auth.emailRequired");
                  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    return t("auth.emailInvalid");
                  }
                  return undefined;
                },
              }}
            >
              {(field) => (
                <div className="space-y-1.5">
                  <div className="relative">
                    <Icon icon="mdi:email-outline" className={authIconClass} width={20} />
                    <Input
                      id={field.name}
                      type="email"
                      value={field.state.value}
                      placeholder={t("auth.email")}
                      onChange={(event) => field.handleChange(event.target.value)}
                      onBlur={field.handleBlur}
                      error={field.state.meta.errors.length > 0}
                      className={`${glassInputClass} pl-12`}
                    />
                  </div>
                  {field.state.meta.errors[0] && <p className="text-ocop-red text-xs">{field.state.meta.errors[0]}</p>}
                </div>
              )}
            </form.Field>

            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) => (!value ? t("auth.passwordRequired") : undefined),
              }}
            >
              {(field) => (
                <div className="space-y-1.5">
                  <div className="relative">
                    <Icon icon="mdi:lock-outline" className={authIconClass} width={20} />
                    <Input
                      id={field.name}
                      type={showPassword ? "text" : "password"}
                      value={field.state.value}
                      placeholder={t("auth.password")}
                      onChange={(event) => field.handleChange(event.target.value)}
                      onBlur={field.handleBlur}
                      error={field.state.meta.errors.length > 0}
                      className={`${glassInputClass} px-12`}
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((value) => !value)}
                      className="text-ocop/60 hover:text-ocop-dark absolute top-1/2 right-4 flex -translate-y-1/2 items-center justify-center transition-colors dark:text-white/55 dark:hover:text-white"
                    >
                      <Icon icon={showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"} width={20} />
                    </button>
                  </div>
                  {field.state.meta.errors[0] && <p className="text-ocop-red text-xs">{field.state.meta.errors[0]}</p>}
                </div>
              )}
            </form.Field>

            {error && <p className="text-ocop-red text-sm">{error}</p>}

            <div className="flex items-center justify-between gap-3 text-sm">
              <label className="flex min-w-0 items-center gap-2 font-medium text-gray-700 dark:text-white/75">
                <Checkbox
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  className="border-ocop/30 data-[state=checked]:border-ocop data-[state=checked]:bg-ocop bg-white/70 dark:border-white/50 dark:bg-white/5"
                />
                <span>{t("auth.rememberMe")}</span>
              </label>
              <a
                href="#"
                className="text-ocop hover:text-ocop-dark dark:text-ocop-100 shrink-0 font-semibold dark:hover:text-white"
              >
                {t("auth.forgotPassword")}
              </a>
            </div>

            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="from-ocop via-ocop-600 to-ocop-amber hover:from-ocop-dark hover:to-ocop-gold h-12 w-full rounded-xl bg-gradient-to-r font-bold text-white shadow-[0_12px_28px_rgba(11,107,58,0.32)]"
                >
                  {isSubmitting && <Icon icon="mdi:loading" className="animate-spin" />}
                  {isSubmitting ? t("auth.loggingIn") : t("auth.login")}
                </Button>
              )}
            </form.Subscribe>
          </form>

          <div className="relative my-6 flex items-center gap-3 text-sm font-medium text-gray-500 dark:text-white/55">
            <span className="bg-ocop/15 h-px flex-1 dark:bg-white/20" />
            <span>{t("auth.or")}</span>
            <span className="bg-ocop/15 h-px flex-1 dark:bg-white/20" />
          </div>

          <div className="relative flex justify-center gap-4">
            <Button
              type="button"
              variant="outline"
              aria-label="Apple"
              className="h-12 w-12 rounded-full border-white/70 bg-white/72 p-0 text-gray-900 shadow-sm backdrop-blur hover:bg-white dark:border-white/30 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              <Icon icon="mdi:apple" width={24} />
            </Button>
            <Button
              type="button"
              variant="outline"
              aria-label={t("auth.loginWithGoogle")}
              className="h-12 w-12 rounded-full border-white/70 bg-white/72 p-0 shadow-sm backdrop-blur hover:bg-white dark:border-white/30 dark:bg-white/10 dark:hover:bg-white/20"
            >
              <Icon icon="logos:google-icon" width={24} />
            </Button>
            <Button
              type="button"
              variant="outline"
              aria-label={t("auth.loginWithFacebook")}
              className="h-12 w-12 rounded-full border-white/70 bg-white/72 p-0 shadow-sm backdrop-blur hover:bg-white dark:border-white/30 dark:bg-white/10 dark:hover:bg-white/20"
            >
              <Icon icon="logos:facebook" width={24} />
            </Button>
          </div>

          <p className="relative mt-7 text-center text-sm font-medium text-gray-600 dark:text-white/70">
            {t("auth.noAccount")}{" "}
            <Link
              to="/account/register"
              search={search.redirect ? { redirect: search.redirect } : {}}
              className="text-ocop hover:text-ocop-dark dark:text-ocop-100 font-semibold dark:hover:text-white"
            >
              {t("auth.registerNow")}
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { startTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button, Checkbox, Input, Select } from "antd";
import { ArrowRight, Coffee, ShieldCheck, Sparkles } from "lucide-react";
import { authSession, getMeUseCase } from "@/src/modules/auth/composition";
import { useLoginApi } from "@/src/modules/api-client/query-hooks";
import {
  crystalLoginSchema,
  type CrystalLoginValues,
} from "@/src/features/schemas";
import { useErpI18n } from "@/src/features/i18n/use-erp-i18n";
import { useAuthStore } from "@/src/shared/providers/auth.store";
import { showToast } from "@/src/shared/ui/toast-message";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const { m, language, setLanguage } = useErpI18n();
  const loginMutation = useLoginApi();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CrystalLoginValues>({
    resolver: zodResolver(crystalLoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const result = await loginMutation.mutateAsync({
        username: values.username,
        password: values.password,
      });

      if (
        result &&
        typeof result === "object" &&
        "accessToken" in result &&
        typeof result.accessToken === "string"
      ) {
        authSession.setAccessToken(result.accessToken);
      } else {
        throw new Error("Login response does not include accessToken");
      }

      if (
        "refreshToken" in result &&
        typeof result.refreshToken === "string"
      ) {
        authSession.setRefreshToken(result.refreshToken);
      }

      const user = await getMeUseCase.execute();
      console.log('user: ', user);

      if (!user) {
        authSession.clear();
        throw new Error("Could not load current user");
      }

      setUser(user);
    } catch {
      showToast.error(m.login.loginFailed);
      return;
    }

    showToast.success(m.login.accessGranted);
    startTransition(() => router.replace("/admin/dashboard"));
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-(--crystal-bg) px-4 py-8 sm:px-6 lg:px-10">
      <div className="crystal-orb crystal-orb-one" />
      <div className="crystal-orb crystal-orb-two" />
      <div className="crystal-orb crystal-orb-three" />

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-400 gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <section className="hidden rounded-4xl border border-white/55 bg-[linear-gradient(160deg,rgba(15,118,110,0.16),rgba(255,255,255,0.48))] p-10 shadow-[0_32px_80px_rgba(15,23,42,0.14)] backdrop-blur-2xl lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/60 bg-white/70 px-4 py-2 text-(length:--fs-2) font-medium text-(--crystal-teal-800)">
              <Sparkles size={16} />
              {m.login.heroBadge}
            </div>
            <h1 className="mt-8! leading-16 max-w-xl font-display text-(length:--fs-10) font-semibold  tracking-[-0.06em] text-slate-950">
              {m.login.heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-(length:--fs-4) leading-8 text-slate-600">
              {m.login.heroSubtitle}
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {[
              { icon: <Coffee size={18} />, ...m.login.heroCards[0] },
              { icon: <ShieldCheck size={18} />, ...m.login.heroCards[1] },
              { icon: <Sparkles size={18} />, ...m.login.heroCards[2] },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/65 bg-white/62 p-5"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 text-(--crystal-teal-700)">
                  {item.icon}
                </div>
                <h2 className="mt-5 font-display text-(length:--fs-6) font-semibold tracking-[-0.04em] text-slate-950">
                  {item.title}
                </h2>
                <p className="mt-3 text-(length:--fs-2) leading-6 text-slate-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="w-full max-w-135 rounded-4xl border border-white/60 bg-white/72 p-7 shadow-[0_32px_90px_rgba(15,23,42,0.15)] backdrop-blur-2xl sm:p-10">
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-3 rounded-full border border-[rgba(15,118,110,0.18)] bg-[rgba(15,118,110,0.08)] px-4 py-2 text-(length:--fs-2) font-medium text-(--crystal-teal-800)">
                <Coffee size={16} />
                {m.login.badge}
              </div>
              <Select
                value={language}
                onChange={(value) => setLanguage(value)}
                className="min-w-33"
                options={[
                  { label: `VI · ${m.common.vietnamese}`, value: "vi" },
                  { label: `EN · ${m.common.english}`, value: "en" },
                ]}
              />
            </div>
            <h2 className="mt-8 font-display text-(length:--fs-8) font-semibold tracking-tighter text-slate-950 sm:text-(length:--fs-9)">
              {m.login.title}
            </h2>
            <p className="mt-3 text-(length:--fs-2) leading-6 text-slate-500 sm:text-(length:--fs-3)">
              {m.login.subtitle}
            </p>

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <label className="text-(length:--fs-2) font-medium text-slate-700">{m.login.email}</label>
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <Input
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      size="large"
                      tabIndex={1}
                      placeholder="ops@crystal-fnb.com"
                      status={errors.username ? "error" : ""}
                    />
                  )}
                />
                {errors.username ? (
                  <p className="text-(length:--fs-2) text-rose-600">{errors.username.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-(length:--fs-2) font-medium text-slate-700">{m.login.password}</label>
                  <Link href="/forgot-password" className="text-(length:--fs-2) text-slate-500 hover:text-slate-900">
                    {m.login.forgotPassword}
                  </Link>
                </div>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input.Password
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      size="large"
                      tabIndex={2}
                      placeholder={m.login.password}
                      status={errors.password ? "error" : ""}
                    />
                  )}
                />
                {errors.password ? (
                  <p className="text-(length:--fs-2) text-rose-600">{errors.password.message}</p>
                ) : null}
              </div>

              <div className="flex items-center justify-between gap-3">
                <Checkbox defaultChecked>{m.login.rememberDevice}</Checkbox>
              </div>

              <Button
                htmlType="submit"
                type="primary"
                size="large"
                loading={loginMutation.isPending}
                icon={<ArrowRight size={16} />}
                iconPlacement="end"
                className="mt-3 w-full"
              >
                {m.login.submit}
              </Button>
            </form>

            <div className="mt-8 rounded-[22px] border border-white/60 bg-[rgba(15,118,110,0.06)] p-4 text-(length:--fs-2) leading-6 text-slate-600">
              {m.login.helper}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

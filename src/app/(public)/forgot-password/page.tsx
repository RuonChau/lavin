"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, MailCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useResetPasswordApi, useSendOtpApi } from "@/src/modules/api-client/query-hooks";
import { Input } from "@/src/shared/ui/input";
import { circle_logo } from "@/src/assets/logo";
import { case_down, case_up, leaf, person } from "@/src/assets/icons";

const OTP_LENGTH = 6;
const INITIAL_COUNTDOWN = 45;

export default function ForgotPassword() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(() => Array(OTP_LENGTH).fill(""));
  const [countdown, setCountdown] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const sendOtpMutation = useSendOtpApi();
  const resetPasswordMutation = useResetPasswordApi();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const isSubmitting = sendOtpMutation.isPending || resetPasswordMutation.isPending;

  useEffect(() => {
    if (countdown === 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setCountdown((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [countdown]);

  const updateOtp = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    setOtp((current) => {
      const next = [...current];
      next[index] = digit;
      return next;
    });

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedDigits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH)
      .split("");

    if (!pastedDigits.length) {
      return;
    }

    setOtp((current) => {
      const next = [...current];

      pastedDigits.forEach((digit, index) => {
        next[index] = digit;
      });

      return next;
    });

    const nextFocusIndex = Math.min(pastedDigits.length, OTP_LENGTH - 1);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  const handleSendOtp = async () => {
    if (!email) {
      return;
    }

    try {
      await sendOtpMutation.mutateAsync({ email });
      setOtp(Array(OTP_LENGTH).fill(""));
      setCountdown(INITIAL_COUNTDOWN);
      inputRefs.current[0]?.focus();
    } catch {
      return;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const code = otp.join("");
    if (!email || !password || code.length !== OTP_LENGTH) {
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        email,
        newPassword: password,
        otp: code,
      });
      router.push("/login");
    } catch {
      return;
    }
  };

  const isComplete = otp.every(Boolean);

  return (
    <main className="relative h-screen overflow-hidden bg-[#fff8f2]">
      <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(244,116,88,0.18),transparent_62%)]" />
      <div className="absolute inset-y-0 left-0 hidden w-[44%] bg-[linear-gradient(180deg,#0d3b3d_0%,#145356_58%,#1f6a5f_100%)] lg:block" />

      <div className="relative grid min-h-screen lg:grid-cols-[minmax(0,44%)_minmax(0,56%)]">
        <section className="relative hidden overflow-hidden px-10 py-12 text-white lg:flex lg:flex-col">
          <div className="flex items-center">
            <Image src={circle_logo} alt="lavin_cafe" className="h-20 w-20 rounded-full object-cover" />
            <div className="leading-none ">
              <p className="font-lobster text-(length:--fs-6) leading-none">Lavin Cafe</p>
              <p className="font-poppins text-(length:--fs-1) uppercase tracking-[0.34em] mt-2 text-white/60">
                Security Check
              </p>
            </div>
          </div>

          <div className="2xl:mt-10 lg:mt-5 max-w-sm">
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 font-poppins text-(length:--fs-1) uppercase tracking-[0.28em] text-white/75">
              OTP Verification
            </span>
            <h1 className="mt-6 font-poppins text-(length:--fs-8) font-semibold leading-[1.05]">
              Verify the code to continue resetting your password.
            </h1>
            <p className="mt-6 max-w-xs font-poppins text-(length:--fs-2) leading-7 text-white/72">
              The system will send a verification code once to your email. Enter the code and your new password to complete the process.
            </p>
          </div>

          <div className="relative mt-auto h-80">
            <motion.div
              className="absolute left-20 top-40 w-16"
              animate={{ rotate: [-10, 12, -10] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image src={leaf} alt="Leaf decoration" className="h-auto w-full" />
            </motion.div>

            <motion.div
              className="absolute right-10 top-0 w-22"
              animate={{ y: [-10, 14, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image src={case_up} alt="Package" className="h-auto w-full" />
            </motion.div>

            <div className="absolute bottom-20 left-96 w-52">
              <Image src={person} alt="Cafe illustration" className="h-auto w-full" />
            </div>

            <motion.div
              className="absolute bottom-20 right-4 w-24"
              animate={{ x: [-8, 10, -8] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image src={case_down} alt="Package" className="h-auto w-full" />
            </motion.div>
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-14">
          <div className="w-full max-w-2xl rounded-4xl border border-[#f8d8cb] bg-white px-6 py-7 sm:px-10 sm:py-5 shadow-[0_32px_90px_rgba(135,80,56,0.12)]">
            <Link href="/login"
              className="inline-flex items-center gap-2 rounded-full border border-[#f6d6c8] px-4 py-2 font-poppins text-(length:--fs-2) font-medium text-[#b56c52] transition hover:border-[#ef8e6f] hover:text-[#ef6e49]"
            >
              <ArrowLeft size={16} />
              Back to login
            </Link>

            <div className="mt-8 flex items-start justify-between gap-4">
              <div>
                <p className="font-poppins text-(length:--fs-2) font-medium uppercase tracking-[0.26em] text-[#ef7f5d]">
                  Verify code
                </p>
                <h2 className="mt-3 font-poppins text-(length:--fs-8) font-semibold leading-tight text-[#22201d] sm:text-(length:--fs-8-5)">
                  Reset Password
                </h2>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0e8] text-[#ef6e49]">
                <MailCheck size={26} strokeWidth={2.2} />
              </div>
            </div>

            <p className="max-w-xl font-poppins text-(length:--fs-2) leading-7 text-[#8b776d]">
              Enter your email to receive an OTP, then enter the code and your new password to complete the reset process.
            </p>

            <form className="mt-6 space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block font-poppins text-(length:--fs-2) text-[#2c2825]"
                  >
                    Email
                  </label>
                  <div className="flex gap-3">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Your email"
                      className="h-12 rounded-xl border-[#f2d7cb] bg-[#fff9f6] px-3"
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={!email || isSubmitting}
                      className="inline-flex h-12 shrink-0 items-center justify-center rounded-xl border border-[#efb49d] px-4 font-poppins text-(length:--fs-2) font-semibold text-[#d96240] transition hover:bg-[#fff1ea] disabled:cursor-not-allowed disabled:border-[#edd5cc] disabled:text-[#c5aba0]"
                    >
                      Gui OTP
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block font-poppins text-(length:--fs-2) text-[#2c2825]"
                  >
                    New Password
                  </label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    onTogglePassword={() => setShowPassword((value) => !value)}
                    placeholder="New password"
                    className="h-12 rounded-xl border-[#f2d7cb] bg-[#fff9f6] px-3"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-1 justify-between">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      inputRefs.current[index] = element;
                    }}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={digit}
                    onChange={(event) => updateOtp(index, event.target.value)}
                    onKeyDown={(event) => handleKeyDown(index, event)}
                    onPaste={handlePaste}
                    className="md:h-14 md:w-14 h-10 w-10 rounded-2xl border border-[#f2d7cb] bg-[#fff9f6] text-center font-poppins text-(length:--fs-6) font-semibold text-[#2f2824] outline-none transition focus:border-[#ef6e49] focus:bg-white focus:shadow-[0_0_0_4px_rgba(244,116,88,0.12)] sm:h-18 sm:w-18"
                    aria-label={`OTP digit ${index + 1}`}
                  />
                ))}
              </div>

              <div className="rounded-[28px] border border-dashed border-[#f3d1c3] bg-[#fff7f3] p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-poppins text-(length:--fs-2) font-semibold text-[#312923]">
                     {`Didn't receive the code?`}
                    </p>
                    <p className="mt-1 font-poppins text-(length:--fs-2) text-[#8b776d]">
                      {countdown > 0
                        ? `You can request a new code after ${countdown}s`
                        : "You can request a new code at any time."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={countdown > 0 || !email || isSubmitting}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-[#efb49d] px-5 font-poppins text-(length:--fs-2) font-semibold text-[#d96240] transition hover:bg-[#fff1ea] disabled:cursor-not-allowed disabled:border-[#edd5cc] disabled:text-[#c5aba0]"
                  >
                    Send OTP again
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={!email || !password || !isComplete || isSubmitting}
                className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-[#ef6e49] px-6 font-poppins text-(length:--fs-2) font-semibold text-white transition hover:opacity-92 disabled:cursor-not-allowed disabled:bg-[#efc5b7]"
              >
                Reset Password
                <ArrowRight size={17} strokeWidth={2.5} />
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

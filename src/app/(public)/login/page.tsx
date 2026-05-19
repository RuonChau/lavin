import LoginPageClient from '@/modules/auth/presentation/components/LoginPageClient';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#EEF8FA] px-4 py-8">
      <div className="w-full max-w-md">
        <LoginPageClient />
      </div>
    </main>
  );
}

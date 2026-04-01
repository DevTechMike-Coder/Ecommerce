export default function ForgotPassword() {
  return (
    <main className="flex min-h-[calc(100svh-10rem)] items-center justify-center px-4 py-10 sm:min-h-[calc(100svh-9rem)] sm:px-6">
      <div className="w-full max-w-md rounded-[2rem] border border-border/50 bg-card p-8 text-center shadow-xl">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Forgot Password
        </h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Password recovery hasn&apos;t been wired yet, but this page now uses
          the same responsive auth shell as the rest of the storefront.
        </p>
      </div>
    </main>
  );
}

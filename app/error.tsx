"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Có lỗi xảy ra</h1>
        <p className="mt-2 text-sm text-muted-foreground">Vui lòng thử lại sau.</p>
        <button
          onClick={() => reset()}
          className="mt-6 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
}

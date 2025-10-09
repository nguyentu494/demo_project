"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center space-y-4 text-center">
      <h2 className="text-2xl font-semibold text-red-600">
        Oops! Something went wrong 😢
      </h2>
      <p className="text-gray-600">{error.message}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Try again
      </button>
    </div>
  );
}

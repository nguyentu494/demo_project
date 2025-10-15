import Link from "next/link";

export default function NotFound() {
  return (
    <main className="h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <p className="text-gray-600 mb-6">
        Sorry, the page you’re looking for doesn’t exist.
      </p>
        <Link href="/">Go back home</Link>
    </main>
  );
}

"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email atau password salah!");
      } else if (result?.ok) {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-soft-grey flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-deep-teal text-center mb-8">
            Masuk ke Salad.id
          </h2>

          {/* Test Credentials Info */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-600 font-medium">
              <strong>Test Account:</strong>
            </p>
            <p className="text-sm text-blue-600">Email: test@salad.id</p>
            <p className="text-sm text-blue-600">Password: 123456</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@salad.id"
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="123456"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? "Masuk..." : "Masuk"}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <Link href="/auth/signup" className="text-lime-green hover:text-deep-teal">
              Belum punya akun? Daftar di sini
            </Link>
            <br />
            <Link href="/" className="text-gray-500 hover:text-deep-teal text-sm">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Password tidak cocok!");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal mendaftar");
      }

      setSuccess("Akun berhasil dibuat! Silakan login.");
      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
    } catch (error: any) {
      setError(error.message || "Terjadi kesalahan saat mendaftar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-soft-grey flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-deep-teal text-center mb-8">
            Daftar ke Salad.id
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="form-label">
                Nama Lengkap
              </label>
              <input
                id="name"
                type="text"
                required
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama lengkap"
              />
            </div>

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
                placeholder="contoh@email.com"
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
                placeholder="Minimal 6 karakter"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="form-label">
                Konfirmasi Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? "Mendaftar..." : "Daftar"}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <Link href="/auth/signin" className="text-lime-green hover:text-deep-teal">
              Sudah punya akun? Login di sini
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
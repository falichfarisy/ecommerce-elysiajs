"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Loader2, Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!email) {
			setError("Email wajib diisi");
			return;
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			setError("Format email tidak valid");
			return;
		}

		setIsLoading(true);

		await new Promise((resolve) => setTimeout(resolve, 1500));

		setIsSubmitted(true);
		setIsLoading(false);
	};

	if (isSubmitted) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
				<div className="max-w-md w-full">
					<div className="text-center mb-8">
						<Link href="/" className="inline-flex items-center gap-2 mb-6">
							<ShoppingCart className="h-8 w-8 text-primary" />
							<span className="text-2xl font-bold">TokoKu</span>
						</Link>
					</div>

					<div className="bg-white rounded-xl shadow-sm border p-8 text-center">
						<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
							<Check className="h-8 w-8 text-green-600" />
						</div>

						<h2 className="text-xl font-bold text-gray-900 mb-2">
							Email Terkirim!
						</h2>
						<p className="text-gray-600 mb-6">
							Kami telah mengirim pesan <b>email</b> ke{" "}
							<span className="font-medium text-gray-900">{email}</span>.
							<br />
							Silakan periksa pesan email.
						</p>

						<div className="bg-blue-50 rounded-lg p-4 mb-6">
							<div className="flex items-start gap-3 text-left">
								<Mail className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
								<p className="text-sm text-blue-800">
									Tidak menerima email? Periksa folder spam atau{" "}
									<button
										type="button"
										onClick={() => setIsSubmitted(false)}
										className="font-semibold underline"
									>
										kirim ulang
									</button>
								</p>
							</div>
						</div>

						<p className="text-sm text-gray-500">
							Link reset akan kedaluwarsa dalam 24 jam.
						</p>
					</div>

					<p className="mt-6 text-center text-sm text-gray-600">
						<Link href="/login" className="text-primary hover:underline font-medium">
							← Kembali ke halaman login
						</Link>
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
			<div className="max-w-md w-full">
				<div className="text-center mb-8">
					<Link href="/" className="inline-flex items-center gap-2 mb-6">
						<ShoppingCart className="h-8 w-8 text-primary" />
						<span className="text-2xl font-bold">TokoKu</span>
					</Link>
					<h1 className="text-2xl font-bold text-gray-900">Lupa Password?</h1>
					<p className="text-gray-600 mt-2">
						Masukkan email Anda untuk reset password
					</p>
				</div>

				<div className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
					<form onSubmit={handleSubmit} className="space-y-5">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="nama@email.com"
								value={email}
								onChange={(e) => {
									setEmail(e.target.value);
									setError("");
								}}
								className={error ? "border-red-500" : ""}
							/>
							{error && <p className="text-sm text-red-500">{error}</p>}
						</div>

						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Kirim Link Reset
						</Button>
					</form>

					<div className="bg-gray-50 rounded-lg p-4 mt-6">
						<h3 className="font-medium text-sm text-gray-900 mb-2">
							Lupa email yang terdaftar?
						</h3>
						<p className="text-sm text-gray-600">
							Hubungi tim support kami di{" "}
							<a
								href="mailto:support@tokoku.com"
								className="text-primary hover:underline"
							>
								support@tokoku.com
							</a>{" "}
							untuk bantuan.
						</p>
					</div>
				</div>

				<p className="mt-6 text-center text-sm text-gray-600">
					Ingat password Anda?{" "}
					<Link href="/login" className="text-primary hover:underline font-medium">
						Masuk
					</Link>
				</p>
			</div>
		</div>
	);
}

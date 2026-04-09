"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Checkbox } from "@/components/ui/Checkbox";
import { Spinner } from "@/components/ui/Spinner";
import { postData } from "../ApiConfig";

export default function LoginPage({ onClose }: { onClose?: () => void }) {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
		username: "",
		agree: false,
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		if (!formData.agree) {
			setError("Please agree to terms and conditions");
			return;
		}

		setIsLoading(true);

		try {
			const result = await postData("/api/auth/register", {
				email: formData.email,
				password: formData.password,
				username: formData.username,
			});

			if (result.success) {
				if (onClose) {
					onClose();
				} else {
					router.push("/");
				}
			} else {
				setError(result.message || "Registration failed");
			}
		} catch (err: any) {
			setError(err.response?.data?.message || "Something went wrong");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full max-w-md mx-auto p-6">
			<div className="text-center mb-8">
				<h1 className="text-2xl font-bold text-gray-900">Buat Akun</h1>
				<p className="text-gray-500 mt-2">Daftar untuk mulai belanja</p>
			</div>

			{error && (
				<div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
					<AlertCircle className="size-4 flex-shrink-0" />
					<span className="text-sm">{error}</span>
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<Label htmlFor="username">Nama Lengkap</Label>
					<Input
						id="username"
						type="text"
						placeholder="John Doe"
						value={formData.username}
						onChange={(e) =>
							setFormData({ ...formData, username: e.target.value })
						}
						required
					/>
				</div>

				<div>
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="email@example.com"
						value={formData.email}
						onChange={(e) =>
							setFormData({ ...formData, email: e.target.value })
						}
						required
					/>
				</div>

				<div>
					<Label htmlFor="password">Password</Label>
					<div className="relative">
						<Input
							id="password"
							type={showPassword ? "text" : "password"}
							placeholder=" Minimal 8 karakter"
							value={formData.password}
							onChange={(e) =>
								setFormData({ ...formData, password: e.target.value })
							}
							minLength={8}
							required
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
							{showPassword ? (
								<EyeOff className="size-4" />
							) : (
								<Eye className="size-4" />
							)}
						</button>
					</div>
				</div>

				<div>
					<Label htmlFor="confirmPassword">Konfirmasi Password</Label>
					<div className="relative">
						<Input
							id="confirmPassword"
							type={showConfirmPassword ? "text" : "password"}
							placeholder=" Konfirmasi password"
							value={formData.confirmPassword}
							onChange={(e) =>
								setFormData({
									...formData,
									confirmPassword: e.target.value,
								})
							}
							required
						/>
						<button
							type="button"
							onClick={() =>
								setShowConfirmPassword(!showConfirmPassword)
							}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
							{showConfirmPassword ? (
								<EyeOff className="size-4" />
							) : (
								<Eye className="size-4" />
							)}
						</button>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Checkbox
						id="agree"
						checked={formData.agree}
						onChange={(checked) =>
							setFormData({ ...formData, agree: !!checked })
						}
					/>
					<label htmlFor="agree" className="text-sm text-gray-600">
						Saya setuju dengan{" "}
						<span className="text-primary hover:underline cursor-pointer">
							Syarat dan Ketentuan
						</span>
					</label>
				</div>

				<Button
					type="submit"
					className="w-full h-12 text-base"
					disabled={isLoading}>
					{isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
					Daftar
				</Button>
			</form>

			<p className="mt-6 text-center text-sm text-gray-600">
				Sudah punya akun?{" "}
				<Link
					href="/login"
					className="text-primary hover:underline font-medium">
					Masuk
				</Link>
			</p>
		</div>
	);
}
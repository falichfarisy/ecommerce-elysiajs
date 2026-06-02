"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, ChevronRight, ArrowLeft, MapPin, Phone, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Header from "@/components/layout/Header";
import { getData, postData } from "@/app/ApiConfig";
import Skeleton from "@/components/ui/Skeleton";

interface ApiProduct {
	id: number;
	name: string;
	price: number;
	imageUrl: string | null;
}

interface ApiCartItem {
	cartId: number;
	quantity: number;
	product: ApiProduct;
}

interface CartItem {
	name: string;
	price: number;
	quantity: number;
}

const formatPrice = (price: number) => {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
	}).format(price);
};

export default function CheckoutPage() {
	const router = useRouter();
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [shippingAddress, setShippingAddress] = useState("");
	const [phone, setPhone] = useState("");
	const [notes, setNotes] = useState("");

	useEffect(() => {
		const fetchCart = async () => {
			try {
				const res = await getData("/cart");
				if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
					const mapped: CartItem[] = res.data.map((item: ApiCartItem) => ({
						name: item.product.name,
						price: item.product.price,
						quantity: item.quantity,
					}));
					setCartItems(mapped);
				} else {
					setCartItems([]);
				}
			} catch {
				setError("Gagal memuat data keranjang.");
			} finally {
				setIsLoading(false);
			}
		};
		fetchCart();
	}, []);

	const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
	const shipping = subtotal >= 100000 ? 0 : 15000;
	const total = subtotal + shipping;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!shippingAddress.trim() || !phone.trim()) {
			setError("Alamat pengiriman dan nomor telepon wajib diisi.");
			return;
		}

		setIsSubmitting(true);
		setError("");

		try {
			const res = await postData("/orders", {
				shippingAddress: shippingAddress.trim(),
				phone: phone.trim(),
				notes: notes.trim(),
			});
			if (res?.success && res?.data?.id) {
				router.push(`/order/${res.data.id}`);
			} else {
				setError("Gagal membuat pesanan. Silakan coba lagi.");
			}
		} catch {
			setError("Terjadi kesalahan. Silakan coba lagi.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-[#FAFAFA]">
				<Header />
				<main className="max-w-4xl mx-auto px-4 py-8">
					<Skeleton className="h-8 w-48 mb-8" />
					<div className="grid md:grid-cols-5 gap-8">
						<div className="md:col-span-3 space-y-4">
							<Skeleton className="h-64 rounded-2xl" />
						</div>
						<div className="md:col-span-2">
							<Skeleton className="h-64 rounded-2xl" />
						</div>
					</div>
				</main>
			</div>
		);
	}

	if (cartItems.length === 0) {
		return (
			<div className="min-h-screen bg-[#FAFAFA]">
				<Header />
				<main className="max-w-4xl mx-auto px-4 py-16 text-center">
					<div className="size-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
						<ShoppingCart className="size-12 text-gray-400" />
					</div>
					<h2 className="text-xl font-semibold text-gray-900 mb-2">Keranjang Belanja Kosong</h2>
					<p className="text-gray-500 mb-6">Tambahkan produk ke keranjang sebelum checkout.</p>
					<Button asChild className="bg-indigo-600 hover:bg-indigo-700">
						<Link href="/">Belanja Sekarang</Link>
					</Button>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#FAFAFA]">
			<Header />

			<main className="max-w-4xl mx-auto px-4 py-8">
				<div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
					<Link href="/" className="hover:text-indigo-600">Home</Link>
					<ChevronRight className="size-4" />
					<Link href="/cart" className="hover:text-indigo-600">Cart</Link>
					<ChevronRight className="size-4" />
					<span className="text-gray-900 font-medium">Checkout</span>
				</div>

				<h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

				<div className="grid md:grid-cols-5 gap-8">
					<form onSubmit={handleSubmit} className="md:col-span-3 space-y-6">
						<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
							<h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
								<MapPin className="size-5 text-indigo-600" />
								Alamat Pengiriman
							</h2>
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Alamat Lengkap <span className="text-red-500">*</span>
									</label>
									<textarea
										required
										value={shippingAddress}
										onChange={(e) => setShippingAddress(e.target.value)}
										placeholder="Jl. Contoh No. 123, RT/RW 001/002, Kelurahan, Kecamatan, Kota, Provinsi"
										className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[100px]"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										<Phone className="size-4 inline mr-1" />
										Nomor Telepon <span className="text-red-500">*</span>
									</label>
									<input
										type="tel"
										required
										value={phone}
										onChange={(e) => setPhone(e.target.value)}
										placeholder="081234567890"
										className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										<FileText className="size-4 inline mr-1" />
										Catatan (opsional)
									</label>
									<textarea
										value={notes}
										onChange={(e) => setNotes(e.target.value)}
										placeholder="Contoh: Titipkan ke satpam, atau jam pengiriman tertentu"
										className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[80px]"
									/>
								</div>
							</div>
						</div>

						{error && (
							<div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
								{error}
							</div>
						)}

						<Button
							type="submit"
							size="lg"
							disabled={isSubmitting}
							className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
						>
							{isSubmitting ? "Memproses..." : "Konfirmasi Pesanan"}
						</Button>

						<Button variant="outline" asChild className="w-full">
							<Link href="/cart">
								<ArrowLeft className="size-4 mr-2" />
								Kembali ke Keranjang
							</Link>
						</Button>
					</form>

					<div className="md:col-span-2">
						<div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-24">
							<h2 className="font-bold text-gray-900 mb-4">Ringkasan Pesanan</h2>
							<div className="space-y-3 mb-4">
								{cartItems.map((item, i) => (
									<div key={i} className="flex justify-between text-sm">
										<span className="text-gray-600 flex-1">
											{item.name} <span className="text-gray-400">x{item.quantity}</span>
										</span>
										<span className="font-medium ml-2">
											{formatPrice(item.price * item.quantity)}
										</span>
									</div>
								))}
							</div>
							<div className="border-t pt-3 space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-gray-500">Subtotal</span>
									<span className="font-medium">{formatPrice(subtotal)}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-gray-500">Ongkos Kirim</span>
									<span className="font-medium">
										{shipping === 0 ? (
											<span className="text-emerald-600">FREE</span>
										) : (
											formatPrice(shipping)
										)}
									</span>
								</div>
							</div>
							<div className="flex justify-between py-3 border-t mt-2">
								<span className="font-bold text-gray-900">Total</span>
								<span className="text-xl font-bold text-gray-900">{formatPrice(total)}</span>
							</div>
						</div>
					</div>
				</div>
			</main>

			<footer className="bg-gray-950 text-white mt-12">
				<div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
					&copy; 2024 ShopCo. All rights reserved.
				</div>
			</footer>
		</div>
	);
}

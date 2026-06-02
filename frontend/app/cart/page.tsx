"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
	ShoppingCart,
	Heart,
	Plus,
	Minus,
	ChevronRight,
	ArrowLeft,
	Shield,
	Truck,
	CreditCard,
	Headphones,
	X,
	Tag,
	Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Header from "@/components/layout/Header";
import { getData } from "@/app/ApiConfig";
import Skeleton from "@/components/ui/Skeleton";

interface ApiProduct {
	id: number;
	name: string;
	price: number;
	imageUrl: string | null;
	stock: number;
}

interface ApiCartItem {
	cartId: number;
	quantity: number;
	product: ApiProduct;
}

interface CartItem {
	cartId: number;
	id: number;
	name: string;
	price: number;
	image: string;
	quantity: number;
	brand?: string;
}

const formatPrice = (price: number) => {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
	}).format(price);
};

const BASE_URL = "http://localhost:3001";

export default function CartPage() {
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	const fetchCart = async () => {
		setIsLoading(true);
		setError("");
		try {
			const res = await getData("/cart");
			if (res?.success && Array.isArray(res.data)) {
				const mapped: CartItem[] = res.data.map((item: ApiCartItem) => ({
					cartId: item.cartId,
					id: item.product.id,
					name: item.product.name,
					price: item.product.price,
					image: item.product.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
					quantity: item.quantity,
				}));
				setCartItems(mapped);
			} else {
				setCartItems([]);
			}
		} catch {
			setError("Gagal memuat keranjang. Pastikan Anda sudah login.");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchCart();
	}, []);

	const updateQuantity = (id: number, delta: number) => {
		setCartItems((items) =>
			items.map((item) =>
				item.id === id
					? { ...item, quantity: Math.max(1, item.quantity + delta) }
					: item
			)
		);
	};

	const removeItem = async (cartId: number) => {
		try {
			await fetch(`${BASE_URL}/cart/${cartId}`, {
				method: "DELETE",
				credentials: "include",
			});
			setCartItems((items) => items.filter((item) => item.cartId !== cartId));
		} catch {
			setError("Gagal menghapus item.");
		}
	};

	const subtotal = cartItems.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0
	);
	const shipping = subtotal >= 100000 ? 0 : 15000;
	const total = subtotal + shipping;

	return (
		<div className="min-h-screen bg-[#FAFAFA]">
			<Header />

			<main className="max-w-7xl mx-auto px-4 py-6">
				<div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
					<Link href="/" className="hover:text-indigo-600 font-medium">Home</Link>
					<ChevronRight className="size-4" />
					<span className="text-gray-900 font-medium">Shopping Cart</span>
				</div>

				<h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
					<ShoppingCart className="size-7 text-indigo-600" />
					Shopping Cart
					{!isLoading && (
						<span className="text-sm font-normal text-gray-500">({cartItems.length} items)</span>
					)}
				</h1>

				{isLoading ? (
					<div className="grid lg:grid-cols-3 gap-8">
						<div className="lg:col-span-2 space-y-4">
							{[1, 2].map((i) => (
								<div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
									<div className="flex gap-4">
										<Skeleton className="w-24 h-24 rounded-xl flex-shrink-0" />
										<div className="flex-1 space-y-3">
											<Skeleton className="h-4 w-20" />
											<Skeleton className="h-5 w-48" />
											<div className="flex justify-between mt-4">
												<Skeleton className="h-8 w-28 rounded-full" />
												<Skeleton className="h-5 w-24" />
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
						<div className="space-y-4">
							<div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
								<Skeleton className="h-6 w-32 mb-4" />
								<div className="space-y-3">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-full" />
								</div>
								<Skeleton className="h-10 w-full mt-4 rounded-lg" />
							</div>
						</div>
					</div>
				) : error ? (
					<div className="text-center py-16">
						<div className="size-24 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
							<ShoppingCart className="size-12 text-red-400" />
						</div>
						<h2 className="text-xl font-semibold text-gray-900 mb-2">Oops!</h2>
						<p className="text-gray-500 mb-6">{error}</p>
						<div className="flex gap-3 justify-center">
							<Button onClick={fetchCart} variant="outline">Coba Lagi</Button>
							<Button asChild className="bg-indigo-600 hover:bg-indigo-700">
								<Link href="/login">Login</Link>
							</Button>
						</div>
					</div>
				) : cartItems.length === 0 ? (
					<div className="text-center py-16">
						<div className="size-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
							<ShoppingCart className="size-12 text-gray-400" />
						</div>
						<h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
						<p className="text-gray-500 mb-6">Looks like you haven&apos;t added anything to your cart yet.</p>
						<Button asChild className="bg-indigo-600 hover:bg-indigo-700">
							<Link href="/">Continue Shopping</Link>
						</Button>
					</div>
				) : (
					<div className="grid lg:grid-cols-3 gap-8">
						<div className="lg:col-span-2 space-y-4">
							{cartItems.map((item) => (
								<div
									key={item.cartId}
									className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
								>
									<div className="flex gap-4">
										<Link href={`/product/${item.id}`} className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
											<Image
												src={item.image}
												alt={item.name}
												fill
												className="object-cover"
												sizes="96px"
											/>
										</Link>
										<div className="flex-1 min-w-0">
											<div className="flex items-start justify-between gap-2">
												<div>
													<Link href={`/product/${item.id}`} className="block">
														<h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-indigo-600">
															{item.name}
														</h3>
													</Link>
												</div>
												<Button
													variant="ghost"
													size="icon-sm"
													className="text-gray-400 hover:text-red-500 hover:bg-red-50 flex-shrink-0"
													onClick={() => removeItem(item.cartId)}
												>
													<X className="size-4" />
												</Button>
											</div>
											<div className="flex items-center justify-between mt-2">
												<div className="flex items-center gap-2">
													<span className="text-sm text-gray-500">Qty:</span>
													<div className="flex items-center border border-gray-200 rounded-full">
														<Button
															variant="ghost"
															size="icon-sm"
															className="h-8 w-8 rounded-full"
															onClick={() => updateQuantity(item.id, -1)}
														>
															<Minus className="size-3" />
														</Button>
														<span className="w-10 text-center font-semibold text-sm">
															{item.quantity}
														</span>
														<Button
															variant="ghost"
															size="icon-sm"
															className="h-8 w-8 rounded-full"
															onClick={() => updateQuantity(item.id, 1)}
														>
															<Plus className="size-3" />
														</Button>
													</div>
												</div>
												<div className="text-right">
													<p className="font-bold text-gray-900">
														{formatPrice(item.price * item.quantity)}
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							))}

							<Button variant="outline" asChild className="w-full">
								<Link href="/">
									<ArrowLeft className="size-4 mr-2" />
									Continue Shopping
								</Link>
							</Button>
						</div>

						<div className="space-y-4">
							<div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-24">
								<h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
								
								<div className="space-y-3 pb-4 border-b border-gray-100">
									<div className="flex justify-between text-sm">
										<span className="text-gray-500">Subtotal</span>
										<span className="font-medium">{formatPrice(subtotal)}</span>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-gray-500">Shipping</span>
										<span className="font-medium">
											{shipping === 0 ? (
												<span className="text-emerald-600">FREE</span>
											) : (
												formatPrice(shipping)
											)}
										</span>
									</div>
									{subtotal < 100000 && (
										<div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
											<Tag className="size-3 flex-shrink-0" />
											<span>Add {formatPrice(100000 - subtotal)} more for FREE shipping!</span>
										</div>
									)}
								</div>

								<div className="flex justify-between py-3">
									<span className="font-bold text-gray-900">Total</span>
									<span className="text-xl font-bold text-gray-900">{formatPrice(total)}</span>
								</div>

								<Button asChild size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">
									<Link href="/checkout">
										<CreditCard className="size-5 mr-2" />
										Proceed to Checkout
									</Link>
								</Button>

								<div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
									<div className="flex items-center gap-2 text-sm text-gray-600">
										<Shield className="size-4 text-indigo-500" />
										<span>Secure checkout</span>
									</div>
									<div className="flex items-center gap-2 text-sm text-gray-600">
										<Truck className="size-4 text-indigo-500" />
										<span>Fast delivery</span>
									</div>
									<div className="flex items-center gap-2 text-sm text-gray-600">
										<Headphones className="size-4 text-indigo-500" />
										<span>24/7 support</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</main>

			<footer className="bg-gray-950 text-white mt-12">
				<div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
					&copy; 2024 ShopCo. All rights reserved.
				</div>
			</footer>
		</div>
	);
}

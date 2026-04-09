"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
	ShoppingCart,
	Heart,
	Trash2,
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
import { getData } from "@/app/ApiConfig";

interface CartItem {
	id: number;
	name: string;
	price: number;
	originalPrice: number;
	image: string;
	quantity: number;
	brand: string;
}

const sampleCartItems: CartItem[] = [
	{
		id: 1,
		name: "Premium Wireless Headphones",
		price: 299000,
		originalPrice: 499000,
		image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
		quantity: 1,
		brand: "SoundMax",
	},
	{
		id: 2,
		name: "Smart Watch Pro Series 5",
		price: 899000,
		originalPrice: 1299000,
		image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
		quantity: 1,
		brand: "TechGear",
	},
];

const formatPrice = (price: number) => {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
	}).format(price);
};

export default function CartPage() {
	const [cartItems, setCartItems] = useState<CartItem[]>(sampleCartItems);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const result = await getData("/api/auth/get-session");
				setIsLoggedIn(!!result);
			} catch {
				setIsLoggedIn(false);
			} finally {
				setIsLoading(false);
			}
		};
		checkAuth();
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

	const removeItem = (id: number) => {
		setCartItems((items) => items.filter((item) => item.id !== id));
	};

	const subtotal = cartItems.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0
	);
	const originalTotal = cartItems.reduce(
		(acc, item) => acc + item.originalPrice * item.quantity,
		0
	);
	const discount = originalTotal - subtotal;
	const shipping = subtotal >= 100000 ? 0 : 15000;
	const total = subtotal + shipping;

	return (
		<div className="min-h-screen bg-[#FAFAFA]">
			<header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b shadow-sm">
				<div className="max-w-7xl mx-auto px-4 py-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Button variant="ghost" size="icon-sm" asChild className="hover:bg-gray-100">
								<Link href="/">
									<ArrowLeft className="size-5" />
								</Link>
							</Button>
							<span className="text-xl font-bold text-gray-900">
								<span className="text-indigo-600">Shop</span>Co
							</span>
						</div>
						<div className="flex items-center gap-3">
							<Button variant="ghost" size="icon-sm" className="text-gray-600 hover:bg-gray-100">
								<Heart className="size-5" />
							</Button>
						</div>
					</div>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-4 py-6">
				<div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
					<Link href="/" className="hover:text-indigo-600 font-medium">Home</Link>
					<ChevronRight className="size-4" />
					<span className="text-gray-900 font-medium">Shopping Cart</span>
				</div>

				<h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
					<ShoppingCart className="size-7 text-indigo-600" />
					Shopping Cart
					<span className="text-sm font-normal text-gray-500">({cartItems.length} items)</span>
				</h1>

				{cartItems.length === 0 ? (
					<div className="text-center py-16">
						<div className="size-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
							<ShoppingCart className="size-12 text-gray-400" />
						</div>
						<h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
						<p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
						<Button asChild className="bg-indigo-600 hover:bg-indigo-700">
							<Link href="/">Continue Shopping</Link>
						</Button>
					</div>
				) : (
					<div className="grid lg:grid-cols-3 gap-8">
						<div className="lg:col-span-2 space-y-4">
							{cartItems.map((item) => (
								<div
									key={item.id}
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
													<span className="text-xs text-indigo-600 font-medium">{item.brand}</span>
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
													onClick={() => removeItem(item.id)}
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
													{item.originalPrice > item.price && (
														<p className="text-xs text-gray-400 line-through">
															{formatPrice(item.originalPrice * item.quantity)}
														</p>
													)}
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
										<span className="text-gray-500">Discount</span>
										<span className="font-medium text-emerald-600">-{formatPrice(discount)}</span>
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

								<Button size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">
									<CreditCard className="size-5 mr-2" />
									Proceed to Checkout
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

							<div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100">
								<h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
									<Sparkles className="size-4 text-indigo-600" />
									Have a promo code?
								</h3>
								<div className="flex gap-2">
									<input
										type="text"
										placeholder="Enter code"
										className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
									/>
									<Button variant="outline" size="sm">Apply</Button>
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
"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Search, Menu, Heart, Star, ChevronRight, User, Package, CreditCard, Headphones, HelpCircle, MapPin, LogOut, X, PackageCheck, Tag, Percent, Shield, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/Carousel";
import LoginPage from "@/app/login/Page";
import { useState, useEffect } from "react";
import { getData } from "../ApiConfig";

const categories = [
	{ name: "Electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop", count: 1234 },
	{ name: "Fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop", count: 2345 },
	{ name: "Beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop", count: 876 },
	{ name: "Home", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop", count: 1567 },
	{ name: "Sports", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop", count: 654 },
	{ name: "Books", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop", count: 432 },
	{ name: "Food", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop", count: 987 },
	{ name: "More", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop", count: 2341 },
];

const products = [
	{
		id: 1,
		name: "Premium Wireless Headphones",
		price: 299000,
		originalPrice: 499000,
		rating: 4.5,
		reviews: 234,
		image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
		category: "Electronics",
	},
	{
		id: 2,
		name: "Smart Watch Pro Series 5",
		price: 899000,
		originalPrice: 1299000,
		rating: 4.8,
		reviews: 567,
		image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
		category: "Electronics",
	},
	{
		id: 3,
		name: "Premium Cotton Shirt",
		price: 189000,
		originalPrice: 289000,
		rating: 4.2,
		reviews: 123,
		image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop",
		category: "Fashion",
	},
	{
		id: 4,
		name: "Luxury Matte Lipstick Set",
		price: 99000,
		originalPrice: 149000,
		rating: 4.6,
		reviews: 456,
		image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop",
		category: "Beauty",
	},
	{ id: 5, name: "Portable Blender Pro", price: 159000, originalPrice: 249000, rating: 4.3, reviews: 89, image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&h=400&fit=crop", category: "Home" },
	{ id: 6, name: "Professional Running Shoes", price: 399000, originalPrice: 599000, rating: 4.7, reviews: 321, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", category: "Sports" },
	{ id: 7, name: "Bestselling Novel Collection", price: 79000, originalPrice: 120000, rating: 4.4, reviews: 678, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop", category: "Books" },
	{ id: 8, name: "Premium Coffee Beans", price: 129000, originalPrice: 179000, rating: 4.5, reviews: 234, image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop", category: "Food" },
];

const formatPrice = (price: number) => {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
	}).format(price);
};

export default function HomePage() {
	const [isLogin, setIsLogin] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [scrolled, setScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		if (isMobileMenuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isMobileMenuOpen]);

	if (isLoading) return null;

	return (
		<div className="bg-[#FAFAFA] flex min-h-screen flex-col">
			{isLogin && (
				<div className="fixed inset-0 z-100 flex items-center justify-center">
					<div className="bg-black/60 backdrop-blur-sm absolute inset-0" onClick={() => setIsLogin(false)} />
					<div className="relative z-10">
						<LoginPage onClose={() => setIsLogin(false)} />
					</div>
				</div>
			)}

			{isMobileMenuOpen && (
				<div className="fixed inset-0 z-200 md:hidden">
					<div className="bg-black/50 absolute inset-0" onClick={() => setIsMobileMenuOpen(false)} />
					<div className="animate-in slide-in-from-left bg-white shadow-2xl absolute bottom-0 left-0 top-0 w-80 max-w-[85vw] duration-300">
						<div className="border-b flex items-center justify-between p-4">
							<span className="text-xl font-bold">
								<span className="text-indigo-600">Shop</span>Co
							</span>
							<Button variant="ghost" size="icon-sm" onClick={() => setIsMobileMenuOpen(false)}>
								<X className="size-5" />
							</Button>
						</div>

						{isLoggedIn ? (
							<div className="bg-gray-50 border-b p-4">
								<div className="flex items-center gap-3 mb-3">
									<div className="bg-indigo-600 rounded-full size-12 flex items-center justify-center">
										<User className="size-6 text-white" />
									</div>
									<div>
										<p className="font-semibold text-gray-900">My Account</p>
										<p className="text-sm text-gray-500">Welcome back!</p>
									</div>
								</div>
								<Button variant="outline" size="sm" className="w-full">Manage Account</Button>
							</div>
						) : (
							<div className="bg-indigo-50 border-b p-4">
								<p className="text-gray-600 text-sm mb-3">Sign in to access your orders, wishlist, and exclusive deals.</p>
								<div className="flex gap-2">
									<Button size="sm" className="flex-1 bg-indigo-600" onClick={() => { setIsMobileMenuOpen(false); setIsLogin(true); }}>Sign In</Button>
									<Button asChild size="sm" variant="outline" className="flex-1"><Link href="/register">Join</Link></Button>
								</div>
							</div>
						)}

						<nav className="max-h-[calc(100vh-200px)] overflow-y-auto p-4">
							<p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Quick Access</p>
							<ul className="space-y-1">
								<li>
									<Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(false)}>
										<Package className="size-5 text-gray-500" />
										<span className="font-medium text-gray-700">Home</span>
									</Link>
								</li>
								<li>
									<Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-3 text-indigo-600 transition-colors hover:bg-indigo-50" onClick={() => setIsMobileMenuOpen(false)}>
										<Percent className="size-5" />
										<span className="font-medium">Flash Sale</span>
										<span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">Live</span>
									</Link>
								</li>
								<li>
									<Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(false)}>
										<Heart className="size-5 text-gray-500" />
										<span className="font-medium text-gray-700">Wishlist</span>
									</Link>
								</li>
								<li>
									<Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(false)}>
										<ShoppingCart className="size-5 text-gray-500" />
										<span className="font-medium text-gray-700">My Cart</span>
									</Link>
								</li>
								<li>
									<Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(false)}>
										<PackageCheck className="size-5 text-gray-500" />
										<span className="font-medium text-gray-700">My Orders</span>
									</Link>
								</li>
							</ul>

							<div className="mt-6">
								<p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Categories</p>
								<ul className="space-y-1">
									{categories.slice(0, 5).map((cat) => (
										<li key={cat.name}>
											<Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(false)}>
												<Tag className="size-5 text-gray-500" />
												<span className="font-medium text-gray-700">{cat.name}</span>
											</Link>
										</li>
									))}
								</ul>
							</div>

							<div className="mt-6 border-t pt-6">
								<p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Support</p>
								<ul className="space-y-1">
									<li>
										<Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(false)}>
											<MessageCircle className="size-5 text-gray-500" />
											<span className="font-medium text-gray-700">Live Chat</span>
										</Link>
									</li>
									<li>
										<Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(false)}>
											<HelpCircle className="size-5 text-gray-500" />
											<span className="font-medium text-gray-700">Help Center</span>
										</Link>
									</li>
									<li>
										<Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(false)}>
											<MapPin className="size-5 text-gray-500" />
											<span className="font-medium text-gray-700">Track Order</span>
										</Link>
									</li>
								</ul>
							</div>

							{isLoggedIn && (
								<div className="mt-6 border-t pt-6">
									<Button variant="ghost" className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => { setIsMobileMenuOpen(false); setIsLoggedIn(false); }}>
										<LogOut className="mr-3 size-5" />
										<span className="font-medium">Sign Out</span>
									</Button>
								</div>
							)}

							<div className="mt-6 border-t pt-6">
								<div className="flex items-center justify-center gap-4 text-gray-400">
									<Shield className="size-4" />
									<span className="text-xs">Secure Shopping</span>
								</div>
							</div>
						</nav>
					</div>
				</div>
			)}

			<header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 shadow-[0_2px_20px_rgba(0,0,0,0.08)] backdrop-blur-md" : "bg-white"}`}>
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between gap-4 lg:h-20">
						<div className="flex items-center gap-3">
							<Button variant="ghost" size="icon-sm" className="md:hidden hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(true)}>
								<Menu className="size-5 text-gray-700" />
							</Button>
							<span className="text-2xl font-bold tracking-tight text-gray-900 lg:text-3xl">
								<span className="text-indigo-600">Shop</span>Co
							</span>
						</div>

						<div className="hidden lg:flex flex-1 max-w-xl mx-8">
							<div className="flex w-full group">
								<Input
									type="search"
									placeholder="Search for products, brands and more..."
									className="rounded-r-none border-0 bg-gray-50 focus:bg-white transition-all focus:ring-0"
								/>
								<Button className="rounded-l-none bg-indigo-600 px-6 hover:bg-indigo-700 transition-colors" aria-label="Search">
									<Search className="size-5" />
								</Button>
							</div>
						</div>

						<div className="flex items-center gap-1 sm:gap-2">
							{isLoggedIn && (
								<>
									<Button variant="ghost" size="icon-sm" className="hidden md:flex text-gray-600 hover:bg-gray-100">
										<Heart className="size-5" />
									</Button>
									<Button asChild variant="outline" size="icon-sm" className="relative hover:border-indigo-300 hover:text-indigo-600 transition-colors">
										<Link href="/cart">
											<ShoppingCart className="size-5" />
											<span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-semibold text-white">
												3
											</span>
										</Link>
									</Button>
								</>
							)}
							<div className="ml-1 flex items-center gap-2">
								{isLoggedIn ? (
									<Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 hover:border-indigo-300 hover:text-indigo-600">
										<User className="size-4" />
										Account
									</Button>
								) : (
									<>
										<Button onClick={() => setIsLogin(true)} variant="outline" className="hidden sm:flex hover:border-indigo-300 hover:text-indigo-600">
											Sign In
										</Button>
										<Button asChild className="bg-indigo-600 shadow-lg shadow-indigo-200 hover:bg-indigo-700">
											<Link href="/register">Join</Link>
										</Button>
									</>
								)}
							</div>
						</div>
					</div>

					<div className="mt-2 pb-4 lg:hidden">
						<div className="flex">
							<Input
								type="search"
								placeholder="Search..."
								className="rounded-r-none border-0 bg-gray-50"
							/>
							<Button className="rounded-l-none bg-indigo-600 px-4 hover:bg-indigo-700" aria-label="Search">
								<Search className="size-5" />
							</Button>
						</div>
					</div>
				</div>
			</header>

			<section className="relative w-full overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 py-12 lg:py-20">
				<div className="absolute inset-0 opacity-30">
					<div className="absolute -left-40 top-0 size-80 rounded-full bg-indigo-500 blur-3xl mix-blend-multiply animate-pulse" />
					<div className="absolute -right-40 bottom-0 size-80 rounded-full bg-purple-500 blur-3xl mix-blend-multiply animate-pulse delay-1000" />
				</div>
				<div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<Carousel className="w-full" opts={{ loop: true }}>
						<CarouselContent>
							<CarouselItem>
								<div className="relative h-100 md:h-125 overflow-hidden rounded-3xl">
									<div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent z-10" />
									<Image src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=900&fit=crop" alt="Hero" fill sizes="100vw" className="object-cover" />
									<div className="absolute inset-0 flex items-end z-20 pb-12 md:pb-16">
										<div className="max-w-2xl px-8 md:px-16">
											<span className="mb-4 inline-block rounded-full bg-indigo-600/90 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
												Limited Time Offer
											</span>
											<h2 className="mb-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-white drop-shadow-lg">
												Discover <span className="text-indigo-300">Premium</span> Products
											</h2>
											<p className="mb-6 max-w-lg text-base sm:text-lg text-gray-200 drop-shadow-md">
												Explore our curated collection of high-quality products at unbeatable prices. Free shipping on orders over Rp 100.000.
											</p>
											<div className="flex flex-wrap gap-3 sm:gap-4">
												<Button className="bg-white text-slate-900 shadow-xl hover:bg-gray-100 h-11 sm:h-12 px-5 sm:px-8 text-sm sm:text-base font-semibold">
													Shop Now
													<ChevronRight className="ml-2 size-4 sm:size-5" />
												</Button>
												<Button variant="outline" className="border-white/40 text-gray-100 bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/60 h-11 sm:h-12 px-5 sm:px-8 text-sm sm:text-base font-semibold">
													View Collection
												</Button>
											</div>
										</div>
									</div>
								</div>
							</CarouselItem>
							<CarouselItem>
								<div className="relative h-100 md:h-125 overflow-hidden rounded-3xl">
									<div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent z-10" />
									<Image src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&h=900&fit=crop" alt="Fashion" fill sizes="100vw" className="object-cover" />
									<div className="absolute inset-0 flex items-end z-20 pb-12 md:pb-16">
										<div className="max-w-2xl px-8 md:px-16">
											<span className="mb-4 inline-block rounded-full bg-purple-600/90 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
												New Collection
											</span>
											<h2 className="mb-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-white drop-shadow-lg">
												Summer <span className="text-purple-300">Essentials</span>
											</h2>
											<p className="mb-6 max-w-lg text-base sm:text-lg text-gray-200 drop-shadow-md">
												Refresh your wardrobe with our latest summer collection. Trendy styles that combine comfort and elegance.
											</p>
											<Button className="bg-white text-purple-900 shadow-xl hover:bg-gray-100 h-11 sm:h-12 px-5 sm:px-8 text-sm sm:text-base font-semibold">
												Explore Now
												<ChevronRight className="ml-2 size-4 sm:size-5" />
											</Button>
										</div>
									</div>
								</div>
							</CarouselItem>
							<CarouselItem>
								<div className="relative h-100 md:h-125 overflow-hidden rounded-3xl">
									<div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent z-10" />
									<Image src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&h=900&fit=crop" alt="Home" fill sizes="100vw" className="object-cover" />
									<div className="absolute inset-0 flex items-end z-20 pb-12 md:pb-16">
										<div className="max-w-2xl px-8 md:px-16">
											<span className="mb-4 inline-block rounded-full bg-emerald-600/90 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
												Free Shipping
											</span>
											<h2 className="mb-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-white drop-shadow-lg">
												Home <span className="text-emerald-300">Essentials</span>
											</h2>
											<p className="mb-6 max-w-lg text-base sm:text-lg text-gray-200 drop-shadow-md">
												Transform your living space with our premium home essentials. Quality products for your dream home.
											</p>
											<Button className="bg-white text-emerald-900 shadow-xl hover:bg-gray-100 h-11 sm:h-12 px-5 sm:px-8 text-sm sm:text-base font-semibold">
												Browse Now
												<ChevronRight className="ml-2 size-4 sm:size-5" />
											</Button>
										</div>
									</div>
								</div>
							</CarouselItem>
						</CarouselContent>
						<CarouselPrevious className="left-6 size-12 border-0 bg-white/20 text-white backdrop-blur-md hover:bg-white/40" />
						<CarouselNext className="right-6 size-12 border-0 bg-white/20 text-white backdrop-blur-md hover:bg-white/40" />
					</Carousel>
				</div>
			</section>

			<section className="bg-white py-12">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mb-8 flex items-center justify-between">
						<h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
						<Button variant="link" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
							View All
							<ChevronRight className="ml-1 size-4" />
						</Button>
					</div>
					<div className="grid grid-cols-4 gap-4 md:grid-cols-6 lg:grid-cols-8">
						{categories.map((category) => (
							<button
								key={category.name}
								className="group flex flex-col items-center rounded-2xl p-4 transition-all duration-300 hover:bg-gray-50 hover:shadow-lg hover:shadow-indigo-100/50">
								<div className="relative mb-3 size-16 overflow-hidden rounded-2xl shadow-md md:size-20">
									<Image src={category.image} alt={category.name} fill sizes="(max-width: 768px) 25vw, (max-width: 1024px) 16vw, 12vw" className="object-cover transition-transform duration-500 group-hover:scale-110" />
									<div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
								</div>
								<span className="text-sm font-semibold text-gray-700 transition-colors group-hover:text-indigo-600">
									{category.name}
								</span>
								<span className="mt-0.5 text-xs text-gray-400">{category.count.toLocaleString()}+ items</span>
							</button>
						))}
					</div>
				</div>
			</section>

			<section className="bg-linear-to-br from-indigo-50 via-white to-purple-50 py-16">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mb-8 flex items-center justify-between">
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-2">
								<span className="text-3xl">⚡</span>
								<h2 className="text-2xl font-bold text-gray-900">Flash Sale</h2>
							</div>
							<div className="flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-200">
								<span>Ends in</span>
								<span className="font-mono">02:45:30</span>
							</div>
						</div>
						<Button variant="outline" className="border-indigo-200 text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50">
							View All
						</Button>
					</div>
					<div className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
						{[products[0], products[1], products[4], products[5]].map((product) => (
							<Link key={product.id} href={`/product/${product.id}`}>
								<Card className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1">
									<div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
										<Image src={product.image} alt={product.name} fill sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
										<div className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-500/30">
											-{Math.round((1 - product.price / product.originalPrice) * 100)}%
										</div>
										<Button
											size="icon"
											variant="secondary"
											className="absolute right-3 top-3 shadow-lg transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-rose-500 hover:text-white"
											onClick={(e) => {
												e.preventDefault();
											}}>
											<Heart className="size-4" />
										</Button>
									</div>
									<CardContent className="flex flex-col gap-2 p-4">
										<div>
											<p className="text-xs font-medium text-indigo-600">{product.category}</p>
											<h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-gray-900">{product.name}</h3>
										</div>
										<div className="flex items-center gap-2">
											<div className="flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-0.5">
												<Star className="size-3 fill-yellow-400 text-yellow-400" />
												<span className="text-xs font-semibold text-gray-900">{product.rating}</span>
											</div>
											<span className="text-xs text-gray-400">({product.reviews.toLocaleString()})</span>
										</div>
										<div className="mt-1 flex items-baseline gap-2">
											<span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
											<span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
										</div>
									</CardContent>
									{isLoggedIn && (
										<CardFooter className="p-4 pt-0">
											<Button className="w-full bg-gray-900 hover:bg-indigo-600" size="sm">
												<ShoppingCart className="mr-2 size-4" />
												Add to Cart
											</Button>
										</CardFooter>
									)}
								</Card>
							</Link>
						))}
					</div>
				</div>
			</section>

			<section className="bg-white py-16">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mb-10 flex items-center justify-between">
						<div>
							<h2 className="text-2xl font-bold text-gray-900">Recommended For You</h2>
							<p className="mt-1 text-gray-500">Based on your interests and recent activity</p>
						</div>
						<Button variant="link" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
							View All
							<ChevronRight className="ml-1 size-4" />
						</Button>
					</div>
					<div className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
						{products.map((product) => (
							<Link key={product.id} href={`/product/${product.id}`}>
								<Card className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1">
									<div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
										<Image src={product.image} alt={product.name} fill sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
										<Button
											size="icon"
											variant="secondary"
											className="absolute right-3 top-3 shadow-lg transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-rose-500 hover:text-white"
											onClick={(e) => {
												e.preventDefault();
											}}>
											<Heart className="size-4" />
										</Button>
									</div>
									<CardContent className="flex flex-col gap-2 p-4">
										<div>
											<p className="text-xs font-medium text-indigo-600">{product.category}</p>
											<h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-gray-900">{product.name}</h3>
										</div>
										<div className="flex items-center gap-2">
											<div className="flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-0.5">
												<Star className="size-3 fill-yellow-400 text-yellow-400" />
												<span className="text-xs font-semibold text-gray-900">{product.rating}</span>
											</div>
											<span className="text-xs text-gray-400">({product.reviews.toLocaleString()})</span>
										</div>
										<div className="mt-1 flex items-baseline gap-2">
											<span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
											<span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
										</div>
									</CardContent>
									{isLoggedIn && (
										<CardFooter className="p-4 pt-0">
											<Button asChild className="w-full bg-gray-900 hover:bg-indigo-600" size="sm">
												<Link href="/cart">
													<ShoppingCart className="mr-2 size-4" />
													Add to Cart
												</Link>
											</Button>
										</CardFooter>
									)}
								</Card>
							</Link>
						))}
					</div>
				</div>
			</section>

			<section className="bg-gray-900 py-16">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="grid gap-8 grid-cols-2 md:grid-cols-4">
						<div className="flex items-center gap-4">
							<div className="flex size-14 items-center justify-center rounded-2xl bg-indigo-600/20">
								<Package className="size-7 text-indigo-400" />
							</div>
							<div>
								<h4 className="font-semibold text-white">Free Shipping</h4>
								<p className="text-sm text-gray-400">On orders over Rp 100.000</p>
							</div>
						</div>
						<div className="flex items-center gap-4">
							<div className="flex size-14 items-center justify-center rounded-2xl bg-indigo-600/20">
								<CreditCard className="size-7 text-indigo-400" />
							</div>
							<div>
								<h4 className="font-semibold text-white">Secure Payment</h4>
								<p className="text-sm text-gray-400">100% secure payment</p>
							</div>
						</div>
						<div className="flex items-center gap-4">
							<div className="flex size-14 items-center justify-center rounded-2xl bg-indigo-600/20">
								<Headphones className="size-7 text-indigo-400" />
							</div>
							<div>
								<h4 className="font-semibold text-white">24/7 Support</h4>
								<p className="text-sm text-gray-400">Dedicated support</p>
							</div>
						</div>
						<div className="flex items-center gap-4">
							<div className="flex size-14 items-center justify-center rounded-2xl bg-indigo-600/20">
								<User className="size-7 text-indigo-400" />
							</div>
							<div>
								<h4 className="font-semibold text-white">Member Rewards</h4>
								<p className="text-sm text-gray-400">Earn points on every order</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<footer className="bg-gray-950 text-white">
				<div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
					<div className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
						<div className="lg:col-span-2">
							<h3 className="mb-4 text-2xl font-bold">
								<span className="text-indigo-400">Shop</span>Co
							</h3>
							<p className="mb-6 max-w-sm text-sm text-gray-400">
								Your trusted online store for premium products. We curate the best quality items to enhance your lifestyle with exceptional value.
							</p>
							<div className="flex gap-3">
								<Button size="icon" variant="ghost" className="rounded-xl bg-gray-800 transition-colors hover:bg-indigo-600">
									<span className="text-lg">📘</span>
								</Button>
								<Button size="icon" variant="ghost" className="rounded-xl bg-gray-800 transition-colors hover:bg-indigo-600">
									<span className="text-lg">📸</span>
								</Button>
								<Button size="icon" variant="ghost" className="rounded-xl bg-gray-800 transition-colors hover:bg-indigo-600">
									<span className="text-lg">🐦</span>
								</Button>
							</div>
						</div>
						<div>
							<h4 className="mb-4 font-semibold text-white">Shop</h4>
							<ul className="space-y-3 text-sm text-gray-400">
								<li><a href="#" className="transition-colors hover:text-indigo-400">New Arrivals</a></li>
								<li><a href="#" className="transition-colors hover:text-indigo-400">Best Sellers</a></li>
								<li><a href="#" className="transition-colors hover:text-indigo-400">Sale</a></li>
								<li><a href="#" className="transition-colors hover:text-indigo-400">All Products</a></li>
							</ul>
						</div>
						<div>
							<h4 className="mb-4 font-semibold text-white">Support</h4>
							<ul className="space-y-3 text-sm text-gray-400">
								<li><a href="#" className="transition-colors hover:text-indigo-400">Help Center</a></li>
								<li><a href="#" className="transition-colors hover:text-indigo-400">Order Status</a></li>
								<li><a href="#" className="transition-colors hover:text-indigo-400">Shipping Info</a></li>
								<li><a href="#" className="transition-colors hover:text-indigo-400">Returns</a></li>
							</ul>
						</div>
						<div>
							<h4 className="mb-4 font-semibold text-white">Company</h4>
							<ul className="space-y-3 text-sm text-gray-400">
								<li><a href="#" className="transition-colors hover:text-indigo-400">About Us</a></li>
								<li><a href="#" className="transition-colors hover:text-indigo-400">Careers</a></li>
								<li><a href="#" className="transition-colors hover:text-indigo-400">Contact</a></li>
								<li><a href="#" className="transition-colors hover:text-indigo-400">Privacy Policy</a></li>
							</ul>
						</div>
					</div>
					<div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
						<p>&copy; 2024 ShopCo. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	);
}

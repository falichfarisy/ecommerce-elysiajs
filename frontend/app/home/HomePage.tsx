"use client";

import Link from "next/link";
import { ShoppingCart, Search, Menu, Heart, Star, ChevronRight, User, Package, CreditCard, Headphones } from "lucide-react";
import * as React from "react";
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

	const handleLoginSuccess = () => {
		setIsLogin(false);
		setIsLoggedIn(true);
	};

	if (isLoading) return null;

	return (
		<div className="min-h-screen flex flex-col bg-[#FAFAFA]">
			{isLogin && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center">
					<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsLogin(false)} />
					<div className="relative z-10">
						<LoginPage onClose={() => setIsLogin(false)} />
					</div>
				</div>
			)}

			<header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.08)]" : "bg-white"}`}>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16 lg:h-20 gap-4">
						<div className="flex items-center gap-3">
							<Button variant="ghost" size="icon-sm" className="md:hidden hover:bg-gray-100">
								<Menu className="h-5 w-5 text-gray-700" />
							</Button>
							<span className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900">
								<span className="text-indigo-600">Shop</span>Co
							</span>
						</div>

						<div className="hidden lg:flex flex-1 max-w-xl mx-8">
							<div className="flex w-full group">
								<Input
									type="search"
									placeholder="Search for products, brands and more..."
									className="rounded-r-none border-gray-200 bg-gray-50 focus:bg-white transition-all focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
								/>
								<Button size="sm" className="rounded-l-none bg-indigo-600 hover:bg-indigo-700 px-6 transition-colors">
									<Search className="h-4 w-4" />
								</Button>
							</div>
						</div>

						<div className="flex items-center gap-1 sm:gap-2">
							<Button variant="ghost" size="icon-sm" className="hidden md:flex hover:bg-gray-100 text-gray-600">
								<Heart className="h-5 w-5" />
							</Button>
							<Button variant="outline" size="icon-sm" className="relative hover:border-indigo-300 hover:text-indigo-600 transition-colors">
								<ShoppingCart className="h-5 w-5" />
								<span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-indigo-600 text-white text-[10px] font-semibold flex items-center justify-center">
									3
								</span>
							</Button>
							<div className="flex items-center gap-2 ml-1">
								{isLoggedIn ? (
									<Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 hover:border-indigo-300 hover:text-indigo-600">
										<User className="h-4 w-4" />
										Account
									</Button>
								) : (
									<>
										<Button onClick={() => setIsLogin(true)} variant="outline" size="sm" className="hidden sm:flex hover:border-indigo-300 hover:text-indigo-600">
											Sign In
										</Button>
										<Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">
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
								className="rounded-r-none border-gray-200 bg-gray-50"
							/>
							<Button size="sm" className="rounded-l-none bg-indigo-600 hover:bg-indigo-700 px-4">
								<Search className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</header>

			<section className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 lg:py-20 relative overflow-hidden">
				<div className="absolute inset-0 opacity-30">
					<div className="absolute top-0 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
					<div className="absolute bottom-0 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
				</div>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
					<Carousel className="w-full" opts={{ loop: true }}>
						<CarouselContent>
							<CarouselItem>
								<div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden">
									<div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/40" />
									<img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=900&fit=crop" alt="Hero" className="w-full h-full object-cover" />
									<div className="absolute inset-0 flex items-center">
										<div className="px-8 md:px-16 max-w-2xl">
											<span className="inline-block px-4 py-1.5 bg-indigo-600/90 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
												Limited Time Offer
											</span>
											<h2 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
												Discover <span className="text-indigo-400">Premium</span> Products
											</h2>
											<p className="text-gray-300 text-lg mb-8 max-w-lg">
												Explore our curated collection of high-quality products at unbeatable prices. Free shipping on orders over Rp 100.000.
											</p>
											<div className="flex flex-wrap gap-4">
												<Button size="lg" className="bg-white text-slate-900 hover:bg-gray-100 shadow-xl">
													Shop Now
													<ChevronRight className="ml-2 h-4 w-4" />
												</Button>
												<Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10 backdrop-blur-sm">
													View Collection
												</Button>
											</div>
										</div>
									</div>
								</div>
							</CarouselItem>
							<CarouselItem>
								<div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden">
									<div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-purple-900/40" />
									<img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&h=900&fit=crop" alt="Fashion" className="w-full h-full object-cover" />
									<div className="absolute inset-0 flex items-center">
										<div className="px-8 md:px-16 max-w-2xl">
											<span className="inline-block px-4 py-1.5 bg-purple-600/90 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
												New Collection
											</span>
											<h2 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
												Summer <span className="text-purple-400">Essentials</span>
											</h2>
											<p className="text-gray-300 text-lg mb-8 max-w-lg">
												Refresh your wardrobe with our latest summer collection. Trendy styles that combine comfort and elegance.
											</p>
											<Button size="lg" className="bg-white text-purple-900 hover:bg-gray-100 shadow-xl">
												Explore Now
												<ChevronRight className="ml-2 h-4 w-4" />
											</Button>
										</div>
									</div>
								</div>
							</CarouselItem>
							<CarouselItem>
								<div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden">
									<div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-emerald-900/40" />
									<img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&h=900&fit=crop" alt="Home" className="w-full h-full object-cover" />
									<div className="absolute inset-0 flex items-center">
										<div className="px-8 md:px-16 max-w-2xl">
											<span className="inline-block px-4 py-1.5 bg-emerald-600/90 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
												Free Shipping
											</span>
											<h2 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
												Home <span className="text-emerald-400">Essentials</span>
											</h2>
											<p className="text-gray-300 text-lg mb-8 max-w-lg">
												Transform your living space with our premium home essentials. Quality products for your dream home.
											</p>
											<Button size="lg" className="bg-white text-emerald-900 hover:bg-gray-100 shadow-xl">
												Browse Now
												<ChevronRight className="ml-2 h-4 w-4" />
											</Button>
										</div>
									</div>
								</div>
							</CarouselItem>
						</CarouselContent>
						<CarouselPrevious className="left-6 bg-white/20 backdrop-blur-md border-0 hover:bg-white/40 text-white h-12 w-12" />
						<CarouselNext className="right-6 bg-white/20 backdrop-blur-md border-0 hover:bg-white/40 text-white h-12 w-12" />
					</Carousel>
				</div>
			</section>

			<section className="py-12 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between mb-8">
						<h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
						<Button variant="link" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
							View All
							<ChevronRight className="ml-1 h-4 w-4" />
						</Button>
					</div>
					<div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
						{categories.map((category, idx) => (
							<button
								key={category.name}
								className="group flex flex-col items-center p-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-100/50">
								<div className="relative w-16 h-16 md:w-20 md:h-20 mb-3 rounded-2xl overflow-hidden shadow-md">
									<img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
									<div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
								</div>
								<span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">
									{category.name}
								</span>
								<span className="text-xs text-gray-400 mt-0.5">{category.count.toLocaleString()}+ items</span>
							</button>
						))}
					</div>
				</div>
			</section>

			<section className="py-16 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between mb-8">
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-2">
								<span className="text-3xl">⚡</span>
								<h2 className="text-2xl font-bold text-gray-900">Flash Sale</h2>
							</div>
							<div className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg shadow-red-200">
								<span>Ends in</span>
								<span className="font-mono">02:45:30</span>
							</div>
						</div>
						<Button variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300">
							View All
						</Button>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{[products[0], products[1], products[4], products[5]].map((product) => (
							<Link key={product.id} href={`/product/${product.id}`}>
								<Card className="overflow-hidden hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-300 group border-0">
									<div className="relative aspect-square overflow-hidden bg-gray-100">
										<img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
										<div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
											-{Math.round((1 - product.price / product.originalPrice) * 100)}%
										</div>
										<Button
											size="icon"
											variant="secondary"
											className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:bg-indigo-600 hover:text-white"
											onClick={(e) => {
												e.preventDefault();
											}}>
											<Heart className="h-4 w-4" />
										</Button>
									</div>
									<CardContent className="p-4">
										<p className="text-xs text-indigo-600 font-medium mb-1">{product.category}</p>
										<h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 min-h-[2.5rem]">{product.name}</h3>
										<div className="flex items-center gap-1 text-sm mb-2">
											<Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
											<span className="font-semibold text-gray-900">{product.rating}</span>
											<span className="text-gray-400 text-xs">({product.reviews})</span>
										</div>
										<p className="font-bold text-lg text-gray-900">{formatPrice(product.price)}</p>
										<p className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
									</CardContent>
									<CardFooter className="p-4 pt-0">
										<Button className="w-full bg-gray-900 hover:bg-indigo-600 transition-colors shadow-lg" size="sm">
											<ShoppingCart className="h-4 w-4 mr-2" />
											Add to Cart
										</Button>
									</CardFooter>
								</Card>
							</Link>
						))}
					</div>
				</div>
			</section>

			<section className="py-16 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between mb-10">
						<div>
							<h2 className="text-2xl font-bold text-gray-900">Recommended For You</h2>
							<p className="text-gray-500 mt-1">Based on your interests and recent activity</p>
						</div>
						<Button variant="link" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
							View All
							<ChevronRight className="ml-1 h-4 w-4" />
						</Button>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{products.map((product) => (
							<Link key={product.id} href={`/product/${product.id}`}>
								<Card className="overflow-hidden hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-300 group border-0 bg-white">
									<div className="relative aspect-square overflow-hidden bg-gray-100">
										<img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
										<Button
											size="icon"
											variant="secondary"
											className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:bg-indigo-600 hover:text-white"
											onClick={(e) => {
												e.preventDefault();
											}}>
											<Heart className="h-4 w-4" />
										</Button>
									</div>
									<CardContent className="p-4">
										<p className="text-xs text-indigo-600 font-medium mb-1">{product.category}</p>
										<h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 min-h-[2.5rem]">{product.name}</h3>
										<div className="flex items-center gap-1 text-sm mb-2">
											<Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
											<span className="font-semibold text-gray-900">{product.rating}</span>
											<span className="text-gray-400 text-xs">({product.reviews})</span>
										</div>
										<p className="font-bold text-lg text-gray-900">{formatPrice(product.price)}</p>
										<p className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
									</CardContent>
									<CardFooter className="p-4 pt-0">
										<Button className="w-full bg-gray-900 hover:bg-indigo-600 transition-colors shadow-lg" size="sm">
											<ShoppingCart className="h-4 w-4 mr-2" />
											Add to Cart
										</Button>
									</CardFooter>
								</Card>
							</Link>
						))}
					</div>
				</div>
			</section>

			<section className="py-16 bg-gray-900">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
						<div className="flex items-center gap-4">
							<div className="w-14 h-14 rounded-2xl bg-indigo-600/20 flex items-center justify-center">
								<Package className="h-7 w-7 text-indigo-400" />
							</div>
							<div>
								<h4 className="font-semibold text-white">Free Shipping</h4>
								<p className="text-sm text-gray-400">On orders over Rp 100.000</p>
							</div>
						</div>
						<div className="flex items-center gap-4">
							<div className="w-14 h-14 rounded-2xl bg-indigo-600/20 flex items-center justify-center">
								<CreditCard className="h-7 w-7 text-indigo-400" />
							</div>
							<div>
								<h4 className="font-semibold text-white">Secure Payment</h4>
								<p className="text-sm text-gray-400">100% secure payment</p>
							</div>
						</div>
						<div className="flex items-center gap-4">
							<div className="w-14 h-14 rounded-2xl bg-indigo-600/20 flex items-center justify-center">
								<Headphones className="h-7 w-7 text-indigo-400" />
							</div>
							<div>
								<h4 className="font-semibold text-white">24/7 Support</h4>
								<p className="text-sm text-gray-400">Dedicated support</p>
							</div>
						</div>
						<div className="flex items-center gap-4">
							<div className="w-14 h-14 rounded-2xl bg-indigo-600/20 flex items-center justify-center">
								<User className="h-7 w-7 text-indigo-400" />
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
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
						<div className="lg:col-span-2">
							<h3 className="text-2xl font-bold mb-4">
								<span className="text-indigo-400">Shop</span>Co
							</h3>
							<p className="text-gray-400 text-sm mb-6 max-w-sm">
								Your trusted online store for premium products. We curate the best quality items to enhance your lifestyle with exceptional value.
							</p>
							<div className="flex gap-3">
								<Button size="icon" variant="ghost" className="bg-gray-800 hover:bg-indigo-600 rounded-xl transition-colors">
									<span className="text-lg">📘</span>
								</Button>
								<Button size="icon" variant="ghost" className="bg-gray-800 hover:bg-indigo-600 rounded-xl transition-colors">
									<span className="text-lg">📸</span>
								</Button>
								<Button size="icon" variant="ghost" className="bg-gray-800 hover:bg-indigo-600 rounded-xl transition-colors">
									<span className="text-lg">🐦</span>
								</Button>
							</div>
						</div>
						<div>
							<h4 className="font-semibold mb-4 text-white">Shop</h4>
							<ul className="space-y-3 text-sm text-gray-400">
								<li><a href="#" className="hover:text-indigo-400 transition-colors">New Arrivals</a></li>
								<li><a href="#" className="hover:text-indigo-400 transition-colors">Best Sellers</a></li>
								<li><a href="#" className="hover:text-indigo-400 transition-colors">Sale</a></li>
								<li><a href="#" className="hover:text-indigo-400 transition-colors">All Products</a></li>
							</ul>
						</div>
						<div>
							<h4 className="font-semibold mb-4 text-white">Support</h4>
							<ul className="space-y-3 text-sm text-gray-400">
								<li><a href="#" className="hover:text-indigo-400 transition-colors">Help Center</a></li>
								<li><a href="#" className="hover:text-indigo-400 transition-colors">Order Status</a></li>
								<li><a href="#" className="hover:text-indigo-400 transition-colors">Shipping Info</a></li>
								<li><a href="#" className="hover:text-indigo-400 transition-colors">Returns</a></li>
							</ul>
						</div>
						<div>
							<h4 className="font-semibold mb-4 text-white">Company</h4>
							<ul className="space-y-3 text-sm text-gray-400">
								<li><a href="#" className="hover:text-indigo-400 transition-colors">About Us</a></li>
								<li><a href="#" className="hover:text-indigo-400 transition-colors">Careers</a></li>
								<li><a href="#" className="hover:text-indigo-400 transition-colors">Contact</a></li>
								<li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
							</ul>
						</div>
					</div>
					<div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
						<p>&copy; 2024 ShopCo. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	);
}

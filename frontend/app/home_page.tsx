"use client";

import Link from "next/link";
import { ShoppingCart, Search, Menu, Heart, Star, ChevronRight } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const categories = [
	{ name: "Elektronik", icon: "📱", count: 1234 },
	{ name: "Fashion", icon: "👕", count: 2345 },
	{ name: "Kecantikan", icon: "💄", count: 876 },
	{ name: "Rumah Tangga", icon: "🏠", count: 1567 },
	{ name: "Olahraga", icon: "⚽", count: 654 },
	{ name: "Buku", icon: "📚", count: 432 },
	{ name: "Makanan", icon: "🍔", count: 987 },
	{ name: "Lainnya", icon: "📦", count: 2341 },
];

const products = [
	{ id: 1, name: "Wireless Headphone Pro", price: 299000, originalPrice: 499000, rating: 4.5, reviews: 234, image: "🎧" },
	{ id: 2, name: "Smart Watch Series 5", price: 899000, originalPrice: 1299000, rating: 4.8, reviews: 567, image: "⌚" },
	{ id: 3, name: "Kemeja Casual Premium", price: 189000, originalPrice: 289000, rating: 4.2, reviews: 123, image: "👔" },
	{ id: 4, name: "Lipstick Matte Collection", price: 99000, originalPrice: 149000, rating: 4.6, reviews: 456, image: "💄" },
	{ id: 5, name: "Portable Blender", price: 159000, originalPrice: 249000, rating: 4.3, reviews: 89, image: "🥤" },
	{ id: 6, name: "Running Shoes Sport", price: 399000, originalPrice: 599000, rating: 4.7, reviews: 321, image: "👟" },
	{ id: 7, name: "Novel Bestseller 2024", price: 79000, originalPrice: 120000, rating: 4.4, reviews: 678, image: "📖" },
	{ id: 8, name: "Coffee Bean Premium", price: 129000, originalPrice: 179000, rating: 4.5, reviews: 234, image: "☕" },
];

const formatPrice = (price: number) => {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
	}).format(price);
};

export default function HomePage() {
	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<header className="sticky top-0 z-50 bg-white border-b shadow-sm">
				<div className="max-w-7xl mx-auto px-4 py-3">
					<div className="flex items-center justify-between gap-4">
						<div className="flex items-center gap-2">
							<Button variant="ghost" size="icon" className="md:hidden">
								<Menu className="h-5 w-5" />
							</Button>
							<span className="text-xl font-bold text-primary">TokoKu</span>
						</div>

						<div className="hidden md:flex flex-1 max-w-xl">
							<div className="flex w-full">
								<Input
									type="search"
									placeholder="Cari produk..."
									className="rounded-r-none border-r-0"
								/>
								<Button className="rounded-l-none px-6">
									<Search className="h-4 w-4" />
								</Button>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<Button variant="ghost" size="icon" className="hidden md:flex">
								<Heart className="h-5 w-5" />
							</Button>
							<Button variant="outline" size="icon" className="relative">
								<ShoppingCart className="h-5 w-5" />
								<span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
									3
								</span>
							</Button>
							<div className="hidden md:flex items-center gap-2 ml-2">
								<Button variant="outline" asChild>
									<Link href="/login">Masuk</Link>
								</Button>
								<Button asChild>
									<Link href="/register">Daftar</Link>
								</Button>
							</div>
						</div>
					</div>

					<div className="mt-3 md:hidden">
						<div className="flex">
							<Input
								type="search"
								placeholder="Cari produk..."
								className="rounded-r-none border-r-0"
							/>
							<Button className="rounded-l-none px-4">
								<Search className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</header>

			<section className="w-full bg-linear-to-r from-primary/10 to-primary/5 py-8">
				<div className="max-w-7xl mx-auto px-4">
					<Carousel className="w-full" opts={{ loop: true }}>
						<CarouselContent>
							<CarouselItem>
								<div className="relative h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden bg-linear-to-r from-blue-600 to-blue-400 flex items-center">
									<div className="absolute inset-0 bg-black/20" />
									<div className="relative z-10 px-8 md:px-16 max-w-lg">
										<span className="inline-block px-3 py-1 bg-white/20 rounded-full text-white text-sm mb-4">
											🔥 Promo Terbatas
										</span>
										<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
											Diskon Up to 50%
										</h2>
										<p className="text-white/90 mb-6 hidden md:block">
											Belanja hemat untuk koleksi elektronik terbaru dan terlengkap
										</p>
										<Button size="lg" className="bg-white text-blue-600 hover:bg-white/90">
											Belanja Sekarang
											<ChevronRight className="ml-2 h-4 w-4" />
										</Button>
									</div>
									<div className="hidden md:block absolute right-16 text-8xl opacity-50">
										🛒
									</div>
								</div>
							</CarouselItem>
							<CarouselItem>
								<div className="relative h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden bg-linear-to-r from-purple-600 to-pink-400 flex items-center">
									<div className="absolute inset-0 bg-black/20" />
									<div className="relative z-10 px-8 md:px-16 max-w-lg">
										<span className="inline-block px-3 py-1 bg-white/20 rounded-full text-white text-sm mb-4">
											✨ Fashion Week
										</span>
										<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
											Koleksi Fashion 2024
										</h2>
										<p className="text-white/90 mb-6 hidden md:block">
											Tampil stylish dengan koleksi fashion terbaru dan terpercaya
										</p>
										<Button size="lg" className="bg-white text-purple-600 hover:bg-white/90">
											Lihat Koleksi
											<ChevronRight className="ml-2 h-4 w-4" />
										</Button>
									</div>
									<div className="hidden md:block absolute right-16 text-8xl opacity-50">
										👗
									</div>
								</div>
							</CarouselItem>
							<CarouselItem>
								<div className="relative h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden bg-linear-to-r from-orange-500 to-yellow-400 flex items-center">
									<div className="absolute inset-0 bg-black/20" />
									<div className="relative z-10 px-8 md:px-16 max-w-lg">
										<span className="inline-block px-3 py-1 bg-white/20 rounded-full text-white text-sm mb-4">
											🎁 Gratis Ongkir
										</span>
										<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
											Bebas Ongkir!
										</h2>
										<p className="text-white/90 mb-6 hidden md:block">
											Nikmati gratis ongkir untuk pembelian minimal Rp 100.000
										</p>
										<Button size="lg" className="bg-white text-orange-500 hover:bg-white/90">
											Klaim Sekarang
											<ChevronRight className="ml-2 h-4 w-4" />
										</Button>
									</div>
									<div className="hidden md:block absolute right-16 text-8xl opacity-50">
										📦
									</div>
								</div>
							</CarouselItem>
						</CarouselContent>
						<CarouselPrevious className="left-4" />
						<CarouselNext className="right-4" />
					</Carousel>
				</div>
			</section>

			<section className="py-8 bg-white">
				<div className="max-w-7xl mx-auto px-4">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-bold">Kategori</h2>
						<Button variant="link" className="text-primary">
							Lihat Semua
						</Button>
					</div>
					<div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
						{categories.map((category) => (
							<button
								key={category.name}
								className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-100 transition-colors group"
							>
								<div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
									{category.icon}
								</div>
								<span className="text-sm font-medium text-center text-gray-700 group-hover:text-primary">
									{category.name}
								</span>
								<span className="text-xs text-gray-400 mt-1">
									{category.count.toLocaleString()} item
								</span>
							</button>
						))}
					</div>
				</div>
			</section>

			<section className="py-8 bg-red-50">
				<div className="max-w-7xl mx-auto px-4">
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center gap-3">
							<span className="text-2xl">⚡</span>
							<h2 className="text-xl font-bold">Flash Sale</h2>
							<div className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
								<span>Berakhir dalam</span>
								<span className="font-bold">02:45:30</span>
							</div>
						</div>
						<Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
							Lihat Semua
						</Button>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
						{products.slice(0, 6).map((product) => (
							<Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
								<div className="aspect-square bg-gray-100 flex items-center justify-center text-6xl">
									{product.image}
								</div>
								<CardContent className="p-3">
									<h3 className="font-medium text-sm line-clamp-2 mb-2 h-10">
										{product.name}
									</h3>
									<div className="flex items-center gap-1 text-sm">
										<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
										<span className="font-medium">{product.rating}</span>
										<span className="text-gray-400">({product.reviews})</span>
									</div>
								</CardContent>
								<CardFooter className="p-3 pt-0">
									<div className="w-full">
										<p className="font-bold text-primary">{formatPrice(product.price)}</p>
										<p className="text-xs text-gray-400 line-through">
											{formatPrice(product.originalPrice)}
										</p>
										<div className="mt-1 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded inline-block">
											{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
										</div>
									</div>
								</CardFooter>
							</Card>
						))}
					</div>
				</div>
			</section>

			<section className="py-8 bg-white">
				<div className="max-w-7xl mx-auto px-4">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-bold">Produk Untukmu</h2>
						<Button variant="link" className="text-primary">
							Lihat Semua
						</Button>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{products.map((product) => (
							<Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
								<div className="relative aspect-square bg-gray-100 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
									{product.image}
									<Button
										size="icon"
										variant="secondary"
										className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
									>
										<Heart className="h-4 w-4" />
									</Button>
								</div>
								<CardContent className="p-4">
									<h3 className="font-medium text-sm line-clamp-2 mb-2 h-10">
										{product.name}
									</h3>
									<div className="flex items-center gap-1 text-sm mb-2">
										<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
										<span className="font-medium">{product.rating}</span>
										<span className="text-gray-400">({product.reviews})</span>
									</div>
									<p className="font-bold text-lg text-primary">{formatPrice(product.price)}</p>
									<p className="text-xs text-gray-400 line-through">
										{formatPrice(product.originalPrice)}
									</p>
								</CardContent>
								<CardFooter className="p-4 pt-0">
									<Button className="w-full" size="sm">
										<ShoppingCart className="h-4 w-4 mr-2" />
										Add to Cart
									</Button>
								</CardFooter>
							</Card>
						))}
					</div>
				</div>
			</section>

			<footer className="bg-gray-900 text-white mt-auto">
				<div className="max-w-7xl mx-auto px-4 py-12">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
						<div className="col-span-2 md:col-span-1">
							<h3 className="text-xl font-bold mb-4">TokoKu</h3>
							<p className="text-gray-400 text-sm mb-4">
								Toko online terpercaya dengan berbagai produk berkualitas untuk kebutuhan sehari-hari Anda.
							</p>
							<div className="flex gap-3">
								<Button size="icon" variant="ghost" className="bg-gray-800 hover:bg-gray-700">
									<span className="text-lg">📘</span>
								</Button>
								<Button size="icon" variant="ghost" className="bg-gray-800 hover:bg-gray-700">
									<span className="text-lg">📸</span>
								</Button>
								<Button size="icon" variant="ghost" className="bg-gray-800 hover:bg-gray-700">
									<span className="text-lg">🐦</span>
								</Button>
							</div>
						</div>
						<div>
							<h4 className="font-semibold mb-4">Layanan</h4>
							<ul className="space-y-2 text-sm text-gray-400">
								<li><a href="#" className="hover:text-white transition-colors">Bantuan</a></li>
								<li><a href="#" className="hover:text-white transition-colors">Cara Pembelian</a></li>
								<li><a href="#" className="hover:text-white transition-colors">Pengiriman</a></li>
								<li><a href="#" className="hover:text-white transition-colors">Pengembalian</a></li>
							</ul>
						</div>
						<div>
							<h4 className="font-semibold mb-4">Tentang Kami</h4>
							<ul className="space-y-2 text-sm text-gray-400">
								<li><a href="#" className="hover:text-white transition-colors">Profil</a></li>
								<li><a href="#" className="hover:text-white transition-colors">Karir</a></li>
								<li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
								<li><a href="#" className="hover:text-white transition-colors">Hubungi Kami</a></li>
							</ul>
						</div>
						<div>
							<h4 className="font-semibold mb-4">Kategori</h4>
							<ul className="space-y-2 text-sm text-gray-400">
								<li><a href="#" className="hover:text-white transition-colors">Elektronik</a></li>
								<li><a href="#" className="hover:text-white transition-colors">Fashion</a></li>
								<li><a href="#" className="hover:text-white transition-colors">Kecantikan</a></li>
								<li><a href="#" className="hover:text-white transition-colors">Rumah Tangga</a></li>
							</ul>
						</div>
					</div>
					<div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
						<p>&copy; 2024 TokoKu. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	);
}

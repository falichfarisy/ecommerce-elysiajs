"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
	ShoppingCart,
	Heart,
	Share2,
	Star,
	Minus,
	Plus,
	ChevronRight,
	Truck,
	Shield,
	RotateCcw,
	BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";

const products = [
	{ id: 1, name: "Wireless Headphone Pro", price: 299000, originalPrice: 499000, rating: 4.5, reviews: 234, image: "🎧", category: "Elektronik", brand: "SoundMax", stock: 15 },
	{ id: 2, name: "Smart Watch Series 5", price: 899000, originalPrice: 1299000, rating: 4.8, reviews: 567, image: "⌚", category: "Elektronik", brand: "TechGear", stock: 8 },
	{ id: 3, name: "Kemeja Casual Premium", price: 189000, originalPrice: 289000, rating: 4.2, reviews: 123, image: "👔", category: "Fashion", brand: "StyleHouse", stock: 25 },
	{ id: 4, name: "Lipstick Matte Collection", price: 99000, originalPrice: 149000, rating: 4.6, reviews: 456, image: "💄", category: "Kecantikan", brand: "GlowUp", stock: 50 },
	{ id: 5, name: "Portable Blender", price: 159000, originalPrice: 249000, rating: 4.3, reviews: 89, image: "🥤", category: "Rumah Tangga", brand: "HomePro", stock: 30 },
	{ id: 6, name: "Running Shoes Sport", price: 399000, originalPrice: 599000, rating: 4.7, reviews: 321, image: "👟", category: "Olahraga", brand: "SportMax", stock: 12 },
	{ id: 7, name: "Novel Bestseller 2024", price: 79000, originalPrice: 120000, rating: 4.4, reviews: 678, image: "📖", category: "Buku", brand: "BookWorld", stock: 100 },
	{ id: 8, name: "Coffee Bean Premium", price: 129000, originalPrice: 179000, rating: 4.5, reviews: 234, image: "☕", category: "Makanan", brand: "CoffeeHub", stock: 45 },
];

const relatedProducts = products.slice(0, 4);

const formatPrice = (price: number) => {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
	}).format(price);
};

const reviews = [
	{ id: 1, user: "Andi S.", date: "15 Mar 2024", rating: 5, comment: "Produk sangat bagus, pengiriman cepat!" },
	{ id: 2, user: "Budi W.", date: "10 Mar 2024", rating: 4, comment: "Kualitas baik, sesuai deskripsi." },
	{ id: 3, user: "Citra M.", date: "5 Mar 2024", rating: 5, comment: "Recommended seller! Akan beli lagi." },
];

export default function ProductDetailPage() {
	const params = useParams();
	const productId = parseInt(params.id as string);
	const product = products.find((p) => p.id === productId) || products[0];

	const [quantity, setQuantity] = useState(1);
	const [selectedImage, setSelectedImage] = useState(0);
	const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");

	const discount = Math.round((1 - product.price / product.originalPrice) * 100);

	const specs = [
		{ label: "Brand", value: product.brand },
		{ label: "Kategori", value: product.category },
		{ label: "Stok", value: `${product.stock} unit` },
		{ label: "Berat", value: "250 gram" },
		{ label: "Garansi", value: "12 bulan" },
	];

	return (
		<div className="min-h-screen bg-gray-50">
			<header className="sticky top-0 z-50 bg-white border-b shadow-sm">
				<div className="max-w-7xl mx-auto px-4 py-3">
					<div className="flex items-center justify-between">
						<Link href="/" className="flex items-center gap-2">
							<span className="text-xl font-bold text-primary">TokoKu</span>
						</Link>
						<div className="flex items-center gap-3">
							<Button variant="outline" size="icon">
								<Heart className="h-5 w-5" />
							</Button>
							<Button variant="outline" size="icon" className="relative">
								<ShoppingCart className="h-5 w-5" />
								<span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
									3
								</span>
							</Button>
						</div>
					</div>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-4 py-6">
				<div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
					<Link href="/" className="hover:text-primary">Beranda</Link>
					<ChevronRight className="h-4 w-4" />
					<Link href="/" className="hover:text-primary">{product.category}</Link>
					<ChevronRight className="h-4 w-4" />
					<span className="text-gray-900">{product.name}</span>
				</div>

				<div className="grid lg:grid-cols-2 gap-8 mb-12">
					<div className="space-y-4">
						<div className="aspect-square bg-white rounded-2xl border flex items-center justify-center text-9xl">
							{product.image}
						</div>
						<div className="flex gap-3">
							{[0, 1, 2, 3].map((i) => (
								<button
									key={i}
									onClick={() => setSelectedImage(i)}
									className={`w-20 h-20 rounded-lg border-2 flex items-center justify-center text-3xl transition-colors ${
										selectedImage === i ? "border-primary" : "border-gray-200 hover:border-gray-300"
									}`}
								>
									{product.image}
								</button>
							))}
						</div>
					</div>

					<div className="space-y-6">
						<div>
							<div className="flex items-center gap-2 mb-2">
								<span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
									{product.brand}
								</span>
								<span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
									Tersedia
								</span>
							</div>
							<h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
								{product.name}
							</h1>
							<div className="flex items-center gap-3">
								<div className="flex items-center gap-1">
									{[1, 2, 3, 4, 5].map((star) => (
										<Star
											key={star}
											className={`h-4 w-4 ${
												star <= Math.round(product.rating)
													? "fill-yellow-400 text-yellow-400"
													: "text-gray-300"
											}`}
										/>
									))}
								</div>
								<span className="font-medium">{product.rating}</span>
								<span className="text-gray-400">|</span>
								<span className="text-gray-500">{product.reviews} ulasan</span>
							</div>
						</div>

						<div className="bg-gray-50 rounded-xl p-4">
							<div className="flex items-baseline gap-3">
								<span className="text-3xl font-bold text-primary">
									{formatPrice(product.price)}
								</span>
								<span className="text-lg text-gray-400 line-through">
									{formatPrice(product.originalPrice)}
								</span>
								<span className="px-2 py-1 bg-red-500 text-white text-sm font-bold rounded">
									{discount}% OFF
								</span>
							</div>
							<p className="text-sm text-gray-500 mt-1">
								Harga sudah termasuk pajak
							</p>
						</div>

						<div className="flex items-center gap-4">
							<span className="text-gray-600">Jumlah:</span>
							<div className="flex items-center border rounded-lg">
								<Button
									variant="ghost"
									size="icon"
									className="h-10 w-10 rounded-r-none"
									onClick={() => setQuantity(Math.max(1, quantity - 1))}
								>
									<Minus className="h-4 w-4" />
								</Button>
								<span className="w-12 text-center font-medium">{quantity}</span>
								<Button
									variant="ghost"
									size="icon"
									className="h-10 w-10 rounded-l-none"
									onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
								>
									<Plus className="h-4 w-4" />
								</Button>
							</div>
							<span className="text-sm text-gray-500">
								Tersisa {product.stock} unit
							</span>
						</div>

						<div className="flex gap-3">
							<Button size="lg" className="flex-1">
								<ShoppingCart className="h-5 w-5 mr-2" />
								Masukkan Keranjang
							</Button>
							<Button size="lg" variant="outline">
								<Heart className="h-5 w-5" />
							</Button>
							<Button size="lg" variant="outline">
								<Share2 className="h-5 w-5" />
							</Button>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t">
							<div className="flex items-center gap-3 text-sm">
								<Truck className="h-5 w-5 text-primary" />
								<span>Gratis Ongkir</span>
							</div>
							<div className="flex items-center gap-3 text-sm">
								<Shield className="h-5 w-5 text-primary" />
								<span>Garansi 12 Bulan</span>
							</div>
							<div className="flex items-center gap-3 text-sm">
								<RotateCcw className="h-5 w-5 text-primary" />
								<span>30 Hari Return</span>
							</div>
							<div className="flex items-center gap-3 text-sm">
								<BadgeCheck className="h-5 w-5 text-primary" />
								<span>Produk Original</span>
							</div>
						</div>
					</div>
				</div>

				<div className="border-t pt-8">
					<div className="flex border-b">
						<button
							onClick={() => setActiveTab("description")}
							className={`px-6 py-3 font-medium border-b-2 transition-colors ${
								activeTab === "description"
									? "border-primary text-primary"
									: "border-transparent text-gray-500 hover:text-gray-700"
							}`}
						>
							Deskripsi
						</button>
						<button
							onClick={() => setActiveTab("specs")}
							className={`px-6 py-3 font-medium border-b-2 transition-colors ${
								activeTab === "specs"
									? "border-primary text-primary"
									: "border-transparent text-gray-500 hover:text-gray-700"
							}`}
						>
							Spesifikasi
						</button>
						<button
							onClick={() => setActiveTab("reviews")}
							className={`px-6 py-3 font-medium border-b-2 transition-colors ${
								activeTab === "reviews"
									? "border-primary text-primary"
									: "border-transparent text-gray-500 hover:text-gray-700"
							}`}
						>
							Ulasan ({product.reviews})
						</button>
					</div>

					<div className="py-6">
						{activeTab === "description" && (
							<div className="prose prose-gray max-w-none">
								<p className="text-gray-600 leading-relaxed">
									{product.name} adalah produk berkualitas tinggi dengan desain modern dan
									fungsional. Cocok untuk digunakan sehari-hari dengan performa yang
									handal dan tahan lama.
								</p>
								<p className="text-gray-600 leading-relaxed mt-4">
									Produk ini telah melalui proses quality control yang ketat untuk
									memastikan setiap unit yang keluar memiliki kualitas terbaik.
									Dengan material pilihan dan teknologi terbaru, produk ini dirancang
									untuk memenuhi kebutuhan Anda.
								</p>
								<ul className="mt-4 space-y-2 text-gray-600">
									<li>• Desain premium dan modern</li>
									<li>• Material berkualitas tinggi</li>
									<li>• Mudah digunakan dan dirawat</li>
									<li>• Cocok untuk hadiah</li>
								</ul>
							</div>
						)}

						{activeTab === "specs" && (
							<table className="w-full">
								<tbody>
									{specs.map((spec, index) => (
										<tr
											key={spec.label}
											className={index % 2 === 0 ? "bg-gray-50" : ""}
										>
											<td className="px-4 py-3 font-medium text-gray-600">
												{spec.label}
											</td>
											<td className="px-4 py-3 text-gray-900">{spec.value}</td>
										</tr>
									))}
								</tbody>
							</table>
						)}

						{activeTab === "reviews" && (
							<div className="space-y-6">
								<div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
									<div className="text-center">
										<div className="text-4xl font-bold text-gray-900">
											{product.rating}
										</div>
										<div className="flex items-center gap-0.5 mt-1">
											{[1, 2, 3, 4, 5].map((star) => (
												<Star
													key={star}
													className={`h-4 w-4 ${
														star <= Math.round(product.rating)
															? "fill-yellow-400 text-yellow-400"
															: "text-gray-300"
													}`}
												/>
											))}
										</div>
										<p className="text-sm text-gray-500 mt-1">
											{product.reviews} ulasan
										</p>
									</div>
								</div>

								{reviews.map((review) => (
									<div
										key={review.id}
										className="border-b pb-6 last:border-0"
									>
										<div className="flex items-center gap-2 mb-2">
											<span className="font-medium">{review.user}</span>
											<span className="text-gray-400">•</span>
											<span className="text-sm text-gray-500">{review.date}</span>
										</div>
										<div className="flex items-center gap-0.5 mb-2">
											{[1, 2, 3, 4, 5].map((star) => (
												<Star
													key={star}
													className={`h-3 w-3 ${
														star <= review.rating
															? "fill-yellow-400 text-yellow-400"
															: "text-gray-300"
													}`}
												/>
											))}
										</div>
										<p className="text-gray-600">{review.comment}</p>
									</div>
								))}

								<Button variant="outline" className="w-full">
									Lihat Semua Ulasan
								</Button>
							</div>
						)}
					</div>
				</div>

				<div className="border-t pt-8 mt-8">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-bold">Produk Terkait</h2>
						<Button variant="link" className="text-primary">
							Lihat Semua
						</Button>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{relatedProducts.map((p) => (
							<Card
								key={p.id}
								className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
							>
								<Link href={`/product/${p.id}`}>
									<div className="aspect-square bg-gray-100 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform">
										{p.image}
									</div>
									<CardContent className="p-3">
										<h3 className="font-medium text-sm line-clamp-2 h-10">
											{p.name}
										</h3>
										<p className="font-bold text-primary mt-2">
											{formatPrice(p.price)}
										</p>
									</CardContent>
								</Link>
							</Card>
						))}
					</div>
				</div>
			</main>

			<footer className="bg-gray-900 text-white mt-12">
				<div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-gray-400">
					&copy; 2024 TokoKu. All rights reserved.
				</div>
			</footer>
		</div>
	);
}

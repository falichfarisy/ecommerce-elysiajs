"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Star, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import Header from "@/components/layout/Header";

const products = [
	{ id: 1, name: "Premium Wireless Headphones", price: 299000, originalPrice: 499000, rating: 4.5, reviews: 234, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop", category: "Electronics" },
	{ id: 2, name: "Smart Watch Pro Series 5", price: 899000, originalPrice: 1299000, rating: 4.8, reviews: 567, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop", category: "Electronics" },
	{ id: 3, name: "Premium Cotton Shirt", price: 189000, originalPrice: 289000, rating: 4.2, reviews: 123, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop", category: "Fashion" },
	{ id: 4, name: "Luxury Matte Lipstick Set", price: 99000, originalPrice: 149000, rating: 4.6, reviews: 456, image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop", category: "Beauty" },
	{ id: 5, name: "Portable Blender Pro", price: 159000, originalPrice: 249000, rating: 4.3, reviews: 89, image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&h=400&fit=crop", category: "Home" },
	{ id: 6, name: "Professional Running Shoes", price: 399000, originalPrice: 599000, rating: 4.7, reviews: 321, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", category: "Sports" },
	{ id: 7, name: "Bestselling Novel Collection", price: 79000, originalPrice: 120000, rating: 4.4, reviews: 678, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop", category: "Books" },
	{ id: 8, name: "Premium Coffee Beans", price: 129000, originalPrice: 179000, rating: 4.5, reviews: 234, image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop", category: "Food" },
];

const categoryNames: Record<string, string> = {
	electronics: "Electronics",
	fashion: "Fashion",
	beauty: "Beauty",
	home: "Home",
	sports: "Sports",
	books: "Books",
	food: "Food",
	more: "More",
};

const formatPrice = (price: number) => {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
	}).format(price);
};

export default function CategoryPage() {
	const params = useParams();
	const slug = (params.slug as string).toLowerCase();

	const isValidCategory = Object.keys(categoryNames).includes(slug);
	const displayName = categoryNames[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
	const filteredProducts = slug === "more" ? products : products.filter((p) => p.category.toLowerCase() === slug);

	return (
		<div className="min-h-screen bg-[#FAFAFA]">
			<Header />

			<main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
					<Link href="/" className="hover:text-indigo-600">Beranda</Link>
					<ChevronRight className="size-4" />
					<span className="text-gray-900 font-medium">{displayName}</span>
				</div>

				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">{displayName}</h1>
					<p className="mt-2 text-gray-500">
						{isValidCategory
							? `${filteredProducts.length} produk tersedia`
							: "Jelajahi koleksi produk kami"}
					</p>
				</div>

				{filteredProducts.length > 0 ? (
					<div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
						{filteredProducts.map((product) => (
							<Link key={product.id} href={`/product/${product.id}`}>
								<Card className="group overflow-hidden border-0 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-100/50">
									<div className="relative aspect-square overflow-hidden bg-gray-100">
										<Image src={product.image} alt={product.name} fill sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-110" />
									</div>
									<CardContent className="p-4">
										<p className="mb-1 text-xs font-medium text-indigo-600">{product.category}</p>
										<h3 className="mb-2 min-h-10 text-sm font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
										<div className="mb-2 flex items-center gap-1 text-sm">
											<Star className="size-3.5 fill-yellow-400 text-yellow-400" />
											<span className="font-semibold text-gray-900">{product.rating}</span>
											<span className="text-xs text-gray-400">({product.reviews})</span>
										</div>
										<p className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</p>
										{product.originalPrice && (
											<p className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
										)}
									</CardContent>
								</Card>
							</Link>
						))}
					</div>
				) : (
					<div className="text-center py-20">
						<p className="text-xl text-gray-400">Kategori tidak ditemukan</p>
						<Link href="/" className="mt-4 inline-block text-indigo-600 hover:underline">
							Kembali ke Beranda
						</Link>
					</div>
				)}
			</main>

			<footer className="bg-gray-900 text-white mt-12">
				<div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-gray-400">
					&copy; 2024 ShopCo. All rights reserved.
				</div>
			</footer>
		</div>
	);
}

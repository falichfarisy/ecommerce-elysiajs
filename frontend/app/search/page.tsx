"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Star, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import Header from "@/components/layout/Header";
import { getData } from "@/app/ApiConfig";
import Skeleton from "@/components/ui/Skeleton";

interface Product {
	id: number;
	name: string;
	price: number;
	imageUrl: string | null;
	category: string;
	stock: number;
	description?: string;
}

interface Pagination {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

const formatPrice = (price: number) => {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
	}).format(price);
};

function SearchContent() {
	const searchParams = useSearchParams();
	const query = searchParams.get("q") || "";
	const pageParam = searchParams.get("page") || "1";

	const [products, setProducts] = useState<Product[]>([]);
	const [pagination, setPagination] = useState<Pagination | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!query.trim()) {
			setIsLoading(false);
			setProducts([]);
			return;
		}

		const fetchProducts = async () => {
			setIsLoading(true);
			setError("");
			try {
				const params: Record<string, string> = { search: query.trim(), page: pageParam };
				const res = await getData("/product", params);
				if (res?.success) {
					setProducts(res.data || []);
					setPagination(res.pagination || null);
				} else {
					setProducts([]);
				}
			} catch {
				setError("Gagal memuat hasil pencarian.");
			} finally {
				setIsLoading(false);
			}
		};
		fetchProducts();
	}, [query, pageParam]);

	const getImageSrc = (product: Product) => {
		return product.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop";
	};

	if (!query.trim()) {
		return (
			<div className="min-h-screen bg-[#FAFAFA]">
				<Header />
				<main className="max-w-7xl mx-auto px-4 py-20 text-center">
					<div className="size-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
						<Search className="size-12 text-gray-400" />
					</div>
					<h2 className="text-xl font-semibold text-gray-900 mb-2">Cari Produk</h2>
					<p className="text-gray-500">Ketik kata kunci di kolom pencarian untuk menemukan produk.</p>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#FAFAFA]">
			<Header />

			<main className="max-w-7xl mx-auto px-4 py-8">
				<div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
					<Link href="/" className="hover:text-indigo-600">Home</Link>
					<ChevronRight className="size-4" />
					<span className="text-gray-900 font-medium">Search</span>
				</div>

				<div className="flex items-center justify-between mb-8">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							Hasil untuk: <span className="text-indigo-600">&ldquo;{query}&rdquo;</span>
						</h1>
						{!isLoading && pagination && (
							<p className="text-gray-500 mt-1">{pagination.total} produk ditemukan</p>
						)}
					</div>
				</div>

				{isLoading ? (
					<div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
						{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
							<div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
								<Skeleton className="aspect-square w-full" />
								<div className="p-4 space-y-2">
									<Skeleton className="h-3 w-16" />
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-24" />
									<Skeleton className="h-5 w-20" />
								</div>
							</div>
						))}
					</div>
				) : error ? (
					<div className="text-center py-16">
						<p className="text-red-500 mb-4">{error}</p>
						<Button variant="outline" onClick={() => window.location.reload()}>
							Coba Lagi
						</Button>
					</div>
				) : products.length === 0 ? (
					<div className="text-center py-16">
						<div className="size-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
							<Search className="size-12 text-gray-400" />
						</div>
						<h2 className="text-xl font-semibold text-gray-900 mb-2">Produk Tidak Ditemukan</h2>
						<p className="text-gray-500 mb-6">
							Tidak ada produk yang cocok dengan &ldquo;{query}&rdquo;
						</p>
						<Button asChild className="bg-indigo-600 hover:bg-indigo-700">
							<Link href="/">Lihat Semua Produk</Link>
						</Button>
					</div>
				) : (
					<>
						<div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
							{products.map((product) => (
								<Link key={product.id} href={`/product/${product.id}`}>
									<Card className="group overflow-hidden border-0 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-100/50 h-full">
										<div className="relative aspect-square overflow-hidden bg-gray-100">
											<Image
												src={getImageSrc(product)}
												alt={product.name}
												fill
												sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
												className="object-cover transition-transform duration-500 group-hover:scale-110"
											/>
										</div>
										<CardContent className="p-4">
											{product.category && (
												<p className="mb-1 text-xs font-medium text-indigo-600">{product.category}</p>
											)}
											<h3 className="mb-2 min-h-10 text-sm font-semibold text-gray-900 line-clamp-2">
												{product.name}
											</h3>
											<p className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</p>
										</CardContent>
									</Card>
								</Link>
							))}
						</div>

						{pagination && pagination.totalPages > 1 && (
							<div className="flex justify-center items-center gap-2 mt-12">
								{pagination.page > 1 && (
									<Button variant="outline" size="sm" asChild>
										<Link href={`/search?q=${encodeURIComponent(query)}&page=${pagination.page - 1}`}>
											Previous
										</Link>
									</Button>
								)}
								{Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
									<Button
										key={page}
										variant={page === pagination.page ? "default" : "outline"}
										size="sm"
										asChild
										className={page === pagination.page ? "bg-indigo-600" : ""}
									>
										<Link href={`/search?q=${encodeURIComponent(query)}&page=${page}`}>
											{page}
										</Link>
									</Button>
								))}
								{pagination.page < pagination.totalPages && (
									<Button variant="outline" size="sm" asChild>
										<Link href={`/search?q=${encodeURIComponent(query)}&page=${pagination.page + 1}`}>
											Next
										</Link>
									</Button>
								)}
							</div>
						)}
					</>
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

export default function SearchPage() {
	return (
		<Suspense fallback={
			<div className="min-h-screen bg-[#FAFAFA]">
				<Header />
				<main className="max-w-7xl mx-auto px-4 py-8">
					<div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
						{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
							<div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
								<Skeleton className="aspect-square w-full" />
								<div className="p-4 space-y-2">
									<Skeleton className="h-3 w-16" />
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-24" />
									<Skeleton className="h-5 w-20" />
								</div>
							</div>
						))}
					</div>
				</main>
			</div>
		}>
			<SearchContent />
		</Suspense>
	);
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
	Check,
	Clock,
	Package,
	ThumbsUp,
	MessageCircle,
	ArrowRight,
	Eye,
	Sparkles,
	Leaf,
	Award,
	Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { getData } from "@/app/ApiConfig";

const products = [
	{
		id: 1,
		name: "Premium Wireless Headphones",
		price: 299000,
		originalPrice: 499000,
		rating: 4.5,
		reviews: 234,
		image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
		images: [
			"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
			"https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop",
			"https://images.unsplash.com/photo-1484704849700-f032f568b501?w=800&h=800&fit=crop",
			"https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&h=800&fit=crop",
		],
		category: "Electronics",
		brand: "SoundMax",
		stock: 15,
		description: "Premium Wireless Headphones with latest noise cancellation technology. Enjoy music without distraction with clear audio quality and powerful bass. Ergonomic design ensures maximum comfort for long-term use.",
		features: ["Active Noise Cancellation", "40hr Battery Life", "Premium Comfort Cushions", "Bluetooth 5.0", "Hi-Res Audio Certified"],
	},
	{
		id: 2,
		name: "Smart Watch Pro Series 5",
		price: 899000,
		originalPrice: 1299000,
		rating: 4.8,
		reviews: 567,
		image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop",
		images: [
			"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop",
			"https://images.unsplash.com/photo-1579586337278-3befd40fed17?w=800&h=800&fit=crop",
			"https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&h=800&fit=crop",
			"https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&h=800&fit=crop",
		],
		category: "Electronics",
		brand: "TechGear",
		stock: 8,
		description: "Smart Watch Pro Series 5 with complete health and productivity features. Clear AMOLED display, long-lasting battery, and accurate fitness tracking.",
		features: ["AMOLED Display", "7-Day Battery", "GPS Tracking", "Heart Rate Monitor", "Sleep Analysis"],
	},
	{
		id: 3,
		name: "Premium Cotton Shirt",
		price: 189000,
		originalPrice: 289000,
		rating: 4.2,
		reviews: 123,
		image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=800&fit=crop",
		images: [
			"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=800&fit=crop",
			"https://images.unsplash.com/photo-1602810318383-e98650c0de9f?w=800&h=800&fit=crop",
			"https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=800&fit=crop",
			"https://images.unsplash.com/photo-1598033129183-c4f50c6a00b4?w=800&h=800&fit=crop",
		],
		category: "Fashion",
		brand: "StyleHouse",
		stock: 25,
		description: "Premium cotton shirt with modern cut. High-quality fabric that is comfortable and wrinkle-resistant. Perfect for various occasions.",
		features: ["100% Cotton", "Wrinkle Resistant", "Modern Fit", "Breathable Fabric", "Machine Washable"],
	},
	{
		id: 4,
		name: "Luxury Matte Lipstick Set",
		price: 99000,
		originalPrice: 149000,
		rating: 4.6,
		reviews: 456,
		image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&h=800&fit=crop",
		images: [
			"https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&h=800&fit=crop",
			"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop",
			"https://images.unsplash.com/photo-1583241800698-a05fb9b59e3d?w=800&h=800&fit=crop",
			"https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?w=800&h=800&fit=crop",
		],
		category: "Beauty",
		brand: "GlowUp",
		stock: 50,
		description: "Luxury lipstick set with 6 stylish matte shades. Soft texture and long-lasting formula for flawless look all day.",
		features: ["6 Matte Shades", "Long-Lasting", "Hydrating Formula", "Cruelty Free", "Vegan Friendly"],
	},
	{
		id: 5,
		name: "Portable Blender Pro",
		price: 159000,
		originalPrice: 249000,
		rating: 4.3,
		reviews: 89,
		image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&h=800&fit=crop",
		images: [
			"https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&h=800&fit=crop",
			"https://images.unsplash.com/photo-1620916566398-40a7e0ab1de5?w=800&h=800&fit=crop",
			"https://images.unsplash.com/photo-1584464491033-08628cee187b?w=800&h=800&fit=crop",
			"https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&h=800&fit=crop",
		],
		category: "Home",
		brand: "HomePro",
		stock: 30,
		description: "Portable blender with latest technology. Easy to carry anywhere, perfect for healthy smoothies anytime, anywhere.",
		features: ["Portable Design", "USB Charging", "3 Speed Modes", "Easy Clean", "BPA Free"],
	},
	{
		id: 6,
		name: "Professional Running Shoes",
		price: 399000,
		originalPrice: 599000,
		rating: 4.7,
		reviews: 321,
		image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop",
		images: [
			"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop",
			"https://images.unsplash.com/photo-1608231387042-46d7b86f70a5?w=800&h=800&fit=crop",
			"https://images.unsplash.com/photo-1606107557195-0e29a4d8d8f9?w=800&h=800&fit=crop",
			"https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop",
		],
		category: "Sports",
		brand: "SportMax",
		stock: 12,
		description: "Professional running shoes with latest cushioning technology. Lightweight, comfortable, and supports optimal performance.",
		features: ["Air Cushioning", "Breathable Mesh", "Anti-Slip Sole", "Lightweight", "Reflective Details"],
	},
	{
		id: 7,
		name: "Bestselling Novel Collection",
		price: 79000,
		originalPrice: 120000,
		rating: 4.4,
		reviews: 678,
		image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=800&fit=crop",
		images: [
			"https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=800&fit=crop",
			"https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=800&fit=crop",
			"https://images.unsplash.com/photo-1476275461168-f85b7f3f3dbb?w=800&h=800&fit=crop",
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop",
		],
		category: "Books",
		brand: "BookWorld",
		stock: 100,
		description: "Must-read bestseller novel collection. Premium paper quality, comfortable layout for reading.",
		features: ["Premium Paper", "Award Winning", "Bestseller Series", "Collector's Edition", "Easy Read Font"],
	},
	{
		id: 8,
		name: "Premium Coffee Beans",
		price: 129000,
		originalPrice: 179000,
		rating: 4.5,
		reviews: 234,
		image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=800&fit=crop",
		images: [
			"https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=800&fit=crop",
			"https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=800&fit=crop",
			"https://images.unsplash.com/photo-1497636577773-12398b0b5a99?w=800&h=800&fit=crop",
			"https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=800&fit=crop",
		],
		category: "Food",
		brand: "CoffeeHub",
		stock: 45,
		description: "Premium coffee beans perfectly roasted. Rich aroma and complex flavor for the best coffee experience.",
		features: ["Single Origin", "Medium Roast", "Rich Aroma", "Fair Trade", "Fresh Roasted"],
	},
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
	{ id: 1, user: "Andi S.", date: "15 Mar 2024", rating: 5, comment: "Produk sangat bagus, pengiriman cepat!", helpful: 12 },
	{ id: 2, user: "Budi W.", date: "10 Mar 2024", rating: 4, comment: "Kualitas baik, sesuai deskripsi.", helpful: 8 },
	{ id: 3, user: "Citra M.", date: "5 Mar 2024", rating: 5, comment: "Recommended seller! Akan beli lagi.", helpful: 15 },
	{ id: 4, user: "Dewi K.", date: "1 Mar 2024", rating: 5, comment: "Sangat puas dengan pembelian ini. Kualitas super!", helpful: 20 },
	{ id: 5, user: "Rudi H.", date: "28 Feb 2024", rating: 4, comment: "Bagus sekali, recomended untuk dibeli.", helpful: 6 },
];

const faqs = [
	{ question: "Apakah produk ini original?", answer: "Ya, kami menjamin 100% produk original dengan garansi resmi." },
	{ question: "Berapa lama pengiriman?", answer: " Pengiriman 2-5 hari kerja untuk area Jawa, 5-7 hari untuk luar Jawa." },
	{ question: "Apakah bisa retur?", answer: "Ya, 30 hari garansi pengembalian dengan syarat dan ketentuan." },
	{ question: "Cara pembayaran apa saja?", answer: "Transfer bank, GOPAY, OVO, dan Cicilan tanpa kartu." },
];

export default function ProductDetailPage() {
	const params = useParams();
	const productId = parseInt(params.id as string);
	const product = products.find((p) => p.id === productId) || products[0];

	const [quantity, setQuantity] = useState(1);
	const [selectedImage, setSelectedImage] = useState(0);
	const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews" | "faq">("description");
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

	const discount = Math.round((1 - product.price / product.originalPrice) * 100);

	const specs = [
		{ label: "Brand", value: product.brand, icon: Award },
		{ label: "Category", value: product.category, icon: Package },
		{ label: "Stock", value: `${product.stock} units`, icon: Package },
		{ label: "Weight", value: "250 gram", icon: Leaf },
		{ label: "Warranty", value: "12 months", icon: Shield },
	];

	const productImages = product.images || [product.image];

	return (
		<div className="min-h-screen bg-[#FAFAFA]">
			{/* Promo Banner */}
			<div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white py-2 overflow-hidden">
				<div className="flex animate-in whitespace-nowrap">
					<span className="mx-4">⚡ FLASH SALE - Up to 50% Off! • Free Shipping Above Rp 100rb • 30-Day Easy Return •</span>
					<span className="mx-4">⚡ FLASH SALE - Up to 50% Off! • Free Shipping Above Rp 100rb • 30-Day Easy Return •</span>
					<span className="mx-4">⚡ FLASH SALE - Up to 50% Off! • Free Shipping Above Rp 100rb • 30-Day Easy Return •</span>
				</div>
			</div>

			<header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b shadow-sm">
				<div className="max-w-7xl mx-auto px-4 py-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Button variant="ghost" size="icon-sm" asChild className="hover:bg-gray-100">
								<Link href="/">
									<ChevronRight className="size-5 rotate-180" />
								</Link>
							</Button>
							<Link href="/">
								<span className="text-xl font-bold text-gray-900">
									<span className="text-indigo-600">Shop</span>Co
								</span>
							</Link>
						</div>
						<div className="flex items-center gap-3">
							<Button variant="ghost" size="icon-sm" className="text-gray-600 hover:bg-gray-100">
								<Heart className="size-5" />
							</Button>
							<Button asChild variant="outline" size="icon-sm" className="relative hover:border-indigo-300 hover:text-indigo-600">
								<Link href="/cart">
									<ShoppingCart className="size-5" />
									<span className="absolute -top-1 -right-1 size-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-semibold">
										3
									</span>
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-4 py-6">
				{/* Breadcrumb */}
				<div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
					<Link href="/" className="hover:text-indigo-600 font-medium">Home</Link>
					<ChevronRight className="size-4" />
					<Link href="/" className="hover:text-indigo-600 font-medium">{product.category}</Link>
					<ChevronRight className="size-4" />
					<span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
				</div>

				{/* Main Content Grid */}
				<div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
					{/* Image Gallery */}
					<div className="space-y-4">
						<div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-lg">
							<Image 
								src={productImages[selectedImage]} 
								alt={product.name}
								fill
								className="object-cover"
								sizes="(max-width: 1024px) 100vw, 50vw"
								priority
							/>
							<div className="absolute left-4 top-4 flex flex-col gap-2">
								<div className="rounded-full bg-red-500 px-4 py-1.5 text-sm font-bold text-white shadow-lg shadow-red-500/30">
									-{discount}% OFF
								</div>
								<div className="rounded-full bg-indigo-600 px-4 py-1.5 text-sm font-bold text-white shadow-lg">
									Best Seller
								</div>
							</div>
							<div className="absolute right-4 top-4">
								<Button variant="secondary" size="icon" className="shadow-lg hover:bg-rose-500 hover:text-white">
									<Heart className="size-5" />
								</Button>
							</div>
						</div>
						<div className="flex gap-3 overflow-x-auto pb-2">
							{productImages.map((img, i) => (
								<button
									key={i}
									onClick={() => setSelectedImage(i)}
									className={`relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${
										selectedImage === i ? "border-indigo-600 ring-4 ring-indigo-100" : "border-gray-200 hover:border-gray-300"
									}`}
								>
									<Image 
										src={img} 
										alt={`${product.name} ${i + 1}`}
										fill
										className="object-cover"
										sizes="96px"
									/>
								</button>
							))}
						</div>
					</div>

					{/* Product Info */}
					<div className="space-y-5">
						<div>
							<div className="flex flex-wrap items-center gap-2 mb-3">
								<span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full">
									{product.brand}
								</span>
								<span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-full flex items-center gap-1">
									<span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
									In Stock
								</span>
								<span className="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-semibold rounded-full flex items-center gap-1">
									<Zap className="size-3" />
									Hot
								</span>
							</div>
							<h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
								{product.name}
							</h1>
							<div className="flex items-center gap-3 mt-3 flex-wrap">
								<div className="flex items-center gap-1">
									{[1, 2, 3, 4, 5].map((star) => (
										<Star
											key={star}
											className={`size-5 ${
												star <= Math.round(product.rating)
													? "fill-yellow-400 text-yellow-400"
													: "text-gray-300"
											}`}
										/>
									))}
								</div>
								<span className="font-semibold text-gray-900">{product.rating}</span>
								<span className="text-gray-400">|</span>
								<span className="text-gray-500">{product.reviews.toLocaleString()} reviews</span>
								<span className="text-gray-400">|</span>
								<span className="text-emerald-600 font-medium">{product.stock * 5}+ sold</span>
							</div>
						</div>

						{/* Price */}
						<div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
							<div className="flex items-baseline gap-3">
								<span className="text-3xl md:text-4xl font-bold text-gray-900">
									{formatPrice(product.price)}
								</span>
								<span className="text-lg text-gray-400 line-through">
									{formatPrice(product.originalPrice)}
								</span>
								<span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-bold rounded-full">
									Save {formatPrice(product.originalPrice - product.price)}
								</span>
							</div>
							<p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
								<Check className="size-4 text-emerald-500" />
								Price includes tax
							</p>
						</div>

						{/* Features Tags */}
						<div className="flex flex-wrap gap-2">
							{product.features?.slice(0, 4).map((feature, i) => (
								<span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full flex items-center gap-1">
									<Sparkles className="size-3 text-indigo-500" />
									{feature}
								</span>
							))}
						</div>

						{/* Quantity */}
						<div className="flex items-center gap-4">
							<span className="text-gray-600 font-medium">Quantity:</span>
							<div className="flex items-center border border-gray-200 rounded-full">
								<Button
									variant="ghost"
									size="icon-sm"
									className="h-10 w-10 rounded-full"
									onClick={() => setQuantity(Math.max(1, quantity - 1))}
								>
									<Minus className="size-4" />
								</Button>
								<span className="w-14 text-center font-semibold">{quantity}</span>
								<Button
									variant="ghost"
									size="icon-sm"
									className="h-10 w-10 rounded-full"
									onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
								>
									<Plus className="size-4" />
								</Button>
							</div>
							<span className="text-sm text-gray-500">
								{product.stock} units left
							</span>
						</div>

						{/* Action Buttons */}
						<div className="flex gap-3">
							<Button size="lg" asChild className="flex-1 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">
								<Link href="/cart">
									<ShoppingCart className="size-5 mr-2" />
									Add to Cart
								</Link>
							</Button>
							<Button size="lg" variant="outline" className="hover:border-rose-300 hover:text-rose-500">
								<Heart className="size-5" />
							</Button>
							<Button size="lg" variant="outline">
								<Share2 className="size-5" />
							</Button>
						</div>

						{/* Trust Badges */}
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-gray-100">
							<div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
								<Truck className="size-5 text-indigo-500" />
								<span>Free Shipping</span>
							</div>
							<div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
								<Shield className="size-5 text-indigo-500" />
								<span>12 Month Warranty</span>
							</div>
							<div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
								<RotateCcw className="size-5 text-indigo-500" />
								<span>30 Day Return</span>
							</div>
							<div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
								<BadgeCheck className="size-5 text-indigo-500" />
								<span>100% Original</span>
							</div>
						</div>

						{/* Delivery Info */}
						<div className="bg-indigo-50 rounded-xl p-4 space-y-3">
							<div className="flex items-center gap-3 text-sm">
								<Clock className="size-5 text-indigo-600" />
								<span className="text-gray-700">Estimasi arrive: <span className="font-semibold">2-4 hari</span></span>
							</div>
							<div className="flex items-center gap-3 text-sm">
								<Package className="size-5 text-indigo-600" />
								<span className="text-gray-700">Dikirim dari: <span className="font-semibold">Jakarta</span></span>
							</div>
							<div className="flex items-center gap-3 text-sm">
								<ThumbsUp className="size-5 text-indigo-600" />
								<span className="text-gray-700">95% reviewer merekomendasikan</span>
							</div>
						</div>
					</div>
				</div>

				{/* Tabs Section */}
				<div className="border border-gray-200 rounded-2xl bg-white shadow-sm mb-12">
					<div className="flex gap-1 border-b border-gray-200 overflow-x-auto p-2">
						<button
							onClick={() => setActiveTab("description")}
							className={`px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap rounded-lg ${
								activeTab === "description"
									? "border-indigo-600 text-indigo-600 bg-indigo-50"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
							}`}
						>
							<Sparkles className="size-4 inline mr-2" />
							Description
						</button>
						<button
							onClick={() => setActiveTab("specs")}
							className={`px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap rounded-lg ${
								activeTab === "specs"
									? "border-indigo-600 text-indigo-600 bg-indigo-50"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
							}`}
						>
							<Award className="size-4 inline mr-2" />
							Specifications
						</button>
						<button
							onClick={() => setActiveTab("reviews")}
							className={`px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap rounded-lg ${
								activeTab === "reviews"
									? "border-indigo-600 text-indigo-600 bg-indigo-50"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
							}`}
						>
							<MessageCircle className="size-4 inline mr-2" />
							Reviews ({product.reviews.toLocaleString()})
						</button>
						<button
							onClick={() => setActiveTab("faq")}
							className={`px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap rounded-lg ${
								activeTab === "faq"
									? "border-indigo-600 text-indigo-600 bg-indigo-50"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
							}`}
						>
							<Zap className="size-4 inline mr-2" />
							FAQ
						</button>
					</div>

					<div className="p-6">
						{activeTab === "description" && (
							<div className="space-y-6">
								<div className="prose prose-gray max-w-none">
									<p className="text-gray-600 leading-relaxed text-lg">
										{product.description}
									</p>
								</div>
								
								<div className="grid sm:grid-cols-2 gap-4">
									{product.features?.map((feature, i) => (
										<div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
											<div className="size-8 rounded-full bg-indigo-100 flex items-center justify-center">
												<Check className="size-4 text-indigo-600" />
											</div>
											<span className="font-medium text-gray-700">{feature}</span>
										</div>
									))}
								</div>

								<div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5">
									<h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
										<Eye className="size-5 text-indigo-600" />
										Why Choose This Product
									</h3>
									<ul className="space-y-2 text-gray-600">
										<li className="flex items-center gap-2">
											<Check className="size-4 text-emerald-500" />
											100% Original with official warranty
										</li>
										<li className="flex items-center gap-2">
											<Check className="size-4 text-emerald-500" />
											Premium quality materials
										</li>
										<li className="flex items-center gap-2">
											<Check className="size-4 text-emerald-500" />
											Best value for money
										</li>
										<li className="flex items-center gap-2">
											<Check className="size-4 text-emerald-500" />
											Fast shipping & secure packaging
										</li>
									</ul>
								</div>
							</div>
						)}

						{activeTab === "specs" && (
							<div className="grid sm:grid-cols-2 gap-4">
								{specs.map((spec) => {
									const Icon = spec.icon;
									return (
										<div
											key={spec.label}
											className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
										>
											<div className="size-12 rounded-xl bg-indigo-100 flex items-center justify-center">
												<Icon className="size-6 text-indigo-600" />
											</div>
											<div>
												<p className="font-medium text-gray-500 text-sm">{spec.label}</p>
												<p className="font-semibold text-gray-900">{spec.value}</p>
											</div>
										</div>
									);
								})}
							</div>
						)}

						{activeTab === "reviews" && (
							<div className="space-y-6">
								{/* Rating Summary */}
								<div className="flex items-center gap-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
									<div className="text-center">
										<div className="text-6xl font-bold text-gray-900">
											{product.rating}
										</div>
										<div className="flex items-center gap-0.5 mt-2 justify-center">
											{[1, 2, 3, 4, 5].map((star) => (
												<Star
													key={star}
													className={`size-6 ${
														star <= Math.round(product.rating)
															? "fill-yellow-400 text-yellow-400"
															: "text-gray-300"
													}`}
												/>
											))}
										</div>
										<p className="text-sm text-gray-500 mt-2">
											{product.reviews.toLocaleString()} reviews
										</p>
									</div>
									<div className="flex-1 space-y-2">
										{[5, 4, 3, 2, 1].map((star) => (
											<div key={star} className="flex items-center gap-2">
												<span className="text-xs text-gray-500 w-8">{star} ★</span>
												<div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
													<div 
														className="h-full bg-yellow-400 rounded-full" 
														style={{ width: star === 5 ? '70%' : star === 4 ? '20%' : star === 3 ? '7%' : '3%' }}
													/>
												</div>
											</div>
										))}
									</div>
								</div>

								{/* Review List */}
								<div className="space-y-4">
									{reviews.map((review) => (
										<div
											key={review.id}
											className="border border-gray-100 p-4 rounded-xl"
										>
											<div className="flex items-start gap-3 mb-3">
												<div className="size-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
													{review.user[0]}
												</div>
												<div className="flex-1">
													<div className="flex items-center gap-2">
														<span className="font-semibold">{review.user}</span>
														<span className="text-xs text-gray-400">{review.date}</span>
													</div>
													<div className="flex items-center gap-1">
														{[1, 2, 3, 4, 5].map((star) => (
															<Star
																key={star}
																className={`size-4 ${
															star <= review.rating
																? "fill-yellow-400 text-yellow-400"
																: "text-gray-300"
																}`}
															/>
														))}
													</div>
												</div>
											</div>
											<p className="text-gray-600 mb-3">{review.comment}</p>
											<div className="flex items-center gap-4 text-sm">
												<button className="text-gray-500 flex items-center gap-1 hover:text-indigo-600">
													<ThumbsUp className="size-4" />
													Helpful ({review.helpful})
												</button>
												<button className="text-gray-500 flex items-center gap-1 hover:text-indigo-600">
													<MessageCircle className="size-4" />
													Reply
												</button>
											</div>
										</div>
									))}
								</div>

								<Button variant="outline" className="w-full">
									View All Reviews
									<ArrowRight className="size-4 ml-2" />
								</Button>
							</div>
						)}

						{activeTab === "faq" && (
							<div className="space-y-4">
								{faqs.map((faq, i) => (
									<div
										key={i}
										className="border border-gray-100 p-4 rounded-xl"
									>
										<h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
											<Zap className="size-4 text-indigo-600" />
											{faq.question}
										</h4>
										<p className="text-gray-600">{faq.answer}</p>
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Related Products */}
				<div className="border-t border-gray-200 pt-8">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
							<Sparkles className="size-5 text-indigo-600" />
							Related Products
						</h2>
						<Button variant="link" className="text-indigo-600">
							View All
							<ArrowRight className="size-4 ml-1" />
						</Button>
					</div>
					<div className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-4">
						{relatedProducts.filter(p => p.id !== product.id).slice(0, 4).map((p) => (
							<Link key={p.id} href={`/product/${p.id}`}>
								<Card className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1">
									<div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
										<Image 
											src={p.image} 
											alt={p.name}
											fill
											className="object-cover transition-transform duration-500 group-hover:scale-105"
											sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
										/>
										<Button
											size="icon"
											variant="secondary"
											className="absolute right-3 top-3 shadow-lg transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-rose-500 hover:text-white"
										>
											<Heart className="size-4" />
										</Button>
										<div className="absolute left-3 top-3 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
											-{Math.round((1 - p.price / p.originalPrice) * 100)}%
										</div>
									</div>
									<CardContent className="flex flex-col gap-2 p-4">
										<h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{p.name}</h3>
										<div className="flex items-center gap-2">
											<span className="text-sm font-bold text-gray-900">{formatPrice(p.price)}</span>
											<span className="text-xs text-gray-400 line-through">{formatPrice(p.originalPrice)}</span>
										</div>
									</CardContent>
								</Card>
							</Link>
						))}
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
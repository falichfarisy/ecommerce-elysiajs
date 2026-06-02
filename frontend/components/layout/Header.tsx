"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
	ShoppingCart,
	Search,
	Menu,
	Heart,
	ChevronRight,
	User,
	Package,
	CreditCard,
	Headphones,
	HelpCircle,
	MapPin,
	LogOut,
	X,
	PackageCheck,
	Tag,
	Percent,
	Shield,
	MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getData } from "@/app/ApiConfig";

interface HeaderProps {
	onLoginClick?: () => void;
}

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

export default function Header({ onLoginClick }: HeaderProps) {
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

	return (
		<>
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
									<Button size="sm" className="flex-1 bg-indigo-600" onClick={() => { setIsMobileMenuOpen(false); onLoginClick?.(); }}>Sign In</Button>
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
											<Link href={`/category/${cat.name.toLowerCase()}`} className="flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(false)}>
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

			<header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-indigo-600 shadow-lg shadow-indigo-800/30" : "bg-indigo-600"}`}>
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between gap-4 lg:h-20">
						<div className="flex items-center gap-3">
							<Button variant="ghost" size="icon-sm" className="md:hidden hover:bg-white/20" onClick={() => setIsMobileMenuOpen(true)}>
								<Menu className="size-5 text-white" />
							</Button>
							<span className="text-2xl font-bold tracking-tight text-white lg:text-3xl">
								ShopCo
							</span>
						</div>

						<div className="hidden lg:flex flex-1 max-w-xl mx-8">
							<div className="flex w-full group rounded-lg bg-white text-black transition-all">
								<Input
									type="search"
									placeholder="Search for products, brands and more..."
									className="flex-1 rounded-l-lg rounded-r-none border-0 bg-transparent text-black placeholder-white/70 focus:ring-0"
								/>
								<Button className="rounded-l-none rounded-r-lg bg-transparent px-5 hover:bg-white/20 transition-colors text-black shrink-0" aria-label="Search">
									<Search className="size-5" />
								</Button>
							</div>
						</div>

						<div className="flex items-center gap-1 sm:gap-2">
							{!isLoading && isLoggedIn && (
								<>
									<Button variant="ghost" size="icon-sm" className="hidden md:flex text-white/80 hover:bg-white/20">
										<Heart className="size-5" />
									</Button>
									<Button variant="outline" size="icon-sm" className="relative border-white/40 text-white hover:border-white/70 hover:bg-white/20 transition-colors">
										<ShoppingCart className="size-5" />
										<span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
											3
										</span>
									</Button>
								</>
							)}
							<div className="ml-1 flex items-center gap-2">
								{!isLoading && isLoggedIn ? (
									<Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 border-white/40 text-white hover:bg-white/20">
										<User className="size-4" />
										Account
									</Button>
								) : !isLoading ? (
									<>
										<Button onClick={() => onLoginClick?.()} variant="outline" className="hidden sm:flex border-white/40 text-indigo-700 hover:bg-indigo-50">
											Sign In
										</Button>
										<Button asChild className="bg-white text-indigo-700 shadow-lg hover:bg-indigo-50">
											<Link href="/register">Join</Link>
										</Button>
									</>
								) : null}
							</div>
						</div>
					</div>

					<div className="mt-2 pb-4 lg:hidden">
						<div className="flex rounded-lg bg-white/30 backdrop-blur-sm ring-1 ring-white/40 has-focus:ring-white/70 has-focus:bg-white/40 transition-all">
							<Input
								type="search"
								placeholder="Search..."
								className="flex-1 rounded-l-lg rounded-r-none border-0 bg-transparent text-white placeholder-white/70 focus:ring-0"
							/>
							<Button className="rounded-l-none rounded-r-lg bg-transparent px-4 hover:bg-white/20 text-white shrink-0" aria-label="Search">
								<Search className="size-5" />
							</Button>
						</div>
					</div>
				</div>
			</header>
		</>
	);
}

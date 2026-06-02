"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Package, ShoppingBag, MapPin, Phone, Calendar, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Header from "@/components/layout/Header";
import { getData } from "@/app/ApiConfig";
import Skeleton from "@/components/ui/Skeleton";

interface OrderItem {
	id: number;
	productId: number;
	quantity: number;
	price: number;
}

interface Order {
	id: number;
	total: number;
	shippingAddress: string;
	phone: string;
	notes: string | null;
	status: string;
	createdAt: string;
}

interface OrderData {
	order: Order;
	item: OrderItem[];
}

const formatPrice = (price: number) => {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
	}).format(price);
};

const statusConfig: Record<string, { label: string; class: string }> = {
	pending: { label: "Menunggu Pembayaran", class: "bg-yellow-100 text-yellow-700" },
	paid: { label: "Dibayar", class: "bg-green-100 text-green-700" },
	shipped: { label: "Dikirim", class: "bg-blue-100 text-blue-700" },
	delivered: { label: "Selesai", class: "bg-gray-100 text-gray-700" },
	cancelled: { label: "Dibatalkan", class: "bg-red-100 text-red-700" },
};

export default function OrderConfirmationPage() {
	const params = useParams();
	const orderId = params.id as string;
	const [orderData, setOrderData] = useState<OrderData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchOrder = async () => {
			setIsLoading(true);
			try {
				const res = await getData(`/orders/${orderId}`);
				if (res?.success && res?.data) {
					setOrderData(res.data);
				} else {
					setError("Pesanan tidak ditemukan.");
				}
			} catch {
				setError("Gagal memuat detail pesanan.");
			} finally {
				setIsLoading(false);
			}
		};
		fetchOrder();
	}, [orderId]);

	const getStatusBadge = (status: string) => {
		const config = statusConfig[status] || { label: status, class: "bg-gray-100 text-gray-700" };
		return (
			<span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.class}`}>
				<CheckCircle className="size-4" />
				{config.label}
			</span>
		);
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-[#FAFAFA]">
				<Header />
				<main className="max-w-3xl mx-auto px-4 py-8">
					<Skeleton className="h-8 w-48 mb-8" />
					<Skeleton className="h-64 rounded-2xl mb-6" />
					<Skeleton className="h-48 rounded-2xl" />
				</main>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-[#FAFAFA]">
				<Header />
				<main className="max-w-3xl mx-auto px-4 py-16 text-center">
					<div className="size-24 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
						<Package className="size-12 text-red-400" />
					</div>
					<h2 className="text-xl font-semibold text-gray-900 mb-2">Pesanan Tidak Ditemukan</h2>
					<p className="text-gray-500 mb-6">{error}</p>
					<div className="flex gap-3 justify-center">
						<Button asChild variant="outline">
							<Link href="/cart">Kembali ke Keranjang</Link>
						</Button>
						<Button asChild className="bg-indigo-600 hover:bg-indigo-700">
							<Link href="/">Belanja Lagi</Link>
						</Button>
					</div>
				</main>
			</div>
		);
	}

	if (!orderData) return null;

	const { order, item } = orderData;
	const itemTotal = item.reduce((sum, i) => sum + i.price * i.quantity, 0);

	return (
		<div className="min-h-screen bg-[#FAFAFA]">
			<Header />

			<main className="max-w-3xl mx-auto px-4 py-8">
				<div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
					<Link href="/" className="hover:text-indigo-600">Home</Link>
					<ChevronRight className="size-4" />
					<Link href="/cart" className="hover:text-indigo-600">Cart</Link>
					<ChevronRight className="size-4" />
					<span className="text-gray-900 font-medium">Order #{order.id}</span>
				</div>

				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
					<div className="flex items-center justify-between mb-6">
						<div>
							<h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
								<Package className="size-7 text-indigo-600" />
								Pesanan Berhasil!
							</h1>
							<p className="text-gray-500 mt-1">Terima kasih, pesanan Anda telah diterima.</p>
						</div>
						{getStatusBadge(order.status)}
					</div>

					<div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl mb-6">
						<div className="flex items-center gap-2 text-sm text-gray-600">
							<Package className="size-4 text-indigo-500" />
							<span>Order #: <strong>{order.id}</strong></span>
						</div>
						<div className="flex items-center gap-2 text-sm text-gray-600">
							<Calendar className="size-4 text-indigo-500" />
							<span>{new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "short" }).format(new Date(order.createdAt))}</span>
						</div>
						<div className="flex items-center gap-2 text-sm text-gray-600">
							<MapPin className="size-4 text-indigo-500" />
							<span className="truncate">{order.shippingAddress}</span>
						</div>
						<div className="flex items-center gap-2 text-sm text-gray-600">
							<Phone className="size-4 text-indigo-500" />
							<span>{order.phone}</span>
						</div>
					</div>

					<h2 className="font-bold text-gray-900 mb-4">Item Pesanan</h2>
					<div className="space-y-3">
						{item.map((i) => (
							<div key={i.id} className="flex justify-between items-center py-2 border-b last:border-0">
								<div>
									<span className="text-gray-900 font-medium">Product #{i.productId}</span>
									<span className="text-gray-400 ml-2">x{i.quantity}</span>
								</div>
								<span className="font-medium">{formatPrice(i.price * i.quantity)}</span>
							</div>
						))}
					</div>

					<div className="border-t mt-4 pt-4 flex justify-between">
						<span className="font-bold text-gray-900 text-lg">Total</span>
						<span className="text-xl font-bold text-indigo-600">{formatPrice(order.total)}</span>
					</div>
				</div>

				{order.notes && (
					<div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
						<p className="text-sm text-blue-700">
							<span className="font-semibold">Catatan:</span> {order.notes}
						</p>
					</div>
				)}

				<div className="text-center">
					<Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">
						<Link href="/">
							<ShoppingBag className="size-5 mr-2" />
							Lanjut Belanja
						</Link>
					</Button>
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

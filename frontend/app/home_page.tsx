"use client";

// import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
// import {
// 	DropdownMenu,
// 	DropdownMenuTrigger,
// 	DropdownMenuContent,
// 	DropdownMenuGroup,
// } from "@/components/ui/dropdown-menu";
import { ShoppingCart } from "lucide-react";
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function HomePage() {
	return (
		<div className="min-h-screen flex flex-col items-center bg-gray-50">
			<div className="w-full h-full border p-4 flex flex-row items-center gap-4">
				<span className="text-xl font-semibold">E-commerce</span>
				{/* <div className="relative group">
					<Button>Kategori</Button>

					<div className="fixed mt-7 left-0 hidden group-hover:block bg-black opacity-50 h-full shadow-lg w-full">
						<div className="bg-white h-1/3 px-8 py-4 flex flex-col">
							<ToggleGroup
								type="single"
								size={"sm"}
								defaultValue="top"
								variant={"outline"}
								spacing={4}>
								<ToggleGroupItem
									value="belanja"
									aria-label="Toggle top">
									Belanja
								</ToggleGroupItem>
								<ToggleGroupItem
									value="featured"
									aria-label="Toggle bottom">
									Featured
								</ToggleGroupItem>
								<ToggleGroupItem
									value="kebutuhan-harian"
									aria-label="Toggle left">
									Kebutuhan Harian
								</ToggleGroupItem>
								<ToggleGroupItem
									value="tagihan"
									aria-label="Toggle right">
									Tagihan
								</ToggleGroupItem>
							</ToggleGroup>
						</div>
					</div>
				</div> */}
				<Field orientation="horizontal">
					<Input
						type="search"
						placeholder="Search..."
					/>
					<Button>Search</Button>

					<div className="mx-8">
						<Button
							variant={"outline"}
							size={"icon"}>
							<ShoppingCart />
						</Button>
					</div>
					<div className="border h-8 mx-3"></div>
					<Button variant={"outline"}>Masuk</Button>
					<Button>Daftar</Button>
				</Field>
			</div>
			<div className="h-full w-full flex justify-center items-center py-10">
				<div className="w-1/2">
					<Carousel className="w-full max-w-48 sm:max-w-xs">
						<CarouselContent>
							{Array.from({ length: 5 }).map((_, index) => (
								<CarouselItem key={index}>
									<div className="p-1">
										<Card>
											<CardContent className="flex aspect-square items-center justify-center p-6">
												<span className="text-4xl font-semibold">{index + 1}</span>
											</CardContent>
										</Card>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious />
						<CarouselNext />
					</Carousel>
				</div>
			</div>
		</div>
	);
}

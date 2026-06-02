import { cn } from "@/lib/Utils";

interface SkeletonProps {
	className?: string;
}

export default function Skeleton({ className }: SkeletonProps) {
	return (
		<div className={cn("animate-pulse rounded bg-gray-200", className)} />
	);
}

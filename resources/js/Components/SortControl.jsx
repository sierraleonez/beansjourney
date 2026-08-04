import { router } from "@inertiajs/react";
import { cn } from "../lib/utils";

/**
 * Single-select sort control backed by the `sort` query param (deep-linkable).
 */
export default function SortControl({
	param = "sort",
	value,
	options,
	className,
	label = "Urutkan",
}) {
	const setSort = (next) => {
		const url = new URL(window.location.href);
		url.searchParams.set(param, next);
		url.searchParams.delete("page");
		router.visit(`${url.pathname}${url.search}`, { preserveScroll: true });
	};

	return (
		<div className={cn("flex items-center gap-2", className)}>
			<span className="text-[12px] font-semibold text-mocha">{label}</span>
			<div role="group" aria-label={label} className="flex flex-wrap gap-1">
				{options.map((option) => (
					<button
						key={option.value}
						type="button"
						onClick={() => setSort(option.value)}
						aria-pressed={value === option.value}
						className={cn(
							"rounded-full border px-3 py-1 text-[12px] font-semibold transition-colors",
							value === option.value
								? "border-caramel bg-caramel text-white"
								: "border-line bg-white text-mocha hover:border-brown hover:text-brown",
						)}
					>
						{option.label}
					</button>
				))}
			</div>
		</div>
	);
}

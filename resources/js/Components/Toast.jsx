import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { cn } from "../lib/utils";

/** Flash-message toast, announced via aria-live. */
export default function Toast() {
	const { flash } = usePage().props;
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (flash?.message) {
			setVisible(true);
			const timer = setTimeout(() => setVisible(false), 4000);

			return () => clearTimeout(timer);
		}
	}, [flash]);

	if (!visible || !flash?.message) return null;

	return (
		<div
			role="status"
			aria-live="polite"
			className={cn(
				"fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg px-5 py-3 text-sm font-semibold shadow-card-hover",
				flash.type === "success"
					? "bg-success text-white"
					: "bg-error text-white",
			)}
		>
			{flash.message}
		</div>
	);
}

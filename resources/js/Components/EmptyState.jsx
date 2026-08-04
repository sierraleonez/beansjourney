import { cn } from "../lib/utils";

export default function EmptyState({
	title,
	message,
	children,
	icon = "☕",
	className,
}) {
	return (
		<div
			className={cn(
				"card-surface flex flex-col items-center px-6 py-12 text-center",
				className,
			)}
		>
			<span aria-hidden="true" className="text-4xl">
				{icon}
			</span>
			<h3 className="mt-4 text-[22px]">{title}</h3>
			{message && <p className="mt-2 max-w-sm text-sm text-mocha">{message}</p>}
			{children && <div className="mt-5">{children}</div>}
		</div>
	);
}

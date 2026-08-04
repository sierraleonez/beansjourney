import { useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * Accessible overlay: closes on Escape and backdrop click. Used for the mobile nav drawer
 * and the account-deletion confirmation. Rendered via a portal to `document.body` so it can
 * never get trapped inside an ancestor's stacking context (e.g. the sticky, z-indexed
 * header) — a `position: fixed` descendant of a `position: sticky` + `z-index` element only
 * stacks within that ancestor's own context, which is what caused the drawer to render
 * underneath the page on mobile.
 */
export default function Modal({
	open,
	onClose,
	title,
	labelledBy,
	children,
	wide = false,
}) {
	useEffect(() => {
		if (!open) return undefined;
		const onKey = (event) => {
			if (event.key === "Escape") onClose();
		};
		document.addEventListener("keydown", onKey);
		document.body.style.overflow = "hidden";

		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = "";
		};
	}, [open, onClose]);

	if (!open) return null;

	return createPortal(
		<div
			className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-espresso/40 p-4 backdrop-blur-sm"
			onMouseDown={(event) => {
				if (event.target === event.currentTarget) onClose();
			}}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby={labelledBy}
				className={`mt-10 w-full ${wide ? "max-w-2xl" : "max-w-sm"} rounded-2xl bg-white p-8 shadow-modal`}
			>
				<div className="mb-4 flex items-center justify-between">
					<h2 id={labelledBy} className="text-[22px]">
						{title}
					</h2>
					<button
						type="button"
						onClick={onClose}
						aria-label="Tutup dialog"
						className="btn-icon"
					>
						<svg
							aria-hidden="true"
							viewBox="0 0 20 20"
							fill="currentColor"
							className="h-5 w-5"
						>
							<path
								fillRule="evenodd"
								d="M6.3 5.3a1 1 0 0 0-1.4 1.4L8.6 10l-3.7 3.3a1 1 0 1 0 1.4 1.4L10 11.4l3.7 3.3a1 1 0 0 0 1.4-1.4L11.4 10l3.7-3.3a1 1 0 0 0-1.4-1.4L10 8.6 6.3 5.3z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
				</div>
				{children}
			</div>
		</div>,
		document.body,
	);
}

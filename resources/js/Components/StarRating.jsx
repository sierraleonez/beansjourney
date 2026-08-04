import { useState } from "react";
import { cn } from "../lib/utils";

const labels = ["Kurang", "Cukup", "Bagus", "Sangat Bagus", "Luar Biasa"];

function Star({ filled, onClick, onHover, onLeave, active, readOnly }) {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 20 20"
			fill="currentColor"
			className={cn(
				"h-5 w-5",
				filled ? "text-caramel" : "text-line",
				!readOnly && "cursor-pointer transition-transform hover:scale-110",
			)}
			onClick={onClick}
			onMouseEnter={onHover}
			onMouseLeave={onLeave}
		>
			<path d="M10 1.5l2.47 5.31 5.83.73-4.3 4.02 1.15 5.77L10 14.5l-5.15 2.83 1.15-5.77-4.3-4.02 5.83-.73L10 1.5z" />
		</svg>
	);
}

/** Read-only rating display. */
export function StarRating({ rating, className }) {
	return (
		<span
			className={cn("inline-flex items-center gap-0.5", className)}
			aria-label={`Dinilai ${rating} dari 5`}
			role="img"
		>
			{[1, 2, 3, 4, 5].map((value) => (
				<Star key={value} filled={value <= Math.round(rating)} readOnly />
			))}
		</span>
	);
}

/** Keyboard-operable radio-group star picker (EXPERIENCE.md accessibility floor). */
export function StarRatingInput({ value, onChange, id, disabled }) {
	const [preview, setPreview] = useState(null);
	const active = preview ?? value ?? 0;

	const pick = (rating) => {
		onChange?.(rating);
	};

	return (
		<div>
			<div
				role="radiogroup"
				aria-label="Penilaian"
				className="inline-flex items-center gap-0.5"
				onMouseLeave={() => setPreview(null)}
			>
				{[1, 2, 3, 4, 5].map((value) => (
					<span key={value} className="relative">
						<input
							type="radio"
							id={`${id}-${value}`}
							name={id}
							className="peer sr-only"
							checked={active === value}
							disabled={disabled}
							onChange={() => pick(value)}
							onFocus={() => setPreview(value)}
							onBlur={() => setPreview(null)}
						/>
						<label
							htmlFor={`${id}-${value}`}
							className="block cursor-pointer"
							onMouseEnter={() => setPreview(value)}
						>
							<Star
								filled={value <= active}
								onClick={() => pick(value)}
								readOnly={disabled}
							/>
						</label>
					</span>
				))}
			</div>
			<p
				className="mt-1 text-[12px] font-medium text-caramel"
				aria-live="polite"
			>
				{labels[active - 1]}
			</p>
		</div>
	);
}

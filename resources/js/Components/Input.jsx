import { forwardRef } from "react";
import { cn } from "../lib/utils";

const Input = forwardRef(function Input(
	{ label, error, hint, id, className, ...props },
	ref,
) {
	const inputId = id ?? props.name;

	return (
		<div className="space-y-1.5">
			{label && (
				<label
					htmlFor={inputId}
					className="block text-[12.5px] font-semibold text-espresso"
				>
					{label}
				</label>
			)}
			<input
				ref={ref}
				id={inputId}
				className={cn("input-field", error && "border-error", className)}
				{...props}
			/>
			{hint && !error && <p className="text-[12px] text-mocha">{hint}</p>}
			{error && (
				<p className="text-[12px] font-medium text-error" role="alert">
					{error}
				</p>
			)}
		</div>
	);
});

export default Input;

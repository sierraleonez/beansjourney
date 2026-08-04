export default function Avatar({ name, size = 40, className }) {
	const initials = (name || "?")
		.split(" ")
		.map((part) => part[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();

	return (
		<span
			aria-hidden="true"
			className={`inline-flex shrink-0 items-center justify-center rounded-full border-2 border-line bg-card font-display font-bold text-brown ${className ?? ""}`}
			style={{ width: size, height: size, fontSize: size * 0.4 }}
		>
			{initials}
		</span>
	);
}

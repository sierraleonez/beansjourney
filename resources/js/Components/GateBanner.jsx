import { router } from "@inertiajs/react";
import { login } from "../routes";
import verification from "../routes/verification";

/**
 * Dark gradient banner that replaces write forms for guests / unverified users
 * (EXPERIENCE.md: brown→espresso gradient, caramel CTA).
 */
export default function GateBanner({
	action,
	message,
	cta,
	redirectTo,
	variant = "guest",
}) {
	const go = () => {
		const target =
			redirectTo === "verification.notice" ? verification.notice : login;
		router.visit(target.url({ query: { redirect: window.location.href } }));
	};

	const ctaLabel =
		variant === "guest" ? (cta ?? "Masuk") : (cta ?? "Verifikasi email");

	return (
		<section
			aria-label={action}
			className="rounded-lg bg-gradient-to-br from-brown to-espresso px-6 py-8 text-center"
		>
			<h3 className="text-display-sm text-bg">{action}</h3>
			<p className="mx-auto mt-2 max-w-md text-[13.5px] text-bg/80">
				{message}
			</p>
			<button
				type="button"
				onClick={go}
				className="btn-primary mt-5 bg-caramel hover:bg-caramel-hover"
			>
				{ctaLabel}
			</button>
		</section>
	);
}

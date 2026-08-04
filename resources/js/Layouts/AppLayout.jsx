import BrandHeader from "../Components/BrandHeader";
import Toast from "../Components/Toast";

export default function AppLayout({ children }) {
	return (
		<div className="flex min-h-screen flex-col">
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-caramel focus:px-4 focus:py-2 focus:text-white"
			>
				Lompat ke konten
			</a>
			<BrandHeader />
			<main
				id="main-content"
				className="mx-auto w-full max-w-[1728px] flex-1 px-4 pb-16 md:px-7 lg:px-12"
			>
				{children}
			</main>
			<footer className="border-t border-line bg-card/50">
				<div className="mx-auto flex max-w-[1728px] flex-col items-center justify-between gap-2 px-4 py-6 text-[12px] text-mocha sm:flex-row md:px-7 lg:px-12">
					<span>
						© {new Date().getFullYear()} BeansJourney — rumah bagi pencinta kopi
						specialty
					</span>
					<span>
						Bagikan ulasan. Temukan racikan yang paling cocok untuk bean-mu.
					</span>
				</div>
			</footer>
			<Toast />
		</div>
	);
}

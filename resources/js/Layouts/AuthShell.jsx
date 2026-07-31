import Logo from '../Components/Logo';
import Card from '../Components/Card';

/**
 * Minimal layout for auth screens (login/register/reset/verify) — no main
 * header, matching the mockups' overlay-modals anatomy: brand lockup, card, footer.
 */
export default function AuthShell({ children, eyebrow, title, subtitle, footer }) {
    return (
        <div className="flex min-h-screen flex-col bg-bg">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-caramel focus:px-4 focus:py-2 focus:text-white"
            >
                Lompat ke konten
            </a>
            <main id="main-content" className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10">
                <div className="mb-6 flex justify-center">
                    <Logo textClass="text-espresso" />
                </div>
                <Card className="p-6 sm:p-8">
                    <div className="mb-6 text-center">
                        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
                        <h1 className="mt-1 text-[26px]">{title}</h1>
                        {subtitle && <p className="mt-1.5 text-[13px] text-mocha">{subtitle}</p>}
                    </div>
                    {children}
                </Card>
                {footer && <div className="mt-5 text-center text-[13px] text-mocha">{footer}</div>}
            </main>
        </div>
    );
}

import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import Logo from './Logo';
import Avatar from './Avatar';
import Modal from './Modal';
import { cn } from '../lib/utils';

const navLinks = [
    { href: '/', label: 'Discover' },
    { href: '/roasters', label: 'Roasters' },
];

export default function BrandHeader() {
    const { auth } = usePage().props;
    const [menuOpen, setMenuOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const currentPath = window.location.pathname;

    return (
        <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-[1728px] items-center justify-between gap-4 px-4 md:px-7 lg:px-12">
                <div className="flex items-center gap-6">
                    <Link href="/" aria-label="BeansJourney home">
                        <Logo />
                    </Link>
                    <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                    currentPath.startsWith(link.href)
                                        ? 'text-espresso'
                                        : 'text-mocha hover:text-brown',
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-2">
                    {auth.user ? (
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setMenuOpen((open) => !open)}
                                className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-card"
                                aria-expanded={menuOpen}
                                aria-haspopup="menu"
                            >
                                <Avatar name={auth.user.name} size={32} />
                                <span className="hidden max-w-[140px] truncate text-sm font-semibold sm:block">
                                    {auth.user.name}
                                </span>
                                <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-mocha">
                                    <path
                                        fillRule="evenodd"
                                        d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                            {menuOpen && (
                                <div
                                    role="menu"
                                    className="card-surface absolute right-0 mt-2 w-52 overflow-hidden p-1.5"
                                >
                                    <Link
                                        href={route('profile.edit')}
                                        role="menuitem"
                                        onClick={() => setMenuOpen(false)}
                                        className="block rounded-md px-3 py-2 text-sm text-espresso hover:bg-card"
                                    >
                                        Profile settings
                                    </Link>
                                    {auth.user.role === 'admin' && (
                                        <a
                                            href="/admin"
                                            role="menuitem"
                                            onClick={() => setMenuOpen(false)}
                                            className="block rounded-md px-3 py-2 text-sm text-espresso hover:bg-card"
                                        >
                                            Admin panel
                                        </a>
                                    )}
                                    <button
                                        type="button"
                                        role="menuitem"
                                        onClick={() => {
                                            setMenuOpen(false);
                                            router.post(route('logout'));
                                        }}
                                        className="block w-full rounded-md px-3 py-2 text-left text-sm text-error hover:bg-card"
                                    >
                                        Log out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="hidden items-center gap-2 sm:flex">
                            <Link href={route('login')} className="btn-ghost">
                                Log In
                            </Link>
                            <Link href={route('register')} className="btn-primary">
                                Join Free
                            </Link>
                        </div>
                    )}

                    <button
                        type="button"
                        className="btn-icon md:hidden"
                        onClick={() => setDrawerOpen(true)}
                        aria-label="Open menu"
                    >
                        <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                            <path fillRule="evenodd" d="M3 5a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zm0 5a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zm0 5a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>

            <Modal
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title="Menu"
                labelledBy="mobile-nav-title"
            >
                <div className="flex flex-col gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setDrawerOpen(false)}
                            className="rounded-md px-3 py-2.5 text-sm font-semibold text-espresso hover:bg-card"
                        >
                            {link.label}
                        </Link>
                    ))}
                    {!auth.user && (
                        <div className="mt-4 flex flex-col gap-2">
                            <Link href={route('login')} className="btn-ghost" onClick={() => setDrawerOpen(false)}>
                                Log In
                            </Link>
                            <Link href={route('register')} className="btn-primary" onClick={() => setDrawerOpen(false)}>
                                Join Free
                            </Link>
                        </div>
                    )}
                </div>
            </Modal>
        </header>
    );
}

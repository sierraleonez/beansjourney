import { useEffect, useRef, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import BeanCard from '../Components/BeanCard';
import SortControl from '../Components/SortControl';
import LoadMore from '../Components/LoadMore';
import EmptyState from '../Components/EmptyState';
import Card from '../Components/Card';

export default function Discover({ beans, sort, search, roasters, stats }) {
    const { auth } = usePage().props;
    const [query, setQuery] = useState(search ?? '');
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            const url = new URL(window.location.href);
            if (query) {
                url.searchParams.set('q', query);
            } else {
                url.searchParams.delete('q');
            }
            url.searchParams.delete('page');
            router.visit(`${url.pathname}${url.search}`, { preserveScroll: true, preserveState: true, replace: true });
        }, 350);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    return (
        <AppLayout>
            <section className="py-10 lg:py-14">
                <h1 className="max-w-2xl text-display">Rumah bagi pencinta kopi specialty</h1>
                <p className="mt-3 max-w-xl text-[15px] text-mocha">
                    Bagaimana rasa bean ini menurutmu? Bagikan metode seduh, catatan rasa, ukuran gilingan — dan temukan
                    resep yang paling cocok untuk bean-nya sebelum kamu membeli.
                </p>

                <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {[
                        ['Bean', stats.beans],
                        ['Ulasan', stats.reviews],
                        ['Resep', stats.recipes],
                        ['Pencinta kopi', stats.users],
                    ].map(([label, value]) => (
                        <div key={label} className="card-surface px-4 py-3 text-center">
                            <dt className="eyebrow">{label}</dt>
                            <dd className="mt-1 font-display text-[22px] font-bold">{value}</dd>
                        </div>
                    ))}
                </dl>

                <div className="mt-8 max-w-xl">
                    <label htmlFor="bean-search" className="sr-only">
                        Cari bean
                    </label>
                    <div className="relative">
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mocha"
                        >
                            <path
                                fillRule="evenodd"
                                d="M9 3.5a5.5 5.5 0 1 0 3.48 9.76l3.13 3.13a.75.75 0 1 0 1.06-1.06l-3.13-3.13A5.5 5.5 0 0 0 9 3.5ZM5 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <input
                            id="bean-search"
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Cari bean berdasarkan nama, asal, atau roastery…"
                            className="input-field pl-10"
                        />
                    </div>
                </div>
            </section>

            <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
                <section>
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-[22px]">Jelajahi bean</h2>
                        <SortControl
                            value={sort}
                            options={[
                                { value: 'newest', label: 'Terbaru' },
                                { value: 'top', label: 'Rating tertinggi' },
                                { value: 'name', label: 'Nama' },
                            ]}
                        />
                    </div>

                    {beans.data.length === 0 ? (
                        <EmptyState
                            title={search ? 'Tidak ada bean yang cocok dengan pencarianmu' : 'Belum ada bean'}
                            message={
                                search
                                    ? `Tidak ada yang cocok dengan "${search}". Coba nama, asal, atau roastery lain.`
                                    : 'Katalog ini baru saja dimulai. Jadilah yang pertama membagikan bean yang pernah kamu coba.'
                            }
                        />
                    ) : (
                        <>
                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {beans.data.map((bean) => (
                                    <BeanCard key={bean.id} bean={bean} />
                                ))}
                            </div>
                            <div className="mt-8">
                                <LoadMore nextPageUrl={beans.next_page_url} />
                            </div>
                        </>
                    )}
                </section>

                <aside className="space-y-5">
                    <div className="rounded-lg bg-gradient-to-br from-brown to-espresso p-6 text-center">
                        <h3 className="text-[20px] text-bg">Pernah coba bean yang layak diceritakan?</h3>
                        <p className="mt-2 text-[13px] text-bg/80">
                            Bagikan ulasan, resep, atau keduanya. Komunitas menyeduh lebih baik lewat catatanmu.
                        </p>
                        {auth.user ? (
                            auth.user.email_verified_at ? (
                                <Link href={route('beans.create')} className="btn-primary mt-5">
                                    Tambahkan Bean
                                </Link>
                            ) : (
                                <Link href={route('verification.notice')} className="btn-primary mt-5">
                                    Verifikasi emailmu
                                </Link>
                            )
                        ) : (
                            <Link href={route('register')} className="btn-primary mt-5">
                                Gabung Gratis
                            </Link>
                        )}
                    </div>

                    <Card className="p-5">
                        <h3 className="text-[17px]">Roaster teratas</h3>
                        <ul className="mt-3 divide-y divide-line">
                            {roasters.map((roastery) => (
                                <li key={roastery.id}>
                                    <Link
                                        href={route('roasteries.show', roastery.id)}
                                        className="flex items-center justify-between gap-2 py-2.5 hover:text-brown"
                                    >
                                        <span className="text-sm font-semibold">{roastery.name}</span>
                                        <span className="text-[12px] text-mocha">{roastery.beans_count} bean</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </aside>
            </div>
        </AppLayout>
    );
}

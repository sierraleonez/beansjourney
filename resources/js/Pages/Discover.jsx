import { Link, usePage } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import BeanCard from '../Components/BeanCard';
import SortControl from '../Components/SortControl';
import LoadMore from '../Components/LoadMore';
import EmptyState from '../Components/EmptyState';
import Card from '../Components/Card';

export default function Discover({ beans, sort, roasters, stats }) {
    const { auth } = usePage().props;

    return (
        <AppLayout>
            <section className="py-10 lg:py-14">
                <h1 className="max-w-2xl text-display">The home for specialty coffee lovers</h1>
                <p className="mt-3 max-w-xl text-[15px] text-mocha">
                    How did this bean taste to you? Share your brewing method, tasting notes, grind setting — and find
                    the recipe that suits the bean before you buy.
                </p>

                <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {[
                        ['Beans', stats.beans],
                        ['Reviews', stats.reviews],
                        ['Recipes', stats.recipes],
                        ['Coffee lovers', stats.users],
                    ].map(([label, value]) => (
                        <div key={label} className="card-surface px-4 py-3 text-center">
                            <dt className="eyebrow">{label}</dt>
                            <dd className="mt-1 font-display text-[22px] font-bold">{value}</dd>
                        </div>
                    ))}
                </dl>
            </section>

            <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
                <section>
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-[22px]">Discover beans</h2>
                        <SortControl
                            value={sort}
                            options={[
                                { value: 'newest', label: 'Newest' },
                                { value: 'top', label: 'Top rated' },
                                { value: 'name', label: 'Name' },
                            ]}
                        />
                    </div>

                    {beans.data.length === 0 ? (
                        <EmptyState
                            title="No beans yet"
                            message="The catalog is just getting started. Be the first to share a bean you've tried."
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
                        <h3 className="text-[20px] text-bg">Tried a bean worth shouting about?</h3>
                        <p className="mt-2 text-[13px] text-bg/80">
                            Share a review, a recipe, or both. The community brews better with your notes.
                        </p>
                        {auth.user ? (
                            auth.user.email_verified_at ? (
                                <Link href={route('beans.create')} className="btn-primary mt-5">
                                    Submit a Bean
                                </Link>
                            ) : (
                                <Link href={route('verification.notice')} className="btn-primary mt-5">
                                    Verify your email
                                </Link>
                            )
                        ) : (
                            <Link href={route('register')} className="btn-primary mt-5">
                                Join Free
                            </Link>
                        )}
                    </div>

                    <Card className="p-5">
                        <h3 className="text-[17px]">Top roasters</h3>
                        <ul className="mt-3 divide-y divide-line">
                            {roasters.map((roastery) => (
                                <li key={roastery.id}>
                                    <Link
                                        href={route('roasteries.show', roastery.id)}
                                        className="flex items-center justify-between gap-2 py-2.5 hover:text-brown"
                                    >
                                        <span className="text-sm font-semibold">{roastery.name}</span>
                                        <span className="text-[12px] text-mocha">{roastery.beans_count} beans</span>
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

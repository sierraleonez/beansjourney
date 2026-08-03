import { Link, usePage } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import BeanCard from '../../Components/BeanCard';
import Card from '../../Components/Card';
import EmptyState from '../../Components/EmptyState';
import LoadMore from '../../Components/LoadMore';
import Pill from '../../Components/Pill';

export default function RoasteryShow({ roastery, beans }) {
    const social = roastery.social ?? {};
    const { auth } = usePage().props;
    const canEdit = auth.user && (auth.user.role === 'admin' || auth.user.id === roastery.created_by);

    return (
        <AppLayout>
            <nav aria-label="Navigasi breadcrumb" className="pt-6">
                <ol className="flex items-center gap-1.5 text-[12px] text-mocha">
                    <li>
                        <Link href="/roasters" className="hover:text-brown">Roaster</Link>
                    </li>
                    <li aria-hidden="true">›</li>
                    <li aria-current="page" className="font-semibold text-espresso">{roastery.name}</li>
                </ol>
            </nav>

            <section className="py-8">
                <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
                    <div>
                        <h1 className="text-display">{roastery.name}</h1>
                        <p className="mt-3 max-w-xl text-[15px] text-mocha">
                            Semua bean dari roastery ini, dalam satu tempat. Ulasan dan resep dari komunitas, supaya
                            kamu bisa menilai sebelum membeli.
                        </p>

                        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
                            {beans.data.map((bean) => (
                                <BeanCard key={bean.id} bean={bean} />
                            ))}
                        </div>
                        <div className="mt-8">
                            <LoadMore nextPageUrl={beans.next_page_url} />
                        </div>
                    </div>

                    <Card className="h-fit p-5">
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="text-[17px]">Tentang roastery</h2>
                            {canEdit && (
                                <Link
                                    href={route('roasteries.edit', roastery.id)}
                                    className="text-[12.5px] font-semibold text-brown hover:text-caramel"
                                >
                                    Edit info roastery
                                </Link>
                            )}
                        </div>
                        <dl className="mt-3 space-y-3 text-sm">
                            {roastery.location && (
                                <div>
                                    <dt className="eyebrow">Lokasi</dt>
                                    <dd className="mt-0.5 text-espresso">{roastery.location}</dd>
                                </div>
                            )}
                            {roastery.contact && (
                                <div>
                                    <dt className="eyebrow">Kontak</dt>
                                    <dd className="mt-0.5 text-espresso">{roastery.contact}</dd>
                                </div>
                            )}
                            {Object.keys(social).length > 0 && (
                                <div>
                                    <dt className="eyebrow">Sosial</dt>
                                    <dd className="mt-1 flex flex-wrap gap-2">
                                        {Object.entries(social).map(([network, handle]) => (
                                            <Pill key={network} variant="neutral">
                                                {network}: {handle}
                                            </Pill>
                                        ))}
                                    </dd>
                                </div>
                            )}
                            <div>
                                <dt className="eyebrow">Katalog</dt>
                                <dd className="mt-0.5 text-espresso">
                                    {beans.total} bean
                                </dd>
                            </div>
                        </dl>
                    </Card>
                </div>
            </section>
        </AppLayout>
    );
}

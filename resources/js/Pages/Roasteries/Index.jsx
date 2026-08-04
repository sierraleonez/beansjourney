import { Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Card from '../../Components/Card';
import EmptyState from '../../Components/EmptyState';
import LoadMore from '../../Components/LoadMore';
import Pill from '../../Components/Pill';
import roasteryRoutes from '../../routes/roasteries';

export default function RoasteryIndex({ roasteries }) {
    return (
        <AppLayout>
            <section className="py-10">
                <h1 className="text-display">Roaster</h1>
                <p className="mt-2 max-w-xl text-[15px] text-mocha">
                    Asal-usul di balik setiap bean. Jelajahi roastery, lokasinya, dan bean yang mereka sangrai.
                </p>
            </section>

            {roasteries.data.length === 0 ? (
                <EmptyState
                    title="Belum ada roaster"
                    message="Setelah roastery ditambahkan ke katalog, kamu akan menemukannya di sini."
                    icon="🏪"
                />
            ) : (
                <>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {roasteries.data.map((roastery) => (
                            <Link key={roastery.id} href={roasteryRoutes.show.url(roastery.id)}>
                                <Card clickable className="flex h-full flex-col p-6">
                                    <h2 className="text-[22px]">{roastery.name}</h2>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {roastery.location && <Pill variant="neutral">{roastery.location}</Pill>}
                                        <Pill variant="caramel">
                                            {roastery.beans_count} bean
                                        </Pill>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                    <div className="mt-8">
                        <LoadMore nextPageUrl={roasteries.next_page_url} />
                    </div>
                </>
            )}
        </AppLayout>
    );
}

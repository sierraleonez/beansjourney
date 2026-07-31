import { Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import BeanCard from '../../Components/BeanCard';
import LoadMore from '../../Components/LoadMore';
import EmptyState from '../../Components/EmptyState';

export default function BeanMine({ beans }) {
    return (
        <AppLayout>
            <section className="py-10 lg:py-14">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-display">Bean Saya</h1>
                        <p className="mt-2 max-w-xl text-[14px] text-mocha">
                            Bean yang sudah kamu tambahkan ke katalog.
                        </p>
                    </div>
                    <Link href={route('beans.create')} className="btn-primary">
                        Tambahkan Bean
                    </Link>
                </div>

                {beans.data.length === 0 ? (
                    <div className="mt-8">
                        <EmptyState
                            title="Kamu belum menambahkan bean apa pun"
                            message="Bagikan bean yang pernah kamu coba — akan muncul di sini setelah masuk katalog."
                        />
                    </div>
                ) : (
                    <>
                        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
        </AppLayout>
    );
}

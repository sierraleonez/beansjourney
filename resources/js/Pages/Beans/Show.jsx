import { Link, usePage } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Card from '../../Components/Card';
import Pill from '../../Components/Pill';
import SortControl from '../../Components/SortControl';
import LoadMore from '../../Components/LoadMore';
import EmptyState from '../../Components/EmptyState';
import GateBanner from '../../Components/GateBanner';
import WriteReviewForm from '../../Components/WriteReviewForm';
import WriteRecipeForm from '../../Components/WriteRecipeForm';
import beans from '../../routes/beans';
import roasteries from '../../routes/roasteries';
import { register } from '../../routes';
import ReviewCard from '../../Components/ReviewCard';
import RecipeCard from '../../Components/RecipeCard';
import { StarRating } from '../../Components/StarRating';
import { cn, formatDate } from '../../lib/utils';

const tabs = ['overview', 'reviews', 'recipes'];
const tabLabels = {
    overview: 'Ringkasan',
    reviews: 'Ulasan',
    recipes: 'Resep',
};
const roastVariant = {
    Light: 'light',
    'Light-Medium': 'light',
    Medium: 'medium',
    'Medium-Dark': 'dark',
    Dark: 'dark',
};

const fieldLabels = {
    name: 'nama',
    description: 'deskripsi',
    process_id: 'proses',
    origin_id: 'asal',
    variety: 'varietas',
    flavour_perception: 'catatan rasa',
    roast_date: 'tanggal sangrai',
    roast_level_id: 'tingkat sangrai',
    purpose_id: 'peruntukan',
    purchased_on: 'tanggal dibeli',
    altitude: 'ketinggian',
};

const actionLabels = {
    created: 'menambahkan bean ini',
    restored: 'memulihkan bean ini',
};

function describeChange(entry) {
    const fields = Object.keys(entry.meta?.changes ?? {});

    if (fields.length > 0) {
        const labels = fields.map((field) => fieldLabels[field] ?? field);
        return `mengubah ${labels.join(', ')}`;
    }

    return actionLabels[entry.action] ?? 'memperbarui bean ini';
}

function ChangeLog({ entries = [] }) {
    if (entries.length === 0) {
        return null;
    }

    return (
        <div className="card-surface p-6">
            <div className="flex items-center gap-3">
                <h2 className="text-[17px]">Riwayat perubahan</h2>
                <span className="h-px flex-1 bg-line" />
            </div>
            <ul className="mt-4 space-y-2.5">
                {entries.map((entry) => (
                    <li key={entry.id} className="text-[13px] text-mocha">
                        <span className="font-semibold text-espresso">{entry.user?.name ?? 'Seseorang'}</span>{' '}
                        {describeChange(entry)} — {formatDate(entry.created_at)}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function Specs({ bean }) {
    const specs = [
        ['Asal', bean.origin?.name],
        ['Varietas', bean.variety],
        ['Proses', bean.process?.name],
        ['Tingkat sangrai', bean.roast_level?.name],
        ['Tanggal sangrai', formatDate(bean.roast_date)],
        ['Peruntukan', bean.purpose?.name],
        ['Tanggal dibeli', formatDate(bean.purchased_on)],
        ['Ketinggian', bean.altitude],
    ];

    return (
        <div className="card-surface p-6">
            <div className="flex items-center gap-3">
                <h2 className="text-[22px]">Sekilas spesifikasi</h2>
                <span className="h-px flex-1 bg-line" />
            </div>
            <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                {specs.map(([label, value]) => (
                    <div key={label} className="flex items-baseline justify-between gap-3 rounded-md bg-card/60 px-3.5 py-2.5">
                        <dt className="eyebrow">{label}</dt>
                        <dd className="text-right text-sm font-semibold text-espresso">{value || '—'}</dd>
                    </div>
                ))}
            </dl>
            {bean.flavour_perception && (
                <div className="mt-5">
                    <h3 className="eyebrow">Catatan rasa</h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-espresso">{bean.flavour_perception}</p>
                </div>
            )}
        </div>
    );
}

function BeanMedia({ bean }) {
    const photos = bean.photo_urls ?? [];

    if (photos.length === 0 && !bean.description) {
        return null;
    }

    return (
        <div className="card-surface flex flex-col gap-5 p-6 sm:flex-row">
            {photos.length === 1 && (
                <img
                    src={photos[0]}
                    alt={bean.name}
                    className="h-48 w-full rounded-md object-cover sm:h-auto sm:w-56 sm:flex-shrink-0"
                />
            )}
            {photos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto sm:w-56 sm:flex-shrink-0 sm:flex-col sm:overflow-visible">
                    {photos.map((url, index) => (
                        <img
                            key={url}
                            src={url}
                            alt={`${bean.name} — foto ${index + 1}`}
                            className="h-28 w-28 shrink-0 rounded-md object-cover sm:h-auto sm:w-full"
                        />
                    ))}
                </div>
            )}
            {bean.description && (
                <p className="text-[14px] leading-relaxed text-espresso">{bean.description}</p>
            )}
        </div>
    );
}

function WriteGate({ canWrite, type, beanId }) {
    const { auth } = usePage().props;

    if (canWrite) {
        return type === 'review'
            ? <WriteReviewForm beanId={beanId} />
            : <WriteRecipeForm beanId={beanId} />;
    }

    if (auth.user) {
        return (
            <GateBanner
                variant="unverified"
                redirectTo="verification.notice"
                action="Verifikasi email untuk mengirim"
                message="Akunmu sudah terdaftar, tapi belum sepenuhnya aktif. Verifikasi email untuk ikut menyuarakan pendapatmu tentang bean ini."
            />
        );
    }

    return (
        <GateBanner
            variant="guest"
            action={type === 'review' ? 'Masuk untuk menulis ulasan' : 'Masuk untuk membagikan resep'}
            message={
                type === 'review'
                    ? 'Bagaimana rasa bean ini menurutmu? Ulasan membantu komunitas menentukan pilihan sebelum membeli.'
                    : 'Bantu komunitas menemukan cara terbaik menyeduh bean ini.'
            }
        />
    );
}

export default function BeanShow({ bean, tab, canWrite, canEdit, reviews, recipes, topReviews, topRecipes, changeLog }) {
    const { auth } = usePage().props;
    const rating = bean.reviews_avg_rating ? Number(bean.reviews_avg_rating).toFixed(1) : null;
    const tabLink = (name) => beans.show.url(bean.id, { query: { tab: name } });

    return (
        <AppLayout>
            <nav aria-label="Navigasi breadcrumb" className="pt-6">
                <ol className="flex items-center gap-1.5 text-[12px] text-mocha">
                    <li>
                        <Link href="/roasters" className="hover:text-brown">Roaster</Link>
                    </li>
                    <li aria-hidden="true">›</li>
                    <li>
                        <Link href={bean.roastery ? roasteries.show.url(bean.roastery.id) : '/roasters'} className="hover:text-brown">
                            {bean.roastery?.name ?? 'Roaster tidak diketahui'}
                        </Link>
                    </li>
                    <li aria-hidden="true">›</li>
                    <li aria-current="page" className="font-semibold text-espresso">{bean.name}</li>
                </ol>
            </nav>

            <section className="py-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-display">{bean.name}</h1>
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                            {rating ? (
                                <span className="flex items-center gap-2">
                                    <StarRating rating={Number(rating)} />
                                    <span className="font-display text-[20px] font-bold">{rating}</span>
                                    <span className="text-[13px] text-mocha">· {bean.reviews_count} ulasan</span>
                                </span>
                            ) : (
                                <span className="text-[13px] text-mocha">Belum ada ulasan</span>
                            )}
                            {bean.roast_level && <Pill variant={roastVariant[bean.roast_level.name] ?? 'neutral'}>{bean.roast_level.name}</Pill>}
                            {bean.origin && <Pill variant="neutral">{bean.origin.name}</Pill>}
                            {bean.purpose && <Pill variant="neutral">Untuk {bean.purpose.name}</Pill>}
                        </div>
                    </div>
                    {canEdit && (
                        <Link
                            href={beans.edit.url(bean.id)}
                            className="text-[12.5px] font-semibold text-brown hover:text-caramel"
                        >
                            Edit bean
                        </Link>
                    )}
                </div>

                <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
                    <div className="min-w-0">
                        <div role="tablist" aria-label="Bagian bean" className="flex gap-1 border-b border-line">
                            {tabs.map((name) => (
                                <Link
                                    key={name}
                                    href={tabLink(name)}
                                    role="tab"
                                    aria-selected={tab === name}
                                    className={cn(
                                        'px-4 py-3 text-sm font-semibold transition-colors',
                                        tab === name
                                            ? 'border-b-2 border-caramel text-espresso'
                                            : 'text-mocha hover:text-brown',
                                    )}
                                >
                                    {tabLabels[name]}
                                    {name === 'reviews' && <span className="ml-1.5 text-[12px] text-mocha">({bean.reviews_count})</span>}
                                    {name === 'recipes' && <span className="ml-1.5 text-[12px] text-mocha">({bean.recipes_count})</span>}
                                </Link>
                            ))}
                        </div>

                        <div className="mt-6 space-y-5">
                            {tab === 'overview' && (
                                <>
                                    <BeanMedia bean={bean} />
                                    <Specs bean={bean} />

                                    <div>
                                        <div className="flex items-center justify-between gap-3">
                                            <h3 className="text-[17px]">Ulasan teratas</h3>
                                        </div>
                                        {(topReviews ?? []).length === 0 ? (
                                            <EmptyState
                                                className="mt-3"
                                                title="Belum ada ulasan"
                                                message="Jadilah yang pertama menulis ulasan untuk bean ini."
                                                icon="⭐"
                                            />
                                        ) : (
                                            <div className="mt-3 space-y-4">
                                                {(topReviews ?? []).map((review) => (
                                                    <ReviewCard key={review.id} review={review} />
                                                ))}
                                            </div>
                                        )}
                                        <Link href={tabLink('reviews')} className="btn-ghost mt-4">
                                            Lihat semua ulasan
                                        </Link>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between gap-3">
                                            <h3 className="text-[17px]">Resep teratas</h3>
                                        </div>
                                        {(topRecipes ?? []).length === 0 ? (
                                            <EmptyState
                                                className="mt-3"
                                                title="Belum ada resep"
                                                message="Bagikan cara kamu menyeduh bean ini."
                                                icon="☕"
                                            />
                                        ) : (
                                            <div className="mt-3 space-y-4">
                                                {(topRecipes ?? []).map((recipe) => (
                                                    <RecipeCard key={recipe.id} recipe={recipe} />
                                                ))}
                                            </div>
                                        )}
                                        <Link href={tabLink('recipes')} className="btn-ghost mt-4">
                                            Lihat semua resep
                                        </Link>
                                    </div>

                                    <ChangeLog entries={changeLog ?? []} />
                                </>
                            )}

                            {tab === 'reviews' && (
                                <>
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <h2 className="text-[22px]">Ulasan</h2>
                                        <SortControl
                                            value={new URLSearchParams(window.location.search).get('sort') ?? 'top'}
                                            options={[
                                                { value: 'top', label: 'Teratas' },
                                                { value: 'newest', label: 'Terbaru' },
                                                { value: 'highest', label: 'Rating tertinggi' },
                                            ]}
                                        />
                                    </div>

                                    <WriteGate canWrite={canWrite} type="review" beanId={bean.id} />

                                    {reviews.data.length === 0 ? (
                                        <EmptyState
                                            title="Belum ada ulasan — jadilah yang pertama mencoba bean ini"
                                            message="Catatan rasamu akan membantu pembeli berikutnya menentukan pilihan."
                                            icon="⭐"
                                        />
                                    ) : (
                                        <>
                                            <div className="space-y-5">
                                                {reviews.data.map((review) => (
                                                    <ReviewCard key={review.id} review={review} />
                                                ))}
                                            </div>
                                            <LoadMore nextPageUrl={reviews.next_page_url} />
                                        </>
                                    )}
                                </>
                            )}

                            {tab === 'recipes' && (
                                <>
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <h2 className="text-[22px]">Resep</h2>
                                        <SortControl
                                            value={new URLSearchParams(window.location.search).get('sort') ?? 'most_upvoted'}
                                            options={[
                                                { value: 'most_upvoted', label: 'Paling didukung' },
                                                { value: 'newest', label: 'Terbaru' },
                                                { value: 'most_discussed', label: 'Paling ramai dibahas' },
                                            ]}
                                        />
                                    </div>

                                    <WriteGate canWrite={canWrite} type="recipe" beanId={bean.id} />

                                    {recipes.data.length === 0 ? (
                                        <EmptyState
                                            title="Belum ada resep"
                                            message="Bagikan cara kamu menyeduh bean ini — komunitas sedang mencari metode yang terbukti."
                                            icon="☕"
                                        />
                                    ) : (
                                        <>
                                            <div className="space-y-5">
                                                {recipes.data.map((recipe) => (
                                                    <RecipeCard key={recipe.id} recipe={recipe} />
                                                ))}
                                            </div>
                                            <LoadMore nextPageUrl={recipes.next_page_url} />
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <aside className="space-y-5">
                        <Card className="p-5">
                            <h3 className="text-[17px]">{bean.roastery?.name ?? 'Roaster tidak diketahui'}</h3>
                            {bean.roastery?.location && (
                                <p className="mt-1 text-[12.5px] text-mocha">{bean.roastery.location}</p>
                            )}
                            {bean.roastery && (
                                <Link href={roasteries.show.url(bean.roastery.id)} className="btn-ghost mt-4 w-full">
                                    Lihat semua bean
                                </Link>
                            )}
                        </Card>
                        {!auth.user && (
                            <div className="rounded-lg bg-gradient-to-br from-brown to-espresso p-6 text-center">
                                <h3 className="text-[20px] text-bg">Catat perjalanan kopimu sendiri</h3>
                                <p className="mt-2 text-[13px] text-bg/80">
                                    Daftar untuk menulis ulasan, membagikan resep, dan mendukung yang menurutmu oke.
                                </p>
                                <Link href={register.url()} className="btn-primary mt-5">
                                    Gabung Gratis
                                </Link>
                            </div>
                        )}
                    </aside>
                </div>
            </section>
        </AppLayout>
    );
}

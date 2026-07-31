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
import ReviewCard from '../../Components/ReviewCard';
import RecipeCard from '../../Components/RecipeCard';
import { StarRating } from '../../Components/StarRating';
import { cn, formatDate } from '../../lib/utils';

const tabs = ['overview', 'reviews', 'recipes'];
const roastVariant = {
    Light: 'light',
    'Light-Medium': 'light',
    Medium: 'medium',
    'Medium-Dark': 'dark',
    Dark: 'dark',
};

function Specs({ bean }) {
    const specs = [
        ['Origin', bean.origin],
        ['Variety', bean.variety],
        ['Process', bean.process],
        ['Roast profile', bean.roast_profile],
        ['Roast date', formatDate(bean.roast_date)],
        ['Purpose', bean.purpose],
        ['Purchased on', formatDate(bean.purchased_on)],
        ['Altitude', bean.altitude],
    ];

    return (
        <div className="card-surface p-6">
            <div className="flex items-center gap-3">
                <h2 className="text-[22px]">Specs at a glance</h2>
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
                    <h3 className="eyebrow">Tasting notes</h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-espresso">{bean.flavour_perception}</p>
                </div>
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
                action="Verify your email to post"
                message="You're registered, but your account isn't fully active yet. Verify your email to add your voice to this bean."
            />
        );
    }

    return (
        <GateBanner
            variant="guest"
            action={type === 'review' ? 'Log in to add a review' : 'Log in to share a recipe'}
            message={
                type === 'review'
                    ? 'How did this bean taste to you? Reviews help the community decide before buying.'
                    : 'Help the community discover the best way to brew this bean.'
            }
        />
    );
}

export default function BeanShow({ bean, tab, canWrite, reviews, recipes }) {
    const { auth } = usePage().props;
    const rating = bean.reviews_avg_rating ? Number(bean.reviews_avg_rating).toFixed(1) : null;
    const tabLink = (name) => route('beans.show', { bean: bean.id, tab: name });

    return (
        <AppLayout>
            <nav aria-label="Breadcrumb" className="pt-6">
                <ol className="flex items-center gap-1.5 text-[12px] text-mocha">
                    <li>
                        <Link href="/roasters" className="hover:text-brown">Roasters</Link>
                    </li>
                    <li aria-hidden="true">›</li>
                    <li>
                        <Link href={bean.roastery ? route('roasteries.show', bean.roastery.id) : '/roasters'} className="hover:text-brown">
                            {bean.roastery?.name ?? 'Unknown roaster'}
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
                                    <span className="text-[13px] text-mocha">· {bean.reviews_count} reviews</span>
                                </span>
                            ) : (
                                <span className="text-[13px] text-mocha">No reviews yet</span>
                            )}
                            {bean.roast_profile && <Pill variant={roastVariant[bean.roast_profile] ?? 'neutral'}>{bean.roast_profile}</Pill>}
                            {bean.origin && <Pill variant="neutral">{bean.origin}</Pill>}
                            {bean.purpose && <Pill variant="neutral">For {bean.purpose}</Pill>}
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
                    <div className="min-w-0">
                        <div role="tablist" aria-label="Bean sections" className="flex gap-1 border-b border-line">
                            {tabs.map((name) => (
                                <Link
                                    key={name}
                                    href={tabLink(name)}
                                    role="tab"
                                    aria-selected={tab === name}
                                    className={cn(
                                        'px-4 py-3 text-sm font-semibold capitalize transition-colors',
                                        tab === name
                                            ? 'border-b-2 border-caramel text-espresso'
                                            : 'text-mocha hover:text-brown',
                                    )}
                                >
                                    {name}
                                    {name === 'reviews' && <span className="ml-1.5 text-[12px] text-mocha">({bean.reviews_count})</span>}
                                    {name === 'recipes' && <span className="ml-1.5 text-[12px] text-mocha">({bean.recipes_count})</span>}
                                </Link>
                            ))}
                        </div>

                        <div className="mt-6 space-y-5">
                            {tab === 'overview' && (
                                <>
                                    <Specs bean={bean} />
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <Card className="p-5">
                                            <h3 className="text-[17px]">Reviews</h3>
                                            <p className="mt-1 text-[12.5px] text-mocha">
                                                {bean.reviews_count} review{bean.reviews_count === 1 ? '' : 's'} on this bean.
                                            </p>
                                            <Link href={tabLink('reviews')} className="btn-ghost mt-4">
                                                Read reviews
                                            </Link>
                                        </Card>
                                        <Card className="p-5">
                                            <h3 className="text-[17px]">Recipes</h3>
                                            <p className="mt-1 text-[12.5px] text-mocha">
                                                {bean.recipes_count} recipe{bean.recipes_count === 1 ? '' : 's'} for brewing it well.
                                            </p>
                                            <Link href={tabLink('recipes')} className="btn-ghost mt-4">
                                                Find a brew
                                            </Link>
                                        </Card>
                                    </div>
                                </>
                            )}

                            {tab === 'reviews' && (
                                <>
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <h2 className="text-[22px]">Reviews</h2>
                                        <SortControl
                                            value={new URLSearchParams(window.location.search).get('sort') ?? 'top'}
                                            options={[
                                                { value: 'top', label: 'Top' },
                                                { value: 'newest', label: 'Newest' },
                                                { value: 'highest', label: 'Highest rated' },
                                            ]}
                                        />
                                    </div>

                                    <WriteGate canWrite={canWrite} type="review" beanId={bean.id} />

                                    {reviews.data.length === 0 ? (
                                        <EmptyState
                                            title="No reviews yet — be the first to try this bean"
                                            message="Your tasting notes will help the next buyer decide."
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
                                        <h2 className="text-[22px]">Recipes</h2>
                                        <SortControl
                                            value={new URLSearchParams(window.location.search).get('sort') ?? 'most_upvoted'}
                                            options={[
                                                { value: 'most_upvoted', label: 'Most upvoted' },
                                                { value: 'newest', label: 'Newest' },
                                                { value: 'most_discussed', label: 'Most discussed' },
                                            ]}
                                        />
                                    </div>

                                    <WriteGate canWrite={canWrite} type="recipe" beanId={bean.id} />

                                    {recipes.data.length === 0 ? (
                                        <EmptyState
                                            title="No recipes yet"
                                            message="Share how you brew this bean — the community is looking for a proven method."
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
                            <h3 className="text-[17px]">{bean.roastery?.name ?? 'Unknown roaster'}</h3>
                            {bean.roastery?.location && (
                                <p className="mt-1 text-[12.5px] text-mocha">{bean.roastery.location}</p>
                            )}
                            {bean.roastery && (
                                <Link href={route('roasteries.show', bean.roastery.id)} className="btn-ghost mt-4 w-full">
                                    See all beans
                                </Link>
                            )}
                        </Card>
                        {!auth.user && (
                            <div className="rounded-lg bg-gradient-to-br from-brown to-espresso p-6 text-center">
                                <h3 className="text-[20px] text-bg">Track your own journey</h3>
                                <p className="mt-2 text-[13px] text-bg/80">
                                    Register to review, share recipes, and upvote what works.
                                </p>
                                <Link href={route('register')} className="btn-primary mt-5">
                                    Join Free
                                </Link>
                            </div>
                        )}
                    </aside>
                </div>
            </section>
        </AppLayout>
    );
}

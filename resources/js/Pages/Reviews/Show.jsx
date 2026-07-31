import { Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Card from '../../Components/Card';
import Avatar from '../../Components/Avatar';
import Pill from '../../Components/Pill';
import VoteButton from '../../Components/VoteButton';
import CommentThread from '../../Components/CommentThread';
import ThreadReplyComposer from '../../Components/ThreadReplyComposer';
import { StarRating } from '../../Components/StarRating';
import { timeAgo } from '../../lib/utils';

export default function ReviewShow({ review, bean, comments, commentCount, canReply, isAuthor }) {
    const threadAuthorId = review.author?.id;

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
                    <li>
                        <Link href={route('beans.show', bean.id)} className="hover:text-brown">
                            {bean.name}
                        </Link>
                    </li>
                    <li aria-hidden="true">›</li>
                    <li aria-current="page" className="font-semibold text-espresso">Review</li>
                </ol>
            </nav>

            <section className="py-8">
                <h1 className="text-display-sm">Review of {bean.name}</h1>
                <p className="mt-1 text-[13px] text-mocha">
                    by {bean.roastery.name} · {bean.roastery.location}
                </p>

                <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
                    <div className="min-w-0">
                        <Card className="flex gap-4 p-6 sm:p-8">
                            <VoteButton
                                votableType="review"
                                votableId={review.id}
                                votesCount={review.votes_count}
                                votedByUser={review.voted_by_user}
                            />
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-3">
                                    <Avatar name={review.author?.name} size={44} />
                                    <div>
                                        <p className="text-sm font-bold">{review.author?.name ?? 'Deleted user'}</p>
                                        <div className="flex items-center gap-2">
                                            <StarRating rating={review.rating} />
                                            <span className="text-[11px] text-mocha">{timeAgo(review.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                                {review.brew_method && (
                                    <p className="mt-4 text-[12px] font-semibold text-caramel">Brewed with: {review.brew_method}</p>
                                )}
                                <p className="mt-2 whitespace-pre-line text-[14.5px] leading-relaxed">{review.body}</p>
                            </div>
                        </Card>

                        <div className="mt-8">
                            <h2 className="text-[22px]">Discussion</h2>
                            <p className="mt-1 text-[12.5px] text-mocha">
                                {commentCount} comment{commentCount === 1 ? '' : 's'}
                            </p>
                            <div className="card-surface mt-4 p-2 sm:p-4">
                                <CommentThread
                                    comments={comments}
                                    commentableType="review"
                                    commentableId={review.id}
                                    canReply={canReply}
                                    threadAuthorId={threadAuthorId}
                                />
                            </div>
                            <div className="mt-6">
                                <ThreadReplyComposer
                                    commentableType="review"
                                    commentableId={review.id}
                                    canReply={canReply}
                                />
                            </div>
                        </div>
                    </div>

                    <aside className="space-y-5">
                        <Card className="p-5">
                            <h3 className="text-[17px]">{bean.name}</h3>
                            <p className="mt-1 text-[12.5px] text-mocha">{bean.roastery?.name ?? 'Unknown roaster'}</p>
                            <Link href={route('beans.show', bean.id)} className="btn-ghost mt-4 w-full">
                                View bean page
                            </Link>
                        </Card>
                        <Card className="p-5">
                            <h3 className="eyebrow">Community</h3>
                            <dl className="mt-2 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-mocha">Upvotes</dt>
                                    <dd className="font-bold">{review.votes_count}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-mocha">Comments</dt>
                                    <dd className="font-bold">{commentCount}</dd>
                                </div>
                            </dl>
                        </Card>
                    </aside>
                </div>
            </section>
        </AppLayout>
    );
}

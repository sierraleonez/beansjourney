import { Link } from '@inertiajs/react';
import Card from './Card';
import Avatar from './Avatar';
import Pill from './Pill';
import VoteButton from './VoteButton';
import { StarRating } from './StarRating';
import { timeAgo } from '../lib/utils';

export default function ReviewCard({ review }) {
    return (
        <Card className="flex gap-4 p-5 sm:p-6">
            <VoteButton
                votableType="review"
                votableId={review.id}
                votesCount={review.votes_count}
                votedByUser={review.voted_by_user}
            />
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                    <Avatar name={review.author?.name} size={36} />
                    <div>
                        <p className="text-sm font-bold">{review.author?.name ?? 'Deleted user'}</p>
                        <div className="flex items-center gap-2">
                            <StarRating rating={review.rating} />
                            <span className="text-[11px] text-mocha">{timeAgo(review.created_at)}</span>
                        </div>
                    </div>
                </div>
                {review.brew_method && (
                    <p className="mt-3 text-[12px] font-semibold text-caramel">Brewed with: {review.brew_method}</p>
                )}
                <p className="mt-2 whitespace-pre-line text-[14px] leading-relaxed text-espresso">{review.body}</p>
                <p className="mt-3 flex items-center gap-3 text-[12px] font-semibold text-mocha">
                    <span>{review.votes_count} upvote{review.votes_count === 1 ? '' : 's'}</span>
                    <Link href={route('reviews.show', review.id)} className="text-caramel hover:text-caramel-hover">
                        Open thread · {review.comment_count} comment{review.comment_count === 1 ? '' : 's'} →
                    </Link>
                </p>
            </div>
        </Card>
    );
}

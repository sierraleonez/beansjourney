import { router, usePage } from '@inertiajs/react';
import { cn } from '../lib/utils';

/**
 * Upvote-only toggle (AD-3): one row per user/votable; clicking again deletes it.
 * Guests navigate to login preserving the current URL so they return after auth.
 */
export default function VoteButton({ votableType, votableId, votesCount, votedByUser, size = 'sm', className }) {
    const { auth } = usePage().props;

    const compact = size === 'xs';

    const handleClick = () => {
        if (!auth.user) {
            router.visit(route('login', { redirect: window.location.href }));

            return;
        }
        router.post(
            route('votes.toggle'),
            { votable_type: votableType, votable_id: votableId },
            { preserveScroll: true },
        );
    };

    return (
        <div className={cn('flex flex-col items-center', className)}>
            <button
                type="button"
                onClick={handleClick}
                aria-pressed={votedByUser}
                aria-label={votedByUser ? 'Batalkan dukungan' : 'Dukung'}
                className={cn(
                    'inline-flex items-center gap-1 rounded-sm border-[1.5px] transition-colors',
                    compact ? 'px-2 py-1' : 'px-2.5 py-1.5',
                    votedByUser
                        ? 'border-caramel bg-caramel/15 text-caramel'
                        : 'border-line text-mocha hover:border-brown hover:text-brown',
                )}
            >
                <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'}>
                    <path
                        fillRule="evenodd"
                        d="M10 3.5a1 1 0 0 1 .76.35l5.9 6.9a1 1 0 0 1-.76 1.66h-3.2V15.5a1 1 0 0 1-1 1H8.3a1 1 0 0 1-1-1v-3.1H4.1a1 1 0 0 1-.76-1.65l5.9-6.9a1 1 0 0 1 .76-.35z"
                        clipRule="evenodd"
                    />
                </svg>
                <span aria-live="polite" className={cn('font-semibold', compact ? 'text-[11px]' : 'text-[12.5px]')}>
                    {votesCount}
                </span>
            </button>
        </div>
    );
}

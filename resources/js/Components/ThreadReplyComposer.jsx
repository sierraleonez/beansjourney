import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import Button from './Button';
import GateBanner from './GateBanner';

export default function ThreadReplyComposer({ commentableType, commentableId, canReply }) {
    const { auth } = usePage().props;
    const [body, setBody] = useState('');
    const [loading, setLoading] = useState(false);

    if (!canReply) {
        const isGuest = !auth.user;

        return (
            <GateBanner
                variant={isGuest ? 'guest' : 'unverified'}
                redirectTo={isGuest ? undefined : 'verification.notice'}
                action={isGuest ? 'Log in to join the discussion' : 'Verify your email to join'}
                message={
                    isGuest
                        ? 'Comments help the community decide and brew better. Add yours to the thread.'
                        : "You're registered, but your account isn't fully active yet. Verify your email to join the discussion."
                }
            />
        );
    }

    const submit = (event) => {
        event.preventDefault();
        if (!body.trim()) return;
        setLoading(true);
        router.post(
            route('comments.store'),
            {
                commentable_type: commentableType,
                commentable_id: commentableId,
                body,
            },
            { preserveScroll: true, onFinish: () => setLoading(false) },
        );
    };

    return (
        <form onSubmit={submit} className="card-surface p-5">
            <label htmlFor={`reply-${commentableType}-${commentableId}`} className="text-[12.5px] font-semibold text-espresso">
                Add to the discussion
            </label>
            <textarea
                id={`reply-${commentableType}-${commentableId}`}
                rows={3}
                maxLength={5000}
                required
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="What worked for you? What would you change?"
                className="input-field mt-2 resize-y"
            />
            <div className="mt-3">
                <Button type="submit" loading={loading}>
                    Post Comment
                </Button>
            </div>
        </form>
    );
}

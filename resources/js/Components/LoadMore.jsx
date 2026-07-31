import { router } from '@inertiajs/react';

/**
 * Load-more pagination: advances the `page` query param, preserving scroll.
 */
export default function LoadMore({ nextPageUrl, label = 'Muat lebih banyak' }) {
    if (!nextPageUrl) return null;

    const loadMore = () => {
        router.visit(nextPageUrl, { preserveScroll: true });
    };

    return (
        <div className="flex justify-center pt-2">
            <button type="button" onClick={loadMore} className="btn-ghost">
                {label}
            </button>
        </div>
    );
}

import { cn } from '../lib/utils';

/** Fallback visual shown wherever a bean has no uploaded photo. */
export default function BeanPhotoPlaceholder({ className }) {
    return (
        <div
            aria-hidden="true"
            className={cn(
                'flex items-center justify-center bg-gradient-to-br from-card to-line text-mocha',
                className,
            )}
        >
            <span className="text-3xl">🫘</span>
        </div>
    );
}

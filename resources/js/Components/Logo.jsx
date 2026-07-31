import { cn } from '../lib/utils';

export default function Logo({ className, textClass = 'text-espresso' }) {
    return (
        <span className={cn('inline-flex items-center gap-2', className)}>
            <span
                aria-hidden="true"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-brown text-bg"
            >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M4 9h13a1 1 0 0 1 1 1v4a6 6 0 0 1-6 6H9a5 5 0 0 1-5-5v-6zm6.5 1.5H6.5v2h4v-2zm5 0h-2v2h2v-2zm2.5 0h1a1.5 1.5 0 0 1 0 3h-1v-3z" />
                    <path d="M6 4.5c1.2 1.2 1.2 2.8 0 4-1.2 1.2-1.2 2.8 0 4 .3.3.8.3 1.1 0 .9-.9.9-2.1 0-3 .9-.9.9-2.1 0-3-.3-.3-.8-.3-1.1 0zM11 4.5c1.2 1.2 1.2 2.8 0 4-1.2 1.2-1.2 2.8 0 4 .3.3.8.3 1.1 0 .9-.9.9-2.1 0-3 .9-.9.9-2.1 0-3-.3-.3-.8-.3-1.1 0z" />
                </svg>
            </span>
            <span className={cn('font-display text-[20px] font-bold', textClass)}>BeansJourney</span>
        </span>
    );
}

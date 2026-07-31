import { cn } from '../lib/utils';

export default function Button({
    children,
    variant = 'primary',
    className,
    loading = false,
    success = false,
    ...props
}) {
    const classes = {
        primary: 'btn-primary',
        ghost: 'btn-ghost',
        icon: 'btn-icon',
    };

    return (
        <button
            className={cn(classes[variant], className)}
            disabled={loading || props.disabled}
            aria-busy={loading || undefined}
            {...props}
        >
            {loading && <Spinner />}
            {success && (
                <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4"
                >
                    <path
                        fillRule="evenodd"
                        d="M16.7 5.3a1 1 0 0 1 0 1.4l-7 7a1 1 0 0 1-1.4 0l-3-3a1 1 0 1 1 1.4-1.4L9 11.6l6.3-6.3a1 1 0 0 1 1.4 0z"
                        clipRule="evenodd"
                    />
                </svg>
            )}
            {children}
        </button>
    );
}

function Spinner() {
    return (
        <svg
            aria-hidden="true"
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
            />
        </svg>
    );
}

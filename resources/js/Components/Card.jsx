import { cn } from '../lib/utils';

export default function Card({ children, className, clickable = false, as: Tag = 'div', ...props }) {
    return (
        <Tag
            className={cn(clickable ? 'card-clickable' : 'card-surface', className)}
            {...props}
        >
            {children}
        </Tag>
    );
}

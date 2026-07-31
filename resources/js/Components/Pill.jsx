import { cn } from '../lib/utils';

const variants = {
    caramel: 'bg-caramel/15 text-caramel',
    green: 'bg-successbg text-success',
    neutral: 'bg-card text-brown',
    mocha: 'bg-card text-mocha',
    light: 'bg-[#FEF5E7] text-caramel border border-[#F5DEB3]',
    medium: 'bg-[#F9EDE0] text-[#8B4513] border border-[#DEB887]',
    dark: 'bg-[#F0E6E0] text-[#5C3317] border border-[#C4A882]',
};

export default function Pill({ children, variant = 'neutral', className, ...props }) {
    return (
        <span className={cn('pill', variants[variant], className)} {...props}>
            {children}
        </span>
    );
}

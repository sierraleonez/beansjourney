import { Link } from '@inertiajs/react';
import Card from './Card';
import Pill from './Pill';
import { StarRating } from './StarRating';

const roastVariant = {
    Light: 'light',
    'Light-Medium': 'light',
    Medium: 'medium',
    'Medium-Dark': 'dark',
    Dark: 'dark',
};

export default function BeanCard({ bean }) {
    const rating = bean.average_rating ? Number(bean.average_rating).toFixed(1) : null;

    return (
        <Link href={route('beans.show', bean.id)} className="block focus:outline-none">
            <Card clickable className="flex h-full flex-col p-6" >
                {bean.photo_url && (
                    <img
                        src={bean.photo_url}
                        alt={bean.name}
                        className="-mx-6 -mt-6 mb-4 h-36 w-[calc(100%+3rem)] rounded-t-md object-cover"
                    />
                )}
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.6px] text-mocha">
                            {bean.roastery?.name}
                        </p>
                        <h3 className="mt-1 text-[22px] leading-snug">{bean.name}</h3>
                    </div>
                    {bean.roast_profile && (
                        <Pill variant={roastVariant[bean.roast_profile] ?? 'neutral'}>{bean.roast_profile}</Pill>
                    )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                    {bean.origin && <Pill variant="neutral">{bean.origin}</Pill>}
                    {bean.process && <Pill variant="neutral">{bean.process}</Pill>}
                </div>

                <div className="mt-auto flex items-center justify-between pt-5">
                    <div className="flex items-center gap-2">
                        {rating ? (
                            <>
                                <StarRating rating={Number(rating)} />
                                <span className="text-[12.5px] font-bold text-espresso">{rating}</span>
                            </>
                        ) : (
                            <span className="text-[12.5px] text-mocha">Bean baru</span>
                        )}
                    </div>
                    <span className="text-[12px] text-mocha">
                        {bean.reviews_count} ulasan · {bean.recipes_count} resep
                    </span>
                </div>
            </Card>
        </Link>
    );
}

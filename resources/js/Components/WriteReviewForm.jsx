import { useForm } from '@inertiajs/react';
import Button from './Button';
import Card from './Card';
import Input from './Input';
import { StarRatingInput } from './StarRating';

export default function WriteReviewForm({ beanId }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        rating: 5,
        body: '',
        brew_method: '',
    });

    const submit = (event) => {
        event.preventDefault();
        post(route('reviews.store', beanId), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <Card className="p-5 sm:p-6">
            <h3 className="text-[17px]">How did this bean taste to you?</h3>
            <p className="mt-1 text-[12.5px] text-mocha">
                Be specific. Include your brewing method, grind size, and water temp when possible.
            </p>
            <form onSubmit={submit} className="mt-4 space-y-4">
                <div>
                    <span className="mb-1.5 block text-[12.5px] font-semibold text-espresso">Your rating</span>
                    <StarRatingInput id={`review-rating-${beanId}`} value={data.rating} onChange={(value) => setData('rating', value)} />
                    {errors.rating && <p className="mt-1 text-[12.5px] font-medium text-error">{errors.rating}</p>}
                </div>
                <Input
                    name="brew_method"
                    label="Brew method (optional)"
                    value={data.brew_method}
                    onChange={(event) => setData('brew_method', event.target.value)}
                    error={errors.brew_method}
                    placeholder="e.g. V60, 1:15 ratio, 91°C"
                    hint="How you brewed this bean — shared on your review."
                />
                <div>
                    <label htmlFor={`review-body-${beanId}`} className="mb-1.5 block text-[12.5px] font-semibold text-espresso">
                        Your review
                    </label>
                    <textarea
                        id={`review-body-${beanId}`}
                        required
                        minLength={10}
                        maxLength={5000}
                        rows={4}
                        value={data.body}
                        onChange={(event) => setData('body', event.target.value)}
                        placeholder="Tasting notes, aromatics, mouthfeel, and whether it delivered on the promise…"
                        className="input-field resize-y"
                    />
                    {errors.body && <p className="mt-1 text-[12.5px] font-medium text-error">{errors.body}</p>}
                </div>
                <Button type="submit" loading={processing}>
                    Post Review
                </Button>
            </form>
        </Card>
    );
}

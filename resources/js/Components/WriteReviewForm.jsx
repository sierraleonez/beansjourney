import { useForm } from '@inertiajs/react';
import Button from './Button';
import Card from './Card';
import Input from './Input';
import { StarRatingInput } from './StarRating';
import reviews from '../routes/reviews';

export default function WriteReviewForm({ beanId }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        rating: 5,
        body: '',
        brew_method: '',
    });

    const submit = (event) => {
        event.preventDefault();
        post(reviews.store.url(beanId), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <Card className="p-5 sm:p-6">
            <h3 className="text-[17px]">Bagaimana rasa bean ini menurutmu?</h3>
            <p className="mt-1 text-[12.5px] text-mocha">
                Ceritakan detailnya. Sertakan metode seduh, ukuran gilingan, dan suhu air kalau memungkinkan.
            </p>
            <form onSubmit={submit} className="mt-4 space-y-4">
                <div>
                    <span className="mb-1.5 block text-[12.5px] font-semibold text-espresso">Penilaianmu</span>
                    <StarRatingInput id={`review-rating-${beanId}`} value={data.rating} onChange={(value) => setData('rating', value)} />
                    {errors.rating && <p className="mt-1 text-[12.5px] font-medium text-error">{errors.rating}</p>}
                </div>
                <Input
                    name="brew_method"
                    label="Metode seduh (opsional)"
                    value={data.brew_method}
                    onChange={(event) => setData('brew_method', event.target.value)}
                    error={errors.brew_method}
                    placeholder="misalnya V60, rasio 1:15, 91°C"
                    hint="Cara kamu menyeduh bean ini — akan ditampilkan di ulasanmu."
                />
                <div>
                    <label htmlFor={`review-body-${beanId}`} className="mb-1.5 block text-[12.5px] font-semibold text-espresso">
                        Ulasanmu
                    </label>
                    <textarea
                        id={`review-body-${beanId}`}
                        required
                        minLength={10}
                        maxLength={5000}
                        rows={4}
                        value={data.body}
                        onChange={(event) => setData('body', event.target.value)}
                        placeholder="Catatan rasa, aroma, mouthfeel, dan apakah sesuai ekspektasi…"
                        className="input-field resize-y"
                    />
                    {errors.body && <p className="mt-1 text-[12.5px] font-medium text-error">{errors.body}</p>}
                </div>
                <Button type="submit" loading={processing}>
                    Kirim Ulasan
                </Button>
            </form>
        </Card>
    );
}

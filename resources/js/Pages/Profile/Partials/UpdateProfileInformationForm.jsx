import { Link, useForm, usePage } from '@inertiajs/react';
import Card from '../../../Components/Card';
import Button from '../../../Components/Button';
import Input from '../../../Components/Input';
import Pill from '../../../Components/Pill';
import { cn } from '../../../lib/utils';

const roastLevels = ['Light', 'Light-Medium', 'Medium', 'Medium-Dark', 'Dark'];
const flavorOptions = [
    'Fruity',
    'Floral',
    'Chocolatey',
    'Nutty',
    'Caramel',
    'Spicy',
    'Earthy',
    'Citrus',
    'Berry',
    'Stone Fruit',
    'Honey',
    'Herbal',
];

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        bio: user.bio ?? '',
        roast_level: user.roast_level ?? 'Medium',
        flavor_profile: user.flavor_profile ?? [],
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    const toggleFlavor = (flavor) => {
        setData(
            'flavor_profile',
            data.flavor_profile.includes(flavor)
                ? data.flavor_profile.filter((item) => item !== flavor)
                : [...data.flavor_profile, flavor],
        );
    };

    return (
        <Card className={cn('p-6 sm:p-8', className)}>
            <h2 className="text-[22px]">Profile information</h2>
            <p className="mt-1 text-[12.5px] text-mocha">Update your name, email, and coffee preferences.</p>

            <form onSubmit={submit} className="mt-6 space-y-5">
                <Input
                    name="name"
                    label="Name"
                    value={data.name}
                    error={errors.name}
                    onChange={(e) => setData('name', e.target.value)}
                    hint="This is shown on your reviews and posts."
                    required
                />
                <Input
                    name="email"
                    label="Email"
                    type="email"
                    value={data.email}
                    error={errors.email}
                    onChange={(e) => setData('email', e.target.value)}
                    required
                />

                {mustVerifyEmail && user.email_verified_at === null && (
                    <p className="rounded-md border border-line bg-card px-3 py-2 text-[12.5px] text-mocha">
                        Your email address is unverified.{' '}
                        <Link href={route('verification.send')} method="post" as="button" className="font-semibold text-caramel hover:text-caramel-hover">
                            Click here to re-send the verification email.
                        </Link>
                    </p>
                )}
                {status === 'verification-link-sent' && (
                    <p aria-live="polite" className="rounded-md border border-successborder bg-successbg px-3 py-2 text-[12.5px] font-medium text-success">
                        A new verification link has been sent to your email.
                    </p>
                )}

                <div>
                    <label htmlFor="bio" className="mb-1.5 block text-[12.5px] font-semibold text-espresso">
                        Bio
                    </label>
                    <textarea
                        id="bio"
                        rows={2}
                        maxLength={500}
                        value={data.bio}
                        onChange={(e) => setData('bio', e.target.value)}
                        placeholder="Light roast devotee. V60 obsessive."
                        className="input-field resize-y"
                    />
                    {errors.bio && <p className="mt-1 text-[12px] text-error">{errors.bio}</p>}
                </div>

                <div>
                    <span className="mb-1.5 block text-[12.5px] font-semibold text-espresso">Roast level preference</span>
                    <input
                        type="range"
                        min={0}
                        max={4}
                        step={1}
                        value={roastLevels.indexOf(data.roast_level) === -1 ? 2 : roastLevels.indexOf(data.roast_level)}
                        onChange={(e) => setData('roast_level', roastLevels[Number(e.target.value)])}
                        aria-label="Roast level preference"
                        className="w-full accent-caramel"
                    />
                    <p aria-live="polite" className="mt-1 text-[12.5px] font-bold text-caramel">{data.roast_level}</p>
                </div>

                <div>
                    <span className="mb-1.5 block text-[12.5px] font-semibold text-espresso">Flavor profile</span>
                    <div className="flex flex-wrap gap-2">
                        {flavorOptions.map((flavor) => (
                            <button
                                key={flavor}
                                type="button"
                                aria-pressed={data.flavor_profile.includes(flavor)}
                                onClick={() => toggleFlavor(flavor)}
                                className={cn(
                                    'rounded-full border px-3 py-1 text-[12px] font-semibold transition-colors',
                                    data.flavor_profile.includes(flavor)
                                        ? 'border-caramel bg-caramel text-white'
                                        : 'border-line bg-white text-mocha hover:border-brown hover:text-brown',
                                )}
                            >
                                {flavor}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button type="submit" loading={processing}>
                        Save
                    </Button>
                    {recentlySuccessful && (
                        <p aria-live="polite" className="text-[13px] font-semibold text-success">
                            Saved.
                        </p>
                    )}
                </div>
            </form>
        </Card>
    );
}

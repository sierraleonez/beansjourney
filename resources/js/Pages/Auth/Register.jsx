import AuthShell from '../../Layouts/AuthShell';
import Input from '../../Components/Input';
import Button from '../../Components/Button';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthShell
            eyebrow="Step 1 of 2"
            title="Create your account"
            subtitle="The home for specialty coffee lovers."
            footer={
                <Link href={route('login')} className="font-semibold text-caramel hover:text-caramel-hover">
                    Already registered? Log in
                </Link>
            }
        >
            <Head title="Register" />

            <form onSubmit={submit} className="space-y-4">
                <Input
                    name="name"
                    label="Name"
                    value={data.name}
                    autoComplete="name"
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
                    autoComplete="username"
                    error={errors.email}
                    onChange={(e) => setData('email', e.target.value)}
                    required
                />
                <Input
                    name="password"
                    label="Password"
                    type="password"
                    value={data.password}
                    autoComplete="new-password"
                    error={errors.password}
                    onChange={(e) => setData('password', e.target.value)}
                    hint="At least 8 characters."
                    required
                />
                <Input
                    name="password_confirmation"
                    label="Confirm Password"
                    type="password"
                    value={data.password_confirmation}
                    autoComplete="new-password"
                    error={errors.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    required
                />
                <Button type="submit" loading={processing} className="w-full">
                    Create Account
                </Button>
                <p className="text-center text-[11px] leading-relaxed text-mocha">
                    By joining you agree to share your tasting notes with the community.
                </p>
            </form>
        </AuthShell>
    );
}

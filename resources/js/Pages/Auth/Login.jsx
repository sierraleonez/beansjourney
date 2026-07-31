import AuthShell from '../../Layouts/AuthShell';
import Input from '../../Components/Input';
import Button from '../../Components/Button';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const redirect = new URL(window.location.href).searchParams.get('redirect') ?? '';
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
        redirect,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthShell
            eyebrow="Welcome back"
            title="Log in"
            subtitle="Pick up where you left off — your reviews, recipes, and upvotes are waiting."
            footer={
                canResetPassword && (
                    <>
                        <Link href={route('password.request')} className="font-semibold text-caramel hover:text-caramel-hover">
                            Forgot your password?
                        </Link>
                        {' · '}
                        <Link href={route('register')} className="font-semibold text-caramel hover:text-caramel-hover">
                            Join Free
                        </Link>
                    </>
                )
            }
        >
            <Head title="Log in" />

            {status && (
                <p className="mb-4 rounded-md border border-successborder bg-successbg px-3 py-2 text-[13px] font-medium text-success">
                    {status}
                </p>
            )}

            <form onSubmit={submit} className="space-y-4">
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
                    autoComplete="current-password"
                    error={errors.password}
                    onChange={(e) => setData('password', e.target.value)}
                    required
                />
                <label className="flex items-center gap-2 text-[13px] text-mocha">
                    <input
                        type="checkbox"
                        name="remember"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                        className="h-4 w-4 rounded border-line text-caramel focus:ring-caramel"
                    />
                    Remember me
                </label>
                <Button type="submit" loading={processing} className="w-full">
                    Log In
                </Button>
            </form>
        </AuthShell>
    );
}

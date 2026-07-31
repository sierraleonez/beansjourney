import AuthShell from '../../Layouts/AuthShell';
import Input from '../../Components/Input';
import Button from '../../Components/Button';
import { Head, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthShell
            eyebrow="Set a new password"
            title="Choose a new password"
            subtitle="Make it a good one — you'll use it to log in from now on."
            footer={
                <a href={route('login')} className="font-semibold text-caramel hover:text-caramel-hover">
                    Back to log in
                </a>
            }
        >
            <Head title="Reset Password" />

            {errors.token && (
                <div className="mb-4 rounded-md border border-error bg-error/10 px-3 py-2 text-[13px] font-medium text-error">
                    <p>{errors.token}</p>
                    <a href={route('password.request')} className="mt-1 inline-block font-semibold text-caramel hover:text-caramel-hover">
                        Send a new reset link
                    </a>
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <Input
                    name="email"
                    label="Email"
                    type="email"
                    value={data.email}
                    autoComplete="username"
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
                    Reset Password
                </Button>
            </form>
        </AuthShell>
    );
}

import AuthShell from '../../Layouts/AuthShell';
import Input from '../../Components/Input';
import Button from '../../Components/Button';
import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <AuthShell
            eyebrow="Forgot password"
            title="Reset your password"
            subtitle="Tell us the email you registered with and we'll send a reset link."
            footer={
                <a href={route('login')} className="font-semibold text-caramel hover:text-caramel-hover">
                    Back to log in
                </a>
            }
        >
            <Head title="Forgot Password" />

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
                    hint="The reset link expires in 30 minutes."
                    required
                />
                <Button type="submit" loading={processing} className="w-full">
                    Send Reset Link
                </Button>
            </form>
        </AuthShell>
    );
}

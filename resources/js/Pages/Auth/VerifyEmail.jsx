import AuthShell from '../../Layouts/AuthShell';
import Button from '../../Components/Button';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <AuthShell
            eyebrow="Step 2 of 2"
            title="Check your inbox"
            subtitle="We emailed you a verification link. Click it to activate your account — then you can review, share recipes, and upvote."
            footer={
                <Link href={route('logout')} method="post" as="button" className="font-semibold text-caramel hover:text-caramel-hover">
                    Log out
                </Link>
            }
        >
            <Head title="Email Verification" />

            {status === 'verification-link-sent' && (
                <p aria-live="polite" className="mb-4 rounded-md border border-successborder bg-successbg px-3 py-2 text-[13px] font-medium text-success">
                    Email sent! A fresh verification link is on its way to your inbox.
                </p>
            )}

            <form onSubmit={submit} className="space-y-4">
                <Button type="submit" loading={processing} className="w-full">
                    Resend Verification Email
                </Button>
            </form>
        </AuthShell>
    );
}

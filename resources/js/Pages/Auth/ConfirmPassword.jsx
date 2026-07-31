import AuthShell from '../../Layouts/AuthShell';
import Input from '../../Components/Input';
import Button from '../../Components/Button';
import { Head, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthShell eyebrow="Secure area" title="Confirm your password" subtitle="This is a secure area — please confirm your password before continuing.">
            <Head title="Confirm Password" />
            <form onSubmit={submit} className="space-y-4">
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
                <Button type="submit" loading={processing} className="w-full">
                    Confirm
                </Button>
            </form>
        </AuthShell>
    );
}

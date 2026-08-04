import AuthShell from '../../Layouts/AuthShell';
import Input from '../../Components/Input';
import Button from '../../Components/Button';
import { Head, useForm } from '@inertiajs/react';
import password from '../../routes/password';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(password.confirm.url(), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthShell eyebrow="Area aman" title="Konfirmasi kata sandimu" subtitle="Ini adalah area aman — mohon konfirmasi kata sandimu sebelum melanjutkan.">
            <Head title="Konfirmasi Kata Sandi" />
            <form onSubmit={submit} className="space-y-4">
                <Input
                    name="password"
                    label="Kata Sandi"
                    type="password"
                    value={data.password}
                    autoComplete="current-password"
                    error={errors.password}
                    onChange={(e) => setData('password', e.target.value)}
                    required
                />
                <Button type="submit" loading={processing} className="w-full">
                    Konfirmasi
                </Button>
            </form>
        </AuthShell>
    );
}

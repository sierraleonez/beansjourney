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
            eyebrow="Atur kata sandi baru"
            title="Pilih kata sandi baru"
            subtitle="Buat yang bagus — kamu akan memakainya untuk masuk mulai sekarang."
            footer={
                <a href={route('login')} className="font-semibold text-caramel hover:text-caramel-hover">
                    Kembali ke halaman masuk
                </a>
            }
        >
            <Head title="Atur Ulang Kata Sandi" />

            {errors.token && (
                <div className="mb-4 rounded-md border border-error bg-error/10 px-3 py-2 text-[13px] font-medium text-error">
                    <p>{errors.token}</p>
                    <a href={route('password.request')} className="mt-1 inline-block font-semibold text-caramel hover:text-caramel-hover">
                        Kirim tautan atur ulang baru
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
                    label="Kata Sandi"
                    type="password"
                    value={data.password}
                    autoComplete="new-password"
                    error={errors.password}
                    onChange={(e) => setData('password', e.target.value)}
                    hint="Minimal 8 karakter."
                    required
                />
                <Input
                    name="password_confirmation"
                    label="Konfirmasi Kata Sandi"
                    type="password"
                    value={data.password_confirmation}
                    autoComplete="new-password"
                    error={errors.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    required
                />
                <Button type="submit" loading={processing} className="w-full">
                    Atur Ulang Kata Sandi
                </Button>
            </form>
        </AuthShell>
    );
}

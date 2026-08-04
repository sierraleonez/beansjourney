import AuthShell from '../../Layouts/AuthShell';
import Button from '../../Components/Button';
import { Head, Link, useForm } from '@inertiajs/react';
import verification from '../../routes/verification';
import { logout } from '../../routes';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(verification.send.url());
    };

    return (
        <AuthShell
            eyebrow="Langkah 2 dari 2"
            title="Periksa kotak masukmu"
            subtitle="Kami telah mengirimkan tautan verifikasi ke emailmu. Klik untuk mengaktifkan akunmu — setelah itu kamu bisa menulis ulasan, membagikan resep, dan memberi dukungan."
            footer={
                <Link href={logout.url()} method="post" as="button" className="font-semibold text-caramel hover:text-caramel-hover">
                    Keluar
                </Link>
            }
        >
            <Head title="Verifikasi Email" />

            {status === 'verification-link-sent' && (
                <p aria-live="polite" className="mb-4 rounded-md border border-successborder bg-successbg px-3 py-2 text-[13px] font-medium text-success">
                    Email terkirim! Tautan verifikasi baru sedang menuju kotak masukmu.
                </p>
            )}

            <form onSubmit={submit} className="space-y-4">
                <Button type="submit" loading={processing} className="w-full">
                    Kirim Ulang Email Verifikasi
                </Button>
            </form>
        </AuthShell>
    );
}

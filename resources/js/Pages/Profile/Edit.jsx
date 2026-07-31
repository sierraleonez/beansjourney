import AppLayout from '../../Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AppLayout>
            <Head title="Profil" />
            <section className="mx-auto max-w-2xl py-10">
                <h1 className="text-display">Pengaturan Profil</h1>
                <p className="mt-2 text-[13.5px] text-mocha">
                    Perubahan akan berlaku di semua ulasan, resep, dan komentarmu yang sudah ada.
                </p>
                <div className="mt-8 space-y-6">
                    <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} />
                    <UpdatePasswordForm />
                    <DeleteUserForm />
                </div>
            </section>
        </AppLayout>
    );
}

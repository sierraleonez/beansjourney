import { Link, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Card from '../../Components/Card';
import Input from '../../Components/Input';
import Button from '../../Components/Button';
import roasteries from '../../routes/roasteries';

export default function RoasteryEdit({ roastery }) {
    const { data, setData, patch, processing, errors } = useForm({
        location: roastery.location ?? '',
        contact: roastery.contact ?? '',
        instagram: roastery.social?.instagram ?? '',
        website: roastery.social?.website ?? '',
    });

    const set = (key) => (event) => setData(key, event.target.value);

    const submit = (event) => {
        event.preventDefault();
        patch(roasteries.update.url(roastery.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <nav aria-label="Navigasi breadcrumb" className="pt-6">
                <ol className="flex items-center gap-1.5 text-[12px] text-mocha">
                    <li>
                        <Link href="/roasters" className="hover:text-brown">Roaster</Link>
                    </li>
                    <li aria-hidden="true">›</li>
                    <li>
                        <Link href={roasteries.show.url(roastery.id)} className="hover:text-brown">
                            {roastery.name}
                        </Link>
                    </li>
                    <li aria-hidden="true">›</li>
                    <li aria-current="page" className="font-semibold text-espresso">Edit</li>
                </ol>
            </nav>

            <section className="mx-auto max-w-2xl py-10">
                <h1 className="text-display">Edit Info Roastery</h1>
                <p className="mt-2 text-[14px] text-mocha">
                    Perbarui lokasi dan tautan sosial untuk {roastery.name}. Nama roastery tidak bisa diubah dari sini.
                </p>

                <Card className="mt-8 p-6 sm:p-8">
                    <form onSubmit={submit} className="space-y-5">
                        <Input
                            name="location"
                            label="Lokasi"
                            value={data.location}
                            onChange={set('location')}
                            error={errors.location}
                            placeholder="Bandung, Indonesia"
                        />
                        <Input
                            name="contact"
                            label="Kontak"
                            value={data.contact}
                            onChange={set('contact')}
                            error={errors.contact}
                            placeholder="email@roastery.com atau nomor WhatsApp"
                        />
                        <Input
                            name="instagram"
                            label="Instagram"
                            value={data.instagram}
                            onChange={set('instagram')}
                            error={errors.instagram}
                            placeholder="@namaroastery"
                        />
                        <Input
                            name="website"
                            label="Website"
                            value={data.website}
                            onChange={set('website')}
                            error={errors.website}
                            placeholder="https://namaroastery.com"
                        />

                        <Button type="submit" loading={processing}>
                            Simpan Perubahan
                        </Button>
                    </form>
                </Card>
            </section>
        </AppLayout>
    );
}

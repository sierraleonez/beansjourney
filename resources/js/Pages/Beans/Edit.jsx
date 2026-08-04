import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Card from '../../Components/Card';
import Input from '../../Components/Input';
import Button from '../../Components/Button';
import SearchableSelect from '../../Components/SearchableSelect';
import PhotoPicker from '../../Components/PhotoPicker';
import beans from '../../routes/beans';

const MAX_PHOTOS = 5;

const toDateInput = (value) => (value ? String(value).slice(0, 10) : '');

export default function BeanEdit({ bean, processes = [], origins = [], roastLevels = [], purposes = [] }) {
    const [removedIds, setRemovedIds] = useState([]);

    const { data, setData, post, processing, errors } = useForm({
        name: bean.name ?? '',
        description: bean.description ?? '',
        photos: [],
        remove_photo_ids: [],
        process_id: bean.process?.id ?? '',
        origin_id: bean.origin?.id ?? '',
        variety: bean.variety ?? '',
        flavour_perception: bean.flavour_perception ?? '',
        roast_date: toDateInput(bean.roast_date),
        roast_level_id: bean.roast_level?.id ?? '',
        purpose_id: bean.purpose?.id ?? '',
        purchased_on: toDateInput(bean.purchased_on),
        altitude: bean.altitude ?? '',
        _method: 'patch',
    });

    const set = (key) => (event) => setData(key, event.target.value);

    const remainingPhotos = bean.photos ?? [];
    const keptCount = remainingPhotos.filter((photo) => !removedIds.includes(photo.id)).length;
    const remainingSlots = MAX_PHOTOS - keptCount - data.photos.length;

    const toggleRemove = (photoId) => {
        const next = removedIds.includes(photoId)
            ? removedIds.filter((id) => id !== photoId)
            : [...removedIds, photoId];

        setRemovedIds(next);
        setData('remove_photo_ids', next);
    };

    const submit = (event) => {
        event.preventDefault();
        post(beans.update.url(bean.id), {
            forceFormData: true,
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
                        <Link href={beans.show.url(bean.id)} className="hover:text-brown">
                            {bean.name}
                        </Link>
                    </li>
                    <li aria-hidden="true">›</li>
                    <li aria-current="page" className="font-semibold text-espresso">Edit</li>
                </ol>
            </nav>

            <section className="mx-auto max-w-2xl py-10">
                <h1 className="text-display">Edit Bean</h1>
                <p className="mt-2 text-[14px] text-mocha">
                    Perbarui detail {bean.name}. Roastery pemilik bean ini tidak bisa diubah dari sini.
                </p>

                <Card className="mt-8 p-6 sm:p-8">
                    <form onSubmit={submit} className="space-y-5">
                        <Input
                            name="name"
                            label="Nama bean"
                            value={data.name}
                            onChange={set('name')}
                            error={errors.name}
                            placeholder="misalnya Ethiopia Bishan Beke"
                            required
                        />

                        <div>
                            <label htmlFor="description" className="mb-1.5 block text-[12.5px] font-semibold text-espresso">
                                Deskripsi
                            </label>
                            <textarea
                                id="description"
                                rows={3}
                                value={data.description}
                                onChange={set('description')}
                                placeholder="Deskripsi singkat tentang bean ini…"
                                className="input-field resize-y"
                            />
                            {errors.description && <p className="mt-1 text-[12.5px] font-medium text-error">{errors.description}</p>}
                        </div>

                        {remainingPhotos.length > 0 && (
                            <div>
                                <span className="mb-1.5 block text-[12.5px] font-semibold text-espresso">Foto saat ini</span>
                                <div className="flex flex-wrap gap-3">
                                    {remainingPhotos.map((photo) => {
                                        const removed = removedIds.includes(photo.id);
                                        return (
                                            <div key={photo.id} className="relative h-20 w-20 shrink-0">
                                                <img
                                                    src={photo.url}
                                                    alt="Foto bean"
                                                    className={`h-full w-full rounded-md object-cover ${removed ? 'opacity-30' : ''}`}
                                                />
                                                <button
                                                    type="button"
                                                    aria-label={removed ? 'Batalkan hapus foto ini' : 'Hapus foto ini'}
                                                    onClick={() => toggleRemove(photo.id)}
                                                    className={`absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-bold text-white shadow ${removed ? 'bg-mocha' : 'bg-espresso'}`}
                                                >
                                                    {removed ? '↺' : '✕'}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <PhotoPicker
                            id="edit-photos"
                            photos={data.photos}
                            onChange={(photos) => setData('photos', photos)}
                            remainingSlots={remainingSlots}
                            error={errors.photos}
                        />

                        <div className="grid gap-5 sm:grid-cols-2">
                            <SearchableSelect
                                name="process_id"
                                label="Proses"
                                value={data.process_id}
                                onChange={(val) => setData('process_id', val)}
                                options={processes}
                                error={errors.process_id}
                                placeholder="Natural, Washed…"
                                emptyText="Proses tidak ditemukan."
                            />
                            <SearchableSelect
                                name="origin_id"
                                label="Asal"
                                value={data.origin_id}
                                onChange={(val) => setData('origin_id', val)}
                                options={origins}
                                error={errors.origin_id}
                                placeholder="Ethiopia"
                                emptyText="Asal tidak ditemukan."
                            />
                            <Input name="variety" label="Varietas" value={data.variety} onChange={set('variety')} error={errors.variety} placeholder="Heirloom" />
                            <SearchableSelect
                                name="roast_level_id"
                                label="Tingkat sangrai"
                                value={data.roast_level_id}
                                onChange={(val) => setData('roast_level_id', val)}
                                options={roastLevels}
                                error={errors.roast_level_id}
                                placeholder="Light, Medium, Dark…"
                                emptyText="Tingkat sangrai tidak ditemukan."
                            />
                            <Input name="roast_date" label="Tanggal sangrai" type="date" value={data.roast_date} onChange={set('roast_date')} error={errors.roast_date} />
                            <Input name="purchased_on" label="Tanggal dibeli" type="date" value={data.purchased_on} onChange={set('purchased_on')} error={errors.purchased_on} />
                            <SearchableSelect
                                name="purpose_id"
                                label="Peruntukan"
                                value={data.purpose_id}
                                onChange={(val) => setData('purpose_id', val)}
                                options={purposes}
                                error={errors.purpose_id}
                                placeholder="Filter, Espresso…"
                                emptyText="Peruntukan tidak ditemukan."
                            />
                            <Input name="altitude" label="Ketinggian" value={data.altitude} onChange={set('altitude')} error={errors.altitude} placeholder="1900–2200m" />
                        </div>

                        <div>
                            <label htmlFor="flavour_perception" className="mb-1.5 block text-[12.5px] font-semibold text-espresso">
                                Persepsi rasa / catatan rasa
                            </label>
                            <textarea
                                id="flavour_perception"
                                rows={3}
                                value={data.flavour_perception}
                                onChange={set('flavour_perception')}
                                placeholder="Blueberry, dark chocolate, jasmine…"
                                className="input-field resize-y"
                            />
                            {errors.flavour_perception && <p className="mt-1 text-[12.5px] font-medium text-error">{errors.flavour_perception}</p>}
                        </div>

                        <Button type="submit" loading={processing}>
                            Simpan Perubahan
                        </Button>
                    </form>
                </Card>
            </section>
        </AppLayout>
    );
}

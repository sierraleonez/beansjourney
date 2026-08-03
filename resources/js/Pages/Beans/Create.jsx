import { useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Card from '../../Components/Card';
import Input from '../../Components/Input';
import Button from '../../Components/Button';
import SearchableSelect from '../../Components/SearchableSelect';

export default function BeanCreate({ roasteries = [], processes = [], origins = [], roastLevels = [], purposes = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        roastery_name: '',
        name: '',
        description: '',
        photo: null,
        process_id: '',
        origin_id: '',
        variety: '',
        flavour_perception: '',
        roast_date: '',
        roast_level_id: '',
        purpose_id: '',
        purchased_on: '',
        altitude: '',
    });

    const set = (key) => (event) => setData(key, event.target.value);
    const setPhoto = (event) => setData('photo', event.target.files?.[0] ?? null);

    const submit = (event) => {
        event.preventDefault();
        post(route('beans.store'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout>
            <section className="mx-auto max-w-2xl py-10">
                <h1 className="text-display">Tambahkan Bean</h1>
                <p className="mt-2 text-[14px] text-mocha">
                    Tambahkan bean ke katalog. Kalau roasterynya belum ada, kami akan membuatkannya — keduanya langsung
                    muncul di katalog.
                </p>

                <Card className="mt-8 p-6 sm:p-8">
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <SearchableSelect
                                creatable
                                name="roastery_name"
                                label="Roastery"
                                value={data.roastery_name}
                                onChange={(val) => setData('roastery_name', val)}
                                options={roasteries}
                                error={errors.roastery_name}
                                placeholder="misalnya Sweet Bloom Coffee Roasters"
                                hint="Dibuat otomatis kalau belum ada."
                                required
                            />
                        </div>
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

                        <div>
                            <label htmlFor="photo" className="mb-1.5 block text-[12.5px] font-semibold text-espresso">
                                Foto
                            </label>
                            <input
                                id="photo"
                                type="file"
                                accept="image/*"
                                onChange={setPhoto}
                                className="input-field"
                            />
                            {errors.photo && <p className="mt-1 text-[12.5px] font-medium text-error">{errors.photo}</p>}
                        </div>

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
                            Tambahkan Bean ke Katalog
                        </Button>
                    </form>
                </Card>
            </section>
        </AppLayout>
    );
}

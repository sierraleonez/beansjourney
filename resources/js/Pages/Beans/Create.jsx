import { useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Card from '../../Components/Card';
import Input from '../../Components/Input';
import Button from '../../Components/Button';

export default function BeanCreate() {
    const { data, setData, post, processing, errors, reset } = useForm({
        roastery_name: '',
        name: '',
        description: '',
        photo: null,
        process: '',
        origin: '',
        variety: '',
        flavour_perception: '',
        roast_date: '',
        roast_profile: '',
        purpose: '',
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
                            <Input
                                name="roastery_name"
                                label="Roastery"
                                value={data.roastery_name}
                                onChange={set('roastery_name')}
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
                            <Input name="process" label="Proses" value={data.process} onChange={set('process')} error={errors.process} placeholder="Natural, Washed…" />
                            <Input name="origin" label="Asal" value={data.origin} onChange={set('origin')} error={errors.origin} placeholder="Ethiopia" />
                            <Input name="variety" label="Varietas" value={data.variety} onChange={set('variety')} error={errors.variety} placeholder="Heirloom" />
                            <Input name="roast_profile" label="Tingkat sangrai" value={data.roast_profile} onChange={set('roast_profile')} error={errors.roast_profile} placeholder="Light, Medium, Dark…" />
                            <Input name="roast_date" label="Tanggal sangrai" type="date" value={data.roast_date} onChange={set('roast_date')} error={errors.roast_date} />
                            <Input name="purchased_on" label="Tanggal dibeli" type="date" value={data.purchased_on} onChange={set('purchased_on')} error={errors.purchased_on} />
                            <Input name="purpose" label="Peruntukan" value={data.purpose} onChange={set('purpose')} error={errors.purpose} placeholder="Filter, Espresso…" />
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

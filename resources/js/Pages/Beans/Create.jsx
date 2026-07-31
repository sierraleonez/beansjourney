import { useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Card from '../../Components/Card';
import Input from '../../Components/Input';
import Button from '../../Components/Button';

export default function BeanCreate() {
    const { data, setData, post, processing, errors, reset } = useForm({
        roastery_name: '',
        name: '',
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
                <h1 className="text-display">Submit a Bean</h1>
                <p className="mt-2 text-[14px] text-mocha">
                    Add a bean to the catalog. If its roastery doesn't exist yet, we'll create it — you'll see both in
                    the catalog right away.
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
                                placeholder="e.g. Sweet Bloom Coffee Roasters"
                                hint="Created automatically if it doesn't exist yet."
                                required
                            />
                        </div>
                        <Input
                            name="name"
                            label="Bean name"
                            value={data.name}
                            onChange={set('name')}
                            error={errors.name}
                            placeholder="e.g. Ethiopia Bishan Beke"
                            required
                        />

                        <div className="grid gap-5 sm:grid-cols-2">
                            <Input name="process" label="Process" value={data.process} onChange={set('process')} error={errors.process} placeholder="Natural, Washed…" />
                            <Input name="origin" label="Origin" value={data.origin} onChange={set('origin')} error={errors.origin} placeholder="Ethiopia" />
                            <Input name="variety" label="Variety" value={data.variety} onChange={set('variety')} error={errors.variety} placeholder="Heirloom" />
                            <Input name="roast_profile" label="Roast profile" value={data.roast_profile} onChange={set('roast_profile')} error={errors.roast_profile} placeholder="Light, Medium, Dark…" />
                            <Input name="roast_date" label="Roast date" type="date" value={data.roast_date} onChange={set('roast_date')} error={errors.roast_date} />
                            <Input name="purchased_on" label="Purchased on" type="date" value={data.purchased_on} onChange={set('purchased_on')} error={errors.purchased_on} />
                            <Input name="purpose" label="Purpose" value={data.purpose} onChange={set('purpose')} error={errors.purpose} placeholder="Filter, Espresso…" />
                            <Input name="altitude" label="Altitude" value={data.altitude} onChange={set('altitude')} error={errors.altitude} placeholder="1900–2200m" />
                        </div>

                        <div>
                            <label htmlFor="flavour_perception" className="mb-1.5 block text-[12.5px] font-semibold text-espresso">
                                Flavour perception / tasting notes
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
                            Add Bean to Catalog
                        </Button>
                    </form>
                </Card>
            </section>
        </AppLayout>
    );
}

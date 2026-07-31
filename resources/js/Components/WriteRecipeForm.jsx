import { useForm } from '@inertiajs/react';
import Button from './Button';
import Card from './Card';
import Input from './Input';
import Pill from './Pill';
import { cn } from '../lib/utils';

const methods = [
    { value: 'americano', label: 'Americano' },
    { value: 'espresso', label: 'Espresso' },
    { value: 'v60', label: 'V60' },
    { value: 'french_press', label: 'French Press' },
    { value: 'aeropress', label: 'AeroPress' },
    { value: 'tubruk', label: 'Tubruk' },
    { value: 'other', label: 'Other' },
];

const initialState = {
    brew_method: 'v60',
    dose_ratio: '',
    grind_size: '',
    water_temp: '',
    tools: [{ tool: '', detail: '' }],
    process: '',
    tasting_notes: '',
};

export default function WriteRecipeForm({ beanId }) {
    const { data, setData, post, processing, errors, reset, transform } = useForm(initialState);

    transform((formData) => ({
        ...formData,
        tools: Object.fromEntries(
            (formData.tools ?? [])
                .filter((item) => item.tool.trim())
                .map((item) => [item.tool.trim(), item.detail.trim()]),
        ),
    }));

    const updateTool = (index, field, value) => {
        setData('tools', data.tools.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
    };

    const submit = (event) => {
        event.preventDefault();
        post(route('recipes.store', beanId), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <Card className="p-5 sm:p-6">
            <h3 className="text-[17px]">Share how you brew this bean</h3>
            <p className="mt-1 text-[12.5px] text-mocha">
                Help the community discover the best way to enjoy it. Structured fields plus your free-text process.
            </p>
            <form onSubmit={submit} className="mt-4 space-y-4">
                <div>
                    <span className="mb-1.5 block text-[12.5px] font-semibold text-espresso">Brew method</span>
                    <div role="radiogroup" aria-label="Brew method" className="flex flex-wrap gap-2">
                        {methods.map((method) => (
                            <button
                                key={method.value}
                                type="button"
                                role="radio"
                                aria-checked={data.brew_method === method.value}
                                onClick={() => setData('brew_method', method.value)}
                                className={cn(
                                    'rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors',
                                    data.brew_method === method.value
                                        ? 'border-caramel bg-caramel text-white'
                                        : 'border-line bg-white text-mocha hover:border-brown hover:text-brown',
                                )}
                            >
                                {method.label}
                            </button>
                        ))}
                    </div>
                    {errors.brew_method && <p className="mt-1 text-[12.5px] font-medium text-error">{errors.brew_method}</p>}
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <Input name="dose_ratio" label="Dose / ratio" value={data.dose_ratio} onChange={(event) => setData('dose_ratio', event.target.value)} error={errors.dose_ratio} placeholder="1:15" />
                    <Input name="grind_size" label="Grind size" value={data.grind_size} onChange={(event) => setData('grind_size', event.target.value)} error={errors.grind_size} placeholder="Medium-fine" />
                    <Input name="water_temp" label="Water temp" value={data.water_temp} onChange={(event) => setData('water_temp', event.target.value)} error={errors.water_temp} placeholder="91°C" />
                </div>

                <div>
                    <span className="mb-1.5 block text-[12.5px] font-semibold text-espresso">Tools used</span>
                    <div className="space-y-2">
                        {data.tools.map((item, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    aria-label="Tool name"
                                    className="input-field"
                                    value={item.tool}
                                    placeholder="e.g. Grinder"
                                    onChange={(event) => updateTool(index, 'tool', event.target.value)}
                                />
                                <input
                                    aria-label="Tool detail"
                                    className="input-field"
                                    value={item.detail}
                                    placeholder="e.g. 1Zpresso K-Ultra"
                                    onChange={(event) => updateTool(index, 'detail', event.target.value)}
                                />
                                <button
                                    type="button"
                                    className="btn-icon shrink-0"
                                    aria-label="Remove tool"
                                    disabled={data.tools.length === 1}
                                    onClick={() => setData('tools', data.tools.filter((_, i) => i !== index))}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="text-[12px] font-semibold text-caramel hover:text-caramel-hover"
                            onClick={() => setData('tools', [...data.tools, { tool: '', detail: '' }])}
                        >
                            + Add tool
                        </button>
                    </div>
                    {errors.tools && <p className="mt-1 text-[12.5px] font-medium text-error">{errors.tools}</p>}
                </div>

                <div>
                    <label htmlFor={`recipe-process-${beanId}`} className="mb-1.5 block text-[12.5px] font-semibold text-espresso">
                        Brewing process
                    </label>
                    <textarea
                        id={`recipe-process-${beanId}`}
                        rows={5}
                        maxLength={10000}
                        value={data.process}
                        onChange={(event) => setData('process', event.target.value)}
                        placeholder="Step-by-step: bloom, pours, timings, agitation…"
                        className="input-field resize-y"
                    />
                    {errors.process && <p className="mt-1 text-[12.5px] font-medium text-error">{errors.process}</p>}
                </div>

                <div>
                    <label htmlFor={`recipe-notes-${beanId}`} className="mb-1.5 block text-[12.5px] font-semibold text-espresso">
                        Tasting notes
                    </label>
                    <textarea
                        id={`recipe-notes-${beanId}`}
                        rows={3}
                        maxLength={5000}
                        value={data.tasting_notes}
                        onChange={(event) => setData('tasting_notes', event.target.value)}
                        placeholder="What does this recipe bring out of the bean?"
                        className="input-field resize-y"
                    />
                    {errors.tasting_notes && <p className="mt-1 text-[12.5px] font-medium text-error">{errors.tasting_notes}</p>}
                </div>

                <div className="flex items-center gap-2">
                    <Button type="submit" loading={processing}>
                        Share a Recipe
                    </Button>
                    {data.brew_method && <Pill variant="caramel">{methods.find((m) => m.value === data.brew_method)?.label}</Pill>}
                </div>
            </form>
        </Card>
    );
}

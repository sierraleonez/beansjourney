import { useState } from 'react';
import { Combobox } from '@headlessui/react';
import { cn } from '../lib/utils';

export default function SearchableSelect({
    id,
    name,
    label,
    value,
    onChange,
    options,
    placeholder = 'Cari atau pilih…',
    emptyText = 'Tidak ditemukan.',
    error,
    hint,
    required = false,
    className,
    creatable = false,
}) {
    const [query, setQuery] = useState('');
    const inputId = id ?? name;

    const filtered =
        query === ''
            ? options
            : options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));

    const matchedOption = options.find((option) => String(option.value) === String(value));
    // In creatable mode, `value` may be a free-typed string that isn't one of the
    // curated options — fall back to a synthetic option so it still displays correctly.
    const selected = matchedOption ?? (creatable && value ? { value, label: String(value) } : null);

    const trimmedQuery = query.trim();
    const showCreateOption =
        creatable &&
        trimmedQuery !== '' &&
        !options.some((option) => option.label.toLowerCase() === trimmedQuery.toLowerCase());
    const createOption = showCreateOption ? { value: trimmedQuery, label: trimmedQuery } : null;

    const handleChange = (option) => {
        setQuery('');
        onChange(option?.value ?? '');
    };

    const handleBlur = () => {
        if (!creatable) return;
        // Commit free-typed text even if the user clicks/tabs away instead of
        // explicitly picking the "use this" suggestion.
        if (trimmedQuery !== '' && trimmedQuery !== (selected?.label ?? '')) {
            onChange(trimmedQuery);
        }
        setQuery('');
    };

    return (
        <div className="space-y-1.5">
            {label && (
                <label htmlFor={inputId} className="block text-[12.5px] font-semibold text-espresso">
                    {label}
                    {required && <span className="text-error"> *</span>}
                </label>
            )}
            <Combobox
                value={selected}
                onChange={handleChange}
                by={(a, b) => String(a?.value) === String(b?.value)}
            >
                <div className="relative">
                    <Combobox.Input
                        id={inputId}
                        name={name}
                        className={cn('input-field', error && 'border-error', className)}
                        displayValue={(option) => option?.label ?? ''}
                        onChange={(event) => setQuery(event.target.value)}
                        onBlur={handleBlur}
                        placeholder={placeholder}
                        autoComplete="off"
                    />
                    <Combobox.Options className="card-surface absolute z-20 mt-1 max-h-60 w-full overflow-auto p-1 shadow-lg empty:invisible">
                        {filtered.length === 0 && !createOption ? (
                            <div className="px-3 py-2 text-[13px] text-mocha">{emptyText}</div>
                        ) : (
                            <>
                                {filtered.map((option) => (
                                    <Combobox.Option
                                        key={option.value}
                                        value={option}
                                        className={({ active }) =>
                                            cn(
                                                'cursor-pointer rounded-md px-3 py-2 text-[14px]',
                                                active ? 'bg-card text-brown' : 'text-espresso',
                                            )
                                        }
                                    >
                                        {option.label}
                                    </Combobox.Option>
                                ))}
                                {createOption && (
                                    <Combobox.Option
                                        value={createOption}
                                        className={({ active }) =>
                                            cn(
                                                'cursor-pointer rounded-md px-3 py-2 text-[14px] italic',
                                                active ? 'bg-card text-brown' : 'text-espresso',
                                            )
                                        }
                                    >
                                        Gunakan "{trimmedQuery}"
                                    </Combobox.Option>
                                )}
                            </>
                        )}
                    </Combobox.Options>
                </div>
            </Combobox>
            {hint && !error && <p className="text-[12px] text-mocha">{hint}</p>}
            {error && (
                <p className="text-[12px] font-medium text-error" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}

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
}) {
    const [query, setQuery] = useState('');
    const inputId = id ?? name;

    const filtered =
        query === ''
            ? options
            : options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));

    const selected = options.find((option) => String(option.value) === String(value)) ?? null;

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
                onChange={(option) => onChange(option?.value ?? '')}
                by={(a, b) => String(a?.value) === String(b?.value)}
            >
                <div className="relative">
                    <Combobox.Input
                        id={inputId}
                        name={name}
                        className={cn('input-field', error && 'border-error', className)}
                        displayValue={(option) => option?.label ?? ''}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={placeholder}
                        autoComplete="off"
                    />
                    <Combobox.Options className="card-surface absolute z-20 mt-1 max-h-60 w-full overflow-auto p-1 shadow-lg empty:invisible">
                        {filtered.length === 0 ? (
                            <div className="px-3 py-2 text-[13px] text-mocha">{emptyText}</div>
                        ) : (
                            filtered.map((option) => (
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
                            ))
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

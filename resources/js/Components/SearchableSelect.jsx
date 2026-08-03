import { useMemo, useState } from 'react';
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { cn } from '../lib/utils';

/**
 * A searchable dropdown built on top of @headlessui/react's Combobox.
 *
 * Two modes:
 * - Strict (default): the user must pick one of `options`. `onChange` fires with the
 *   selected option's `value`.
 * - Creatable (`creatable`): the user may type arbitrary free text. `onChange` fires with
 *   the typed string on every keystroke, and picking an existing option from the dropdown
 *   just replaces the typed text with that option's label (handy for "type a name, we'll
 *   create it if it doesn't exist yet" fields like Roastery).
 */
export default function SearchableSelect({
    id,
    name,
    label,
    value,
    onChange,
    options = [],
    placeholder,
    emptyText = 'Tidak ada hasil.',
    error,
    hint,
    required,
    className,
    creatable = false,
}) {
    const [query, setQuery] = useState('');
    const selectId = id ?? name;

    const filteredOptions = useMemo(() => {
        if (query === '') {
            return options;
        }

        const needle = query.toLowerCase();

        return options.filter((option) => option.label.toLowerCase().includes(needle));
    }, [query, options]);

    const selectedOption = useMemo(
        () => options.find((option) => option.value === value) ?? null,
        [options, value],
    );

    const comboboxValue = creatable ? (value ?? '') : selectedOption;

    const displayValue = creatable ? (val) => val ?? '' : (option) => option?.label ?? '';

    const handleOptionSelect = (option) => {
        if (!option) {
            if (!creatable) {
                onChange(null);
            }

            return;
        }

        onChange(creatable ? option.label : option.value);
    };

    const handleInputChange = (event) => {
        setQuery(event.target.value);

        if (creatable) {
            onChange(event.target.value);
        }
    };

    return (
        <div className={cn('space-y-1.5', className)}>
            {label && (
                <label htmlFor={selectId} className="block text-[12.5px] font-semibold text-espresso">
                    {label}
                </label>
            )}
            <Combobox value={comboboxValue} onChange={handleOptionSelect} onClose={() => setQuery('')} immediate>
                <div className="relative">
                    <ComboboxInput
                        id={selectId}
                        name={name}
                        className={cn('input-field', error && 'border-error')}
                        displayValue={displayValue}
                        onChange={handleInputChange}
                        placeholder={placeholder}
                        autoComplete="off"
                        required={required}
                    />
                    <ComboboxOptions className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-md border border-line bg-white py-1 shadow-lift empty:hidden">
                        {filteredOptions.length === 0 ? (
                            <div className="px-3.5 py-2 text-[13px] text-mocha">{emptyText}</div>
                        ) : (
                            filteredOptions.map((option) => (
                                <ComboboxOption
                                    key={option.value}
                                    value={option}
                                    className="cursor-pointer px-3.5 py-2 text-[13.5px] text-espresso data-[focus]:bg-card data-[selected]:font-semibold"
                                >
                                    {option.label}
                                </ComboboxOption>
                            ))
                        )}
                    </ComboboxOptions>
                </div>
            </Combobox>
            {hint && !error && <p className="text-[12px] text-mocha">{hint}</p>}
            {error && <p className="mt-1 text-[12px] font-medium text-error" role="alert">{error}</p>}
        </div>
    );
}

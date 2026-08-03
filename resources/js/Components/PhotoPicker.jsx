import { useEffect, useState } from 'react';

export default function PhotoPicker({ photos, onChange, remainingSlots, error, id = 'photos' }) {
    const [previews, setPreviews] = useState([]);

    useEffect(() => {
        const urls = photos.map((file) => URL.createObjectURL(file));
        setPreviews(urls);

        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [photos]);

    const addFiles = (event) => {
        const files = Array.from(event.target.files ?? []);
        event.target.value = '';

        if (files.length === 0) {
            return;
        }

        onChange([...photos, ...files].slice(0, photos.length + remainingSlots));
    };

    const removeAt = (index) => {
        onChange(photos.filter((_, i) => i !== index));
    };

    return (
        <div>
            <label htmlFor={id} className="mb-1.5 block text-[12.5px] font-semibold text-espresso">
                Tambah foto
            </label>
            <input
                id={id}
                type="file"
                accept="image/*"
                multiple
                disabled={remainingSlots <= 0}
                onChange={addFiles}
                className="input-field"
            />
            <p className="mt-1 text-[12px] text-mocha">
                {remainingSlots > 0
                    ? `Bisa tambah ${remainingSlots} foto lagi (maksimal 5 total).`
                    : 'Sudah mencapai batas maksimal 5 foto.'}
            </p>
            {error && <p className="mt-1 text-[12.5px] font-medium text-error">{error}</p>}

            {photos.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-3">
                    {photos.map((file, index) => (
                        <div key={index} className="relative h-20 w-20 shrink-0">
                            <img
                                src={previews[index]}
                                alt={`Pratinjau foto ${index + 1}`}
                                className="h-full w-full rounded-md object-cover"
                            />
                            <button
                                type="button"
                                aria-label="Hapus foto ini"
                                onClick={() => removeAt(index)}
                                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-espresso text-[12px] font-bold text-white shadow"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

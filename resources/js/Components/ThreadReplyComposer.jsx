import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import Button from './Button';
import GateBanner from './GateBanner';
import comments from '../routes/comments';

export default function ThreadReplyComposer({ commentableType, commentableId, canReply }) {
    const { auth } = usePage().props;
    const [body, setBody] = useState('');
    const [loading, setLoading] = useState(false);

    if (!canReply) {
        const isGuest = !auth.user;

        return (
            <GateBanner
                variant={isGuest ? 'guest' : 'unverified'}
                redirectTo={isGuest ? undefined : 'verification.notice'}
                action={isGuest ? 'Masuk untuk ikut diskusi' : 'Verifikasi email untuk bergabung'}
                message={
                    isGuest
                        ? 'Komentar membantu komunitas menentukan pilihan dan menyeduh lebih baik. Yuk, tambahkan komentarmu di utas ini.'
                        : 'Akunmu sudah terdaftar, tapi belum sepenuhnya aktif. Verifikasi email untuk ikut berdiskusi.'
                }
            />
        );
    }

    const submit = (event) => {
        event.preventDefault();
        if (!body.trim()) return;
        setLoading(true);
        router.post(
            comments.store.url(),
            {
                commentable_type: commentableType,
                commentable_id: commentableId,
                body,
            },
            { preserveScroll: true, onFinish: () => setLoading(false) },
        );
    };

    return (
        <form onSubmit={submit} className="card-surface p-5">
            <label htmlFor={`reply-${commentableType}-${commentableId}`} className="text-[12.5px] font-semibold text-espresso">
                Tambahkan ke diskusi
            </label>
            <textarea
                id={`reply-${commentableType}-${commentableId}`}
                rows={3}
                maxLength={5000}
                required
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Apa yang berhasil buat kamu? Apa yang ingin kamu ubah?"
                className="input-field mt-2 resize-y"
            />
            <div className="mt-3">
                <Button type="submit" loading={loading}>
                    Kirim Komentar
                </Button>
            </div>
        </form>
    );
}

import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import Card from '../../../Components/Card';
import Button from '../../../Components/Button';
import Input from '../../../Components/Input';
import Modal from '../../../Components/Modal';

export default function DeleteUserForm({ className = '' }) {
    const [confirming, setConfirming] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirming(false);
        clearErrors();
        reset();
    };

    return (
        <Card className={`p-6 sm:p-8 ${className}`}>
            <h2 className="text-[22px]">Delete account</h2>
            <p className="mt-1 text-[12.5px] text-mocha">
                Deleting your account is permanent: your profile is removed and you'll be signed out. Your posts stay
                visible, attributed to a deleted profile.
            </p>
            <Button variant="ghost" onClick={() => setConfirming(true)} className="mt-4 border-error text-error hover:bg-error hover:text-white hover:border-error">
                Delete Account
            </Button>

            <Modal open={confirming} onClose={closeModal} title="Delete your account?" labelledBy="delete-user-title">
                <h2 id="delete-user-title" className="sr-only">
                    Delete your account?
                </h2>
                <form onSubmit={deleteUser} className="space-y-4">
                    <p className="text-[13px] text-mocha">
                        Please enter your password to confirm you'd like to permanently delete your account.
                    </p>
                    <Input
                        name="password"
                        label="Password"
                        type="password"
                        ref={passwordInput}
                        value={data.password}
                        error={errors.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="current-password"
                        required
                    />
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button type="submit" loading={processing} className="bg-error hover:bg-error">
                            Delete Account
                        </Button>
                    </div>
                </form>
            </Modal>
        </Card>
    );
}

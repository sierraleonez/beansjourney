import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import Card from '../../../Components/Card';
import Button from '../../../Components/Button';
import Input from '../../../Components/Input';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errs) => {
                if (errs.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errs.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <Card className={`p-6 sm:p-8 ${className}`}>
            <h2 className="text-[22px]">Update password</h2>
            <p className="mt-1 text-[12.5px] text-mocha">
                Ensure your account is using a long, random password to stay secure.
            </p>

            <form onSubmit={updatePassword} className="mt-6 space-y-5">
                <Input
                    name="current_password"
                    label="Current password"
                    type="password"
                    ref={currentPasswordInput}
                    value={data.current_password}
                    error={errors.current_password}
                    onChange={(e) => setData('current_password', e.target.value)}
                    autoComplete="current-password"
                    required
                />
                <Input
                    name="password"
                    label="New password"
                    type="password"
                    ref={passwordInput}
                    value={data.password}
                    error={errors.password}
                    onChange={(e) => setData('password', e.target.value)}
                    autoComplete="new-password"
                    required
                />
                <Input
                    name="password_confirmation"
                    label="Confirm new password"
                    type="password"
                    value={data.password_confirmation}
                    error={errors.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    autoComplete="new-password"
                    required
                />

                <div className="flex items-center gap-4">
                    <Button type="submit" loading={processing}>
                        Save
                    </Button>
                    {recentlySuccessful && (
                        <p aria-live="polite" className="text-[13px] font-semibold text-success">
                            Saved.
                        </p>
                    )}
                </div>
            </form>
        </Card>
    );
}

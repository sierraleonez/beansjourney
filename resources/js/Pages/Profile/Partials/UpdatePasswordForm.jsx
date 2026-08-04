import { useForm } from "@inertiajs/react";
import { useRef } from "react";
import Button from "../../../Components/Button";
import Card from "../../../Components/Card";
import Input from "../../../Components/Input";
import password from "../../../routes/password";

export default function UpdatePasswordForm({ className = "" }) {
	const passwordInput = useRef();
	const currentPasswordInput = useRef();

	const { data, setData, errors, put, reset, processing, recentlySuccessful } =
		useForm({
			current_password: "",
			password: "",
			password_confirmation: "",
		});

	const updatePassword = (e) => {
		e.preventDefault();

		put(password.update.url(), {
			preserveScroll: true,
			onSuccess: () => reset(),
			onError: (errs) => {
				if (errs.password) {
					reset("password", "password_confirmation");
					passwordInput.current?.focus();
				}

				if (errs.current_password) {
					reset("current_password");
					currentPasswordInput.current?.focus();
				}
			},
		});
	};

	return (
		<Card className={`p-6 sm:p-8 ${className}`}>
			<h2 className="text-[22px]">Perbarui kata sandi</h2>
			<p className="mt-1 text-[12.5px] text-mocha">
				Pastikan akunmu menggunakan kata sandi yang panjang dan acak agar tetap
				aman.
			</p>

			<form onSubmit={updatePassword} className="mt-6 space-y-5">
				<Input
					name="current_password"
					label="Kata sandi saat ini"
					type="password"
					ref={currentPasswordInput}
					value={data.current_password}
					error={errors.current_password}
					onChange={(e) => setData("current_password", e.target.value)}
					autoComplete="current-password"
					required
				/>
				<Input
					name="password"
					label="Kata sandi baru"
					type="password"
					ref={passwordInput}
					value={data.password}
					error={errors.password}
					onChange={(e) => setData("password", e.target.value)}
					autoComplete="new-password"
					required
				/>
				<Input
					name="password_confirmation"
					label="Konfirmasi kata sandi baru"
					type="password"
					value={data.password_confirmation}
					error={errors.password_confirmation}
					onChange={(e) => setData("password_confirmation", e.target.value)}
					autoComplete="new-password"
					required
				/>

				<div className="flex items-center gap-4">
					<Button type="submit" loading={processing}>
						Simpan
					</Button>
					{recentlySuccessful && (
						<p
							aria-live="polite"
							className="text-[13px] font-semibold text-success"
						>
							Tersimpan.
						</p>
					)}
				</div>
			</form>
		</Card>
	);
}

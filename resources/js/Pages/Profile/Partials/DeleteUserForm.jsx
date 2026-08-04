import { useForm } from "@inertiajs/react";
import { useRef, useState } from "react";
import Button from "../../../Components/Button";
import Card from "../../../Components/Card";
import Input from "../../../Components/Input";
import Modal from "../../../Components/Modal";
import profile from "../../../routes/profile";

export default function DeleteUserForm({ className = "" }) {
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
		password: "",
	});

	const deleteUser = (e) => {
		e.preventDefault();

		destroy(profile.destroy.url(), {
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
			<h2 className="text-[22px]">Hapus akun</h2>
			<p className="mt-1 text-[12.5px] text-mocha">
				Menghapus akun bersifat permanen: profilmu akan dihapus dan kamu akan
				keluar dari sesi. Postinganmu tetap terlihat, atas nama profil yang
				telah dihapus.
			</p>
			<Button
				variant="ghost"
				onClick={() => setConfirming(true)}
				className="mt-4 border-error text-error hover:bg-error hover:text-white hover:border-error"
			>
				Hapus Akun
			</Button>

			<Modal
				open={confirming}
				onClose={closeModal}
				title="Hapus akunmu?"
				labelledBy="delete-user-title"
			>
				<h2 id="delete-user-title" className="sr-only">
					Hapus akunmu?
				</h2>
				<form onSubmit={deleteUser} className="space-y-4">
					<p className="text-[13px] text-mocha">
						Masukkan kata sandimu untuk mengonfirmasi bahwa kamu ingin menghapus
						akun secara permanen.
					</p>
					<Input
						name="password"
						label="Kata Sandi"
						type="password"
						ref={passwordInput}
						value={data.password}
						error={errors.password}
						onChange={(e) => setData("password", e.target.value)}
						autoComplete="current-password"
						required
					/>
					<div className="flex justify-end gap-2">
						<Button type="button" variant="ghost" onClick={closeModal}>
							Batal
						</Button>
						<Button
							type="submit"
							loading={processing}
							className="bg-error hover:bg-error"
						>
							Hapus Akun
						</Button>
					</div>
				</form>
			</Modal>
		</Card>
	);
}

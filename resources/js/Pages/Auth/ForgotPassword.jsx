import { Head, useForm } from "@inertiajs/react";
import Button from "../../Components/Button";
import Input from "../../Components/Input";
import AuthShell from "../../Layouts/AuthShell";
import { login } from "../../routes";
import password from "../../routes/password";

export default function ForgotPassword({ status }) {
	const { data, setData, post, processing, errors } = useForm({
		email: "",
	});

	const submit = (e) => {
		e.preventDefault();
		post(password.email.url());
	};

	return (
		<AuthShell
			eyebrow="Lupa kata sandi"
			title="Atur ulang kata sandimu"
			subtitle="Beri tahu kami email yang kamu gunakan saat mendaftar, dan kami akan mengirimkan tautan atur ulang."
			footer={
				<a
					href={login.url()}
					className="font-semibold text-caramel hover:text-caramel-hover"
				>
					Kembali ke halaman masuk
				</a>
			}
		>
			<Head title="Lupa Kata Sandi" />

			{status && (
				<p className="mb-4 rounded-md border border-successborder bg-successbg px-3 py-2 text-[13px] font-medium text-success">
					{status}
				</p>
			)}

			<form onSubmit={submit} className="space-y-4">
				<Input
					name="email"
					label="Email"
					type="email"
					value={data.email}
					autoComplete="username"
					error={errors.email}
					onChange={(e) => setData("email", e.target.value)}
					hint="Tautan atur ulang berlaku selama 30 menit."
					required
				/>
				<Button type="submit" loading={processing} className="w-full">
					Kirim Tautan Atur Ulang
				</Button>
			</form>
		</AuthShell>
	);
}

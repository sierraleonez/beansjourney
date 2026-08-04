import { Head, Link, useForm } from "@inertiajs/react";
import Button from "../../Components/Button";
import Input from "../../Components/Input";
import AuthShell from "../../Layouts/AuthShell";
import { login, register } from "../../routes";

export default function Register() {
	const { data, setData, post, processing, errors, reset } = useForm({
		name: "",
		email: "",
		password: "",
		password_confirmation: "",
	});

	const submit = (e) => {
		e.preventDefault();
		post(register.url(), {
			onFinish: () => reset("password", "password_confirmation"),
		});
	};

	return (
		<AuthShell
			eyebrow="Langkah 1 dari 2"
			title="Buat akunmu"
			subtitle="Rumah bagi pencinta kopi specialty."
			footer={
				<Link
					href={login.url()}
					className="font-semibold text-caramel hover:text-caramel-hover"
				>
					Sudah punya akun? Masuk
				</Link>
			}
		>
			<Head title="Daftar" />

			<form onSubmit={submit} className="space-y-4">
				<Input
					name="name"
					label="Nama"
					value={data.name}
					autoComplete="name"
					error={errors.name}
					onChange={(e) => setData("name", e.target.value)}
					hint="Nama ini akan ditampilkan di ulasan dan postinganmu."
					required
				/>
				<Input
					name="email"
					label="Email"
					type="email"
					value={data.email}
					autoComplete="username"
					error={errors.email}
					onChange={(e) => setData("email", e.target.value)}
					required
				/>
				<Input
					name="password"
					label="Kata Sandi"
					type="password"
					value={data.password}
					autoComplete="new-password"
					error={errors.password}
					onChange={(e) => setData("password", e.target.value)}
					hint="Minimal 8 karakter."
					required
				/>
				<Input
					name="password_confirmation"
					label="Konfirmasi Kata Sandi"
					type="password"
					value={data.password_confirmation}
					autoComplete="new-password"
					error={errors.password_confirmation}
					onChange={(e) => setData("password_confirmation", e.target.value)}
					required
				/>
				<Button type="submit" loading={processing} className="w-full">
					Buat Akun
				</Button>
				<p className="text-center text-[11px] leading-relaxed text-mocha">
					Dengan bergabung, kamu setuju untuk membagikan catatan rasamu dengan
					komunitas.
				</p>
			</form>
		</AuthShell>
	);
}

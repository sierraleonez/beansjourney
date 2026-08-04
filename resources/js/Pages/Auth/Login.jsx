import { Head, Link, useForm } from "@inertiajs/react";
import Button from "../../Components/Button";
import Input from "../../Components/Input";
import AuthShell from "../../Layouts/AuthShell";
import { login, register } from "../../routes";
import password from "../../routes/password";

export default function Login({ status, canResetPassword }) {
	const redirect =
		new URL(window.location.href).searchParams.get("redirect") ?? "";
	const { data, setData, post, processing, errors, reset } = useForm({
		email: "",
		password: "",
		remember: false,
		redirect,
	});

	const submit = (e) => {
		e.preventDefault();
		post(login.url(), {
			onFinish: () => reset("password"),
		});
	};

	return (
		<AuthShell
			eyebrow="Selamat datang kembali"
			title="Masuk"
			subtitle="Lanjutkan dari terakhir kali — ulasan, resep, dan dukunganmu sudah menunggu."
			footer={
				canResetPassword && (
					<>
						<Link
							href={password.request.url()}
							className="font-semibold text-caramel hover:text-caramel-hover"
						>
							Lupa kata sandi?
						</Link>
						{" · "}
						<Link
							href={register.url()}
							className="font-semibold text-caramel hover:text-caramel-hover"
						>
							Gabung Gratis
						</Link>
					</>
				)
			}
		>
			<Head title="Masuk" />

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
					required
				/>
				<Input
					name="password"
					label="Kata Sandi"
					type="password"
					value={data.password}
					autoComplete="current-password"
					error={errors.password}
					onChange={(e) => setData("password", e.target.value)}
					required
				/>
				<label className="flex items-center gap-2 text-[13px] text-mocha">
					<input
						type="checkbox"
						name="remember"
						checked={data.remember}
						onChange={(e) => setData("remember", e.target.checked)}
						className="h-4 w-4 rounded border-line text-caramel focus:ring-caramel"
					/>
					Ingat saya
				</label>
				<Button type="submit" loading={processing} className="w-full">
					Masuk
				</Button>
			</form>
		</AuthShell>
	);
}

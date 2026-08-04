import { Link } from "@inertiajs/react";
import { timeAgo } from "../lib/utils";
import recipes from "../routes/recipes";
import Avatar from "./Avatar";
import Card from "./Card";
import Pill from "./Pill";
import VoteButton from "./VoteButton";

const brewLabels = {
	americano: "Americano",
	espresso: "Espresso",
	v60: "V60",
	french_press: "French Press",
	aeropress: "AeroPress",
	tubruk: "Tubruk",
	other: "Lainnya",
};

export default function RecipeCard({ recipe }) {
	const tools = recipe.tools ?? {};

	return (
		<Card className="flex gap-4 p-5 sm:p-6">
			<VoteButton
				votableType="recipe"
				votableId={recipe.id}
				votesCount={recipe.votes_count}
				votedByUser={recipe.voted_by_user}
			/>
			<div className="min-w-0 flex-1">
				<div className="flex items-center gap-3">
					<Avatar name={recipe.author?.name} size={36} />
					<div>
						<p className="text-sm font-bold">
							{recipe.author?.name ?? "Pengguna terhapus"}
						</p>
						<span className="text-[11px] text-mocha">
							{timeAgo(recipe.created_at)}
						</span>
					</div>
				</div>

				<div className="mt-3 flex flex-wrap items-center gap-2">
					<Pill variant="caramel">
						{brewLabels[recipe.brew_method] ?? recipe.brew_method}
					</Pill>
					{recipe.dose_ratio && (
						<Pill variant="neutral">Dosis {recipe.dose_ratio}</Pill>
					)}
					{recipe.grind_size && (
						<Pill variant="neutral">Gilingan {recipe.grind_size}</Pill>
					)}
					{recipe.water_temp && (
						<Pill variant="neutral">{recipe.water_temp}</Pill>
					)}
				</div>

				{Object.keys(tools).length > 0 && (
					<p className="mt-3 text-[12px] text-mocha">
						Alat:{" "}
						{Object.entries(tools)
							.map(([tool, detail]) => `${tool}${detail ? ` (${detail})` : ""}`)
							.join(" · ")}
					</p>
				)}

				{recipe.tasting_notes && (
					<p className="mt-3 whitespace-pre-line text-[14px] leading-relaxed text-espresso">
						{recipe.tasting_notes}
					</p>
				)}

				<p className="mt-3 flex items-center gap-3 text-[12px] font-semibold text-mocha">
					<span>{recipe.votes_count} dukungan</span>
					<Link
						href={recipes.show.url(recipe.id)}
						className="text-caramel hover:text-caramel-hover"
					>
						Buka utas · {recipe.comment_count} komentar →
					</Link>
				</p>
			</div>
		</Card>
	);
}

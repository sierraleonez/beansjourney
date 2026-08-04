import { Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import { timeAgo } from "../lib/utils";
import comments from "../routes/comments";
import Avatar from "./Avatar";
import Button from "./Button";
import VoteButton from "./VoteButton";

function DeletedPlaceholder() {
	return <span className="italic text-mocha">[dihapus]</span>;
}

function CommentItem({
	comment,
	commentableType,
	commentableId,
	canReply,
	threadAuthorId,
	authUser,
	rootId,
	onExpand,
}) {
	const [replying, setReplying] = useState(false);
	const [replyBody, setReplyBody] = useState("");
	const [posting, setPosting] = useState(false);

	const isAuthor =
		authUser && comment.author && authUser.id === comment.author.id;
	const isOP = comment.author && threadAuthorId === comment.author.id;

	const reply = (event) => {
		event.preventDefault();
		if (!replyBody.trim()) return;
		setPosting(true);
		router.post(
			comments.store.url(),
			{
				commentable_type: commentableType,
				commentable_id: commentableId,
				parent_id: comment.id,
				body: replyBody,
			},
			{
				preserveScroll: true,
				onFinish: () => setPosting(false),
				onSuccess: () => {
					if (comment.parent_id && rootId) {
						const url = new URL(window.location.href);
						url.searchParams.set("expand_root", rootId);
						router.visit(`${url.pathname}${url.search}`, {
							preserveScroll: true,
						});
					}
				},
			},
		);
	};

	const remove = () => {
		if (window.confirm("Hapus komentar ini? Balasannya akan tetap terlihat.")) {
			router.delete(comments.destroy.url(comment.id), { preserveScroll: true });
		}
	};

	const deleteButton = isAuthor && !comment.deleted && (
		<button
			type="button"
			onClick={remove}
			className="text-[12px] font-semibold text-error hover:opacity-80"
		>
			Hapus
		</button>
	);

	const replyButton = canReply && !comment.deleted && (
		<button
			type="button"
			onClick={() => setReplying((value) => !value)}
			className="text-[12px] font-semibold text-caramel hover:text-caramel-hover"
		>
			Balas
		</button>
	);

	return (
		<div className="flex gap-3">
			<Avatar name={comment.author?.name} size={32} className="mt-0.5" />
			<div className="min-w-0 flex-1">
				<div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
					<span className="text-[13px] font-bold">
						{comment.author?.name ?? "Pengguna terhapus"}
					</span>
					{isOP && (
						<span className="text-[10.5px] font-bold text-caramel">OP</span>
					)}
					<span className="text-[11px] text-mocha">
						{timeAgo(comment.created_at)}
					</span>
				</div>
				{comment.reply_to && (
					<p className="mt-0.5 text-[12px] font-medium text-mocha">
						→ membalas {comment.reply_to}
					</p>
				)}
				<p className="mt-1 text-[13.5px] leading-relaxed">
					{comment.deleted ? <DeletedPlaceholder /> : comment.body}
				</p>

				<div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
					{!comment.deleted && (
						<VoteButton
							size="xs"
							votableType="comment"
							votableId={comment.id}
							votesCount={comment.votes_count}
							votedByUser={comment.voted_by_user}
						/>
					)}
					{replyButton}
					{deleteButton}
				</div>

				{replying && (
					<form onSubmit={reply} className="mt-3 flex gap-2">
						<textarea
							aria-label="Tulis balasan"
							rows={2}
							maxLength={5000}
							value={replyBody}
							onChange={(event) => setReplyBody(event.target.value)}
							placeholder="Bagikan pendapatmu…"
							className="input-field resize-y"
						/>
						<div className="flex shrink-0 flex-col gap-1.5">
							<Button type="submit" loading={posting} className="px-4 py-2">
								Kirim
							</Button>
							<button
								type="button"
								onClick={() => setReplying(false)}
								className="text-[12px] font-semibold text-mocha hover:text-brown"
							>
								Batal
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}

function RootComment({
	comment,
	commentableType,
	commentableId,
	canReply,
	threadAuthorId,
	authUser,
}) {
	const hasCollapsed = comment.collapsed_count > 0;

	const expand = () => {
		const url = new URL(window.location.href);
		url.searchParams.set("expand_root", comment.id);
		router.visit(`${url.pathname}${url.search}`, { preserveScroll: true });
	};

	return (
		<div className="border-b border-line py-5 last:border-b-0">
			<CommentItem
				comment={comment}
				commentableType={commentableType}
				commentableId={commentableId}
				canReply={canReply}
				threadAuthorId={threadAuthorId}
				authUser={authUser}
				rootId={comment.id}
			/>
			{comment.children.length > 0 && (
				<div className="ml-5 mt-3 space-y-4 border-l-2 border-line pl-5 sm:ml-9">
					{comment.children.map((child) => (
						<CommentItem
							key={child.id}
							comment={child}
							commentableType={commentableType}
							commentableId={commentableId}
							canReply={canReply}
							threadAuthorId={threadAuthorId}
							authUser={authUser}
							rootId={comment.id}
						/>
					))}
				</div>
			)}
			{hasCollapsed && (
				<button
					type="button"
					onClick={expand}
					className="ml-5 mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-caramel hover:text-caramel-hover sm:ml-9"
				>
					<svg
						aria-hidden="true"
						viewBox="0 0 20 20"
						fill="currentColor"
						className="h-3.5 w-3.5"
					>
						<path
							fillRule="evenodd"
							d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4z"
							clipRule="evenodd"
						/>
					</svg>
					Muat {comment.collapsed_count} komentar lagi
				</button>
			)}
		</div>
	);
}

export default function CommentThread({
	comments,
	commentableType,
	commentableId,
	canReply,
	threadAuthorId,
}) {
	const { auth } = usePage().props;

	if (!comments.roots.length) {
		return (
			<p className="py-4 text-center text-[13px] text-mocha">
				Belum ada komentar — yuk, mulai obrolannya.
			</p>
		);
	}

	return (
		<div className="divide-y-0">
			{comments.roots.map((comment) => (
				<RootComment
					key={comment.id}
					comment={comment}
					commentableType={commentableType}
					commentableId={commentableId}
					canReply={canReply}
					threadAuthorId={threadAuthorId}
					authUser={auth.user}
				/>
			))}
			{comments.next_page_url && (
				<div className="flex justify-center pt-4">
					<Link href={comments.next_page_url} className="btn-ghost">
						Muat lebih banyak komentar
					</Link>
				</div>
			)}
		</div>
	);
}

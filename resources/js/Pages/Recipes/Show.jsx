import { Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Card from '../../Components/Card';
import Avatar from '../../Components/Avatar';
import Pill from '../../Components/Pill';
import VoteButton from '../../Components/VoteButton';
import CommentThread from '../../Components/CommentThread';
import ThreadReplyComposer from '../../Components/ThreadReplyComposer';
import { timeAgo } from '../../lib/utils';

const brewLabels = {
    americano: 'Americano',
    espresso: 'Espresso',
    v60: 'V60',
    french_press: 'French Press',
    aeropress: 'AeroPress',
    tubruk: 'Tubruk',
    other: 'Lainnya',
};

export default function RecipeShow({ recipe, bean, comments, commentCount, canReply, isAuthor }) {
    const threadAuthorId = recipe.author?.id;
    const tools = recipe.tools ?? {};

    return (
        <AppLayout>
            <nav aria-label="Navigasi breadcrumb" className="pt-6">
                <ol className="flex items-center gap-1.5 text-[12px] text-mocha">
                    <li>
                        <Link href="/roasters" className="hover:text-brown">Roaster</Link>
                    </li>
                    <li aria-hidden="true">›</li>
                    <li>
                        <Link href={bean.roastery ? route('roasteries.show', bean.roastery.id) : '/roasters'} className="hover:text-brown">
                            {bean.roastery?.name ?? 'Roaster tidak diketahui'}
                        </Link>
                    </li>
                    <li aria-hidden="true">›</li>
                    <li>
                        <Link href={route('beans.show', bean.id)} className="hover:text-brown">
                            {bean.name}
                        </Link>
                    </li>
                    <li aria-hidden="true">›</li>
                    <li aria-current="page" className="font-semibold text-espresso">Resep</li>
                </ol>
            </nav>

            <section className="py-8">
                <h1 className="text-display-sm">
                    Menyeduh {bean.name} — {brewLabels[recipe.brew_method] ?? recipe.brew_method}
                </h1>
                <p className="mt-1 text-[13px] text-mocha">
                    oleh {bean.roastery?.name ?? 'Roaster tidak diketahui'}{bean.roastery?.location ? ` · ${bean.roastery.location}` : ''}
                </p>

                <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
                    <div className="min-w-0">
                        <Card className="flex gap-4 p-6 sm:p-8">
                            <VoteButton
                                votableType="recipe"
                                votableId={recipe.id}
                                votesCount={recipe.votes_count}
                                votedByUser={recipe.voted_by_user}
                            />
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-3">
                                    <Avatar name={recipe.author?.name} size={44} />
                                    <div>
                                        <p className="text-sm font-bold">{recipe.author?.name ?? 'Pengguna terhapus'}</p>
                                        <span className="text-[11px] text-mocha">{timeAgo(recipe.created_at)}</span>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    <Pill variant="caramel">{brewLabels[recipe.brew_method] ?? recipe.brew_method}</Pill>
                                    {recipe.dose_ratio && <Pill variant="neutral">Dosis {recipe.dose_ratio}</Pill>}
                                    {recipe.grind_size && <Pill variant="neutral">Gilingan {recipe.grind_size}</Pill>}
                                    {recipe.water_temp && <Pill variant="neutral">{recipe.water_temp}</Pill>}
                                </div>

                                {Object.keys(tools).length > 0 && (
                                    <div className="mt-4">
                                        <h2 className="eyebrow">Alat</h2>
                                        <ul className="mt-1.5 flex flex-wrap gap-2">
                                            {Object.entries(tools).map(([tool, detail]) => (
                                                <Pill key={tool} variant="neutral">
                                                    {tool}{detail ? ` · ${detail}` : ''}
                                                </Pill>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {recipe.process && (
                                    <div className="mt-5">
                                        <h2 className="eyebrow">Proses</h2>
                                        <p className="mt-1.5 whitespace-pre-line text-[14.5px] leading-relaxed">{recipe.process}</p>
                                    </div>
                                )}

                                {recipe.tasting_notes && (
                                    <div className="mt-5">
                                        <h2 className="eyebrow">Catatan rasa</h2>
                                        <p className="mt-1.5 whitespace-pre-line text-[14.5px] leading-relaxed">{recipe.tasting_notes}</p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        <div className="mt-8">
                            <h2 className="text-[22px]">Diskusi</h2>
                            <p className="mt-1 text-[12.5px] text-mocha">
                                {commentCount} komentar
                            </p>
                            <div className="card-surface mt-4 p-2 sm:p-4">
                                <CommentThread
                                    comments={comments}
                                    commentableType="recipe"
                                    commentableId={recipe.id}
                                    canReply={canReply}
                                    threadAuthorId={threadAuthorId}
                                />
                            </div>
                            <div className="mt-6">
                                <ThreadReplyComposer
                                    commentableType="recipe"
                                    commentableId={recipe.id}
                                    canReply={canReply}
                                />
                            </div>
                        </div>
                    </div>

                    <aside className="space-y-5">
                        <Card className="p-5">
                            <h3 className="text-[17px]">{bean.name}</h3>
                            <p className="mt-1 text-[12.5px] text-mocha">{bean.roastery?.name ?? 'Roaster tidak diketahui'}</p>
                            <Link href={route('beans.show', bean.id)} className="btn-ghost mt-4 w-full">
                                Lihat halaman bean
                            </Link>
                        </Card>
                        <Card className="p-5">
                            <h3 className="eyebrow">Komunitas</h3>
                            <dl className="mt-2 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-mocha">Dukungan</dt>
                                    <dd className="font-bold">{recipe.votes_count}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-mocha">Komentar</dt>
                                    <dd className="font-bold">{commentCount}</dd>
                                </div>
                            </dl>
                        </Card>
                    </aside>
                </div>
            </section>
        </AppLayout>
    );
}

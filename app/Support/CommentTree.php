<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Builds the nested comment tree for a thread (Review or Recipe).
 *
 * At most two visual indent tiers are ever produced (EXPERIENCE.md): roots
 * render their direct replies indented 44px; deeper descendants collapse into
 * a "Load N more comments" per root and render flat with a "replying to"
 * attribution once expanded.
 */
class CommentTree
{
    public const PER_PAGE = 5;
    public const REPLIES_SHOWN = 5;

    public static function for(Model $commentable, ?int $viewerId, int $page = 1, ?int $expandRoot = null): array
    {
        $voteScope = fn ($q) => $viewerId ? $q->where('user_id', $viewerId) : $q->whereRaw('1 = 0');

        /** @var LengthAwarePaginator $roots */
        $roots = $commentable->comments()
            ->withTrashed()
            ->rootOnly()
            ->with('user:id,name,bio')
            ->withCount('votes')
            ->withExists(['votes as voted_by_user' => $voteScope])
            ->orderBy('created_at')
            ->paginate(self::PER_PAGE, ['*'], 'page', $page);

        $comments = $commentable->comments()
            ->withTrashed()
            ->with('user:id,name,bio')
            ->withCount('votes')
            ->withExists(['votes as voted_by_user' => $voteScope])
            ->orderBy('created_at')
            ->get();
        $childrenMap = self::childrenMap($comments);
        $idsByUser = $comments->pluck('user_id', 'id');
        $namesById = \App\Models\User::query()->whereIn('id', $idsByUser->unique())->pluck('name', 'id');

        $rootNodes = [];
        foreach ($roots->items() as $root) {
            $expanded = $expandRoot !== null && (int) $expandRoot === (int) $root->id;
            $descendants = self::bfs($childrenMap, (int) $root->id);
            $direct = [];
            $deeper = [];
            foreach ($descendants as $node) {
                if ($node->parent_id === $root->id) {
                    $direct[] = $node;
                } else {
                    $deeper[] = $node;
                }
            }

            $shown = $expanded
                ? array_merge($direct, $deeper)
                : array_slice($direct, 0, self::REPLIES_SHOWN);

            $replyTo = static function (Model $node) use ($root, $idsByUser, $namesById): ?string {
                if ($node->parent_id === $root->id) {
                    return null;
                }

                return $namesById->get($idsByUser->get($node->parent_id));
            };

            $rootNodes[] = PostPresenter::comment($root, $viewerId) + [
                'children' => array_map(
                    fn (Model $node) => PostPresenter::comment($node, $viewerId) + ['reply_to' => $replyTo($node)],
                    $shown,
                ),
                'collapsed_count' => count($descendants) - count($shown),
                'expanded' => $expanded,
            ];
        }

        return [
            'roots' => $rootNodes,
            'next_page_url' => $roots->nextPageUrl(),
            'prev_page_url' => $roots->previousPageUrl(),
            'total' => $roots->total(),
            'page' => $roots->currentPage(),
            'last_page' => $roots->lastPage(),
        ];
    }

    private static function childrenMap(Collection $comments): array
    {
        $map = [];
        foreach ($comments as $comment) {
            if ($comment->parent_id) {
                $map[$comment->parent_id][] = $comment;
            }
        }

        return $map;
    }

    private static function bfs(array $childrenMap, int $rootId): array
    {
        $result = [];
        $queue = [$rootId];

        while ($queue) {
            $id = array_shift($queue);
            foreach ($childrenMap[$id] ?? [] as $child) {
                $result[] = $child;
                $queue[] = $child->id;
            }
        }

        return $result;
    }
}

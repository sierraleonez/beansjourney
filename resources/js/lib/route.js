const routes = {
    'login': '/login',
    'logout': '/logout',
    'register': '/register',
    'password.request': '/forgot-password',
    'password.email': '/forgot-password',
    'password.store': '/reset-password',
    'password.confirm': '/confirm-password',
    'password.update': '/password',
    'verification.notice': '/verify-email',
    'verification.send': '/email/verification-notification',
    'profile.edit': '/profile',
    'profile.update': '/profile',
    'profile.destroy': '/profile',
    'beans.create': '/beans/new',
    'beans.store': '/beans',
    'beans.show': '/beans/{bean}',
    'roasteries.show': '/roasters/{roastery}',
    'reviews.store': '/beans/{bean}/reviews',
    'recipes.store': '/beans/{bean}/recipes',
    'reviews.show': '/reviews/{review}',
    'recipes.show': '/recipes/{recipe}',
    'comments.store': '/comments',
    'comments.destroy': '/comments/{comment}',
    'votes.toggle': '/votes',
};

export default function route(name, params) {
    let path = routes[name];

    if (!path) {
        throw new Error(`Unknown route name: ${name}`);
    }

    const query = [];

    if (params && typeof params === 'object') {
        for (const [key, value] of Object.entries(params)) {
            if (path.includes(`{${key}}`)) {
                path = path.replace(`{${key}}`, encodeURIComponent(value));
            } else if (value !== undefined && value !== null) {
                query.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
            }
        }
    } else if (params !== undefined && params !== null) {
        path = path.replace(/\{\w+\}/, encodeURIComponent(params));
    }

    return query.length ? `${path}?${query.join('&')}` : path;
}

const root = 'https://jsonplaceholder.typicode.com';

function arg(idx) {
  return function(...args) {
    return args[idx];
  };
}

function qps(params = {}) {
  return function() {
    let query = Object.keys(params).map(key => {
      let getter = params[key];
      let paramValue = getter;
      if (typeof getter === 'function') {
        paramValue = getter(...arguments);
      }

      return `${key}=${paramValue}`;
    }).join('&');
    return `?${query}`;
  };
}

function withPath(...args) {
  return function() {
    let path = args.map(x => {
      if (typeof x === 'function') {
        return x(...arguments);
      }

      return x;
    }).join('/').replace('/?', '?');

    return `${root}/${path}`;
  };
}

export default {
  posts: withPath('posts'),
  postById: withPath('posts', arg(0)),
  postComments: withPath('posts', arg(0), 'comments'),
  postsByUser: withPath('posts', qps({ userId: arg(0) })),
  comments: withPath('comments'),
  commentsForPost: withPath('comments', qps({ postId: arg(0) })),
  albums: withPath('albums'),
  photos: withPath('photos'),
  todos: withPath('todos'),
  users: withPath('users')
}

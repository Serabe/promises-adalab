import paths from  'promises/paths';
import get from 'promises/another-simple-get';

function sumAll(coll) {
  return coll.reduce((a, b) => a + b, 0);
}

function fetch(url, { method = 'GET' } = {}) {
  return new Promise(function(resolve, reject) {
    get(url, {
      method,
      callbacks: {
        load(res) {
          resolve(res.responseText);
        },
        error(reason) {
          reject(reason);
        }
      }
    });
  });
}

function getPosts(user) {
  return Promise.resolve(user)
    .then((user) => {
      console.log(`Requesting posts for user ${user.name}`);

      return fetch(paths.postsByUser(user.id))
    })
    .then(JSON.parse)
}

function countComments(post) {
  return Promise.resolve(post)
    .then((post) => {
      console.log(`Requesting comments for post "${post.title}"`);
      return fetch(paths.commentsForPost(post.id));
    })
    .then(JSON.parse)
    .then(comments => comments.length);
}

function getCommentsCount(user) {
  return getPosts(user)
    .then(posts => Promise.all(posts.map(countComments)))
    .then(sumAll)
}

export function init() {
  console.log('Requesting users');
  let userName, postTitle;
  let users = fetch(paths.users())
    .then(JSON.parse);
  let commentCounts = users.then(users => Promise.all(users.map(getCommentsCount)));
  Promise.all([users, commentCounts])
    .then(([users, commentCounts]) => {
      users.forEach((user, idx) => {
        console.info(`User ${user.name} has ${commentCounts[idx]} comments`);
      });
    })
    .catch(reason => console.error(reason));
}

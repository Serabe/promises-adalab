import paths from  'promises/paths';
import get from 'promises/another-simple-get';

function randomSample(collection) {
  const { length } = collection;
  return collection[Math.floor(Math.random() * length)];
};

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

function getRandomPost(user) {
  return Promise.resolve(user)
    .then((user) => {
      console.log(`Requesting posts for user ${user.name}`);

      return fetch(paths.postsByUser(user.id))
    })
    .then(JSON.parse)
    .then(randomSample);
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

function resolveAll(coll) {
  return new Promise(function(resolve, reject) {
    let count = coll.length;
    let result = new Array(count);
    let rejected = false;
    function pingResolve() {
      count = count - 1;
      if (!rejected && count === 0) {
        resolve(result);
      }
    }
    function thenCallback(index) {
      return function(value) {
        result[index] = value;
        pingResolve();
      }
    }
    function rejectCallback(reason) {
      if (!rejected) {
        rejected = true;
        reject(reason);
      }
    }
    coll.forEach((obj, idx) => {
      Promise.resolve(obj)
        .then(
          thenCallback(idx),
          rejectCallback
        );
    });
  });
}

export function init() {
  console.log('Requesting users');
  let userName, postTitle;
  let user = fetch(paths.users())
    .then(JSON.parse)
    .then(randomSample);
  let post = getRandomPost(user);
  let commentCount = countComments(post);
  resolveAll([user, post, commentCount])
    .then(([user, post, commentCount]) => {
      console.info(`User ${userName} has ${commentCount} comments in their post "${postTitle}"`);
    })
    .catch(reason => console.error(reason));
}

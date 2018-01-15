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

export function init() {
  console.log('Requesting users');
  let userName, postTitle;
  fetch(paths.users())
    .then(JSON.parse)
    .then(randomSample)
    .then(user => {
      userName = user.name;
      return user;
    })
    .then(getRandomPost)
    .then(post => {
      postTitle = post.title;
      return post;
    })
    .then(countComments)
    .then(commentCount => {
      console.info(`User ${userName} has ${commentCount} comments in their post "${postTitle}"`);
    })
    .catch(reason => console.error(reason));
}

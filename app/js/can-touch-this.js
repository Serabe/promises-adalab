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

export function init() {
  console.log('Requesting users');
  let userName, postTitle;
  fetch(paths.users())
    .then(JSON.parse)
    .then(randomSample)
    .then(user => {
      userName = user.name
      console.log(`Requesting posts for user ${userName}`);

      return fetch(paths.postsByUser(user.id))
    })
    .then(JSON.parse)
    .then(randomSample)
    .then(post => {
      postTitle = post.title;
      console.log(`Requesting comments for post "${postTitle}"`);
      return fetch(paths.commentsForPost(post.id));
    })
    .then(JSON.parse)
    .then(comments => {
      console.info(`User ${userName} has ${comments.length} comments in their post "${postTitle}"`);
    })
    .catch(reason => console.error(reason));
}

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
  fetch(paths.users())
    .then((txt) => {
      const user = randomSample(JSON.parse(txt));

      console.log(`Requesting posts for user ${user.name}`);
      fetch(paths.postsByUser(user.id))
        .then((txt) => {
          const post = randomSample(JSON.parse(txt));

          console.log(`Requesting comments for post "${post.title}"`);
          fetch(paths.commentsForPost(post.id))
            .then((txt) => {
              const comments = JSON.parse(txt);

              console.info(`User ${user.name} has ${comments.length} comments in their post "${post.title}"`);
            }, reason => console.error(reason));
        }, reason => console.error(reason));
    }, reason => console.error(reason));
}

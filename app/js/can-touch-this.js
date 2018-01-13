import paths from  'promises/paths';
import get from 'promises/another-simple-get';

function randomSample(collection) {
  const { length } = collection;
  return collection[Math.floor(Math.random() * length)];
};

export function init() {
  console.log('Requesting users');
  get(paths.users(), {
    method: 'GET',
    callbacks: {
      load(res) {
        const user = randomSample(JSON.parse(res.responseText));

        console.log(`Requesting posts for user ${user.name}`);
        get(paths.postsByUser(user.id), {
          method: 'GET',
          callbacks: {
            load(res) {
              const post = randomSample(JSON.parse(res.responseText));

              console.log(`Requesting comments for post "${post.title}"`);
              get(paths.commentsForPost(post.id), {
                method: 'GET',
                callbacks: {
                  load(res) {
                    const comments = JSON.parse(res.responseText);

                    console.info(`User ${user.name} has ${comments.length} comments in their post "${post.title}"`);
                  }
                }
              });
            }
          }
        });
      }
    }
  });
}

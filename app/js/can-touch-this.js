import paths from  'promises/paths';
import get from 'promises/another-simple-get';

function sumAll(coll) {
  return coll.reduce((a, b) => a + b, 0);
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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

async function getPosts(_user) {
  const user = await Promise.resolve(_user);
  console.log(`Requesting posts for user ${user.name}`);
  return JSON.parse(await fetch(paths.postsByUser(user.id)));
}

async function countComments(_post) {
  const post = await Promise.resolve(_post)
  console.log(`Requesting comments for post "${post.title}"`);
  const comments = JSON.parse(await fetch(paths.commentsForPost(post.id)));
  return comments.length;
}

async function getCommentsCount(user) {
  const posts = await getPosts(user)
  const commentCounts = await Promise.all(posts.map(countComments));
  return sumAll(commentCounts);
}

async function printUsersAndComments() {
  try {
    console.log('Requesting users');
    const users = JSON.parse(await fetch(paths.users()));

    let commentCounts = await Promise.all(users.map(getCommentsCount));

    for(let i = 0; i < users.length; i++) {
      console.info(`User ${users[i].name} has ${commentCounts[i]} comments`);
    }
  } catch(reason) {
    console.error(reason);
  }
}

function limit(ms) {
  timeout(ms).then(Promise.reject);
}

export async function init() {
  try {
    await Promise.race([printUsersAndComments(), limit(1500)])
  } catch(reason) {
    console.error('Timeout!');
  }
}

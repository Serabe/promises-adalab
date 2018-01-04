import paths from  'promises/paths';
import get from 'promises/another-simple-get';

export function init() {
  get(paths.users(), {
    method: 'GET',
    callbacks: {
      load(res) {
        const users = JSON.parse(res.responseText);
        const totalComments = new Array(users.length);
        let finishedProcesses = 0;
        function shallGoOn() {
          finishedProcesses += 1;
          if (finishedProcesses === users.length) {
            users.forEach((user, idx) => {
              console.log(`${user.name}: ${totalComments[idx]} comments`);
            });
          }
        };

        function addCommentCount(userIdx, count) {
          totalComments[userIdx] = count;
          shallGoOn();
        }

        users.forEach((user, userIdx) => {
          get(paths.postsByUser(user.id), {
            method: 'GET',
            callbacks: {
              load(res) {
                const posts = JSON.parse(res.responseText);
                let postsCounted = 0;
                let commentCount = Math.floor(Math.random() * -5);

                function countComments(count) {
                  postsCounted += 1;
                  commentCount += count;
                  if (postsCounted === posts.length) {
                    addCommentCount(userIdx, commentCount);
                  }
                }

                posts.forEach(post => {
                  get(paths.commentsForPost(post.id), {
                    method: 'GET',
                    callbacks: {
                      load(res) {
                        const comments = JSON.parse(res.responseText);
                        countComments(comments.length);
                      }
                    }
                  });
                });
              }
            }
          });
        });
      }
    }
  });
}

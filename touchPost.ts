import fs from 'fs/promises';
import inquirer from 'inquirer';
import path, { join } from 'path';
const postDirectory = path.join(process.cwd(), 'posts');
const draftDirectory = path.join(process.cwd(), 'drafts');

const updateOrCreateFrontMatter = (post, targetName, value) => {
  const lines = post.replace(/\r\n/g, '\n').split('\n');
  const newLine = `${targetName}: '${value}'`;
  let frontMatterEndIdx = -1,
    updated = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (i == 0 && line !== '---') {
      throw new Error('No front matter in this post!');
    } else if (i != 0 && line === '---') {
      frontMatterEndIdx = i;
      break;
    }

    const name = line.substring(0, line.indexOf(':'));
    if (name === targetName) {
      lines[i] = `${name}: '${value}'`;
      updated = true;
    }
  }

  if (!updated) {
    lines.splice(frontMatterEndIdx, 0, newLine);
  }
  return lines.join('\n');
};

(async () => {
  const drafts = await fs.readdir(draftDirectory);
  const posts = (await fs.readdir(postDirectory)).concat(drafts);
  const { selectedPost, whatToTouch } = await inquirer.prompt([
    {
      name: 'selectedPost',
      message: 'Post to touch date',
      type: 'list',
      choices: posts,
    },
    {
      name: 'whatToTouch',
      type: 'list',
      choices: [
        { name: 'Creation date', value: 'date' },
        { name: 'Last updated at', value: 'last_modified_at' },
      ],
      default: 'last_modified_at',
    },
  ]);

  const isDraftSelected = drafts.includes(selectedPost);
  const postPath = join(
    isDraftSelected ? draftDirectory : postDirectory,
    selectedPost
  );
  const post = await fs.readFile(postPath, {
    encoding: 'utf8',
  });
  const touchedPost = await updateOrCreateFrontMatter(
    post,
    whatToTouch,
    new Date().toISOString()
  );

  await fs.writeFile(postPath, touchedPost, { encoding: 'utf8' });
  console.log('Touched!');

  if (isDraftSelected) {
    const { moveToPost } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'moveToPost',
        message: 'Move from draft to post?',
        default: false,
      },
    ]);
    if (moveToPost) {
      const newPostPath = join(postDirectory, selectedPost);
      await fs.rename(postPath, newPostPath);
      console.log('Moved!');
    }
  }
  console.log('Done!');
})();

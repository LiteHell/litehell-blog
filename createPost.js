const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const postDirectory = path.join(process.cwd(), 'posts');

inquirer
  .prompt([
    {
      name: 'id',
      type: 'input',
      required: true,
      message: 'Post id?',
      validate: (input) => {
        if (fs.existsSync(path.join(postDirectory, input + '.md'))) {
          return 'Id already exists!';
        } else if (/[^a-zA-z0-9_]/.test(input)) {
          return 'Id should be conistsed of alphabets, numbers and underscore!';
        }
        return true;
      },
    },
    {
      required: true,
      name: 'title',
      type: 'input',
      message: 'Title?',
    },
    {
      name: 'subtitle',
      type: 'input',
      message: 'Subtitle?',
      default: '',
    },
    {
      name: 'author',
      type: 'input',
      message: 'Author?',
      default: 'LiteHell',
    },
    {
      name: 'category',
      type: 'input',
      message: 'category?',
      default: '',
      filter: (input) => (input === '' ? null : input),
    },
    {
      name: 'tags',
      type: 'input',
      message: 'Tags (separated with comma)?',
      default: '',
      filter: (input) =>
        input === '' ? null : input.split(',').map((i) => i.trim()),
    },
  ])
  .then((answers) => {
    let template = `---\n`;
    for (const i of ['title', 'subtitle', 'author'])
      template += `${i}: '${answers[i]}'\n`;
    template += `date: '${new Date().toISOString()}'\n`;
    if (answers.category) template += `category: '${answers.category}'\n`;
    if (answers.tags) {
      template += 'tags:\n';
      for (const tag of answers.tags) template += `    - '${tag}'\n`;
    }
    template += '---\nWrite something here';
    const filename = path.join(postDirectory, answers.id + '.md');
    fs.writeFile(filename, template, { encoding: 'utf8' }, (err) => {
      if (err) {
        console.error('Error while writing file!');
        console.error(err);
      } else {
        console.log('Done successfully!');
        process.exit();
      }
    });
  })
  .catch((err) => {
    console.error('Error while creating post');
    console.error(err);
  });

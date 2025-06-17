import { program } from "commander";
import { mkdirp } from "fs-extra";
import createTemplate from "./tool/createTemplate";
import inquireMissingPostHeaderValues from "./tool/inquireMissingPostHeaderValues";
import { readFile, rename, writeFile } from "fs/promises";
import path from "path";
import readPostAndDraftNames from "./tool/readPostAndDraftNames";
import inquirer from "inquirer";
import updateOrCreateFrontMatter from "./tool/updateOrCreateFrontMatter";

program
  .command("create")
  .description("Create a post or a draft")
  .argument("<id>", "post id")
  .option("--draft", "create as draft")
  .option("--title <title>", "post title")
  .option("--subtitle <subtitle>", "post subtitle")
  .option("--author [author]", "post author", "LiteHell")
  .option("--date [date]", "post write date", new Date().toISOString())
  .option("--tags [tags...]", "post tags")
  .option("--no-tags", "no tags")
  .action(async (id, { noTags, ...options }) => {
    if (/[^a-zA-Z0-9_]/.test(id)) {
      console.error(
        "Invalid id. post id should be alphabet/number/underscore."
      );
      return;
    }

    let dir = `./${options.draft ? "drafts" : "posts"}/${id}`;
    await mkdirp(dir);

    if (options.date) options.date = new Date(options.date);
    if (noTags) options.tags = [];

    const values = await inquireMissingPostHeaderValues(options);
    const template = createTemplate(values);

    await writeFile(path.join(dir, "ko.md"), template, "utf8");
    console.log("Done");
  });

program
  .command("touch")
  .argument("[id]", "id")
  .option(
    "--touch-type [touchType]",
    'specify what to touch, can be "date" or "last_modified_at"'
  )
  .option(
    "--language <language>",
    "language",
    "ko"
  )
  .action(async (selectedPost, { language, touchType }) => {
    const draftDirectory = "./drafts";
    const postDirectory = "./posts";
    const { drafts, posts } = await readPostAndDraftNames();

    if (typeof selectedPost === 'undefined') {
      selectedPost = (
        await inquirer.prompt([
          {
            name: "id",
            type: "select",
            message: "Select id to touch",
            choices: [...posts, ...drafts],
            loop: true,
          },
        ])
      ).id;
    }

    if (touchType !== 'date' && touchType !== 'last_modified_at') {
      touchType = (
        await inquirer.prompt([
          {
            name: "type",
            type: "select",
            message: "Select id to touch",
            choices: [
              { value: "date", name: "Creation date" },
              { value: "last_modified_at", name: "Last updated at" },
            ],
            loop: true,
          },
        ])
      ).type;
    }

    const isDraftSelected = drafts.includes(selectedPost);
    const postDir = path.join(
      isDraftSelected ? draftDirectory : postDirectory,
      selectedPost,)
    const postPath = path.join(
      postDir,
      `${language}.md`
    );
    const post = await readFile(postPath, {
      encoding: "utf8",
    });
    const touchedPost = await updateOrCreateFrontMatter(
      post,
      touchType,
      new Date().toISOString()
    );

    await writeFile(postPath, touchedPost, { encoding: "utf8" });
    console.log("Touched!");

    if (isDraftSelected) {
      const { moveToPost } = await inquirer.prompt([
        {
          type: "confirm",
          name: "moveToPost",
          message: "Move from draft to post?",
          default: false,
        },
      ]);
      if (moveToPost) {
        const newPostDir = path.join(postDirectory, selectedPost);
        await rename(postDir, newPostDir);
        console.log("Moved!");
      }
    }
    console.log("Done!");
  });

program.parse();

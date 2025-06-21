import inquirer from "inquirer";
import { PostHeader } from "./createTemplate";
import { UnnamedDistinctQuestion } from "inquirer/dist/commonjs/types";

export default async function inquireMissingPostHeaderValues(
  given: Partial<PostHeader>,
): Promise<PostHeader> {
  const questions: (UnnamedDistinctQuestion & { name: string })[] = [
    {
      name: "title",
      type: "input",
      message: "Post title?",
      required: true,
      validate: title => title.trim().length !== 0,
    },
    {
      name: "subtitle",
      type: "input",
      message: "Post subtitle?",
      required: true,
      validate: title => title.trim().length !== 0,
    },
    {
      name: "author",
      type: "input",
      message: "Post author?",
      required: true,
      validate: title => title.trim().length !== 0,
    },
    {
      name: "category",
      type: "input",
      message: "Post category?",
      filter: category =>
        category.trim().length === 0 ? null : category.trim(),
    },
    {
      name: "tags",
      type: "input",
      message: "Tags (separated with comma)?",
      filter: (tags: string) => {
        const parsed = tags
          .split(",")
          .map(i => i.trim())
          .filter(i => i.length !== 0)
          .reduce((prev, cur) => {
            if (!prev.includes(cur)) prev.push(cur);

            return prev;
          }, [] as string[]);

        if (parsed.length === 0) return null;
        else return parsed;
      },
    },
    {
      name: "date",
      type: "input",
      message: "Date?",
      required: true,
      default: new Date().toISOString(),
      validate: date => isNaN(Date.parse(date)),
      filter: date => new Date(date),
    },
  ];

  const givenKeys = Object.keys(given);
  const remaining = await inquirer.prompt(
    questions.filter(i => !givenKeys.includes(i.name)),
  );
  return { ...remaining, ...given } as PostHeader;
}

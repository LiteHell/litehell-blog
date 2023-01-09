import { existsSync, promises as fs } from 'fs';
import highlightJs from 'highlight.js';
import yaml from 'js-yaml';
import marked from 'marked';
import path from 'path';

export default class Blog {
  constructor() {
    this._pageDirectory = path.join(process.cwd(), 'posts');
    this._draftDirectory = path.join(process.cwd(), 'drafts');
    marked.use({
      highlight: (code, lang) => {
        if (lang === 'tsx') lang = 'ts';
        if (lang !== '') return highlightJs.highlight(lang, code).value;
        else return code;
      },
      langPrefix: 'hljs language-',
    });
  }

  async getArticleNames() {
    let names = await fs.readdir(this._pageDirectory, 'utf8');
    if (process.env.NODE_ENV === 'development') {
      names = names.concat(await fs.readdir(this._draftDirectory));
    }
    return names
      .filter((i) => i.endsWith('.md'))
      .map((i) => path.parse(i).name);
  }

  async _isDraft(articleName) {
    if (
      process.env.NODE_ENV !== 'development' ||
      existsSync(path.join(this._pageDirectory, articleName + '.md'))
    )
      return false;
    else if (existsSync(path.join(this._draftDirectory, articleName + '.md')))
      return true;
  }

  async getArticleList() {
    const names = await this.getArticleNames();
    const posts = await Promise.all(
      names.map(async (name) => {
        const source = await this.readSource(name);
        const { metadata } = await this.readMetadata(source);
        return {
          name,
          metadata,
        };
      })
    );
    return posts.sort((a, b) =>
      a.metadata.date && b.metadata.date
        ? Date.parse(b.metadata.date) - Date.parse(a.metadata.date)
        : 0
    );
  }

  async getCategories(withCount = false) {
    const articles = await this.getArticleList();
    if (withCount)
      return articles.reduce((prev, cur) => {
        if (!cur.metadata.category) return prev;
        const category = cur.metadata.category;
        if (!prev[category]) prev[category] = 1;
        else prev[category]++;
        return prev;
      }, {});
    else
      return articles.reduce((prev, cur) => {
        if (
          typeof cur.metadata.category === 'string' &&
          !prev.includes(cur.metadata.category)
        )
          prev.push(cur.metadata.category);
        return prev;
      }, []);
  }

  async getTags(withCount = false) {
    const articles = await this.getArticleList();
    if (withCount)
      return articles.reduce((prev, cur) => {
        if (!cur.metadata.tags) return prev;
        const tags = cur.metadata.tags;
        for (const tag of tags)
          if (!prev[tag]) prev[tag] = 1;
          else prev[tag]++;
        return prev;
      }, {});
    else
      return articles.reduce((prev, cur) => {
        if (cur.metadata.tags)
          for (const tag of cur.metadata.tags)
            if (!prev.includes(tag)) prev.push(tag);
        return prev;
      }, []);
  }

  async readSource(articleName) {
    const articlePath = path.join(
      (await this._isDraft(articleName))
        ? this._draftDirectory
        : this._pageDirectory,
      articleName + '.md'
    );
    const source = await fs.readFile(articlePath, { encoding: 'utf8' });

    return source.replace(/\r\n/g, '\n');
  }

  async readMetadata(source) {
    if (!source.startsWith('---\n')) {
      return {
        metadata: {},
        source,
      };
    }
    const metadataYamlEndsAt = source.indexOf('---\n', 4);
    const metadataYaml = source.substring(4, metadataYamlEndsAt);
    return {
      metadata: yaml.load(metadataYaml),
      source: source.substring(metadataYamlEndsAt + 4),
    };
  }

  async readArticle(articleName) {
    const sourceWithMetadata = await this.readSource(articleName);
    const { metadata, source } = await this.readMetadata(sourceWithMetadata);
    const rendered = marked(source);

    return {
      metadata,
      rendered,
    };
  }
}

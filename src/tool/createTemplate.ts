export type PostHeader = {
    title: string;
    subtitle: string;
    author: string;
    category?: string;
    tags?: string[];
    date: Date;
}

export default function createTemplate(options: PostHeader) {
    let template = `---\n`;
    
    // Write title, subtitle, author, date
    for (const i of ['title', 'subtitle', 'author'] as (keyof PostHeader)[]) {
        template += `${i}: '${options[i]}'\n`;
    }
    template += `date: '${options.date.toISOString()}'\n`;

    // Write category
    if (options.category) {
        template += `category: '${options.category}'\n`;
    }

    // Write tags
    if (options.tags) {
        template += 'tags:\n';
        for (const tag of options.tags)
            template += `    - '${tag}'\n`;
    }

    // Finish
    template += '---\nWrite something here';
    return template;
}

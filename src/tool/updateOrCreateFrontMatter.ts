
export default function updateOrCreateFrontMatter (post: string, targetName: string, value: string) {
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
}
export const Markdown = {
    BOLD: 'markdown_bold',
    ITALIC: 'markdown_italic',
    STRIKE_THROUGH: 'markdown_strike_through',
    CODE: 'markdown_code',
    FREE_TEXT: 'markdown_free_text',
}

export const MarkdownRegexp = {
    [Markdown.BOLD]: '\\*{2}',
    [Markdown.ITALIC]: '\\*{3}',
    [Markdown.STRIKE_THROUGH]: '~{2}',
    [Markdown.CODE]: '`',
}

export const MarkdownMarker = {
    BOLD: '**',
    ITALIC: '***',
    STRIKE_THROUGH: '~~',
    CODE: '`',
    FREE_TEXT: null,
}

export function getMarkdownType(marker) {
    const markdownKey = Object.keys(MarkdownMarker).find(key => MarkdownMarker[key] === marker);
    if (!markdownKey || !Markdown.hasOwnProperty(markdownKey)) {
        return Markdown.FREE_TEXT;
    }
    return Markdown[markdownKey];
}

export function getMarkdownRegexp(...types) {
    const filterTypes = types.filter(type => type !== Markdown.FREE_TEXT);

    const sortTypes = filterTypes.sort((a, b) => {
        const aMarker = getMarkdownMarker(a);
        const bMarker = getMarkdownMarker(b);
        return bMarker.length - aMarker.length;
    })
    const result = sortTypes.reduce((acc, type) => {
        if (!MarkdownRegexp.hasOwnProperty(type)) return acc;
        if (acc.length) acc += '|';
        acc += MarkdownRegexp[type];
        return acc;
    }, '')
    if (!result.length) return '';
    return new RegExp(`(${result})`, 'g')
}

export function getMarkdownMarker(type) {
    const markdownKey = Object.keys(Markdown).find(key => Markdown[key] === type);
    if (!markdownKey || !MarkdownMarker.hasOwnProperty(markdownKey)) {
        return MarkdownMarker.FREE_TEXT;
    }
    return MarkdownMarker[markdownKey];
}
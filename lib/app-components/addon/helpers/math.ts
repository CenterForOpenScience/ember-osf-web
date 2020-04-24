import Helper from '@ember/component/helper';
import { htmlSafe } from '@ember/string';
import katex, { KatexRenderOptions } from 'katex';

export interface Delimiter {
    start: string;
    end: string;
    inline: boolean;
}

interface Match {
    start: number;
    end: number;
    delimiter: Delimiter;
}

// Adapted from https://github.com/Khan/KaTeX/blob/master/contrib/auto-render/splitAtDelimiters.js
export function findEnd(content: string, start: number, end: string) {
    let contextLevel = 0;

    for (let i = start; i < content.length; i++) {
        if (contextLevel < 1 && content.startsWith(end, i)) {
            return i + end.length;
        } if (content[i] === '{') {
            contextLevel++;
        } else if (content[i] === '}') {
            contextLevel--;
        } else if (content[i] === '\\') {
            i++;
        }
    }

    return -1;
}

export function replace(content: string, delimiters: Delimiter[], callback: (exp: string, delim: Delimiter) => string) {
    const matches: Match[] = [];

    for (let i = 0; i < content.length; i++) {
        for (const delimiter of delimiters) {
            if (content.startsWith(delimiter.start, i)) {
                const start = i;
                const end = findEnd(content, i + delimiter.start.length, delimiter.end);

                // Skip empty matches and non-matches
                if (end === -1 || end === i + delimiter.start.length + delimiter.end.length) {
                    continue;
                }

                i = end;
                matches.push({ end, start, delimiter });
            }
        }
    }

    let index = 0;
    let result = '';

    for (const match of matches) {
        result += content.slice(index, match.start);
        result += callback(content.slice(
            match.start + match.delimiter.start.length,
            match.end - match.delimiter.end.length,
        ), match.delimiter);

        index = match.end;
    }

    return result + content.slice(index);
}

export const DELIMITERS: Delimiter[] = [
    { start: '$$', end: '$$', inline: false },
    { start: '\\[', end: '\\]', inline: false },
    { start: '$', end: '$', inline: true },
    { start: '\\(', end: '\\)', inline: true },
];

export default class MathHelper extends Helper {
    compute(params: string[]) {
        const renderOptions: KatexRenderOptions = {
            allowedProtocols: [],
        };

        return htmlSafe(replace(params[0], DELIMITERS, (expr, delim) => {
            try {
                return katex.renderToString(expr, {
                    ...renderOptions,
                    displayMode: !delim.inline,
                });
            } catch (e) {
                // If KaTeX fails to render, return the original expression
                return expr;
            }
        }));
    }
}

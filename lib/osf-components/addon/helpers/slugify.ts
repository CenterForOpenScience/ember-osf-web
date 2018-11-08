import { helper } from '@ember/component/helper';

export function slugify([text]: string[]): string {
    return text.toLowerCase().replace(/\s+/g, '-');
}

export default helper(slugify);

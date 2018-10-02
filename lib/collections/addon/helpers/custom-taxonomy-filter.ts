import { helper } from '@ember/component/helper';

export function customTaxonomyFilter([subject = '']: [string]) {
    return subject.split('|').pop() || subject;
}

export default helper(customTaxonomyFilter);

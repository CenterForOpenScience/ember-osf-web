import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
    tagName: 'span',
    i18n: service(),

    contributorList: computed('node.contributors', function() {
        let contribs = this.get('node.contributors');
        if (!contribs) {
            return;
        }
        const and = this.get('i18n').t('general.and');
        contribs = contribs.toArray();
        const len = contribs.length;
        const name = index => contribs[index].get('users.familyName') || contribs[index].get('users.givenName');
        switch (len) {
        case 1: return name(0);
        case 2: return `${name(0)} ${and} ${name(1)}`;
        case 3: return `${name(0)}, ${name(1)}, ${and} ${name(2)}`;
        default: return `${name(0)}, ${name(1)}, ${name(2)}, ${and} ${len - 3} ${this.get('i18n').t('general.more')}`;
        }
    }),
});

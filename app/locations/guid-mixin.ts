/* eslint-disable ember/no-new-mixins */
import Mixin from '@ember/object/mixin';

import cleanURL from 'ember-osf-web/utils/clean-url';

export default Mixin.create({
    setURL(url: string) {
        return this._super(cleanURL(url));
    },

    replaceURL(url: string) {
        return this._super(cleanURL(url));
    },

    formatURL(url: string): string {
        return this._super(cleanURL(url));
    },
});
/* eslint-enable ember/no-new-mixins */

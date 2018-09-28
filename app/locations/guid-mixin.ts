import Mixin from '@ember/object/mixin';

export default Mixin.create({
    pattern: /(?:^|\/)--[^/]+/g,

    cleanURL(url: string) {
        return url.replace(this.pattern, '');
    },

    setURL(url: string) {
        return this._super(this.cleanURL(url));
    },

    replaceURL(url: string) {
        return this._super(this.cleanURL(url));
    },

    formatURL(url: string): string {
        return this._super(this.cleanURL(url));
    },
});

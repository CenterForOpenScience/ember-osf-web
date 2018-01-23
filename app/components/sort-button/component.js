import Component from '@ember/component';

export default Component.extend({
    tagName: 'span',
    actions: {
        sort() {
            if (this.get('sortBy')) {
                this.get('sortAction')(this.get('sortBy'), this.get('sortOrder'));
            } else {
                this.get('sortAction')(this.get('sortOrder'));
            }
        },
    },
});

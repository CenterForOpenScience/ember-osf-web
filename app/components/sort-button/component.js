import Component from '@ember/component';

export default Component.extend({
    tagName: 'span',
    actions: {
        sort(sortOrder) {
            if (this.get('sortBy')) {
                this.get('sortAction')(this.get('sortBy'), sortOrder);
            } else {
                this.get('sortAction')(sortOrder);
            }
        },
    },
});

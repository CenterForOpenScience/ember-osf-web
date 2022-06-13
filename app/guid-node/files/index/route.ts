import Route from '@ember/routing/route';

export default class GuidNodeFileIndexRoute extends Route.extend({}) {
    beforeModel() {
        return this.replaceWith('guid-node.files.provider', 'osfstorage');
    }
}

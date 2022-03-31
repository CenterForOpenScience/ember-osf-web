import Route from '@ember/routing/route';

export default class FileIndexRoute extends Route.extend({}) {
    beforeModel() {
        return this.replaceWith('overview.files.provider', 'osfstorage');
    }
}

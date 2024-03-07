import Route from '@ember/routing/route';


export default class MetadataIndexRoute extends Route {
    model() {
        this.replaceWith('guid-node.metadata.detail', 'osf');
    }
}

import ResolvedGuidRoute from 'ember-osf-web/resolve-guid/resolved-guid-route';

export default class GuidNode extends ResolvedGuidRoute {
    model(this: GuidNode, params: { node_guid: string }) {
        return {
            taskInstance: this.get('loadModel').perform('registration', params.node_guid),
            nodeId: params.node_guid,
        };
    }
}

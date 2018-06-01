import ResolvedGuidRoute from 'ember-osf-web/resolve-guid/resolved-guid-route';

export default class GuidNode extends ResolvedGuidRoute {
    model(this: GuidNode, params: { node_guid: string }) {
        return {
            taskInstance: this.get('resolveGuid').perform(params.node_guid, 'node'),
            nodeId: params.node_guid,
        };
    }
}

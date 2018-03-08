import ResolvedGuidRoute from '../resolve-guid/resolved-guid-route';

export default class GuidNode extends ResolvedGuidRoute.extend({
}) {
    model(this: GuidNode, params: { node_guid: string }) {
        return {
            taskInstance: this.get('loadModel').perform('node', params.node_guid),
            nodeId: params.node_guid,
        };
    }
}

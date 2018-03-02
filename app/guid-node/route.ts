import ResolvedGuidRoute from '../resolve-guid/resolved-guid-route';

export default class GuidNode extends ResolvedGuidRoute.extend({
}) {
    model(this: GuidNode, params: { node_id: string }) {
        return {
            taskInstance: this.get('loadModel').perform('node', params.node_id),
            nodeId: params.node_id,
        };
    }
}

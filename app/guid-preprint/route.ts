import ResolvedGuidRoute from '../resolve-guid/resolved-guid-route';

export default class GuidPreprint extends ResolvedGuidRoute.extend({
}) {
    model(this: GuidPreprint, params: { preprint_id: string }) {
        return {
            taskInstance: this.get('loadModel').perform('preprint', params.preprint_id),
            preprintId: params.preprint_id,
        };
    }
}

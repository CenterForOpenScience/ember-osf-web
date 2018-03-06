import ResolvedGuidRoute from '../resolve-guid/resolved-guid-route';

export default class GuidPreprint extends ResolvedGuidRoute.extend({
}) {
    model(this: GuidPreprint, params: { preprint_guid: string }) {
        return {
            taskInstance: this.get('loadModel').perform('preprint', params.preprint_guid),
            preprintId: params.preprint_guid,
        };
    }
}

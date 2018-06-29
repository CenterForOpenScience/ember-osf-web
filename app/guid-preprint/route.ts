import ResolvedGuidRoute from 'ember-osf-web/resolve-guid/resolved-guid-route';

export default class GuidPreprint extends ResolvedGuidRoute {
    model(this: GuidPreprint, params: { preprint_guid: string }) {
        return {
            taskInstance: this.get('resolveGuid').perform(params.preprint_guid, 'preprint'),
            preprintId: params.preprint_guid,
        };
    }
}

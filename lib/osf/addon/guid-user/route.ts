import ResolvedGuidRoute from 'osf/resolve-guid/resolved-guid-route';

export default class GuidUser extends ResolvedGuidRoute {
    model(this: GuidUser, params: { user_guid: string }) {
        return {
            taskInstance: this.get('resolveGuid').perform(params.user_guid, 'user'),
            userId: params.user_guid,
        };
    }
}

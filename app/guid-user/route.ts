import ResolvedGuidRoute from '../resolve-guid/resolved-guid-route';

export default class GuidUser extends ResolvedGuidRoute.extend({
}) {
    model(this: GuidUser, params: { user_guid: string }) {
        return {
            taskInstance: this.get('loadModel').perform('user', params.user_guid),
            userId: params.user_guid,
        };
    }
}

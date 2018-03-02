import ResolvedGuidRoute from '../resolve-guid/resolved-guid-route';

export default class GuidUser extends ResolvedGuidRoute.extend({
}) {
    model(this: GuidUser, params: { user_id: string }) {
        return {
            taskInstance: this.get('loadModel').perform('user', params.user_id),
            userId: params.user_id,
        };
    }
}

import Route from '@ember/routing/route';

export default class Index extends Route {
    model(params: { provider_id: string }): string {
        return params.provider_id;
    }
}

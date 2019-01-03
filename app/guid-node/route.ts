import GuidRoute from 'ember-osf-web/resolve-guid/guid-route';

export default class GuidNode extends GuidRoute {
    modelName(): 'node' {
        return 'node';
    }

    adapterOptions() {
        return {
            query: {
                related_counts: 'forks,registrations,draft_registrations',
                include: 'root',
            },
        };
    }
}

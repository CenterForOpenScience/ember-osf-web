import GuidRoute from 'ember-osf-web/resolve-guid/guid-route';

export default class Overview extends GuidRoute {
    modelName(): 'registration' {
        return 'registration';
    }

    include() {
        return ['registration_schema'];
    }

    adapterOptions() {
        return {
            query: {
                related_counts: 'forks,linked_nodes,linked_registrations,children',
            },
        };
    }
}

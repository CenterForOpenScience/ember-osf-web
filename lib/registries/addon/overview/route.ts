import GuidRoute from 'ember-osf-web/resolve-guid/guid-route';

export default class Overview extends GuidRoute {
    modelName(): 'registration' {
        return 'registration';
    }
}

import GuidRoute from 'ember-osf-web/resolve-guid/guid-route';

export default class GuidUser extends GuidRoute {
    modelName(): 'user' {
        return 'user';
    }
}

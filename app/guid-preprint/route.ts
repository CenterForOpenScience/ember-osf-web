import GuidRoute from 'ember-osf-web/resolve-guid/guid-route';

export default class GuidPreprint extends GuidRoute {
    modelName(): 'preprint' {
        return 'preprint';
    }
}

import CrossrefAdapter from 'ember-osf-web/adapters/crossref-adapter';

export default class CrossrefFunderAdapter extends CrossrefAdapter {
    pathForType() {
        return 'funders';
    }
}

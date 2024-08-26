import Controller from '@ember/controller';

export default class PreprintsMyPreprintsController extends Controller {
    get preprints() {
        return this.model;
    }
}

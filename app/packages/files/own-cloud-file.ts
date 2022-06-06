import FileModel from 'ember-osf-web/models/file';
import File from 'ember-osf-web/packages/files/file';
import CurrentUserService from 'ember-osf-web/services/current-user';

export default class OwnCloudFile extends File {
    shouldShowRevisions = false;
    providerHandlesVersioning = false;

    constructor(currentUser: CurrentUserService, fileModel: FileModel) {
        super(currentUser, fileModel);
    }
}

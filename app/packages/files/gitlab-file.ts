import FileModel from 'ember-osf-web/models/file';
import File from 'ember-osf-web/packages/files/file';
import CurrentUserService from 'ember-osf-web/services/current-user';

export default class GitlabFile extends File {
    shouldShowRevisions = false;
    providerHandlesVersioning = false;

    constructor(owner: unknown, currentUser: CurrentUserService,fileModel: FileModel) {
        super(owner, currentUser, fileModel);
    }

    get currentUserPermission() {
        return 'read';
    }
}

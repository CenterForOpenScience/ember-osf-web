import FileModel from 'ember-osf-web/models/file';
import File from 'ember-osf-web/packages/files/file';
import CurrentUserService from 'ember-osf-web/services/current-user';

export default class GithubFile extends File {
    userCanDownloadAsZip = false;
    parallelUploadsLimit = 1;

    constructor(currentUser: CurrentUserService,fileModel: FileModel) {
        super(currentUser, fileModel);
    }

    get userCanMoveToHere(): boolean {
        return false;
    }
}

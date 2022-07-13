import FileModel from 'ember-osf-web/models/file';
import File from 'ember-osf-web/packages/files/file';
import CurrentUserService from 'ember-osf-web/services/current-user';

interface DataverseExtraInfo {
    datasetVersion: 'latest-published' | 'latest';
    fileId: string;
    hasPublishedVersion: boolean;
    hashes: {
        md5: string,
    };
}

export default class DataverseFile extends File {
    shouldShowRevisions = false;
    providerHandlesVersioning = false;

    constructor(currentUser: CurrentUserService,fileModel: FileModel) {
        super(currentUser, fileModel);
    }

    get currentUserPermission() {
        return 'read';
    }

    get displayName() {
        const fileExtra = this.fileModel.extra as DataverseExtraInfo;
        const translationKeyPrefix = 'osf-components.file-browser.provider-specific-data.dataverse.';
        const fileNameSuffix = ' ' + this.intl.t(translationKeyPrefix + fileExtra.datasetVersion);
        return this.fileModel.name + fileNameSuffix;
    }
}

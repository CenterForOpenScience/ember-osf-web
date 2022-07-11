import FileModel from 'ember-osf-web/models/file';
import File, { ProviderSpecificData } from 'ember-osf-web/packages/files/file';
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

    get providerSpecificData(): ProviderSpecificData {
        const fileExtra = this.fileModel.extra as DataverseExtraInfo;
        const translationPrefix = 'osf-components.file-browser.provider-specific-data.dataverse.';
        return {
            titleSuffix: this.intl.t(translationPrefix + fileExtra.datasetVersion),
        };
    }
}

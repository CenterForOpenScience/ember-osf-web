import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

// Waterbutler file version
interface Version {
    id: string;
    attributes: {
        extra: {
            downloads: number,
            hashes: {
                md5: string,
                sha256: string,
            },
            users: {
                name: string,
                url: string,
            },
        },
        modified: string,
        version: number,
    };
}

interface Args {
    version: Version;
    downloadUrl: string;
    changeVersion: (version: number) => void;
}

export default class FileVersionComponent extends Component<Args> {
    @service intl!: Intl;
    @service toast!: Toast;

    @tracked dropdownOpen = false;

    @action toggleDropdown() {
        this.dropdownOpen = !this.dropdownOpen;
    }

    @action downloadVersion(version: number) {
        window.location.href = `${this.args.downloadUrl}?revision=${version}`;
    }

    @action copySuccess() {
        this.toast.success(this.intl.t('osf-components.file-version.copy_success'));
    }

    @action copyError() {
        this.toast.error(this.intl.t('osf-components.file-version.copy_error'));
    }
}

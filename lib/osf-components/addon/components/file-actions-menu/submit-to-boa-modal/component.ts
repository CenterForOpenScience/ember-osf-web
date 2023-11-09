import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import IntlService from 'ember-intl/services/intl';
import File from 'ember-osf-web/packages/files/file';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import config from 'ember-osf-web/config/environment';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

interface Args {
    file: File;
    isOpen: boolean;
    closeModal: () => {};
}

export default class SubmitToBoaModal extends Component<Args> {
    @service toast!: Toastr;
    @service intl!: IntlService;
    @tracked selectedDataset?: string;

    datasets = [
        '2022 Jan/Java',
        '2022 Feb/Python',
        '2021 Method Chains',
        '2021 Aug/Python',
        '2021 Aug/Kotlin (small)',
        '2021 Aug/Kotlin',
        '2021 Jan/ML-Verse',
        '2020 August/Python-DS',
        '2019 October/GitHub (small)',
        '2019 October/GitHub (medium)',
        '2019 October/GitHub',
        '2015 September/GitHub',
        '2013 September/SF (small)',
        '2013 September/SF (medium)',
        '2013 September/SF',
        '2013 May/SF',
        '2013 February/SF',
        '2012 July/SF',
    ];

    @action
    onDatasetChange(newDataset: string) {
        this.selectedDataset = newDataset;
    }

    @task
    @waitFor
    async confirmSubmitToBoa() {
        try {
            const file = this.args.file;
            const fileModel = file.fileModel;
            const parentFolder = await fileModel.get('parentFolder');
            const grandparentFolder = await parentFolder.get('parentFolder');
            const endpoint = config.OSF.url + 'api/v1/project/' + fileModel.target.get('id') + '/boa/submit-job/';
            const uploadLink = new URL(parentFolder.get('links').upload as string);
            uploadLink.searchParams.set('kind', 'file');
            const payload = {
                data: {
                    nodeId: fileModel.target.get('id'),
                    name: file.name,
                    materialized: fileModel.materializedPath,
                    size: fileModel.size,
                    links: {
                        download: file.links.download,
                        upload: file.links.upload,
                    },
                },
                parent: {
                    links: {
                        upload: uploadLink.toString(),
                    },
                    isAddonRoot: !grandparentFolder,
                },
                dataset: this.selectedDataset,
            };
            await this.args.file.currentUser.authenticatedAJAX({
                url: endpoint,
                type: 'POST',
                data: JSON.stringify(payload),
                xhrFields: { withCredentials: true },
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            this.args.closeModal();
        } catch (e) {
            captureException(e);
            const errorMessageKey = this.intl.t('osf-components.file-browser.submit_to_boa_fail',
                { fileName: this.args.file.name, htmlSafe: true }) as string;
            this.toast.error(getApiErrorMessage(e), errorMessageKey);
            return;
        }

        this.toast.success(
            this.intl.t('osf-components.file-browser.submit_to_boa_success', { fileName: this.args.file.name }),
        );
    }
}

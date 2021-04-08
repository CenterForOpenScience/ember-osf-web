import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import SubjectModel from 'ember-osf-web/models/subject';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import { SubjectManager } from 'osf-components/components/subjects/manager/component';

import template from './template';

// SubjectBrowserManager is responsible for:
// (1) loading root-level subjects in the given provider's chosen taxonomy
export interface SubjectBrowserManager {
    rootSubjects?: SubjectModel[];
    isLoading: boolean;
}

// Law category has 117 (Jan 2018)
const subjectPageSize = 150;

@tagName('')
@layout(template)
export default class SubjectBrowserManagerComponent extends Component {
    // params
    subjectsManager!: SubjectManager;

    // private
    @service store!: DS.Store;
    @service toast!: Toast;
    @service intl!: Intl;

    rootSubjects?: SubjectModel[];

    @task({ on: 'init' })
    @waitFor
    async loadRootSubjects() {
        try {
            const provider = this.subjectsManager.provider;
            const rootSubjects = await provider.queryHasMany('subjects', {
                filter: {
                    parent: 'null',
                },
                page: {
                    size: subjectPageSize,
                },
                related_counts: 'children',
            });
            this.setProperties({ rootSubjects });
        } catch (e) {
            const errorMessage = this.intl.t('registries.registration_metadata.load_subjects_error');
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
            throw e;
        }
    }

    init() {
        super.init();

        assert(
            '@subjectsManager is required',
            Boolean(this.subjectsManager),
        );
    }
}

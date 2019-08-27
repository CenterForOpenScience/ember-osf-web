import { tagName } from '@ember-decorators/component';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { task } from 'ember-concurrency';
import DS from 'ember-data';

import { layout } from 'ember-osf-web/decorators/component';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import SubjectModel from 'ember-osf-web/models/subject';
import { SubjectManager } from 'osf-components/components/subjects/manager/component';

import template from './template';

// SubjectBrowserManager is responsible for:
// (1) root-level subjects in the given provider's chosen taxonomy
export interface SubjectBrowserManager {
    rootSubjects: SubjectModel[];
}

// Law category has 117 (Jan 2018)
const subjectPageSize = 150;

@tagName('')
@layout(template)
export default class SubjectBrowserManagerComponent extends Component.extend({
    loadRootSubjects: task(function *(this: SubjectBrowserManagerComponent) {
        let rootSubjects: QueryHasManyResult<SubjectModel>;

        try {
            rootSubjects = yield this.manager.provider.queryHasMany('subjects', {
                filter: {
                    parent: 'null',
                },
                page: {
                    size: subjectPageSize,
                },
                related_counts: 'children',
            });
        } catch (e) {
            throw e;
        }

        this.setProperties({ rootSubjects });
    }).on('didReceiveAttrs').restartable(),
}) {
    // params
    manager!: SubjectManager;

    // private
    @service store!: DS.Store;

    rootSubjects?: SubjectModel[];

    init() {
        super.init();

        assert(
            '@manager is required',
            Boolean(this.manager),
        );
    }
}

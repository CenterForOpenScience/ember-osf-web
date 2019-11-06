import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { assert } from '@ember/debug';

import { ChangesetDef } from 'ember-changeset/types';
import File from 'ember-osf-web/models/file';
import NodeModel from 'ember-osf-web/models/node';
import { FileReference, SchemaBlock } from 'ember-osf-web/packages/registration-schema';
import Analytics from 'ember-osf-web/services/analytics';

import { layout } from 'ember-osf-web/decorators/component';

import template from './template';

@layout(template)
@tagName('')
export default class Files extends Component {
    @service analytics!: Analytics;

    // Required param
    changeset!: ChangesetDef;
    node!: NodeModel;
    schemaBlock!: SchemaBlock;

    @alias('schemaBlock.registrationResponseKey')
    valuePath!: string;
    selectedFiles: FileReference[] = [];
    onInput!: () => void;

    didReceiveAttrs() {
        assert(
            'Registries::SchemaBlockRenderer::Editable::Files requires a changeset to render',
            Boolean(this.changeset),
        );
        assert(
            'Registries::SchemaBlockRenderer::Editable::Files requires a node to render',
            Boolean(this.node),
        );
        assert(
            'Registries::SchemaBlockRenderer::Editable::Files requires a valuePath to render',
            Boolean(this.valuePath),
        );
        assert(
            'Registries::SchemaBlockRenderer::Editable::Files requires a schemaBlock to render',
            Boolean(this.schemaBlock),
        );

        this.set('selectedFiles', this.changeset.get(this.valuePath) || []);
    }

    @action
    select(file: FileReference) {
        this.selectedFiles.pushObject(file);
        this.changeset.set(this.valuePath, this.selectedFiles);
        this.onInput();
    }

    @action
    unselect(file: FileReference) {
        const newSelectedFiles = this.selectedFiles.filter(
            (selectedFile: FileReference) => selectedFile.file_id !== file.file_id,
        );
        this.set('selectedFiles', newSelectedFiles);
        this.changeset.set(this.valuePath, this.selectedFiles);
        this.onInput();
    }

    @action
    onSelectFile(file: File) {
        const fileRef = file.toFileReference();
        const isSelected = this.selectedFiles.includes(fileRef);

        this.analytics.trackFromElement(this.element, {
            name: `${isSelected ? 'Unselect file' : 'Select file'}`,
            category: 'button',
            action: 'click',
        });

        if (isSelected) {
            this.unselect(fileRef);
        } else {
            this.select(fileRef);
        }
    }
}

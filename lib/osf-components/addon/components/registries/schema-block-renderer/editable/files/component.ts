import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { action, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

import { ChangesetDef } from 'ember-changeset/types';
import config from 'ember-get-config';

import { layout } from 'ember-osf-web/decorators/component';
import File from 'ember-osf-web/models/file';
import NodeModel from 'ember-osf-web/models/node';
import { SchemaBlock } from 'ember-osf-web/packages/registration-schema';
import Analytics from 'ember-osf-web/services/analytics';
import pathJoin from 'ember-osf-web/utils/path-join';

import styles from './styles';
import template from './template';

const { OSF: { url: baseURL } } = config;

@layout(template, styles)
@tagName('')
export default class Files extends Component {
    @service analytics!: Analytics;

    // Required param
    changeset!: ChangesetDef;
    node!: NodeModel;
    schemaBlock!: SchemaBlock;

    @alias('schemaBlock.registrationResponseKey')
    valuePath!: string;
    selectedFiles: File[] = [];
    onInput!: () => void;

    @computed('node')
    get nodeUrl() {
        return this.node && pathJoin(baseURL, this.node.id);
    }

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
    select(file: File) {
        this.selectedFiles.pushObject(file);
        this.changeset.set(this.valuePath, this.selectedFiles);
        this.onInput();
    }

    @action
    unselect(file: File) {
        const newSelectedFiles = this.selectedFiles.filter(
            selectedFile => selectedFile.id !== file.id,
        );
        this.set('selectedFiles', newSelectedFiles);
        this.changeset.set(this.valuePath, this.selectedFiles);
        this.onInput();
    }

    @action
    onSelectFile(selectedFile: File) {
        const isSelected = this.selectedFiles.some(file => selectedFile.id === file.id);

        this.analytics.trackFromElement(this.element, {
            name: `${isSelected ? 'Unselect file' : 'Select file'}`,
            category: 'button',
            action: 'click',
        });

        if (isSelected) {
            this.unselect(selectedFile);
        } else {
            this.select(selectedFile);
        }
    }

    @action
    onAddFile(addedFile: File) {
        this.select(addedFile);
    }
}

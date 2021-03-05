import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { action, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

import { ChangesetDef } from 'ember-changeset/types';
import config from 'ember-get-config';

import { layout } from 'ember-osf-web/decorators/component';
import File from 'ember-osf-web/models/file';
import { Permission } from 'ember-osf-web/models/osf-model';
import { SchemaBlock } from 'ember-osf-web/packages/registration-schema';
import Analytics from 'ember-osf-web/services/analytics';
import pathJoin from 'ember-osf-web/utils/path-join';

import AbstractNodeModel from 'ember-osf-web/models/abstract-node';
import DraftRegistrationModel from 'ember-osf-web/models/draft-registration';
import styles from './styles';
import template from './template';

const { OSF: { url: baseURL } } = config;

@layout(template, styles)
@tagName('')
export default class Files extends Component {
    @service analytics!: Analytics;

    // Required param
    changeset!: ChangesetDef;
    schemaBlock!: SchemaBlock;
    draftRegistration!: DraftRegistrationModel;

    @alias('schemaBlock.registrationResponseKey')
    valuePath!: string;
    @alias('draftRegistration.currentUserPermissions') currentUserPermissions!: Permission[];
    selectedFiles: File[] = [];

    @tracked node?: AbstractNodeModel;
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
            'Registries::SchemaBlockRenderer::Editable::Files requires a draft-registration to render',
            Boolean(this.draftRegistration),
        );
        assert(
            'Registries::SchemaBlockRenderer::Editable::Files requires a valuePath to render',
            Boolean(this.valuePath),
        );
        assert(
            'Registries::SchemaBlockRenderer::Editable::Files requires a schemaBlock to render',
            Boolean(this.schemaBlock),
        );

        this.node = this.draftRegistration.belongsTo('branchedFrom').value() as AbstractNodeModel;
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

    @action
    onDeleteFile(deleteFileOrFolder: File, options: { callback?: () => void }) {
        let filesToUnselect: File[] = [];
        if (deleteFileOrFolder.isFolder) {
            filesToUnselect = this.selectedFiles
                .filter(({ materializedPath }) => materializedPath.includes(deleteFileOrFolder.materializedPath));
        } else {
            const isSelected = this.selectedFiles.some(file => deleteFileOrFolder.id === file.id);
            if (isSelected) {
                filesToUnselect = [deleteFileOrFolder];
            }
        }

        filesToUnselect.forEach(file => this.unselect(file));

        if (options && options.callback) {
            options.callback();
        }
    }
}

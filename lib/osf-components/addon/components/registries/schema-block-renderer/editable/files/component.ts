import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import Component from '@ember/component';
import { assert } from '@ember/debug';

import { ChangesetDef } from 'ember-changeset/types';
import File from 'ember-osf-web/models/file';
import NodeModel from 'ember-osf-web/models/node';
import { FileReference, SchemaBlock } from 'ember-osf-web/packages/registration-schema';

import { layout } from 'ember-osf-web/decorators/component';

import template from './template';

@layout(template)
@tagName('')
export default class Files extends Component {
    // Required param
    changeset!: ChangesetDef;
    node!: NodeModel;
    schemaBlock!: SchemaBlock;

    @alias('schemaBlock.registrationResponseKey')
    valuePath!: string;
    selectedFiles: FileReference[] = [];

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
    }

    @action
    onSelect(file: File) {
        const newFile: FileReference = {
            file_id: file.id,
            file_name: file.name,
            file_url: {
                html: (file.links.html as string),
                download: (file.links.download as string),
            },
            file_hashes: {
                sha256: file.extra.hashes.sha256,
            },
        };
        this.selectedFiles.pushObject(newFile);
        this.changeset.set(this.valuePath, this.selectedFiles);
    }

    @action
    onUnselect(file: File) {
        const newSelectedFiles = this.selectedFiles.filter(
            (selectedFile: FileReference) => selectedFile.file_id !== file.id,
        );
        this.set('selectedFiles', newSelectedFiles);
        this.changeset.set(this.valuePath, this.selectedFiles);
    }
}

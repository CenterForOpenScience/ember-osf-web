import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import Component from '@ember/component';
import { assert } from '@ember/debug';

import { ChangesetDef } from 'ember-changeset/types';
import File from 'ember-osf-web/models/file';
import NodeModel from 'ember-osf-web/models/node';

import { layout } from 'ember-osf-web/decorators/component';
import { SchemaBlock } from 'ember-osf-web/packages/registration-schema';

import template from './template';

interface FileObject {
    fileID: string;
    fileName: string;
    fileUrl: string;
    sha256: string;
}

@layout(template)
@tagName('')
export default class Files extends Component {
    // Required param
    changeset!: ChangesetDef;
    node!: NodeModel;
    schemaBlock!: SchemaBlock;

    @alias('schemaBlock.registrationResponseKey')
    valuePath!: string;
    selectedFiles: unknown[] = [];

    didReceiveAttrs() {
        assert(
            'schema-block-renderer::editable::files requires a changeset to render',
            Boolean(this.changeset),
        );
        assert(
            'schema-block-renderer::editable::files requires a node to render',
            Boolean(this.node),
        );
        assert(
            'schema-block-renderer::editable::files requires a valuePath to render',
            Boolean(this.valuePath),
        );
        assert(
            'schema-block-renderer::editable::files requires a schemaBlock to render',
            Boolean(this.schemaBlock),
        );
    }

    @action
    onSelect(file: File) {
        if (file) {
            const newFile: FileObject = {
                fileID: `${file.id}`,
                fileName: `${file.name}`,
                fileUrl: `${file.links.html}`,
                sha256: `${file.extra.hashes.sha256}`,
            };
            this.selectedFiles.pushObject(newFile);
            this.changeset.set(this.valuePath, this.selectedFiles);
        }
    }

    @action
    onUnselect(file: File) {
        if (file) {
            const newFile: FileObject = {
                fileID: `${file.id}`,
                fileName: `${file.name}`,
                fileUrl: `${file.links.html}`,
                sha256: `${file.extra.hashes.sha256}`,
            };

            const newSelectedFiles = this.selectedFiles.filter(
                (result: FileObject) => result.fileID !== newFile.fileID,
            );
            this.set('selectedFiles', newSelectedFiles);
            this.changeset.set(this.valuePath, this.selectedFiles);
        }
    }
}

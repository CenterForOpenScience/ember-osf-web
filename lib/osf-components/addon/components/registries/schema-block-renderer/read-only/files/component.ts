import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';

import { layout } from 'ember-osf-web/decorators/component';
import { PageResponse, SchemaBlock } from 'ember-osf-web/packages/registration-schema';

import template from './template';

@layout(template)
@tagName('')
export default class ReadOnlyFiles extends Component {
    // Required param
    schemaBlock!: SchemaBlock;
    registrationResponses!: PageResponse;

    didReceiveAttrs() {
        assert(
            'schema-block-renderer/read-only/files requires a schemaBlock to render',
            Boolean(this.schemaBlock),
        );
        assert(
            'schema-block-renderer/read-only/files requires registrationResponses to render',
            Boolean(this.registrationResponses),
        );
    }

    didRender() {
        this.getFileList();
    }

    getFileList() {
        const response = this.registrationResponses[this.schemaBlock.registrationResponseKey!];
        let list = '';
        if (Array.isArray(response)) {
            const responseList: unknown[] = [];
            response.forEach((file: any) => {
                responseList.push(`<a href='${file.fileUrl}'>${file.fileName}</a>`);
            });
            list = responseList.join(', ');
        }
        (document.querySelector('[data-test-read-only-file-widget]') as HTMLElement).innerHTML = list;
    }
}

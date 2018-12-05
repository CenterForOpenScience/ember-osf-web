import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { localClassNames } from 'ember-css-modules';

import { layout } from 'ember-osf-web/decorators/component';
import File from 'ember-osf-web/models/file';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import template from './template';

const iconForType = {
    code: [
        'py',
        'js',
        'css',
        'html',
        'awk',
        'bat',
        'c',
        'cpp',
        'h',
        'hdl',
        'java',
        'jar',
        'mk',
        'pl',
        'sh',
        'coffee',
        'ipynb',
        'lua',
        'm',
        'php',
        'pyc',
        'r',
        'rb',
    ],
    image: [
        'png',
        'jpeg',
        'jpg',
        'tiff',
        'gif',
        'bmp',
    ],
    pdf: [
        'pdf',
    ],
    word: [
        'doc',
        'docx',
        'dotx',
        'dot',
        'docm',
    ],
    video: [
        'mov',
        'mkv',
        'flv',
        'avi',
        'mp4',
    ],
    powerpoint: [
        'ppt',
        'pptx',
        'pptm',
        'potx',
    ],
    audio: [
        'mp3',
        'wav',
        'flac',
        'aiff',
        'wma',
    ],
    excel: [
        'xlsx',
        'xlsm',
        'xltx',
        'xltm',
        'csv',
    ],
    text: [
        'txt',
        'md',
        'rtf',
    ],
};

const typeIcons: Map<string, string> = new Map(
    Object.entries(iconForType)
        .map(([icon, extensions]): Array<[string, string]> => extensions
            .map((extension): [string, string] => [extension, icon]))
        .reduce((acc, val): Array<[string, string]> => [...acc, ...val], []),
);

function iconFromName(name: string): string {
    const match = name.match(/(?!\.)[^.]+$/);
    const type = match ? match[0] : '';
    const icon = typeIcons.get(type);

    return `file${icon ? `-${icon}` : ''}-o`;
}

/**
 * @module ember-osf-web
 * @submodule components
 */

/**
 * Display the correct file tree icon for on the item to be displayed
 *
 * Sample usage:
 * ```handlebars
 * {{file-icon item=item}}
 * ```
 * @class file-icon
 */

@layout(template, styles)
@tagName('span')
@localClassNames('FileIcon')
export default class FileIcon extends Component {
    item: File = this.item;

    @computed('item', 'item.expanded')
    get iconName(): string {
        // TODO: More icons!

        if (this.item.name) {
            return iconFromName(this.item.name);
        }

        if (this.item.isNode) {
            // TODO node types
            return 'cube';
        }

        if (this.item.isProvider) {
            // TODO provider-specific icons
            return 'hdd-o';
        }

        if (this.item.isFolder) {
            return 'folder';
        }

        return iconFromName(defaultTo(this.item.itemName, ''));
    }
}

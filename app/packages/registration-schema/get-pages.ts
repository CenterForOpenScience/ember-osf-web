import { SchemaBlock } from 'ember-osf-web/packages/registration-schema';

export function getPages(blocks: SchemaBlock[]) {
    const pageArray = blocks.reduce(
        (pages, block) => {
            // instantiate first page if the schema doesn't start with a page-heading
            if (pages.length === 0 && block.blockType !== 'page-heading') {
                const blankPage: SchemaBlock[] = [];
                pages.push(blankPage);
            }

            const lastPage: SchemaBlock[] = pages.slice(-1)[0];
            if (block.blockType === 'page-heading') {
                pages.push([block]);
            } else {
                lastPage.push(block);
            }
            return pages;
        },
        [] as SchemaBlock[][],
    );
    return pageArray;
}

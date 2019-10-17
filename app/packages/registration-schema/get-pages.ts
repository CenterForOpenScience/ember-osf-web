import SchemaBlockModel from 'ember-osf-web/models/schema-block';

export function getPages(blocks: SchemaBlockModel[]) {
    const pageArray = blocks.reduce(
        (pages, block) => {
            // instantiate first page if the schema doesn't start with a page-heading
            if (pages.length === 0 && block.blockType !== 'page-heading') {
                const blankPage: SchemaBlockModel[] = [];
                pages.push(blankPage);
            }

            const lastPage: SchemaBlockModel[] = pages.slice(-1)[0];
            if (block.blockType === 'page-heading') {
                pages.push([block]);
            } else {
                lastPage.push(block);
            }
            return pages;
        },
        [] as SchemaBlockModel[][],
    );
    return pageArray;
}

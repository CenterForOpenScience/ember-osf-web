import slugify from 'ember-osf-web/utils/slugify';

/*
*  pageIndex: index of current page in the pageManagers arrays
*  pageNumber: pageIndex + 1
*/

export function getPageIndex(pageParam: string): number | undefined {
    const match = pageParam.match(/^\d+(?=-|$)/);
    return match ? Number.parseInt(match[0], 10) - 1 : undefined;
}

export function getPageParam(
    pageIndex: number,
    pageHeading?: string,
) {
    const slug = pageHeading ? slugify(pageHeading) : '';
    const pageNumber = pageIndex + 1;
    return slug ? `${pageNumber}-${slug}` : `${pageNumber}`;
}

export function getNextPageParam(
    pageIndex: number,
    pageHeading: string,
) {
    return getPageParam(pageIndex + 1, pageHeading);
}

export function getPrevPageParam(
    pageIndex: number,
    pageHeading: string,
) {
    if (pageIndex === 0) {
        return undefined;
    }
    return getPageParam(pageIndex - 1, pageHeading);
}

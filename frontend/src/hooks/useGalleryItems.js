import { catalogApi } from '../api';
import { sampleGallery } from '../data/gallery';
import { useApiResource } from './useApiResource';

/**
 * The projects shown on Home and the Gallery page: the live list from the
 * admin panel, or the bundled samples while that list is empty (or the API is
 * unreachable), so the pages are never bare.
 */
export function useGalleryItems() {
  const { data, loading, reload } = useApiResource(
    (options) => catalogApi.listGallery(options),
    { initialData: null },
  );

  return { items: data?.length ? data : sampleGallery, loading, reload };
}

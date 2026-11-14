import { useQuery } from '@tanstack/react-query';
import { DEFAULT_EVENT_GALLERY, DEFAULT_HERO_SLIDES, mediaService } from '@/services/media.service';
import type { EventGalleryItem, HeroSlide } from '@/types/domain';

export function useHeroSlides(): {
  data: HeroSlide[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const query = useQuery({
    queryKey: ['hero-slides'],
    queryFn: () => mediaService.getHeroSlides(),
    initialData: DEFAULT_HERO_SLIDES,
    staleTime: 5 * 60 * 1000,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useEventGallery(): {
  data: EventGalleryItem[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const query = useQuery({
    queryKey: ['event-gallery'],
    queryFn: () => mediaService.getEventGallery(),
    initialData: DEFAULT_EVENT_GALLERY,
    staleTime: 5 * 60 * 1000,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

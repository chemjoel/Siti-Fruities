/**
 * SITI FRUITIES — Media Service Implementation
 *
 * Fetches homepage hero slides and event gallery content from Supabase when
 * configured, otherwise falls back to the bundled public URLs from the CMS data.
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { HeroSlide, EventGalleryItem } from '@/types/domain';
import type { IMediaService } from '@/types/services';

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'hero-slide-1',
    image_url: 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/hero/SITIFRUTIES.1.jpg',
    alt_text: 'Siti Fruities parfait',
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'hero-slide-2',
    image_url: 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/hero/SITIFRUTIES2.jpg',
    alt_text: 'Siti Fruities parfait',
    is_active: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'hero-slide-3',
    image_url: 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/hero/SITIFRUTIES5.jpg',
    alt_text: 'Siti Fruities parfait',
    is_active: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'hero-slide-4',
    image_url: 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/hero/SITIFRUTIES6.jpg',
    alt_text: 'Siti Fruities parfait',
    is_active: true,
    display_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'hero-slide-5',
    image_url: 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/hero/SITIFRUTIES8.jpg',
    alt_text: 'Siti Fruities parfait',
    is_active: true,
    display_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const DEFAULT_EVENT_GALLERY: EventGalleryItem[] = [
  {
    id: 'event-gallery-1',
    media_type: 'image',
    media_url: 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/IMG_4728.jpg',
    thumbnail_url: null,
    caption: null,
    event_name: null,
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'event-gallery-2',
    media_type: 'video',
    media_url: 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/VID-20261024-WA0024.mp4',
    thumbnail_url: null,
    caption: null,
    event_name: null,
    is_active: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'event-gallery-3',
    media_type: 'image',
    media_url: 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/IMG_4732.jpg',
    thumbnail_url: null,
    caption: null,
    event_name: null,
    is_active: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'event-gallery-4',
    media_type: 'video',
    media_url: 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/VID-20261024-WA0020.mp4',
    thumbnail_url: null,
    caption: null,
    event_name: null,
    is_active: true,
    display_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'event-gallery-5',
    media_type: 'image',
    media_url: 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/IMG_4734.jpg',
    thumbnail_url: null,
    caption: null,
    event_name: null,
    is_active: true,
    display_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'event-gallery-6',
    media_type: 'video',
    media_url: 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/VID-20261024-WA0021.mp4',
    thumbnail_url: null,
    caption: null,
    event_name: null,
    is_active: true,
    display_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'event-gallery-7',
    media_type: 'image',
    media_url: 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/IMG_4735.jpg',
    thumbnail_url: null,
    caption: null,
    event_name: null,
    is_active: true,
    display_order: 7,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'event-gallery-8',
    media_type: 'video',
    media_url: 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/VID-20261024-WA0022.mp4',
    thumbnail_url: null,
    caption: null,
    event_name: null,
    is_active: true,
    display_order: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'event-gallery-9',
    media_type: 'image',
    media_url: 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/IMG_4736.jpg',
    thumbnail_url: null,
    caption: null,
    event_name: null,
    is_active: true,
    display_order: 9,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'event-gallery-10',
    media_type: 'video',
    media_url: 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/VID-20261024-WA0023.mp4',
    thumbnail_url: null,
    caption: null,
    event_name: null,
    is_active: true,
    display_order: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'event-gallery-11',
    media_type: 'image',
    media_url: 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/IMG_4741.jpg',
    thumbnail_url: null,
    caption: null,
    event_name: null,
    is_active: true,
    display_order: 11,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'event-gallery-12',
    media_type: 'video',
    media_url: 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/VID-20261024-WA0025.mp4',
    thumbnail_url: null,
    caption: null,
    event_name: null,
    is_active: true,
    display_order: 12,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'event-gallery-13',
    media_type: 'image',
    media_url: 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/IMG_4743.jpg',
    thumbnail_url: null,
    caption: null,
    event_name: null,
    is_active: true,
    display_order: 13,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'event-gallery-14',
    media_type: 'video',
    media_url: 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/VID-20261024-WA0026.mp4',
    thumbnail_url: null,
    caption: null,
    event_name: null,
    is_active: true,
    display_order: 14,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'event-gallery-15',
    media_type: 'image',
    media_url: 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/IMG_4782.jpg',
    thumbnail_url: null,
    caption: null,
    event_name: null,
    is_active: true,
    display_order: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'event-gallery-16',
    media_type: 'video',
    media_url: 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/VID-20261024-WA0027.mp4',
    thumbnail_url: null,
    caption: null,
    event_name: null,
    is_active: true,
    display_order: 16,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'event-gallery-17',
    media_type: 'image',
    media_url: 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/IMG_4873.jpg',
    thumbnail_url: null,
    caption: null,
    event_name: null,
    is_active: true,
    display_order: 17,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'event-gallery-18',
    media_type: 'video',
    media_url: 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/VID-20261024-WA0028.mp4',
    thumbnail_url: null,
    caption: null,
    event_name: null,
    is_active: true,
    display_order: 18,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'event-gallery-19',
    media_type: 'image',
    media_url: 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/IMG_4934.jpg',
    thumbnail_url: null,
    caption: null,
    event_name: null,
    is_active: true,
    display_order: 19,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'event-gallery-20',
    media_type: 'video',
    media_url: 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/VID-20261024-WA0029.mp4',
    thumbnail_url: null,
    caption: null,
    event_name: null,
    is_active: true,
    display_order: 20,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'event-gallery-21',
    media_type: 'image',
    media_url: 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/IMG_7621.JPEG',
    thumbnail_url: null,
    caption: null,
    event_name: null,
    is_active: true,
    display_order: 21,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'event-gallery-22',
    media_type: 'image',
    media_url: 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/IMG_9382.jpg',
    thumbnail_url: null,
    caption: null,
    event_name: null,
    is_active: true,
    display_order: 22,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mediaService: IMediaService = {
  async getHeroSlides(): Promise<HeroSlide[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from<HeroSlide[]>('hero_slides')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data;
      }
    }

    return DEFAULT_HERO_SLIDES;
  },

  async getEventGallery(): Promise<EventGalleryItem[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from<EventGalleryItem[]>('event_gallery')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data;
      }
    }

    return DEFAULT_EVENT_GALLERY;
  },
};

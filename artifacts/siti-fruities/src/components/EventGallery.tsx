import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useEventGallery } from '@/hooks/useSiteMedia';

const VISIBLE_INITIAL_COUNT = 8;

export default function EventGallery() {
  const { data = [], isLoading, isError } = useEventGallery();
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px 0px' });
  const [visibleCount, setVisibleCount] = useState(VISIBLE_INITIAL_COUNT);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const lightboxVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (data.length === 0) {
      setVisibleCount(VISIBLE_INITIAL_COUNT);
      return;
    }

    setVisibleCount((current) => Math.min(current, data.length));
  }, [data.length]);

  useEffect(() => {
    if (selectedIndex === null) {
      if (lightboxVideoRef.current) {
        lightboxVideoRef.current.pause();
        lightboxVideoRef.current.currentTime = 0;
      }
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedIndex(null);
        return;
      }

      if (event.key === 'ArrowRight') {
        setSelectedIndex((current) => (current === null ? current : (current + 1) % data.length));
      }

      if (event.key === 'ArrowLeft') {
        setSelectedIndex((current) => (current === null ? current : (current - 1 + data.length) % data.length));
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [data.length, selectedIndex]);

  useEffect(() => {
    if (!selectedItem || selectedItem.media_type !== 'video') {
      if (lightboxVideoRef.current) {
        lightboxVideoRef.current.pause();
        lightboxVideoRef.current.currentTime = 0;
      }
      return;
    }

    const video = lightboxVideoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;
    const playPromise = video.play();
    if (playPromise) {
      playPromise.catch(() => undefined);
    }

    return () => {
      video.pause();
      video.currentTime = 0;
    };
  }, [selectedItem]);

  const visibleItems = data.slice(0, visibleCount);
  const selectedItem = selectedIndex !== null ? data[selectedIndex] : null;

  if (!isLoading && data.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-background py-20" id="event-gallery" ref={ref}>
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center max-w-2xl mx-auto"
        >
          <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-primary">
            Event Moments
          </div>
          <h2 className="mt-4 font-serif text-4xl font-bold text-foreground md:text-5xl">
            Event Gallery
          </h2>
          <p className="mt-3 text-base text-muted-foreground md:text-lg">
            Moments from the events we&apos;ve catered.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="aspect-[4/5] w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {visibleItems.map((item, index) => {
                const isVideo = item.media_type === 'video';
                const tileLabel = item.caption || item.event_name || 'Event gallery item';
                const videoSrc = item.media_url.includes('#') ? item.media_url : `${item.media_url}#t=0.1`;

                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`Open ${tileLabel}`}
                    onClick={() => setSelectedIndex(index)}
                    className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card text-left shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden">
                      {isVideo ? (
                        item.thumbnail_url ? (
                          <img
                            src={item.thumbnail_url}
                            alt={tileLabel}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <video
                            src={videoSrc}
                            className="h-full w-full object-cover"
                            muted
                            playsInline
                            preload="metadata"
                          />
                        )
                      ) : (
                        <img
                          src={item.media_url}
                          alt={tileLabel}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/5 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

                      {isVideo && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-black/35 text-white backdrop-blur-sm shadow-lg">
                            <Play className="ml-0.5 h-5 w-5 fill-current" />
                          </span>
                        </div>
                      )}

                      {(item.caption || item.event_name) && (
                        <div className="absolute inset-x-0 bottom-0 p-3 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          <div className="rounded-xl bg-black/30 px-2 py-1.5 backdrop-blur-sm">
                            {item.event_name && <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">{item.event_name}</p>}
                            {item.caption && <p className="mt-1 line-clamp-2 text-xs font-medium text-white">{item.caption}</p>}
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {visibleCount < data.length && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((current) => Math.min(current + 8, data.length))}
                  className="rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
                >
                  Show more
                </button>
              </div>
            )}
          </>
        )}

        {isError && (
          <p className="mt-6 text-center text-sm text-destructive" role="alert">
            Unable to load the event gallery.
          </p>
        )}
      </div>

      <Dialog
        open={selectedIndex !== null}
        onOpenChange={(open) => {
          if (!open) {
            if (lightboxVideoRef.current) {
              lightboxVideoRef.current.pause();
              lightboxVideoRef.current.currentTime = 0;
            }
            setSelectedIndex(null);
          }
        }}
      >
        {selectedItem && (
          <DialogContent className="max-w-6xl border-0 bg-[#0b0b0b]/95 p-0 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6">
              <div className="min-w-0">
                <DialogTitle className="truncate text-base font-semibold text-white sm:text-lg">
                  {selectedItem.event_name || 'Event gallery'}
                </DialogTitle>
                {selectedItem.caption && (
                  <DialogDescription className="mt-1 text-sm text-white/70">
                    {selectedItem.caption}
                  </DialogDescription>
                )}
              </div>
              <button
                type="button"
                aria-label="Close gallery item"
                onClick={() => {
                  if (lightboxVideoRef.current) {
                    lightboxVideoRef.current.pause();
                    lightboxVideoRef.current.currentTime = 0;
                  }
                  setSelectedIndex(null);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative flex items-center gap-2 bg-black px-3 py-3 sm:px-6">
              <button
                type="button"
                aria-label="Previous gallery item"
                onClick={() => setSelectedIndex((current) => current === null ? current : (current - 1 + data.length) % data.length)}
                className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 sm:flex"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="relative mx-auto w-full overflow-hidden rounded-xl bg-black/30">
                {selectedItem.media_type === 'video' ? (
                  <video
                    ref={lightboxVideoRef}
                    key={selectedItem.id}
                    src={selectedItem.media_url}
                    autoPlay
                    controls
                    playsInline
                    className="max-h-[72vh] w-full object-contain"
                  />
                ) : (
                  <img
                    src={selectedItem.media_url}
                    alt={selectedItem.caption || selectedItem.event_name || 'Event gallery item'}
                    className="max-h-[72vh] w-full object-contain"
                  />
                )}
              </div>

              <button
                type="button"
                aria-label="Next gallery item"
                onClick={() => setSelectedIndex((current) => current === null ? current : (current + 1) % data.length)}
                className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 sm:flex"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}

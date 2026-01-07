import React, { useRef, useEffect, useState } from "react";

const JuztDanceVideo = () => {
  const videoRef = useRef(null);
  const [poster, setPoster] = useState(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let mounted = true;

    const onLoadedMetadata = () => {
      // target time (1s) but guard against videos shorter than 1s
      const target = Math.min(1, (video.duration && !isNaN(video.duration)) ? video.duration : 1);

      const handleSeeked = () => {
        try {
          const vw = video.videoWidth || video.clientWidth;
          const vh = video.videoHeight || video.clientHeight;
          if (!vw || !vh) {
            video.removeEventListener('seeked', handleSeeked);
            return;
          }
          const canvas = document.createElement('canvas');
          canvas.width = vw;
          canvas.height = vh;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          // get a reasonably sized jpeg
          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          if (mounted) setPoster(dataUrl);
        } catch (err) {
          // drawing to canvas can fail due to CORS — handle gracefully
          // Leave poster as null (browser will show first frame or black)
          // and log for debugging.
          // eslint-disable-next-line no-console
          console.warn('Could not capture thumbnail (possible CORS issue):', err);
        } finally {
          video.removeEventListener('seeked', handleSeeked);
        }
      };

      video.addEventListener('seeked', handleSeeked);

      try {
        // attempt to set time to 1s
        video.currentTime = target;
      } catch (err) {
        // Some browsers disallow setting currentTime before playback; try a play/pause fallback
        video.play().then(() => {
          video.pause();
          try { video.currentTime = target; } catch (e) { /* ignore */ }
        }).catch(() => {
          // can't autoplay; we'll rely on user seek/play
        });
      }
    };

    video.addEventListener('loadedmetadata', onLoadedMetadata);

    return () => {
      mounted = false;
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, []);

  return (
    <section className="video-section my-4 d-flex flex-column align-items-center">
      <h2 className="mb-4">What's Inside?</h2>
      <div className="w-100 d-flex justify-content-center">
        <video
          ref={videoRef}
          className="w-100"
          style={{ maxWidth: '80vw', maxHeight: '70vh', borderRadius: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}
          controls
          preload="metadata"
          crossOrigin="anonymous"
          poster={poster}
        >
          <source src="/JuztDanceVideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  );
};

export default JuztDanceVideo;

import { useEffect, useState } from "react";

const DISPLAY_DELAY_MS = 2000;

const FestivalOfferOverlay = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, DISPLAY_DELAY_MS);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="relative mx-auto w-full max-w-[90vw] sm:w-fit sm:max-w-none md:max-w-[70vw]"
        onClick={handleClose}
      >
        <button
          type="button"
          className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-semibold text-gray-800 shadow-lg sm:-right-4 sm:-top-4"
          onClick={(event) => {
            event.stopPropagation();
            handleClose();
          }}
          aria-label="Close festival offer"
        >
          ×
        </button>
        <img
          src="/Festival.jpg"
          alt="Festival offer"
          className="mx-auto block max-h-[90vh] w-full rounded-lg object-cover shadow-2xl sm:w-auto sm:max-h-[85vh] md:max-h-[80vh] md:object-contain"
        />
      </div>
    </div>
  );
};

export default FestivalOfferOverlay;

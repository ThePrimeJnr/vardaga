import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

type LinkPreviewCardProps = {
  url: string;
  title: string;
  description?: string;
  image?: string;
};

const LinkPreviewCard = ({
  url,
  title,
  description,
  image,
}: LinkPreviewCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false); // Track card hover state
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const previewRef = useRef<HTMLAnchorElement>(null);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalElement(document.body);
  }, []);

  const updatePosition = useCallback(() => {
    if (!anchorRef.current || !previewRef.current) return;

    const anchorRect = anchorRef.current.getBoundingClientRect();
    const previewRect = previewRef.current.getBoundingClientRect();

    const spaceBelow = window.innerHeight - anchorRect.bottom;
    const verticalPosition =
      spaceBelow >= previewRect.height ? "bottom" : "top";

    const left = anchorRect.left + anchorRect.width / 2 - previewRect.width / 2;
    const adjustedLeft = Math.max(
      0,
      Math.min(left, window.innerWidth - previewRect.width)
    );

    previewRef.current.style.left = `${adjustedLeft}px`;
    previewRef.current.style.top =
      verticalPosition === "bottom" ? `${anchorRect.bottom + 4}px` : "auto";
    previewRef.current.style.bottom =
      verticalPosition === "top"
        ? `${window.innerHeight - anchorRect.top + 4}px`
        : "auto";
  }, []);

  useEffect(() => {
    if (isHovered || isCardHovered) {
      // Update position when either is hovered
      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
    }
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isHovered, isCardHovered, updatePosition]); // Depend on both states

  return (
    <div className="relative inline-block">
      <a
        ref={anchorRef}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center p-1 text-sm font-medium
                   bg-gray-200/70 text-accent-900 rounded-md
                   border border-accent-900/10 hover:border-accent-900/60
                   transition-all duration-200 ease-in-out"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="mr-1">🔗</span>
        {title || "Open Link"}
      </a>

      {portalElement &&
        createPortal(
          <a
            ref={previewRef}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`
            ${
              isHovered || isCardHovered
                ? "opacity-100 visible"
                : "opacity-0 invisible"
            }
            w-80 bg-white/95 backdrop-blur-sm border-2 border-accent-500/20
            hover:border-accent-500/30 rounded-lg shadow-xl transition-all
            duration-300 ease-in-out cursor-pointer overflow-hidden z-[999]
          `}
            style={{
              position: "fixed",
              transform: "translateZ(0)",
            }}
            onMouseEnter={() => setIsCardHovered(true)} // Track card hover
            onMouseLeave={() => setIsCardHovered(false)} // Reset on leave
          >
            {image && (
              <img
                src={image}
                alt={title}
                className="w-full h-40 object-cover"
                loading="lazy"
              />
            )}
            <div className="p-3">
              <h4 className="text-base font-semibold text-gray-900 mb-2">
                {title}
              </h4>
              {description && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </a>,
          portalElement
        )}
    </div>
  );
};

export default LinkPreviewCard;

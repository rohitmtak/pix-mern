interface CollectionSectionProps {
  imageUrl: string;
  altText: string;
  title?: string;
  titlePosition?: "left" | "right" | "center";
  titleColor?: "black" | "white";
  backgroundImageUrl?: string;
  containerHeight?: string;
  imageWidth?: string;
  titleSize?: string;
  titleStyle?: React.CSSProperties;
  layout?: "image-left" | "image-right" | "full-width";
  imageClassName?: string;
}

const CollectionSection: React.FC<CollectionSectionProps> = ({
  imageUrl,
  altText,
  title,
  titlePosition = "center",
  titleColor = "white",
  backgroundImageUrl,
  containerHeight = "h-screen",
  imageWidth = "w-full",
  titleSize = "text-8xl",
  titleStyle,
  layout = "full-width",
  imageClassName,
}) => {
  const getTitlePositionClass = () => {
    switch (titlePosition) {
      case "left":
        return "left-16 md:left-32";
      case "right":
        return "right-16 md:right-32";
      case "center":
      default:
        return "left-1/2 transform -translate-x-1/2";
    }
  };

  const titleColorClass = titleColor === "white" ? "text-white" : "text-black";

  if (layout === "image-left" || layout === "image-right") {
    return (
      <section className={`relative w-full ${containerHeight} flex`}>
        {layout === "image-left" && (
          <div className="w-1/2 flex items-center justify-center">
            <img
              src={imageUrl}
              alt={altText}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="w-1/2 relative flex items-center justify-center">
          {backgroundImageUrl && (
            <img
              src={backgroundImageUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          {title && (
            <div
              className={`absolute ${getTitlePositionClass()} ${titleColorClass}`}
            >
              <h2
                className={`text-4xl md:text-7xl lg:text-8xl ${titleColorClass} font-bold uppercase tracking-wider leading-tight`}
                style={{
                  fontFamily:
                    "Jost, -apple-system, Roboto, Jost, sans-serif",
                  ...titleStyle,
                }}
              >
                {title}
              </h2>
            </div>
          )}
        </div>

        {layout === "image-right" && (
          <div className="w-1/2 flex items-center justify-center">
            <img
              src={imageUrl}
              alt={altText}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </section>
    );
  }

  return (
    <section className={`relative w-full ${containerHeight}`}>
      <img
        src={imageUrl}
        alt={altText}
        className={`${imageWidth} h-full object-cover absolute inset-0 w-full${imageClassName ? ` ${imageClassName}` : ""}`}
        style={{ zIndex: 0 }}
      />
      {title && (
        <div
          className="absolute bottom-16 left-1/2 transform -translate-x-1/2 pointer-events-none"
          style={{ zIndex: 1 }}
        >
          <h2
            className={`${titleSize} ${titleColorClass} font-normal uppercase tracking-wider text-center font-jost`}
            style={{
              // fontFamily:
              //   "Helvetica, -apple-system, Roboto, Helvetica, sans-serif",
              letterSpacing: "19.5px",
              lineHeight: "normal",
              whiteSpace: "nowrap",
              ...titleStyle,
            }}
          >
            {title}
          </h2>
        </div>
      )}
    </section>
  );
};

export default CollectionSection;

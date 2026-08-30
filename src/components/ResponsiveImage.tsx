import React from 'react';

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  webpSrc?: string;
  srcSetWebp?: string;
  srcSetJpg?: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  aspectRatio?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  decoding?: 'async' | 'sync' | 'auto';
  className?: string;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  webpSrc,
  srcSetWebp,
  srcSetJpg,
  alt,
  width,
  height,
  aspectRatio,
  loading = 'lazy',
  fetchPriority = 'auto',
  decoding = 'async',
  className = '',
  style,
  ...rest
}) => {
  // Derive automatic WebP alternative if not explicitly passed and src is a standard public image
  const derivedWebp = webpSrc || (src.endsWith('.jpg') || src.endsWith('.png') ? src.replace(/\.(jpg|png)$/, '.webp') : undefined);
  
  // Custom fetchpriority attribute for React compatibility
  const imgProps = {
    src,
    alt,
    width,
    height,
    loading,
    decoding,
    className,
    style: {
      ...(aspectRatio ? { aspectRatio } : {}),
      ...style,
    },
    ...(fetchPriority ? { fetchpriority: fetchPriority } : {}),
    ...rest,
  };

  if (srcSetWebp || derivedWebp) {
    return (
      <picture className="contents">
        {srcSetWebp ? (
          <source type="image/webp" srcSet={srcSetWebp} sizes={rest.sizes} />
        ) : derivedWebp ? (
          <source type="image/webp" srcSet={derivedWebp} />
        ) : null}
        {srcSetJpg && <source type="image/jpeg" srcSet={srcSetJpg} sizes={rest.sizes} />}
        <img {...imgProps} />
      </picture>
    );
  }

  return <img {...imgProps} />;
};

export default ResponsiveImage;

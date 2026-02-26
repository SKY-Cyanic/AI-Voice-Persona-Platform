import { useEffect } from 'react';

// Extend the window object to include adsbygoogle
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdBannerProps {
  className?: string;
  style?: React.CSSProperties;
  dataAdSlot?: string;
  dataAdFormat?: 'auto' | 'fluid' | 'rectangle';
  dataFullWidthResponsive?: boolean;
}

export function AdBanner({
  className = '',
  style = { display: 'block' },
  dataAdSlot = '1234567890', // Placeholder slot ID
  dataAdFormat = 'auto',
  dataFullWidthResponsive = true
}: AdBannerProps) {

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div className={`w-full flex justify-center overflow-hidden my-4 ${className}`}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-6612970567702495" // Actual client ID
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
}

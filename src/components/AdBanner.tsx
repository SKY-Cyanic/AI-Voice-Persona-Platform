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
    let timeoutId: ReturnType<typeof setTimeout>;
    try {
      // Delay push to allow React to finish painting DOM layout dimensions
      timeoutId = setTimeout(() => {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }, 200);
    } catch (e) {
      console.error("AdSense error:", e);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className={`w-full flex justify-center overflow-hidden my-4 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ ...style, minWidth: '250px', minHeight: '50px', width: '100%' }}
        data-ad-client="ca-pub-6612970567702495" // Actual client ID
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
}

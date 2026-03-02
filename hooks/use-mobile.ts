 "use client";

 import { useEffect, useState } from "react";

 const MOBILE_MEDIA_QUERY = "(max-width: 768px)";

 export function useIsMobile(): boolean {
   const [isMobile, setIsMobile] = useState(false);

   useEffect(() => {
     if (typeof window === "undefined") {
       return;
     }

     const mediaQueryList = window.matchMedia(MOBILE_MEDIA_QUERY);

     const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
       setIsMobile(event.matches);
     };

     handleChange(mediaQueryList);

     if (typeof mediaQueryList.addEventListener === "function") {
       mediaQueryList.addEventListener("change", handleChange);
       return () => mediaQueryList.removeEventListener("change", handleChange);
     }

     mediaQueryList.addListener(handleChange);
     return () => mediaQueryList.removeListener(handleChange);
   }, []);

   return isMobile;
 }

// 'use client';

// import { useState, useEffect } from 'react';

// const BackToTop = () => {
//   const [isVisible, setIsVisible] = useState(false);

//   // Show button when page is scrolled down
//   const toggleVisibility = () => {
//     if (window.scrollY > 300) {
//       setIsVisible(true);
//     } else {
//       setIsVisible(false);
//     }
//   };

//   const scrollToTop = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: 'smooth',
//     });
//   };

//   useEffect(() => {
//     window.addEventListener('scroll', toggleVisibility);
//     return () => window.removeEventListener('scroll', toggleVisibility);
//   }, []);

//   return (
//     <div className="fixed bottom-6 right-6 z-50">
//       {isVisible && (
//         <button
//           onClick={scrollToTop}
//           className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out"
//           aria-label="Back to top"
//         >
//           ↑
//         </button>
//       )}
//     </div>
//   );
// };

// export default BackToTop;

// NT: Use only if U don't like the scroll indicator
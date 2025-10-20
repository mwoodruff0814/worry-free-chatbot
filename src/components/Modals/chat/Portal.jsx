// FILE: src/components/Modals/chat/Portal.jsx
// PURPOSE: React Portal component to render modals at document root level

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

const Portal = ({ children }) => {
  const portalRoot = document.body;

  useEffect(() => {
    // Prevent body scroll when portal is mounted
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return createPortal(children, portalRoot);
};

export default Portal;

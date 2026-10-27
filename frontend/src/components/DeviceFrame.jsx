import React from 'react';

/**
 * Full-screen layout wrapper.
 * Completely removes any phone mockup or device frame constraints,
 * allowing the desktop dashboard to utilize the full available screen width and height.
 */
export default function DeviceFrame({ children, isConnected }) {
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#F7F0E7] text-[#303831] overflow-x-hidden antialiased">
      {children}
    </div>
  );
}

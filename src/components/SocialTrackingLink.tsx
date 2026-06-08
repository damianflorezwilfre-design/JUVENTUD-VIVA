"use client"

import React from "react";

export default function SocialTrackingLink({ href, network, children, className }: { href: string, network: "fbClick" | "igClick", children: React.ReactNode, className?: string }) {
  const handleClick = () => {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: network })
    }).catch(e => console.error(e));
  };

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={handleClick}>
      {children}
    </a>
  );
}

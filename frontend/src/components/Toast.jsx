import React, { useEffect } from "react";

export default function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(() => onClose && onClose(), 3500);
    return () => clearTimeout(id);
  }, [message, onClose]);

  if (!message) return null;
  return <div className="toast">{message}</div>;
}

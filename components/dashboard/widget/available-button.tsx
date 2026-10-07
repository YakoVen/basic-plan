'use client';
import React, { useState } from 'react';

export default function AvailableButton({ initial = true, onToggle }: { initial?: boolean; onToggle?: (active: boolean) => void }) {
  const [active, setActive] = useState(initial);

  const handleToggle = () => {
    const next = !active;
    setActive(next);
    onToggle?.(next);
  };

  return (
    <button
      onClick={handleToggle}
      className={`px-3 py-1 rounded-full text-xs font-semibold transition ${active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
    >
      {active ? 'Disponible' : 'Indisponible'}
    </button>
  );
}

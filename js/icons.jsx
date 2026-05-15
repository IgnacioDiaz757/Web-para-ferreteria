// ============================================================
// FC Icons — Hand-drawn industrial SVG icons (2px stroke, square caps)
// ============================================================

const FCIcon = ({ name, size = 24, ...rest }) => {
  const props = {
    width: size, height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'square',
    strokeLinejoin: 'miter',
    ...rest,
  };

  const paths = {
    // Tools
    hammer: <g><path d="M14 3l7 7-3 3-2-2-3 3-5-5 3-3-2-2 5-1z"/><path d="M11 11l-7 7v3h3l7-7"/></g>,
    wrench: <g><path d="M14 6a4 4 0 1 1 4 4h-2v8l-3 3-3-3v-3"/><path d="M10 15l-4 4-3-3 4-4"/></g>,
    screwdriver: <g><path d="M3 21l4-4 6-6 4 4-6 6-4 4z" transform="translate(0,-1)"/><path d="M14 7l3-3 4 4-3 3"/></g>,
    pliers: <g><path d="M4 4l6 6m4 4l6 6"/><path d="M10 10l4 4"/><circle cx="8" cy="8" r="2.5"/><circle cx="16" cy="16" r="2.5"/></g>,
    saw: <g><path d="M3 8h14l4 4-4 4H3z"/><path d="M5 12h10"/><path d="M7 8v-2M11 8v-2M15 8v-2"/></g>,
    tape: <g><circle cx="9" cy="12" r="6"/><circle cx="9" cy="12" r="2"/><path d="M15 12h6v4h-3l-2 4"/></g>,
    drill: <g><path d="M3 9h10v6h-10z"/><path d="M13 11h4l3-2v6l-3-2h-4"/><path d="M5 15v3h4v-3"/><path d="M3 12h-2"/></g>,
    grinder: <g><circle cx="8" cy="14" r="5"/><path d="M13 14l8-4v8z"/><path d="M3 5l3 3"/></g>,
    circular: <g><circle cx="10" cy="13" r="6"/><path d="M10 7v6l4 4"/><path d="M16 8l5-3v6l-3 1"/></g>,
    screw: <g><path d="M9 3h6v3l-3 2-3-2z"/><path d="M9 8h6v2l-3 1-3-1z M9 11h6v2l-3 1-3-1z M9 14h6v2l-3 1-3-1z M9 17h6v2l-3 2-3-2z"/></g>,
    plug: <g><rect x="8" y="3" width="8" height="14" rx="1"/><path d="M10 17v3M14 17v3"/><path d="M10 3v-1M14 3v-1"/></g>,
    'paint-can': <g><rect x="5" y="7" width="14" height="14"/><path d="M5 9h14"/><path d="M9 7v-2a3 3 0 0 1 3-3c2 0 3 1 3 3v2"/><path d="M9 14h6"/></g>,
    roller: <g><rect x="3" y="6" width="14" height="5" rx="1"/><path d="M10 11v3h-4v6"/></g>,
    cable: <g><path d="M3 6c4 0 4 6 8 6s4-6 8-6"/><path d="M3 14c4 0 4 6 8 6s4-6 8-6"/></g>,
    switch: <g><rect x="6" y="3" width="12" height="18" rx="1"/><rect x="9" y="7" width="6" height="6"/><circle cx="12" cy="17" r="1"/></g>,
    bulb: <g><path d="M9 18h6v2h-6z"/><path d="M8 14a5 5 0 1 1 8 0c-1 1-1 2-1 4h-6c0-2 0-3-1-4z"/><path d="M10 22h4"/></g>,
    pipe: <g><path d="M3 8h10v4h-10z"/><path d="M13 6v8h4v-8z"/><path d="M17 8h4"/><path d="M3 12h-2"/></g>,
    faucet: <g><path d="M9 4h6v3h-6z"/><path d="M12 7v5"/><path d="M5 12h14v3h-14z"/><path d="M12 18l-2 3h4z"/><path d="M5 12v-2"/></g>,
    cement: <g><path d="M5 7l7-3 7 3v12l-7 3-7-3z"/><path d="M5 7l7 3 7-3"/><path d="M12 10v12"/></g>,
    brick: <g><rect x="3" y="6" width="18" height="4"/><rect x="3" y="10" width="18" height="4"/><rect x="3" y="14" width="18" height="4"/><path d="M9 6v4M15 10v4M9 14v4M15 6v4M9 14v4"/></g>,
    helmet: <g><path d="M4 16c0-5 4-9 8-9s8 4 8 9v2h-16z"/><path d="M9 7c0-2 1-3 3-3s3 1 3 3"/><path d="M4 18h16"/></g>,
    glove: <g><path d="M8 21h8v-7l3-1v-5l-3 1v-5h-2v5h-2v-6h-2v6h-2v-5h-2v9l2 1z"/></g>,
    goggles: <g><circle cx="7" cy="13" r="4"/><circle cx="17" cy="13" r="4"/><path d="M11 13h2"/><path d="M3 13c0-3 1-4 4-4M21 13c0-3-1-4-4-4"/></g>,
    bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7z"/>,
    // UI
    search: <g><circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/></g>,
    cart: <g><path d="M3 4h3l2 14h12"/><path d="M6 8h16l-2 8h-12"/><circle cx="10" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></g>,
    heart: <path d="M12 21s-7-5-9-10c-1-3 1-7 4-7 2 0 4 1 5 3 1-2 3-3 5-3 3 0 5 4 4 7-2 5-9 10-9 10z"/>,
    x: <g><path d="M5 5l14 14M5 19l14-14"/></g>,
    arrow: <g><path d="M5 12h14"/><path d="M13 5l7 7-7 7"/></g>,
    plus: <g><path d="M12 5v14M5 12h14"/></g>,
    minus: <path d="M5 12h14"/>,
    sun: <g><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></g>,
    moon: <path d="M21 13a8 8 0 0 1-10-10 8 8 0 0 0 10 10z"/>,
    pin: <g><path d="M12 2c-4 0-7 3-7 7 0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></g>,
    phone: <path d="M5 3h4l2 5-3 2c1 3 4 6 7 7l2-3 5 2v4c0 1-1 2-2 2C9 22 2 15 2 5c0-1 1-2 2-2z"/>,
    mail: <g><rect x="3" y="5" width="18" height="14"/><path d="M3 7l9 7 9-7"/></g>,
    clock: <g><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></g>,
    whatsapp: <g><path d="M12 3a9 9 0 0 0-8 13l-1 5 5-1a9 9 0 1 0 4-17z"/><path d="M9 9c0 4 3 7 7 7l1-2-3-1-1 1c-1 0-3-2-3-3l1-1-1-3z"/></g>,
    truck: <g><rect x="2" y="7" width="12" height="9"/><path d="M14 10h4l3 3v3h-7"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></g>,
    star: <path d="M12 3l3 6 6 1-4 4 1 7-6-3-6 3 1-7-4-4 6-1z"/>,
    chevron: <path d="M9 6l6 6-6 6"/>,
    instagram: <g><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r="1" fill="currentColor"/></g>,
    facebook: <path d="M14 3h3v4h-3c-1 0-1 1-1 1v3h4l-1 4h-3v9h-4v-9h-3v-4h3v-3c0-3 2-5 5-5z"/>,
  };

  return <svg {...props}>{paths[name] || paths.search}</svg>;
};

window.FCIcon = FCIcon;

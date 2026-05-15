// ============================================================
// FC Store — Single source of truth, persisted in localStorage.
// Both the public site and the admin panel read/write through this.
// ============================================================

(function() {
  const STORAGE_KEY = 'fc-store-v1';
  const VERSION = 1;

  // ---------- SEED DATA ----------
  // Built from the original FC_PRODUCTS / FC_CATEGORIES so first-time visitors
  // get a populated site. Admin edits override this seed in localStorage.
  const SEED = {
    version: VERSION,
    settings: {
      shopName: 'FERRETERÍA CENTRAL',
      tagline: 'Industria · Hogar · Obra',
      address: 'Av. San Martín 1234, CABA',
      addressDetail: 'Esquina Av. Mitre · entre Belgrano y Sarmiento',
      phone: '5491100000000',
      phoneDisplay: '+54 11 0000-0000',
      email: 'ventas@ferreteriacentral.com.ar',
      cuit: '30-00000000-0',
      foundedYear: 1987,
      accent: '#EE8907',
    },
    hero: {
      eyebrow: 'Ferretería industrial · desde 1987',
      title1: 'TODO PARA',
      title2: 'TU OBRA,',
      titleStrike: 'AL MEJOR',
      titleAccent: 'PRECIO.',
      lead: 'Herramientas profesionales, materiales de construcción, sanitarios y seguridad. Catálogo completo con precios actualizados al día. Atención técnica especializada.',
    },
    horarios: [
      { day: 'Lunes',     hr: '8:00 – 19:00', closed: false },
      { day: 'Martes',    hr: '8:00 – 19:00', closed: false },
      { day: 'Miércoles', hr: '8:00 – 19:00', closed: false },
      { day: 'Jueves',    hr: '8:00 – 19:00', closed: false },
      { day: 'Viernes',   hr: '8:00 – 19:00', closed: false },
      { day: 'Sábado',    hr: '8:00 – 14:00', closed: false },
      { day: 'Domingo',   hr: 'Cerrado',      closed: true  },
    ],
    categories: window.FC_CATEGORIES || [],
    brands: window.FC_BRANDS || [],
    products: window.FC_PRODUCTS || [],
    // Featured ofertas (product IDs) — shown in the ofertas strip.
    // null = auto-pick all products with oldPrice.
    ofertasIds: null,
    // Quote tracking left as an empty list — the user opted out of an inbox;
    // cotizaciones go directly to WhatsApp from the public site.
    cotizaciones: [],
  };

  // ---------- LOAD / PERSIST ----------
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return clone(SEED);
      const parsed = JSON.parse(raw);
      if (parsed.version !== VERSION) return clone(SEED);
      // Merge to fill missing keys after a schema bump
      return { ...clone(SEED), ...parsed };
    } catch (e) {
      console.warn('FCStore: bad cache, using seed', e);
      return clone(SEED);
    }
  }

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  let state = loadState();
  const listeners = new Set();

  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (e) { console.warn('FCStore: persist failed', e); }
  }
  function notify() { listeners.forEach(fn => { try { fn(state); } catch (e) { console.error(e); } }); }

  function setState(mut) {
    if (typeof mut === 'function') state = mut(state);
    else state = { ...state, ...mut };
    persist();
    notify();
  }

  // Cross-tab sync — admin in one tab updates the public site in another
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const next = JSON.parse(e.newValue);
        if (next.version === VERSION) {
          state = next;
          notify();
        }
      } catch (err) { /* ignore */ }
    }
  });

  // ---------- ENTITY HELPERS ----------
  const nextProductId = () =>
    Math.max(0, ...state.products.map(p => p.id)) + 1;
  const nextCatId = (name) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || ('cat-' + Date.now());

  const api = {
    getState: () => state,
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    reset() {
      localStorage.removeItem(STORAGE_KEY);
      state = clone(SEED);
      notify();
    },
    export() { return JSON.stringify(state, null, 2); },
    import(json) {
      try {
        const next = JSON.parse(json);
        if (next.version !== VERSION) throw new Error('Version mismatch');
        state = next; persist(); notify();
        return true;
      } catch (e) { return false; }
    },

    // ----- Settings -----
    updateSettings(patch) {
      setState(s => ({ ...s, settings: { ...s.settings, ...patch } }));
    },
    updateHero(patch) {
      setState(s => ({ ...s, hero: { ...s.hero, ...patch } }));
    },
    updateHorarios(arr) {
      setState(s => ({ ...s, horarios: arr }));
    },

    // ----- Products -----
    upsertProduct(p) {
      setState(s => {
        if (!p.id) p = { ...p, id: nextProductId() };
        const exists = s.products.some(x => x.id === p.id);
        const products = exists
          ? s.products.map(x => x.id === p.id ? { ...x, ...p } : x)
          : [...s.products, p];
        return { ...s, products };
      });
    },
    removeProduct(id) {
      setState(s => ({ ...s, products: s.products.filter(p => p.id !== id) }));
    },
    bulkUpdateStock(updates) {
      setState(s => ({
        ...s,
        products: s.products.map(p => updates[p.id] != null ? { ...p, stock: +updates[p.id] } : p),
      }));
    },

    // ----- Categories -----
    upsertCategory(c) {
      setState(s => {
        if (!c.id) c = { ...c, id: nextCatId(c.name) };
        const exists = s.categories.some(x => x.id === c.id);
        const categories = exists
          ? s.categories.map(x => x.id === c.id ? { ...x, ...c } : x)
          : [...s.categories, { count: 0, icon: 'wrench', ...c }];
        return { ...s, categories };
      });
    },
    removeCategory(id) {
      setState(s => ({
        ...s,
        categories: s.categories.filter(c => c.id !== id),
      }));
    },
    reorderCategories(ids) {
      setState(s => ({
        ...s,
        categories: ids.map(id => s.categories.find(c => c.id === id)).filter(Boolean),
      }));
    },

    // ----- Brands -----
    addBrand(name) {
      setState(s => s.brands.includes(name) ? s : { ...s, brands: [...s.brands, name].sort() });
    },
    renameBrand(oldName, newName) {
      setState(s => ({
        ...s,
        brands: s.brands.map(b => b === oldName ? newName : b).sort(),
        products: s.products.map(p => p.brand === oldName ? { ...p, brand: newName } : p),
      }));
    },
    removeBrand(name) {
      setState(s => ({ ...s, brands: s.brands.filter(b => b !== name) }));
    },

    // ----- Ofertas -----
    setOfertas(ids) {
      setState(s => ({ ...s, ofertasIds: ids }));
    },

    // ----- Cotizaciones -----
    addCotizacion(c) {
      const full = {
        id: 'cot-' + Date.now(),
        ts: Date.now(),
        status: 'nueva',
        notes: '',
        ...c,
      };
      setState(s => ({ ...s, cotizaciones: [full, ...s.cotizaciones] }));
      return full;
    },
    updateCotizacion(id, patch) {
      setState(s => ({
        ...s,
        cotizaciones: s.cotizaciones.map(c => c.id === id ? { ...c, ...patch } : c),
      }));
    },
    removeCotizacion(id) {
      setState(s => ({ ...s, cotizaciones: s.cotizaciones.filter(c => c.id !== id) }));
    },
  };

  // ---------- REACT HOOK ----------
  // Defined when React is available. Triggers a re-render whenever state changes.
  function useStore() {
    const [, force] = React.useReducer(x => x + 1, 0);
    React.useEffect(() => api.subscribe(force), []);
    return state;
  }

  window.FCStore = api;
  window.useStore = useStore;

  // Derived counts so admin/dashboard can avoid re-deriving everywhere
  window.fcCounts = () => {
    const s = state;
    const lowStock = s.products.filter(p => p.stock > 0 && p.stock < 10);
    const outOfStock = s.products.filter(p => p.stock === 0);
    const ofertas = s.ofertasIds
      ? s.products.filter(p => s.ofertasIds.includes(p.id))
      : s.products.filter(p => p.oldPrice);
    const totalValue = s.products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const byCategory = {};
    s.categories.forEach(c => {
      byCategory[c.id] = s.products.filter(p => p.cat === c.id).length;
    });
    return { lowStock, outOfStock, ofertas, totalValue, byCategory };
  };
})();

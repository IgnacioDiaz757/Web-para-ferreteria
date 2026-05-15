// ============================================================
// FC — Main app
// ============================================================

const TWEAKS_DEFAULTS = /*EDITMODE-BEGIN*/{
  "shopName": "FERRETERÍA CENTRAL",
  "accent": "#EE8907",
  "gridCols": 3,
  "showStamp": true,
  "heroLayout": "cards",
  "phone": "5491100000000"
}/*EDITMODE-END*/;

const FCApp = () => {
  const [tweaks, setTweak] = useTweaks(TWEAKS_DEFAULTS);
  const [theme, setTheme] = useState('light');
  const [searchQ, setSearchQ] = useState('');
  const [filterCat, setFilterCat] = useState([]);
  const [filterBrand, setFilterBrand] = useState([]);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [onlyOffers, setOnlyOffers] = useState(false);
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState('relevance');
  const [favs, setFavs] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [openProduct, setOpenProduct] = useState(null);

  // Apply theme to <html> root
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Apply tweak accent color
  useEffect(() => {
    document.documentElement.style.setProperty('--fc-primary', tweaks.accent);
    // Derive a deep variant by darkening
    const c = tweaks.accent;
    document.documentElement.style.setProperty('--fc-primary-deep', shade(c, -0.18));
  }, [tweaks.accent]);

  function shade(hex, pct) {
    const num = parseInt(hex.slice(1), 16);
    let r = (num >> 16) & 0xff, g = (num >> 8) & 0xff, b = num & 0xff;
    r = Math.max(0, Math.min(255, Math.round(r + 255 * pct)));
    g = Math.max(0, Math.min(255, Math.round(g + 255 * pct)));
    b = Math.max(0, Math.min(255, Math.round(b + 255 * pct)));
    return '#' + [r,g,b].map(x => x.toString(16).padStart(2,'0')).join('');
  }

  // --- Derived: filtered products ---
  const filteredProducts = useMemo(() => {
    const q = searchQ.trim().toLowerCase();
    let arr = FC_PRODUCTS.filter(p => {
      if (q && !(p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))) return false;
      if (filterCat.length && !filterCat.includes(p.cat)) return false;
      if (filterBrand.length && !filterBrand.includes(p.brand)) return false;
      if (priceMin !== '' && p.price < +priceMin) return false;
      if (priceMax !== '' && p.price > +priceMax) return false;
      if (onlyOffers && !p.oldPrice) return false;
      if (inStock && p.stock === 0) return false;
      return true;
    });
    if (sort === 'price-asc') arr = [...arr].sort((a,b) => a.price - b.price);
    if (sort === 'price-desc') arr = [...arr].sort((a,b) => b.price - a.price);
    if (sort === 'name') arr = [...arr].sort((a,b) => a.name.localeCompare(b.name));
    return arr;
  }, [searchQ, filterCat, filterBrand, priceMin, priceMax, onlyOffers, inStock, sort]);

  // --- Counts for filter sidebar ---
  const counts = useMemo(() => {
    const byCat = {}, byBrand = {};
    FC_PRODUCTS.forEach(p => {
      byCat[p.cat] = (byCat[p.cat] || 0) + 1;
      byBrand[p.brand] = (byBrand[p.brand] || 0) + 1;
    });
    return { byCat, byBrand };
  }, []);

  // --- Suggestions for header search ---
  const suggestions = useMemo(() => {
    const q = searchQ.trim().toLowerCase();
    if (!q) return [];
    return FC_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
    );
  }, [searchQ]);

  // --- Ofertas ---
  const ofertas = useMemo(() => FC_PRODUCTS.filter(p => p.oldPrice).slice(0, 4), []);

  // --- Cart ---
  const addToCart = (p) => {
    setCart(prev => {
      const ex = prev.find(it => it.id === p.id);
      if (ex) return prev.map(it => it.id === p.id ? { ...it, qty: it.qty + 1 } : it);
      return [...prev, { ...p, qty: 1 }];
    });
    setCartOpen(true);
  };
  const incCart = (id) => setCart(prev => prev.map(it => it.id === id ? { ...it, qty: it.qty + 1 } : it));
  const decCart = (id) => setCart(prev => prev.map(it => it.id === id ? { ...it, qty: Math.max(1, it.qty - 1) } : it));
  const removeCart = (id) => setCart(prev => prev.filter(it => it.id !== id));
  const cartTotal = useMemo(() => cart.reduce((s, it) => s + it.price * it.qty, 0), [cart]);

  // --- Favs ---
  const toggleFav = (p) => setFavs(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id]);

  // --- Active filter chips ---
  const activeChips = [
    ...filterCat.map(id => ({ key: 'cat-'+id, label: FC_CATEGORIES.find(c => c.id === id)?.short || id, remove: () => setFilterCat(c => c.filter(x => x !== id)) })),
    ...filterBrand.map(b => ({ key: 'brand-'+b, label: b, remove: () => setFilterBrand(arr => arr.filter(x => x !== b)) })),
    ...(onlyOffers ? [{ key: 'off', label: 'Solo ofertas', remove: () => setOnlyOffers(false) }] : []),
    ...(inStock ? [{ key: 'stk', label: 'Con stock', remove: () => setInStock(false) }] : []),
    ...((priceMin !== '' || priceMax !== '') ? [{ key: 'price', label: `${priceMin || '0'} – ${priceMax || '∞'}`, remove: () => { setPriceMin(''); setPriceMax(''); } }] : []),
  ];

  const clearFilters = () => {
    setFilterCat([]); setFilterBrand([]); setPriceMin(''); setPriceMax(''); setOnlyOffers(false); setInStock(false);
  };

  const scrollToCatalog = () => {
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const gridCols = tweaks.gridCols || 3;

  return (
    <>
      <FCTopbar phone={tweaks.phone} address="Av. San Martín 1234, CABA"/>
      <FCHeader
        name={tweaks.shopName}
        onCartClick={() => setCartOpen(true)}
        cartCount={cart.reduce((s, it) => s + it.qty, 0)}
        onSearch={setSearchQ}
        searchQ={searchQ}
        suggestions={suggestions}
        onPickSuggestion={(s) => { setSearchQ(''); setOpenProduct(s); }}
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        theme={theme}
      />

      <FCHero onShop={scrollToCatalog}/>

      <FCCategoriesSection
        onPick={(catId) => {
          if (catId === null) setFilterCat([]);
          else setFilterCat(filterCat.includes(catId) ? [] : [catId]);
          scrollToCatalog();
        }}
        activeCat={filterCat[0]}
      />

      <FCOfertas
        products={ofertas}
        onAdd={addToCart}
        onOpen={setOpenProduct}
        onFav={toggleFav}
        favs={favs}
      />

      <section className="fc-section" id="catalogo">
        <div className="fc-container">
          <div className="fc-section-head">
            <div className="left">
              <div className="fc-eyebrow">Catálogo completo</div>
              <h2>Todos los productos</h2>
              <p className="sub">Precios actualizados al día. IVA incluido. Consultá disponibilidad por WhatsApp.</p>
            </div>
          </div>

          <div className="fc-catalog">
            <FCFilters
              cat={filterCat} setCat={setFilterCat}
              brand={filterBrand} setBrand={setFilterBrand}
              priceMin={priceMin} setPriceMin={setPriceMin}
              priceMax={priceMax} setPriceMax={setPriceMax}
              onlyOffers={onlyOffers} setOnlyOffers={setOnlyOffers}
              inStock={inStock} setInStock={setInStock}
              onClear={clearFilters}
              counts={counts}
            />

            <div className="fc-catalog-main">
              <div className="fc-catalog-toolbar">
                <div className="fc-results-count">
                  Mostrando <b>{filteredProducts.length}</b> de <b>{FC_PRODUCTS.length}</b> productos
                </div>
                <div className="fc-sort">
                  <span>Ordenar:</span>
                  <select value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="relevance">Relevancia</option>
                    <option value="price-asc">Precio: menor a mayor</option>
                    <option value="price-desc">Precio: mayor a menor</option>
                    <option value="name">Nombre A-Z</option>
                  </select>
                </div>
              </div>

              {activeChips.length > 0 && (
                <div className="fc-active-filters">
                  {activeChips.map(c => (
                    <span key={c.key} className="fc-chip" onClick={c.remove}>
                      {c.label}
                      <FCIcon name="x" size={12}/>
                    </span>
                  ))}
                  <span className="fc-chip" onClick={clearFilters}
                    style={{background:'var(--fc-ink)', color:'#fff', borderColor:'var(--fc-ink)'}}>
                    Limpiar todo
                  </span>
                </div>
              )}

              {filteredProducts.length === 0 ? (
                <div style={{padding:'80px 20px', textAlign:'center', border:'1.5px dashed var(--fc-border)', background:'var(--fc-bg-alt)'}}>
                  <div style={{fontFamily:'var(--vu-font-display)', fontSize: 28, color:'var(--fc-text-strong)', textTransform:'uppercase', marginBottom: 8}}>
                    Sin resultados
                  </div>
                  <div style={{color:'var(--fc-text-muted)', marginBottom: 20}}>Probá con otra búsqueda o limpiá los filtros.</div>
                  <FCBtn variant="ghost" onClick={() => { clearFilters(); setSearchQ(''); }}>Limpiar todo</FCBtn>
                </div>
              ) : (
                <div className="fc-product-grid" style={{gridTemplateColumns: `repeat(${gridCols}, 1fr)`}}>
                  {filteredProducts.map(p => (
                    <FCProductCard
                      key={p.id}
                      p={p}
                      onAdd={addToCart}
                      onOpen={setOpenProduct}
                      onFav={toggleFav}
                      isFav={favs.includes(p.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <FCContact address="Av. San Martín 1234, CABA" phone={tweaks.phone}/>

      <FCFooter name={tweaks.shopName}/>

      {/* Floating WhatsApp */}
      <button className="fc-fab" onClick={() => window.open(`https://wa.me/${tweaks.phone}?text=${encodeURIComponent('Hola! Quiero consultar por un producto')}`, '_blank')} aria-label="WhatsApp">
        <FCIcon name="whatsapp" size={30}/>
      </button>

      <FCCartDrawer
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onInc={incCart}
        onDec={decCart}
        onRemove={removeCart}
        total={cartTotal}
        phone={tweaks.phone}
      />

      <FCProductModal
        product={openProduct}
        onClose={() => setOpenProduct(null)}
        onAdd={addToCart}
      />

      <TweaksPanel title="Tweaks · Ferretería">
        <TweakSection label="Marca">
          <TweakText label="Nombre del negocio" value={tweaks.shopName} onChange={(v) => setTweak('shopName', v)}/>
          <TweakText label="WhatsApp (sin +)" value={tweaks.phone} onChange={(v) => setTweak('phone', v)}/>
        </TweakSection>
        <TweakSection label="Apariencia">
          <TweakColor
            label="Color de acento"
            value={tweaks.accent}
            onChange={(v) => setTweak('accent', v)}
            options={['#EE8907', '#C72525', '#F2D214', '#186133', '#2B6CB0', '#E61D86']}
          />
          <TweakRadio
            label="Densidad del catálogo"
            value={String(tweaks.gridCols)}
            onChange={(v) => setTweak('gridCols', +v)}
            options={[
              { value: '2', label: '2 col' },
              { value: '3', label: '3 col' },
              { value: '4', label: '4 col' },
            ]}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<FCApp/>);

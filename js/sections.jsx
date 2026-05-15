// ============================================================
// FC — Page sections
// ============================================================

// ---------- TOP BAR ----------
const FCTopbar = ({ phone, address }) => (
  <div className="fc-topbar">
    <div className="fc-container fc-topbar-inner">
      <span><FCIcon name="pin" size={12} style={{verticalAlign:'-2px', marginRight:6}}/> {address}</span>
      <span className="sep">·</span>
      <span><FCIcon name="clock" size={12} style={{verticalAlign:'-2px', marginRight:6}}/> Lun a Sáb · 8:00 a 19:00</span>
      <div className="right">
        <a href={`tel:${phone}`}><FCIcon name="phone" size={12} style={{verticalAlign:'-2px', marginRight:6}}/> +54 11 0000-0000</a>
        <span className="sep">·</span>
        <a href="#contacto">Envíos a todo el país</a>
      </div>
    </div>
  </div>
);

// ---------- HEADER ----------
const FCHeader = ({ name, onCartClick, cartCount, onSearch, searchQ, onToggleTheme, theme, suggestions, onPickSuggestion }) => {
  const [focused, setFocused] = useState(false);
  return (
    <header className="fc-header">
      <div className="fc-container fc-header-inner">
        <FCLogo name={name} />
        <div className="fc-search">
          <span className="fc-search-icon"><FCIcon name="search"/></span>
          <input
            type="search"
            placeholder="Buscar herramientas, marcas, códigos…"
            value={searchQ}
            onChange={(e) => onSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
          />
          {focused && searchQ && suggestions.length > 0 && (
            <div className="fc-search-suggest">
              {suggestions.slice(0, 6).map(s => (
                <div className="fc-search-suggest-item" key={s.id} onMouseDown={() => onPickSuggestion(s)}>
                  <div className="fc-search-suggest-thumb"><FCIcon name={s.icon}/></div>
                  <div>
                    <div className="fc-search-suggest-name">{s.name}</div>
                    <div className="fc-search-suggest-sku">{s.sku} · {s.brand}</div>
                  </div>
                  <div className="fc-search-suggest-price">{fmtARS(s.price)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="fc-header-actions">
          <button className="fc-icon-btn" onClick={onToggleTheme} aria-label="Cambiar tema">
            <FCIcon name={theme === 'dark' ? 'sun' : 'moon'}/>
          </button>
          <button className="fc-icon-btn" onClick={onCartClick} aria-label="Cotización">
            <FCIcon name="cart"/>
            {cartCount > 0 && <span className="fc-icon-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
};

// ---------- HERO ----------
const FCHero = ({ onShop, layout = 'cards' }) => (
  <section className="fc-hero">
    <div className="fc-hero-grid-bg"/>
    <div className="fc-container fc-hero-inner">
      <div>
        <div className="fc-eyebrow" style={{color:'var(--fc-primary)'}}>
          <span style={{background:'var(--fc-primary)'}}/>
          Ferretería industrial · desde 1987
        </div>
        <h1>
          TODO PARA<br/>
          TU OBRA,<br/>
          <span className="strike">AL MEJOR</span>{' '}
          <span className="accent">PRECIO.</span>
        </h1>
        <p className="lead">
          Herramientas profesionales, materiales de construcción, sanitarios y seguridad. Catálogo completo con precios actualizados al día. Atención técnica especializada.
        </p>
        <div style={{display:'flex', gap:12, flexWrap:'wrap'}}>
          <FCBtn icon="arrow" iconRight={null} size="lg" onClick={onShop}>
            Ver catálogo completo
          </FCBtn>
          <FCBtn variant="ghost" size="lg" icon="whatsapp" onClick={() => window.open('https://wa.me/5491100000000', '_blank')} style={{borderColor:'#43382A', color:'#fff'}}>
            Consultar precios
          </FCBtn>
        </div>

        <div className="fc-hero-meta">
          <div className="item">
            <FCIcon name="truck"/>
            <div><span className="ttl">Envíos a todo el país</span><span className="sub">Despacho 24-48 hs</span></div>
          </div>
          <div className="item">
            <FCIcon name="star"/>
            <div><span className="ttl">+500 marcas</span><span className="sub">Stock permanente</span></div>
          </div>
          <div className="item">
            <FCIcon name="phone"/>
            <div><span className="ttl">Asesoramiento técnico</span><span className="sub">Lun a Sáb 8 a 19</span></div>
          </div>
        </div>
      </div>

      <div className="fc-hero-art">
        <div className="fc-hero-card fc-hero-card-1">
          <div className="thumb"><FCIcon name="drill"/></div>
          <div className="name">Taladro 750W</div>
          <div className="price">{fmtARS(89900)}</div>
          <div className="fc-hero-stamp">−20%</div>
        </div>
        <div className="fc-hero-card fc-hero-card-2">
          <div className="thumb"><FCIcon name="hammer"/></div>
          <div className="name">Martillo 16oz</div>
          <div className="price">{fmtARS(18400)}</div>
        </div>
        <div className="fc-hero-card fc-hero-card-3">
          <div className="thumb"><FCIcon name="helmet"/></div>
          <div className="name">Casco Clase B</div>
          <div className="price">{fmtARS(12900)}</div>
        </div>
      </div>
    </div>
  </section>
);

// ---------- CATEGORÍAS ----------
const FCCategoriesSection = ({ onPick, activeCat }) => (
  <section className="fc-section" id="categorias">
    <div className="fc-container">
      <div className="fc-section-head">
        <div className="left">
          <div className="fc-eyebrow">Categorías destacadas</div>
          <h2>Encontrá lo que necesitás</h2>
          <p className="sub">Más de 500 productos organizados por rubro. Todo lo que precisás para tu próximo proyecto.</p>
        </div>
        <FCBtn variant="ghost" iconRight="arrow" onClick={() => onPick(null)}>Ver todas</FCBtn>
      </div>
      <div className="fc-cat-grid">
        {FC_CATEGORIES.map((c, i) => (
          <button
            key={c.id}
            className={`fc-cat ${i === 0 || i === 4 ? 'featured' : ''} ${activeCat === c.id ? 'featured' : ''}`}
            onClick={() => onPick(c.id)}
          >
            <div className="icon"><FCIcon name={c.icon} size={28}/></div>
            <div className="name">{c.name}</div>
            <div className="count">{c.count} productos</div>
            <div className="arrow">→</div>
          </button>
        ))}
      </div>
    </div>
  </section>
);

// ---------- OFERTAS ----------
const FCOfertas = ({ products, onAdd, onOpen, onFav, favs }) => (
  <section className="fc-ofertas" id="ofertas">
    <div className="fc-container">
      <div className="fc-section-head">
        <div className="left">
          <div className="fc-eyebrow">Promos de la semana</div>
          <h2>Liquidación industrial.<br/>Mientras dure el stock.</h2>
          <p className="sub">Productos seleccionados con hasta 30% de descuento. Renovamos las ofertas todos los lunes.</p>
        </div>
      </div>
      <div className="fc-ofertas-grid">
        {products.slice(0, 4).map(p => (
          <FCProductCard
            key={p.id}
            p={p}
            onAdd={onAdd}
            onOpen={onOpen}
            onFav={onFav}
            isFav={favs.includes(p.id)}
          />
        ))}
      </div>
    </div>
  </section>
);

// ---------- FILTERS SIDEBAR ----------
const FCFilters = ({ cat, setCat, brand, setBrand, priceMin, setPriceMin, priceMax, setPriceMax, onlyOffers, setOnlyOffers, inStock, setInStock, onClear, counts }) => {
  return (
    <aside className="fc-filters">
      <h3>Filtros</h3>

      <div className="fc-filter-group">
        <h4>Categoría</h4>
        {FC_CATEGORIES.map(c => (
          <label key={c.id} className="fc-filter-opt">
            <input
              type="checkbox"
              checked={cat.includes(c.id)}
              onChange={() => setCat(cat.includes(c.id) ? cat.filter(x => x !== c.id) : [...cat, c.id])}
            />
            <span>{c.short}</span>
            <span className="count">{counts.byCat[c.id] || 0}</span>
          </label>
        ))}
      </div>

      <div className="fc-filter-group">
        <h4>Precio (ARS)</h4>
        <div className="fc-range-inputs">
          <input type="number" placeholder="Mín" value={priceMin} onChange={(e) => setPriceMin(e.target.value)}/>
          <span className="dash">—</span>
          <input type="number" placeholder="Máx" value={priceMax} onChange={(e) => setPriceMax(e.target.value)}/>
        </div>
      </div>

      <div className="fc-filter-group">
        <h4>Marca</h4>
        {[...new Set(FC_PRODUCTS.map(p => p.brand))].sort().slice(0, 8).map(b => (
          <label key={b} className="fc-filter-opt">
            <input
              type="checkbox"
              checked={brand.includes(b)}
              onChange={() => setBrand(brand.includes(b) ? brand.filter(x => x !== b) : [...brand, b])}
            />
            <span>{b}</span>
            <span className="count">{counts.byBrand[b] || 0}</span>
          </label>
        ))}
      </div>

      <div className="fc-filter-group">
        <h4>Otros</h4>
        <label className="fc-filter-opt">
          <input type="checkbox" checked={onlyOffers} onChange={(e) => setOnlyOffers(e.target.checked)}/>
          <span>Solo ofertas</span>
        </label>
        <label className="fc-filter-opt">
          <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)}/>
          <span>Solo con stock</span>
        </label>
      </div>

      <FCBtn variant="ghost" size="sm" onClick={onClear} style={{width:'100%'}}>
        Limpiar filtros
      </FCBtn>
    </aside>
  );
};

// ---------- CONTACT / UBICACIÓN ----------
const FCContact = ({ address, phone }) => {
  const today = new Date().getDay(); // 0=dom
  const dayMap = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const horarios = [
    { day: 'Lunes',     hr: '8:00 – 19:00' },
    { day: 'Martes',    hr: '8:00 – 19:00' },
    { day: 'Miércoles', hr: '8:00 – 19:00' },
    { day: 'Jueves',    hr: '8:00 – 19:00' },
    { day: 'Viernes',   hr: '8:00 – 19:00' },
    { day: 'Sábado',    hr: '8:00 – 14:00' },
    { day: 'Domingo',   hr: 'Cerrado', closed: true },
  ];
  return (
    <section className="fc-section alt" id="contacto">
      <div className="fc-container">
        <div className="fc-section-head">
          <div className="left">
            <div className="fc-eyebrow">Visitanos · Pedinos</div>
            <h2>Acá estamos.<br/>Vení o escribinos.</h2>
            <p className="sub">Mostrador, asesoramiento técnico y retiro de pedidos. Despacho a domicilio y envíos al interior.</p>
          </div>
        </div>

        <div className="fc-contact-grid">
          <div className="fc-contact-info">
            <div className="fc-info-block">
              <div className="label"><FCIcon name="pin" size={14}/> Dirección</div>
              <div className="value">{address}</div>
              <div className="sub">Esquina Av. Mitre · entre Belgrano y Sarmiento</div>
            </div>
            <div className="fc-info-block">
              <div className="label"><FCIcon name="clock" size={14}/> Horarios</div>
              <div className="fc-horarios">
                {horarios.map(h => {
                  const isToday = h.day === dayMap[today];
                  return (
                    <React.Fragment key={h.day}>
                      <span className={`day ${isToday ? 'today' : ''}`}>{h.day}{isToday ? ' · hoy' : ''}</span>
                      <span className={`hr ${isToday ? 'today' : ''} ${h.closed ? 'closed' : ''}`}>{h.hr}</span>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
            <div className="fc-info-block">
              <div className="label"><FCIcon name="phone" size={14}/> Contacto</div>
              <div className="value" style={{fontSize: 18}}>+54 11 0000-0000</div>
              <div className="sub">ventas@ferreteriacentral.com.ar</div>
              <div style={{display:'flex', gap:10, marginTop: 16, flexWrap:'wrap'}}>
                <FCBtn variant="whatsapp" icon="whatsapp" size="sm" onClick={() => window.open(`https://wa.me/${phone}`, '_blank')}>
                  WhatsApp
                </FCBtn>
                <FCBtn variant="ghost" icon="mail" size="sm">Email</FCBtn>
              </div>
            </div>
          </div>

          <FCMap address={address}/>
        </div>
      </div>
    </section>
  );
};

const FCMap = ({ address }) => (
  <div className="fc-map">
    <svg className="map-bg" viewBox="0 0 600 480" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#D9CFB5" strokeWidth=".5"/>
        </pattern>
      </defs>
      <rect width="600" height="480" fill="#F3ECDC"/>
      <rect width="600" height="480" fill="url(#grid)"/>
      {/* Streets — main horizontal */}
      <path d="M0 240 L600 240" stroke="#A89A82" strokeWidth="22"/>
      <path d="M0 240 L600 240" stroke="#FBF7EE" strokeWidth="14"/>
      {/* main vertical */}
      <path d="M300 0 L300 480" stroke="#A89A82" strokeWidth="18"/>
      <path d="M300 0 L300 480" stroke="#FBF7EE" strokeWidth="11"/>
      {/* secondary */}
      <path d="M0 100 L600 100" stroke="#C8BEA4" strokeWidth="8"/>
      <path d="M0 380 L600 380" stroke="#C8BEA4" strokeWidth="8"/>
      <path d="M120 0 L120 480" stroke="#C8BEA4" strokeWidth="8"/>
      <path d="M480 0 L480 480" stroke="#C8BEA4" strokeWidth="8"/>
      {/* blocks fill */}
      <rect x="20" y="20" width="80" height="60" fill="#ECE3CC" stroke="#D9CFB5"/>
      <rect x="140" y="20" width="140" height="60" fill="#ECE3CC" stroke="#D9CFB5"/>
      <rect x="320" y="20" width="140" height="60" fill="#ECE3CC" stroke="#D9CFB5"/>
      <rect x="500" y="20" width="80" height="60" fill="#ECE3CC" stroke="#D9CFB5"/>
      <rect x="20" y="120" width="80" height="100" fill="#ECE3CC" stroke="#D9CFB5"/>
      <rect x="140" y="120" width="140" height="100" fill="#ECE3CC" stroke="#D9CFB5"/>
      <rect x="320" y="120" width="140" height="100" fill="#DCE9CC" stroke="#D9CFB5"/>
      <rect x="500" y="120" width="80" height="100" fill="#ECE3CC" stroke="#D9CFB5"/>
      <rect x="20" y="260" width="80" height="100" fill="#ECE3CC" stroke="#D9CFB5"/>
      <rect x="140" y="260" width="140" height="100" fill="#ECE3CC" stroke="#D9CFB5"/>
      <rect x="320" y="260" width="140" height="100" fill="#ECE3CC" stroke="#D9CFB5"/>
      <rect x="500" y="260" width="80" height="100" fill="#ECE3CC" stroke="#D9CFB5"/>
      <rect x="20" y="400" width="80" height="60" fill="#ECE3CC" stroke="#D9CFB5"/>
      <rect x="140" y="400" width="140" height="60" fill="#ECE3CC" stroke="#D9CFB5"/>
      <rect x="320" y="400" width="140" height="60" fill="#ECE3CC" stroke="#D9CFB5"/>
      <rect x="500" y="400" width="80" height="60" fill="#ECE3CC" stroke="#D9CFB5"/>
      {/* labels */}
      <text x="50" y="245" fontFamily="JetBrains Mono" fontSize="9" fill="#76664F" letterSpacing="1">AV. SAN MARTÍN</text>
      <text x="305" y="155" fontFamily="JetBrains Mono" fontSize="9" fill="#76664F" letterSpacing="1" transform="rotate(-90 305 155)">AV. MITRE</text>
    </svg>
    <div className="fc-map-pin">
      <div className="head"><FCIcon name="pin" size={22}/></div>
      <div className="tag">Ferretería Central</div>
    </div>
  </div>
);

// ---------- FOOTER ----------
const FCFooter = ({ name }) => (
  <footer className="fc-footer">
    <div className="fc-container">
      <div className="fc-footer-grid">
        <div>
          <h5>{name}</h5>
          <p style={{maxWidth: 280, lineHeight: 1.6, fontSize: 14}}>
            Ferretería industrial con más de 35 años de trayectoria. Stock permanente, marcas líderes y atención técnica.
          </p>
          <div style={{display:'flex', gap: 10, marginTop: 14}}>
            <a href="#" aria-label="Instagram"><FCIcon name="instagram"/></a>
            <a href="#" aria-label="Facebook"><FCIcon name="facebook"/></a>
            <a href="#" aria-label="WhatsApp"><FCIcon name="whatsapp"/></a>
          </div>
        </div>
        <div>
          <h5>Catálogo</h5>
          <ul>
            {FC_CATEGORIES.slice(0, 5).map(c => <li key={c.id}><a href="#">{c.short}</a></li>)}
            <li><a href="#ofertas">Ofertas vigentes</a></li>
          </ul>
        </div>
        <div>
          <h5>Atención</h5>
          <ul>
            <li><a href="#contacto">Ubicación y horarios</a></li>
            <li><a href="#">Envíos al interior</a></li>
            <li><a href="#">Devoluciones</a></li>
            <li><a href="#">Cuenta corriente</a></li>
            <li><a href="#">Para profesionales</a></li>
          </ul>
        </div>
        <div>
          <h5>Contacto</h5>
          <ul>
            <li>Av. San Martín 1234</li>
            <li>CABA, Argentina</li>
            <li>+54 11 0000-0000</li>
            <li>ventas@ferreteriacentral.com.ar</li>
          </ul>
        </div>
      </div>
      <div className="fc-footer-bottom">
        <span>© 2026 {name} · Todos los derechos reservados</span>
        <span>CUIT 30-00000000-0 · Diseñado en Argentina</span>
      </div>
    </div>
  </footer>
);

Object.assign(window, { FCTopbar, FCHeader, FCHero, FCCategoriesSection, FCOfertas, FCFilters, FCContact, FCFooter });

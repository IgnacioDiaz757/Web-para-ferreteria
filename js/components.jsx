// ============================================================
// FC — Shared components (Button, Badge, ProductCard, etc.)
// ============================================================

const { useState, useEffect, useRef, useMemo } = React;

// ---------- LOGO ----------
const FCLogo = ({ name = 'FERRETERÍA CENTRAL', tag = 'Industria · Hogar · Obra' }) => (
  <a href="#" className="fc-logo" onClick={(e) => e.preventDefault()}>
    <div className="fc-logo-mark">
      <FCIcon name="wrench" />
    </div>
    <div>
      <div className="fc-logo-text">
        {name}
        <span>{tag}</span>
      </div>
    </div>
  </a>
);

// ---------- BUTTON ----------
const FCBtn = ({ children, variant = 'primary', size = 'md', icon, iconRight, onClick, type = 'button', ...rest }) => (
  <button
    type={type}
    onClick={onClick}
    className={`fc-btn ${variant !== 'primary' ? variant : ''} ${size !== 'md' ? size : ''}`.trim()}
    {...rest}
  >
    {icon && <FCIcon name={icon} />}
    {children}
    {iconRight && <FCIcon name={iconRight} />}
  </button>
);

// ---------- BADGE ----------
const FCBadge = ({ kind, children }) => (
  <span className={`fc-badge ${kind || ''}`}>{children}</span>
);

// ---------- STOCK INDICATOR ----------
const FCStock = ({ stock }) => {
  if (stock === 0) return <div className="fc-product-stock out"><span className="dot"/>Sin stock</div>;
  if (stock < 10) return <div className="fc-product-stock low"><span className="dot"/>Últimas {stock} unidades</div>;
  return <div className="fc-product-stock"><span className="dot"/>En stock · {stock}u</div>;
};

// ---------- PRODUCT CARD ----------
const FCProductCard = ({ p, onAdd, onOpen, onFav, isFav }) => {
  const hasDiscount = p.oldPrice && p.oldPrice > p.price;
  const discount = hasDiscount ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  return (
    <div className="fc-product">
      <div className="fc-product-img" onClick={() => onOpen(p)} style={{cursor:'pointer'}}>
        <FCIcon name={p.icon} size={72}/>
        <div className="fc-product-badges">
          {p.badge === 'hot' && <FCBadge kind="hot">Hot</FCBadge>}
          {p.badge === 'new' && <FCBadge kind="new">Nuevo</FCBadge>}
          {p.badge === 'stock-low' && <FCBadge kind="stock-low">Últimas</FCBadge>}
          {hasDiscount && <FCBadge kind="discount">−{discount}%</FCBadge>}
        </div>
        <button
          className={`fc-product-fav ${isFav ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); onFav(p); }}
          aria-label="Agregar a favoritos"
        >
          <FCIcon name="heart" size={16}/>
        </button>
      </div>
      <div className="fc-product-brand">{p.brand}</div>
      <div className="fc-product-name">{p.name}</div>
      <div className="fc-product-sku">{p.sku}</div>
      <FCStock stock={p.stock} />
      <div className="fc-product-price-row">
        <span className={`fc-product-price ${hasDiscount ? 'hot' : ''}`}>{fmtARS(p.price)}</span>
        {hasDiscount && <span className="fc-product-price-old">{fmtARS(p.oldPrice)}</span>}
        <span className="fc-product-unit">/ {p.unit}</span>
      </div>
      <div className="fc-product-cta">
        <FCBtn icon="plus" size="sm" onClick={() => onAdd(p)} disabled={p.stock === 0}>
          Cotizar
        </FCBtn>
        <FCBtn variant="ghost" size="sm" onClick={() => onOpen(p)}>
          Detalle
        </FCBtn>
      </div>
    </div>
  );
};

// ---------- PRODUCT MODAL ----------
const FCProductModal = ({ product, onClose, onAdd }) => {
  if (!product) return null;
  const p = product;
  const hasDiscount = p.oldPrice && p.oldPrice > p.price;
  return (
    <div className="fc-modal-backdrop open" onClick={onClose}>
      <div className="fc-modal" onClick={(e) => e.stopPropagation()}>
        <button className="fc-modal-close" onClick={onClose} aria-label="Cerrar">
          <FCIcon name="x"/>
        </button>
        <div className="fc-modal-img">
          <FCIcon name={p.icon} className="product-svg" />
        </div>
        <div className="fc-modal-body">
          <div className="brand">{p.brand} · {p.sku}</div>
          <h3>{p.name}</h3>
          <p className="desc">{p.desc}</p>

          <ul className="fc-spec-list">
            {Object.entries(p.specs || {}).map(([k, v]) => (
              <li key={k}><span className="k">{k}</span><span className="v">{v}</span></li>
            ))}
          </ul>

          <FCStock stock={p.stock} />
          <div className={`fc-modal-price ${hasDiscount ? 'hot' : ''}`} style={{marginTop: 16}}>
            {fmtARS(p.price)}
            {hasDiscount && <span style={{
              fontFamily:'var(--vu-font-body)', fontSize:'16px', color:'var(--fc-text-muted)',
              textDecoration:'line-through', marginLeft: 10, fontWeight: 400,
            }}>{fmtARS(p.oldPrice)}</span>}
          </div>
          <div className="fc-modal-unit">Precio por {p.unit} · IVA incluido</div>

          <div className="fc-modal-cta">
            <FCBtn icon="plus" onClick={() => { onAdd(p); onClose(); }} disabled={p.stock === 0}>
              Agregar a cotización
            </FCBtn>
            <FCBtn
              variant="whatsapp"
              icon="whatsapp"
              onClick={() => {
                const msg = encodeURIComponent(`Hola! Quiero consultar por: ${p.name} (${p.sku}) — ${fmtARS(p.price)}`);
                window.open(`https://wa.me/5491100000000?text=${msg}`, '_blank');
              }}
            >
              Consultar
            </FCBtn>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------- CART DRAWER ----------
const FCCartDrawer = ({ open, items, onClose, onInc, onDec, onRemove, total, phone }) => {
  const whatsappMsg = () => {
    if (items.length === 0) return '';
    const lines = items.map(it => `• ${it.qty}× ${it.name} (${it.sku}) — ${fmtARS(it.price * it.qty)}`);
    const text = `Hola! Quiero solicitar cotización de los siguientes productos:\n\n${lines.join('\n')}\n\n*Total estimado: ${fmtARS(total)}*\n\nAguardo confirmación. Gracias!`;
    return encodeURIComponent(text);
  };
  return (
    <>
      <div className={`fc-drawer-backdrop ${open ? 'open' : ''}`} onClick={onClose}/>
      <div className={`fc-drawer ${open ? 'open' : ''}`}>
        <div className="fc-drawer-header">
          <h3>Tu cotización · {items.length} {items.length === 1 ? 'ítem' : 'ítems'}</h3>
          <button className="fc-drawer-close" onClick={onClose} aria-label="Cerrar">
            <FCIcon name="x"/>
          </button>
        </div>
        <div className="fc-drawer-body">
          {items.length === 0 ? (
            <div className="fc-drawer-empty">
              <FCIcon name="cart" size={64}/>
              <div className="title">Lista vacía</div>
              <div>Agregá productos del catálogo para armar tu cotización.</div>
            </div>
          ) : (
            items.map(it => (
              <div className="fc-cart-item" key={it.id}>
                <div className="thumb"><FCIcon name={it.icon} size={32}/></div>
                <div>
                  <div className="name">{it.name}</div>
                  <div className="sku">{it.sku} · {it.brand}</div>
                  <div className="price">{fmtARS(it.price * it.qty)}</div>
                </div>
                <div className="right">
                  <div className="fc-qty">
                    <button onClick={() => onDec(it.id)} aria-label="−">−</button>
                    <span className="val">{it.qty}</span>
                    <button onClick={() => onInc(it.id)} aria-label="+">+</button>
                  </div>
                  <button className="fc-cart-remove" onClick={() => onRemove(it.id)}>Quitar</button>
                </div>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className="fc-drawer-foot">
            <div className="fc-drawer-total">
              <span className="lbl">Total estimado</span>
              <span className="val">{fmtARS(total)}</span>
            </div>
            <FCBtn
              variant="whatsapp"
              icon="whatsapp"
              size="lg"
              style={{width:'100%'}}
              onClick={() => window.open(`https://wa.me/${phone}?text=${whatsappMsg()}`, '_blank')}
            >
              Enviar cotización por WhatsApp
            </FCBtn>
            <div className="fc-drawer-note">
              Los precios pueden variar. Confirmamos disponibilidad y entrega por WhatsApp.
            </div>
          </div>
        )}
      </div>
    </>
  );
};

Object.assign(window, { FCLogo, FCBtn, FCBadge, FCStock, FCProductCard, FCProductModal, FCCartDrawer });

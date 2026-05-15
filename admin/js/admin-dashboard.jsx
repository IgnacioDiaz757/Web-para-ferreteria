// ============================================================
// Admin · Dashboard
// ============================================================

const AdmDashboard = ({ goTo }) => {
  const store = useStore();
  const counts = window.fcCounts();
  const { products, categories, brands, settings } = store;

  // Mock metrics — these would be derived from real DB tables.
  // Right now we synthesize stable numbers from the catalog for the demo.
  const totalProducts = products.length;
  const offerCount = counts.ofertas.length;
  const stockValue = counts.totalValue;
  const mostViewed = useMemo(() => {
    // Stable pseudo-ranking — most-viewed = highest oldPrice (proxy for popular)
    return [...products]
      .sort((a, b) => (b.oldPrice || b.price * 1.05) - (a.oldPrice || a.price))
      .slice(0, 5);
  }, [products]);

  const fmt = (n) => '$' + n.toLocaleString('de-DE');

  return (
    <>
      <AdmPageHead
        title="Panel general"
        sub={`Hola — ${new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}`}
      >
        <AdmBtn icon="arrow" iconRight={null} variant="ghost" onClick={() => window.open('../index.html', '_blank')}>
          Ver la web pública
        </AdmBtn>
      </AdmPageHead>

      <div className="adm-db-callout">
        <div className="icon"><FCIcon name="bolt"/></div>
        <div style={{flex: 1}}>
          <h4>Modo demo · localStorage</h4>
          <p>Los cambios persisten en este navegador y se reflejan al instante en la web pública. Para producción, conectar a una base de datos real (ver <code>HANDOFF-DB.md</code> en el proyecto).</p>
          <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
            <AdmBtn size="sm" variant="ghost" style={{borderColor:'#3D3324', color:'#C9BD9F'}} onClick={() => {
              const data = window.FCStore.export();
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url; a.download = 'fc-data.json'; a.click();
              URL.revokeObjectURL(url);
            }}>Exportar datos (JSON)</AdmBtn>
            <AdmBtn size="sm" variant="ghost" style={{borderColor:'#3D3324', color:'#C9BD9F'}} onClick={() => {
              if (confirm('Esto restablece todos los datos al estado inicial. ¿Continuar?')) {
                window.FCStore.reset();
              }
            }}>Reset a datos demo</AdmBtn>
          </div>
        </div>
      </div>

      <div className="adm-stat-grid">
        <div className="adm-stat accent">
          <div className="label"><FCIcon name="bolt"/>Valor de stock</div>
          <div className="value">{fmt(stockValue)}</div>
          <div className="trend">a precio de venta · IVA incl.</div>
        </div>
        <div className="adm-stat">
          <div className="label"><FCIcon name="cement"/>Productos publicados</div>
          <div className="value">{totalProducts}</div>
          <div className="trend up">en {categories.length} categorías</div>
        </div>
        <div className="adm-stat">
          <div className="label"><FCIcon name="star"/>Ofertas activas</div>
          <div className="value">{offerCount}</div>
          <div className="trend">{counts.ofertas.length === 0 ? 'agregá ofertas destacadas' : 'visibles en el home'}</div>
        </div>
        <div className="adm-stat">
          <div className="label"><FCIcon name="goggles"/>Stock bajo</div>
          <div className="value" style={{color: counts.lowStock.length > 0 ? 'var(--adm-warning)' : undefined}}>
            {counts.lowStock.length}
          </div>
          <div className={`trend ${counts.lowStock.length > 0 ? 'down' : ''}`}>
            {counts.outOfStock.length > 0 ? `${counts.outOfStock.length} sin stock` : 'todo OK'}
          </div>
        </div>
      </div>

      <div className="adm-dashboard-row">
        <AdmCard
          title="Productos más consultados"
          action={<AdmBtn size="sm" variant="ghost" onClick={() => goTo('products')}>Ver todos</AdmBtn>}
        >
          <ul className="adm-list">
            {mostViewed.map((p, i) => (
              <li key={p.id}>
                <div className="thumb">
                  {p.image ? <img src={p.image}/> : <FCIcon name={p.icon}/>}
                </div>
                <div>
                  <div className="name">{p.name}</div>
                  <div className="meta">{p.sku} · {p.brand}</div>
                </div>
                <div className="right">
                  <div style={{textAlign:'right'}}>
                    <div style={{fontFamily:'var(--vu-font-display)', fontSize:14, color:'var(--adm-text)'}}>{fmt(p.price)}</div>
                    <div style={{fontFamily:'var(--vu-font-mono)', fontSize:10, color:'var(--adm-text-soft)'}}>
                      {p.stock === 0 ? 'SIN STOCK' : `Stock: ${p.stock}`}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </AdmCard>

        <AdmCard title="Productos por categoría">
          <div className="adm-bars">
            {categories.map(c => {
              const max = Math.max(1, ...categories.map(x => counts.byCategory[x.id] || 0));
              const v = counts.byCategory[c.id] || 0;
              const pct = (v / max) * 100;
              return (
                <div className="adm-bar-row" key={c.id}>
                  <div className="lbl">{c.short}</div>
                  <div className="track"><div className="fill" style={{width: `${pct}%`}}/></div>
                  <div className="val">{v}</div>
                </div>
              );
            })}
          </div>
        </AdmCard>
      </div>

      {counts.lowStock.length > 0 && (
        <AdmCard
          title="⚠ Alerta de stock"
          action={<AdmBtn size="sm" variant="ghost" onClick={() => goTo('products')}>Ir a productos</AdmBtn>}
        >
          <ul className="adm-list">
            {counts.lowStock.slice(0, 6).map(p => (
              <li key={p.id}>
                <div className="thumb">
                  {p.image ? <img src={p.image}/> : <FCIcon name={p.icon}/>}
                </div>
                <div>
                  <div className="name">{p.name}</div>
                  <div className="meta">{p.sku} · {p.brand}</div>
                </div>
                <div className="right">
                  <span className="adm-pill warning"><span className="dot"/>{p.stock} {p.stock === 1 ? 'unidad' : 'unidades'}</span>
                </div>
              </li>
            ))}
          </ul>
        </AdmCard>
      )}
    </>
  );
};

window.AdmDashboard = AdmDashboard;

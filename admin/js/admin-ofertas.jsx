// ============================================================
// Admin · Ofertas destacadas y Hero
// ============================================================

const AdmOfertas = () => {
  const store = useStore();
  const { products, ofertasIds } = store;
  const toast = useToast();

  // Current selection: if ofertasIds is null, default to all w/ oldPrice
  const currentIds = useMemo(() => {
    if (ofertasIds && ofertasIds.length > 0) return ofertasIds;
    return products.filter(p => p.oldPrice).map(p => p.id);
  }, [ofertasIds, products]);

  const [selection, setSelection] = useState(currentIds);

  // Refresh selection when store changes externally
  useEffect(() => { setSelection(currentIds); }, [ofertasIds]);

  const [q, setQ] = useState('');
  const candidates = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return products.filter(p =>
      !qq ||
      p.name.toLowerCase().includes(qq) ||
      p.brand.toLowerCase().includes(qq) ||
      p.sku.toLowerCase().includes(qq)
    );
  }, [products, q]);

  const toggle = (id) => {
    setSelection(prev => prev.includes(id)
      ? prev.filter(x => x !== id)
      : prev.length >= 4 ? [...prev.slice(1), id] : [...prev, id]);
  };

  const save = () => {
    window.FCStore.setOfertas(selection);
    toast('Ofertas actualizadas');
  };

  const auto = () => {
    const auto = products.filter(p => p.oldPrice).map(p => p.id);
    setSelection(auto);
    window.FCStore.setOfertas(null); // null = auto
    toast('Selección automática · todos los productos con oferta');
  };

  const isDirty = JSON.stringify([...selection].sort()) !== JSON.stringify([...currentIds].sort());

  return (
    <>
      <AdmPageHead
        title="Ofertas destacadas"
        sub="Elegí hasta 4 productos para mostrar en la sección de ofertas del home."
      >
        <AdmBtn variant="ghost" onClick={auto}>Selección automática</AdmBtn>
        <AdmBtn onClick={save} disabled={!isDirty} icon="arrow">
          Guardar ({selection.length}/4)
        </AdmBtn>
      </AdmPageHead>

      <div className="adm-alert info">
        <FCIcon name="bolt"/>
        <div className="alert-body">
          <strong>Selección automática</strong>
          Si dejás esta selección vacía, la web muestra automáticamente los primeros 4 productos con "precio anterior" cargado.
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 320px', gap: 20}}>
        <div className="adm-table-wrap">
          <div className="adm-table-tools">
            <div className="search">
              <FCIcon name="search"/>
              <input placeholder="Buscar productos…" value={q} onChange={(e) => setQ(e.target.value)}/>
            </div>
          </div>
          <table className="adm-table">
            <thead>
              <tr>
                <th style={{width: 30}}></th>
                <th style={{width: 60}}></th>
                <th>Producto</th>
                <th style={{textAlign:'right'}}>Precio</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map(p => {
                const checked = selection.includes(p.id);
                return (
                  <tr key={p.id} onClick={() => toggle(p.id)} style={{cursor:'pointer'}}>
                    <td>
                      <input type="checkbox" className="adm-check" checked={checked} readOnly/>
                    </td>
                    <td>
                      <div className="thumb">
                        {p.image ? <img src={p.image}/> : <FCIcon name={p.icon}/>}
                      </div>
                    </td>
                    <td>
                      <div className="name-cell" style={{paddingLeft: 0}}>
                        <div>
                          <div className="nm">{p.name}</div>
                          <div className="meta">{p.sku} · {p.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="price-cell" style={{textAlign:'right'}}>
                      {fmtPrice(p.price)}
                      {p.oldPrice && <div className="old">{fmtPrice(p.oldPrice)}</div>}
                    </td>
                    <td>
                      {p.oldPrice
                        ? <span className="adm-pill warning"><span className="dot"/>En oferta</span>
                        : <span className="adm-pill">Sin oferta</span>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div>
          <AdmCard title={`Vitrina (${selection.length}/4)`}>
            {selection.length === 0 ? (
              <div style={{padding: '40px 20px', textAlign:'center', color:'var(--adm-text-muted)', fontSize: 13}}>
                Sin selección. La web pública mostrará la selección automática.
              </div>
            ) : (
              <ul className="adm-list">
                {selection.map(id => {
                  const p = products.find(x => x.id === id);
                  if (!p) return null;
                  return (
                    <li key={id}>
                      <div className="thumb">
                        {p.image ? <img src={p.image}/> : <FCIcon name={p.icon}/>}
                      </div>
                      <div>
                        <div className="name" style={{fontSize: 12, lineHeight: 1.3}}>{p.name}</div>
                        <div className="meta">{fmtPrice(p.price)}</div>
                      </div>
                      <button
                        className="icon-btn"
                        style={{marginLeft:'auto'}}
                        onClick={() => toggle(id)}
                        title="Quitar"
                      >
                        <FCIcon name="x"/>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </AdmCard>
        </div>
      </div>
    </>
  );
};

window.AdmOfertas = AdmOfertas;

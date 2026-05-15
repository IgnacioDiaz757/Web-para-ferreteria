// ============================================================
// Admin · Productos (CRUD)
// ============================================================

const fmtPrice = (n) => '$' + (Number(n) || 0).toLocaleString('de-DE');

const AdmProducts = () => {
  const store = useStore();
  const { products, categories, brands } = store;
  const toast = useToast();

  const [q, setQ] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterStock, setFilterStock] = useState('');
  const [editing, setEditing] = useState(null); // product or null
  const [confirmId, setConfirmId] = useState(null);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return products.filter(p => {
      if (qq && !(p.name.toLowerCase().includes(qq) || p.brand.toLowerCase().includes(qq) || p.sku.toLowerCase().includes(qq))) return false;
      if (filterCat && p.cat !== filterCat) return false;
      if (filterStock === 'in' && p.stock === 0) return false;
      if (filterStock === 'low' && (p.stock === 0 || p.stock >= 10)) return false;
      if (filterStock === 'out' && p.stock !== 0) return false;
      return true;
    });
  }, [products, q, filterCat, filterStock]);

  const onNew = () => setEditing({
    id: null,
    name: '',
    brand: brands[0] || '',
    cat: categories[0]?.id || '',
    sku: '',
    price: 0,
    oldPrice: null,
    stock: 0,
    unit: 'unidad',
    icon: 'wrench',
    image: null,
    desc: '',
    specs: {},
    badge: null,
  });

  const onSave = (p) => {
    const auto = !p.sku ? `FC-${(p.cat || 'GEN').slice(0,3).toUpperCase()}-${String(Date.now()).slice(-4)}` : p.sku;
    window.FCStore.upsertProduct({ ...p, sku: auto });
    setEditing(null);
    toast(p.id ? 'Producto actualizado' : 'Producto creado');
  };

  const onDelete = (id) => {
    window.FCStore.removeProduct(id);
    setConfirmId(null);
    toast('Producto eliminado', 'danger');
  };

  return (
    <>
      <AdmPageHead
        title="Productos"
        sub={`${products.length} productos en catálogo · ${filtered.length} mostrados`}
      >
        <AdmBtn icon="plus" onClick={onNew}>Nuevo producto</AdmBtn>
      </AdmPageHead>

      <div className="adm-table-wrap">
        <div className="adm-table-tools">
          <div className="search">
            <FCIcon name="search"/>
            <input
              placeholder="Buscar por nombre, marca o SKU…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <select className="select-mini" value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
            <option value="">Todas las categorías</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.short}</option>)}
          </select>
          <select className="select-mini" value={filterStock} onChange={(e) => setFilterStock(e.target.value)}>
            <option value="">Cualquier stock</option>
            <option value="in">Con stock</option>
            <option value="low">Stock bajo (&lt;10)</option>
            <option value="out">Sin stock</option>
          </select>
          {(q || filterCat || filterStock) && (
            <AdmBtn size="sm" variant="ghost" onClick={() => { setQ(''); setFilterCat(''); setFilterStock(''); }}>
              Limpiar
            </AdmBtn>
          )}
        </div>

        {filtered.length === 0 ? (
          <div style={{padding: '60px 20px', textAlign:'center', color:'var(--adm-text-muted)'}}>
            <div style={{fontFamily:'var(--vu-font-display)', fontSize: 22, color:'var(--adm-text)', textTransform:'uppercase', marginBottom: 6}}>
              Sin productos
            </div>
            <div style={{marginBottom: 18, fontSize: 13}}>No hay productos que coincidan con los filtros.</div>
            <AdmBtn variant="ghost" onClick={() => { setQ(''); setFilterCat(''); setFilterStock(''); }}>
              Limpiar filtros
            </AdmBtn>
          </div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th style={{width: 60}}></th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Marca</th>
                <th style={{textAlign:'right'}}>Precio</th>
                <th style={{textAlign:'right'}}>Stock</th>
                <th>Estado</th>
                <th style={{width: 1}}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const cat = categories.find(c => c.id === p.cat);
                const stockState = p.stock === 0 ? 'out' : p.stock < 10 ? 'low' : 'ok';
                return (
                  <tr key={p.id}>
                    <td>
                      <div className="thumb">
                        {p.image ? <img src={p.image}/> : <FCIcon name={p.icon}/>}
                      </div>
                    </td>
                    <td>
                      <div className="name-cell" style={{paddingLeft: 0}}>
                        <div>
                          <div className="nm">{p.name}</div>
                          <div className="meta">{p.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td><span style={{fontSize: 12}}>{cat?.short || p.cat}</span></td>
                    <td><span style={{fontSize: 12}}>{p.brand}</span></td>
                    <td className="price-cell" style={{textAlign:'right'}}>
                      {fmtPrice(p.price)}
                      {p.oldPrice && <div className="old">{fmtPrice(p.oldPrice)}</div>}
                    </td>
                    <td className="price-cell" style={{textAlign:'right'}}>{p.stock}</td>
                    <td>
                      {stockState === 'ok' && <span className="adm-pill success"><span className="dot"/>En stock</span>}
                      {stockState === 'low' && <span className="adm-pill warning"><span className="dot"/>Bajo</span>}
                      {stockState === 'out' && <span className="adm-pill danger"><span className="dot"/>Sin stock</span>}
                    </td>
                    <td className="actions">
                      <button className="icon-btn" onClick={() => setEditing(p)} title="Editar">
                        <FCIcon name="screwdriver"/>
                      </button>
                      <button className="icon-btn danger" onClick={() => setConfirmId(p.id)} title="Eliminar">
                        <FCIcon name="x"/>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <AdmProductEditor
          product={editing}
          categories={categories}
          brands={brands}
          onSave={onSave}
          onCancel={() => setEditing(null)}
        />
      )}

      <AdmConfirm
        open={confirmId !== null}
        title="Eliminar producto"
        message="Esta acción no se puede deshacer. El producto desaparecerá del catálogo público inmediatamente."
        confirmLabel="Sí, eliminar"
        onConfirm={() => onDelete(confirmId)}
        onCancel={() => setConfirmId(null)}
      />
    </>
  );
};

// ---------- PRODUCT EDITOR MODAL ----------
const AdmProductEditor = ({ product, categories, brands, onSave, onCancel }) => {
  const [p, setP] = useState(product);
  const [specEntries, setSpecEntries] = useState(() =>
    Object.entries(product.specs || {}).map(([k, v]) => ({ k, v }))
  );

  const patch = (k, v) => setP(prev => ({ ...prev, [k]: v }));

  const submit = () => {
    if (!p.name?.trim()) return alert('El nombre es obligatorio');
    if (!p.cat) return alert('Asigná una categoría');
    const specs = {};
    specEntries.forEach(({ k, v }) => { if (k?.trim()) specs[k.trim()] = v; });
    onSave({ ...p, specs });
  };

  return (
    <AdmModal
      open
      onClose={onCancel}
      size="lg"
      title={p.id ? `Editar · ${p.name || 'producto'}` : 'Nuevo producto'}
      footer={
        <>
          <div className="left">
            {p.id && <span>ID interno: <code style={{fontFamily:'var(--vu-font-mono)'}}>#{p.id}</code></span>}
          </div>
          <AdmBtn variant="ghost" onClick={onCancel}>Cancelar</AdmBtn>
          <AdmBtn onClick={submit} icon="arrow">Guardar</AdmBtn>
        </>
      }
    >
      <div style={{display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24}}>
        <div>
          <AdmField label="Imagen del producto">
            <AdmImageUpload value={p.image} onChange={(v) => patch('image', v)}/>
          </AdmField>
          <AdmField label="Icono (fallback si no hay imagen)" help="Se usa cuando no se subió foto.">
            <AdmIconPicker value={p.icon} onChange={(v) => patch('icon', v)}/>
          </AdmField>
        </div>

        <div>
          <div className="adm-sect-head">Información básica</div>

          <AdmField label="Nombre del producto *">
            <AdmInput value={p.name} onChange={(v) => patch('name', v)} placeholder="Ej. Taladro percutor 750W con maletín"/>
          </AdmField>

          <div className="adm-field-row">
            <AdmField label="Categoría *">
              <AdmSelect
                value={p.cat}
                onChange={(v) => patch('cat', v)}
                options={categories.map(c => ({ value: c.id, label: c.name }))}
                placeholder="Elegí una categoría"
              />
            </AdmField>
            <AdmField label="Marca">
              <AdmSelect
                value={p.brand}
                onChange={(v) => patch('brand', v)}
                options={brands}
              />
            </AdmField>
          </div>

          <div className="adm-field-row three">
            <AdmField label="SKU" help="Vacío = se genera automáticamente">
              <AdmInput value={p.sku} onChange={(v) => patch('sku', v)} placeholder="FC-ELE-0010"/>
            </AdmField>
            <AdmField label="Unidad" help="unidad, kit, bolsa, par…">
              <AdmInput value={p.unit} onChange={(v) => patch('unit', v)} placeholder="unidad"/>
            </AdmField>
            <AdmField label="Destacado">
              <AdmSelect
                value={p.badge || ''}
                onChange={(v) => patch('badge', v || null)}
                options={[
                  { value: '', label: 'Ninguno' },
                  { value: 'new', label: 'Nuevo' },
                  { value: 'hot', label: 'Hot' },
                  { value: 'stock-low', label: 'Últimas unidades' },
                ]}
              />
            </AdmField>
          </div>

          <div className="adm-sect-head">Precio y stock</div>

          <div className="adm-field-row three">
            <AdmField label="Precio (ARS) *">
              <AdmInput type="number" prefix="$" value={p.price} onChange={(v) => patch('price', v)}/>
            </AdmField>
            <AdmField label="Precio anterior" help="Mostrá el tachado si hay oferta">
              <AdmInput type="number" prefix="$" value={p.oldPrice || ''} onChange={(v) => patch('oldPrice', v || null)}/>
            </AdmField>
            <AdmField label="Stock (unidades)">
              <AdmInput type="number" value={p.stock} onChange={(v) => patch('stock', v)}/>
            </AdmField>
          </div>

          <div className="adm-sect-head">Descripción</div>

          <AdmField label="Descripción comercial">
            <AdmTextarea
              value={p.desc}
              onChange={(v) => patch('desc', v)}
              placeholder="Cómo se usa, ventajas, para qué tareas sirve…"
              rows={3}
            />
          </AdmField>

          <div className="adm-sect-head">
            Ficha técnica
            <AdmBtn
              size="sm"
              variant="ghost"
              icon="plus"
              style={{float:'right', marginTop:-4}}
              onClick={() => setSpecEntries([...specEntries, { k: '', v: '' }])}
            >Agregar fila</AdmBtn>
          </div>
          {specEntries.length === 0 && (
            <div style={{padding: '12px 14px', background:'var(--adm-surface-alt)', borderRadius: 6, fontSize: 12, color: 'var(--adm-text-muted)'}}>
              Sin specs. Hacé clic en "Agregar fila" para sumar datos como peso, potencia, etc.
            </div>
          )}
          {specEntries.map((s, i) => (
            <div className="adm-spec-row" key={i}>
              <AdmInput value={s.k} onChange={(v) => setSpecEntries(arr => arr.map((x, j) => j === i ? { ...x, k: v } : x))} placeholder="Atributo"/>
              <AdmInput value={s.v} onChange={(v) => setSpecEntries(arr => arr.map((x, j) => j === i ? { ...x, v: v } : x))} placeholder="Valor"/>
              <button className="rm" onClick={() => setSpecEntries(arr => arr.filter((_, j) => j !== i))} title="Quitar">
                <FCIcon name="x" size={14}/>
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdmModal>
  );
};

window.AdmProducts = AdmProducts;

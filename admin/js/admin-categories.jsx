// ============================================================
// Admin · Categorías y Marcas
// ============================================================

const AdmCategories = () => {
  const store = useStore();
  const { categories, products } = store;
  const toast = useToast();
  const [editing, setEditing] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [dragId, setDragId] = useState(null);
  const [overId, setOverId] = useState(null);

  const productCounts = useMemo(() => {
    const c = {};
    products.forEach(p => { c[p.cat] = (c[p.cat] || 0) + 1; });
    return c;
  }, [products]);

  const onSave = (c) => {
    window.FCStore.upsertCategory(c);
    setEditing(null);
    toast(c.id ? 'Categoría actualizada' : 'Categoría creada');
  };

  const onDelete = (id) => {
    const inUse = productCounts[id] > 0;
    if (inUse) {
      alert(`No se puede eliminar: hay ${productCounts[id]} productos en esta categoría. Reasignalos primero.`);
      setConfirmId(null);
      return;
    }
    window.FCStore.removeCategory(id);
    setConfirmId(null);
    toast('Categoría eliminada', 'danger');
  };

  const onDrop = (targetId) => {
    if (!dragId || dragId === targetId) return;
    const ids = categories.map(c => c.id);
    const from = ids.indexOf(dragId);
    const to = ids.indexOf(targetId);
    ids.splice(from, 1);
    ids.splice(to, 0, dragId);
    window.FCStore.reorderCategories(ids);
    setDragId(null);
    setOverId(null);
    toast('Orden actualizado');
  };

  return (
    <>
      <AdmPageHead
        title="Categorías"
        sub={`${categories.length} categorías · arrastrá para reordenar`}
      >
        <AdmBtn icon="plus" onClick={() => setEditing({ id: null, name: '', short: '', icon: 'wrench', count: 0 })}>
          Nueva categoría
        </AdmBtn>
      </AdmPageHead>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th style={{width: 32}}></th>
              <th style={{width: 60}}></th>
              <th>Nombre</th>
              <th>Slug</th>
              <th style={{textAlign:'right'}}>Productos</th>
              <th style={{width: 1}}></th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr
                key={c.id}
                className={`${dragId === c.id ? 'dragging' : ''} ${overId === c.id ? 'drag-over' : ''}`}
                draggable
                onDragStart={() => setDragId(c.id)}
                onDragOver={(e) => { e.preventDefault(); setOverId(c.id); }}
                onDragLeave={() => setOverId(null)}
                onDrop={(e) => { e.preventDefault(); onDrop(c.id); }}
                onDragEnd={() => { setDragId(null); setOverId(null); }}
              >
                <td><div className="adm-drag-handle">⋮⋮</div></td>
                <td>
                  <div className="thumb"><FCIcon name={c.icon}/></div>
                </td>
                <td>
                  <div className="name-cell" style={{paddingLeft: 0}}>
                    <div>
                      <div className="nm">{c.name}</div>
                      <div className="meta">corto: {c.short}</div>
                    </div>
                  </div>
                </td>
                <td><code style={{fontFamily:'var(--vu-font-mono)', fontSize:12, color:'var(--adm-text-muted)'}}>{c.id}</code></td>
                <td className="price-cell" style={{textAlign:'right'}}>{productCounts[c.id] || 0}</td>
                <td className="actions">
                  <button className="icon-btn" onClick={() => setEditing(c)}><FCIcon name="screwdriver"/></button>
                  <button className="icon-btn danger" onClick={() => setConfirmId(c.id)}><FCIcon name="x"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <AdmModal
          open
          onClose={() => setEditing(null)}
          title={editing.id ? 'Editar categoría' : 'Nueva categoría'}
          footer={
            <>
              <AdmBtn variant="ghost" onClick={() => setEditing(null)}>Cancelar</AdmBtn>
              <AdmBtn onClick={() => {
                if (!editing.name?.trim()) return alert('El nombre es obligatorio');
                onSave({ ...editing, short: editing.short || editing.name });
              }}>Guardar</AdmBtn>
            </>
          }
        >
          <AdmField label="Nombre largo *" help="Ej. 'Herramientas Eléctricas'">
            <AdmInput value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })}/>
          </AdmField>
          <AdmField label="Nombre corto" help="Para filtros y menú. Si lo dejás vacío usa el nombre largo.">
            <AdmInput value={editing.short} onChange={(v) => setEditing({ ...editing, short: v })} placeholder="Ej. Eléctricas"/>
          </AdmField>
          <AdmField label="Icono">
            <AdmIconPicker value={editing.icon} onChange={(v) => setEditing({ ...editing, icon: v })}/>
          </AdmField>
        </AdmModal>
      )}

      <AdmConfirm
        open={confirmId !== null}
        title="Eliminar categoría"
        message="Solo podés eliminar categorías que no tengan productos asociados."
        confirmLabel="Sí, eliminar"
        onConfirm={() => onDelete(confirmId)}
        onCancel={() => setConfirmId(null)}
      />
    </>
  );
};

// ============================================================
// MARCAS
// ============================================================

const AdmBrands = () => {
  const store = useStore();
  const { brands, products } = store;
  const toast = useToast();
  const [editing, setEditing] = useState(null);  // { old, new } or null
  const [newName, setNewName] = useState('');
  const [confirmName, setConfirmName] = useState(null);

  const brandCounts = useMemo(() => {
    const c = {};
    products.forEach(p => { c[p.brand] = (c[p.brand] || 0) + 1; });
    return c;
  }, [products]);

  const addBrand = () => {
    if (!newName.trim()) return;
    if (brands.includes(newName.trim())) {
      toast('Esa marca ya existe', 'danger');
      return;
    }
    window.FCStore.addBrand(newName.trim());
    setNewName('');
    toast('Marca agregada');
  };

  const rename = () => {
    if (!editing.new?.trim()) return;
    window.FCStore.renameBrand(editing.old, editing.new.trim());
    setEditing(null);
    toast('Marca renombrada · productos actualizados');
  };

  const remove = (name) => {
    if (brandCounts[name] > 0) {
      alert(`No se puede eliminar: ${brandCounts[name]} productos usan esta marca. Cambialos antes.`);
      setConfirmName(null);
      return;
    }
    window.FCStore.removeBrand(name);
    setConfirmName(null);
    toast('Marca eliminada', 'danger');
  };

  return (
    <>
      <AdmPageHead title="Marcas" sub={`${brands.length} marcas registradas`}/>

      <div style={{display:'grid', gridTemplateColumns:'1.5fr 1fr', gap: 20}}>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Marca</th>
                <th style={{textAlign:'right'}}>Productos</th>
                <th style={{width: 1}}></th>
              </tr>
            </thead>
            <tbody>
              {brands.map(b => (
                <tr key={b}>
                  <td>
                    <div className="name-cell" style={{paddingLeft: 0}}>
                      <div className="thumb"><FCIcon name="star"/></div>
                      <div className="nm">{b}</div>
                    </div>
                  </td>
                  <td className="price-cell" style={{textAlign:'right'}}>{brandCounts[b] || 0}</td>
                  <td className="actions">
                    <button className="icon-btn" onClick={() => setEditing({ old: b, new: b })} title="Renombrar">
                      <FCIcon name="screwdriver"/>
                    </button>
                    <button className="icon-btn danger" onClick={() => setConfirmName(b)} title="Eliminar">
                      <FCIcon name="x"/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AdmCard title="Nueva marca" padded>
          <p style={{fontSize: 13, color: 'var(--adm-text-muted)', marginTop: 0}}>
            Agregá una marca para poder asignarla a productos.
          </p>
          <AdmField label="Nombre de la marca">
            <AdmInput value={newName} onChange={setNewName} placeholder="Ej. Karcher" onKeyDown={(e) => e.key === 'Enter' && addBrand()}/>
          </AdmField>
          <AdmBtn block icon="plus" onClick={addBrand} disabled={!newName.trim()}>Agregar marca</AdmBtn>
        </AdmCard>
      </div>

      {editing && (
        <AdmModal
          open
          onClose={() => setEditing(null)}
          title="Renombrar marca"
          footer={
            <>
              <AdmBtn variant="ghost" onClick={() => setEditing(null)}>Cancelar</AdmBtn>
              <AdmBtn onClick={rename}>Renombrar</AdmBtn>
            </>
          }
        >
          <p style={{fontSize: 13, color:'var(--adm-text-muted)', marginTop: 0}}>
            Renombrar <b>{editing.old}</b> también actualiza todos los productos que la usan ({brandCounts[editing.old] || 0} productos).
          </p>
          <AdmField label="Nuevo nombre">
            <AdmInput value={editing.new} onChange={(v) => setEditing({ ...editing, new: v })}/>
          </AdmField>
        </AdmModal>
      )}

      <AdmConfirm
        open={confirmName !== null}
        title="Eliminar marca"
        message="Solo podés eliminar marcas sin productos asociados."
        confirmLabel="Sí, eliminar"
        onConfirm={() => remove(confirmName)}
        onCancel={() => setConfirmName(null)}
      />
    </>
  );
};

window.AdmCategories = AdmCategories;
window.AdmBrands = AdmBrands;

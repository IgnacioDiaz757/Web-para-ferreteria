// ============================================================
// Admin · Configuración (negocio + hero + horarios)
// ============================================================

const AdmSettings = () => {
  const store = useStore();
  const toast = useToast();
  const [tab, setTab] = useState('business');

  const [biz, setBiz] = useState(store.settings);
  const [hero, setHero] = useState(store.hero);
  const [horarios, setHorarios] = useState(store.horarios);

  useEffect(() => setBiz(store.settings), [store.settings]);
  useEffect(() => setHero(store.hero), [store.hero]);
  useEffect(() => setHorarios(store.horarios), [store.horarios]);

  const saveBiz = () => {
    window.FCStore.updateSettings(biz);
    toast('Datos del negocio guardados');
  };
  const saveHero = () => {
    window.FCStore.updateHero(hero);
    toast('Banner actualizado');
  };
  const saveHorarios = () => {
    window.FCStore.updateHorarios(horarios);
    toast('Horarios actualizados');
  };

  const bizDirty = JSON.stringify(biz) !== JSON.stringify(store.settings);
  const heroDirty = JSON.stringify(hero) !== JSON.stringify(store.hero);
  const horariosDirty = JSON.stringify(horarios) !== JSON.stringify(store.horarios);

  return (
    <>
      <AdmPageHead
        title="Configuración"
        sub="Datos del negocio, banner del home y horarios."
      />

      <div className="adm-tabs">
        <button className={`adm-tab ${tab === 'business' ? 'active' : ''}`} onClick={() => setTab('business')}>
          Datos del negocio
        </button>
        <button className={`adm-tab ${tab === 'hero' ? 'active' : ''}`} onClick={() => setTab('hero')}>
          Banner del home
        </button>
        <button className={`adm-tab ${tab === 'horarios' ? 'active' : ''}`} onClick={() => setTab('horarios')}>
          Horarios
        </button>
      </div>

      {tab === 'business' && (
        <div style={{display:'grid', gridTemplateColumns:'1fr', gap: 20}}>
          <AdmCard title="Identidad" padded>
            <div className="adm-field-row">
              <AdmField label="Nombre del negocio *">
                <AdmInput value={biz.shopName} onChange={(v) => setBiz({ ...biz, shopName: v })}/>
              </AdmField>
              <AdmField label="Tagline" help="Aparece debajo del logo">
                <AdmInput value={biz.tagline} onChange={(v) => setBiz({ ...biz, tagline: v })}/>
              </AdmField>
            </div>
            <div className="adm-field-row">
              <AdmField label="Año de fundación">
                <AdmInput type="number" value={biz.foundedYear} onChange={(v) => setBiz({ ...biz, foundedYear: v })}/>
              </AdmField>
              <AdmField label="CUIT / RUT">
                <AdmInput value={biz.cuit} onChange={(v) => setBiz({ ...biz, cuit: v })}/>
              </AdmField>
            </div>
            <AdmField label="Color de acento" help="Se usa para botones, badges y links destacados">
              <div style={{display:'flex', gap: 12, alignItems:'center', flexWrap:'wrap'}}>
                {['#EE8907', '#C72525', '#F2D214', '#186133', '#2B6CB0', '#E61D86'].map(c => (
                  <button
                    key={c}
                    onClick={() => setBiz({ ...biz, accent: c })}
                    style={{
                      width: 36, height: 36, background: c,
                      border: biz.accent === c ? '2px solid var(--adm-text)' : '2px solid var(--adm-border)',
                      borderRadius: 4, cursor: 'pointer',
                    }}
                  />
                ))}
                <input
                  type="color"
                  value={biz.accent}
                  onChange={(e) => setBiz({ ...biz, accent: e.target.value })}
                  style={{ width: 36, height: 36, border: 'none', cursor: 'pointer', background: 'none' }}
                />
                <code style={{fontFamily:'var(--vu-font-mono)', fontSize: 12, color: 'var(--adm-text-muted)'}}>{biz.accent}</code>
              </div>
            </AdmField>
          </AdmCard>

          <AdmCard title="Ubicación y contacto" padded>
            <AdmField label="Dirección *">
              <AdmInput value={biz.address} onChange={(v) => setBiz({ ...biz, address: v })} placeholder="Av. San Martín 1234, CABA"/>
            </AdmField>
            <AdmField label="Detalle / referencia">
              <AdmInput value={biz.addressDetail} onChange={(v) => setBiz({ ...biz, addressDetail: v })} placeholder="Esquina Av. Mitre · entre…"/>
            </AdmField>
            <div className="adm-field-row">
              <AdmField label="Teléfono (formato WhatsApp, sin +)" help="Ej: 5491100000000">
                <AdmInput value={biz.phone} onChange={(v) => setBiz({ ...biz, phone: String(v).replace(/\D/g, '') })}/>
              </AdmField>
              <AdmField label="Teléfono para mostrar">
                <AdmInput value={biz.phoneDisplay} onChange={(v) => setBiz({ ...biz, phoneDisplay: v })} placeholder="+54 11 0000-0000"/>
              </AdmField>
            </div>
            <AdmField label="Email">
              <AdmInput type="email" value={biz.email} onChange={(v) => setBiz({ ...biz, email: v })} placeholder="ventas@ferreteria.com.ar"/>
            </AdmField>
          </AdmCard>

          <div style={{display:'flex', justifyContent:'flex-end', gap: 10}}>
            <AdmBtn variant="ghost" disabled={!bizDirty} onClick={() => setBiz(store.settings)}>
              Descartar cambios
            </AdmBtn>
            <AdmBtn onClick={saveBiz} disabled={!bizDirty} icon="arrow">Guardar cambios</AdmBtn>
          </div>
        </div>
      )}

      {tab === 'hero' && (
        <AdmCard title="Banner principal" padded>
          <p style={{fontSize: 13, color:'var(--adm-text-muted)', marginTop: 0}}>
            El banner gigante del home. El título se compone de 4 partes para crear el efecto tipográfico.
          </p>

          <AdmField label="Texto chico de arriba (eyebrow)" help="Ej. 'Ferretería industrial · desde 1987'">
            <AdmInput value={hero.eyebrow} onChange={(v) => setHero({ ...hero, eyebrow: v })}/>
          </AdmField>

          <div className="adm-field-row">
            <AdmField label="Título línea 1" help="MAYÚSCULAS">
              <AdmInput value={hero.title1} onChange={(v) => setHero({ ...hero, title1: v })}/>
            </AdmField>
            <AdmField label="Título línea 2" help="MAYÚSCULAS">
              <AdmInput value={hero.title2} onChange={(v) => setHero({ ...hero, title2: v })}/>
            </AdmField>
          </div>
          <div className="adm-field-row">
            <AdmField label="Resaltado tachado" help="Va sobre fondo amarillo, rotado">
              <AdmInput value={hero.titleStrike} onChange={(v) => setHero({ ...hero, titleStrike: v })}/>
            </AdmField>
            <AdmField label="Acento (color de marca)" help="Se pinta del color de acento">
              <AdmInput value={hero.titleAccent} onChange={(v) => setHero({ ...hero, titleAccent: v })}/>
            </AdmField>
          </div>

          <AdmField label="Subtítulo / bajada">
            <AdmTextarea
              value={hero.lead}
              onChange={(v) => setHero({ ...hero, lead: v })}
              rows={3}
              placeholder="Una o dos frases que expliquen qué vendés y para quién."
            />
          </AdmField>

          <div className="adm-sect-head">Vista previa</div>
          <div style={{background: '#1A140C', color: '#fff', padding: 32, borderRadius: 6}}>
            <div style={{fontFamily:'var(--vu-font-mono)', fontSize: 11, color:'var(--adm-primary)', letterSpacing:'.18em', textTransform:'uppercase', marginBottom: 12}}>
              › {hero.eyebrow}
            </div>
            <div style={{fontFamily:'var(--vu-font-display)', fontSize: 44, lineHeight: .92, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: 14}}>
              {hero.title1}<br/>
              {hero.title2}<br/>
              {hero.titleStrike && <span style={{background:'#F2D214', color:'#1A140C', padding:'0 8px', display:'inline-block', transform:'rotate(-1.5deg)'}}>{hero.titleStrike}</span>}
              {' '}
              <span style={{color:'var(--adm-primary)'}}>{hero.titleAccent}</span>
            </div>
            <div style={{color:'#A89A82', fontSize: 14, maxWidth: 520}}>{hero.lead}</div>
          </div>

          <div style={{display:'flex', justifyContent:'flex-end', gap: 10, marginTop: 24}}>
            <AdmBtn variant="ghost" disabled={!heroDirty} onClick={() => setHero(store.hero)}>
              Descartar
            </AdmBtn>
            <AdmBtn onClick={saveHero} disabled={!heroDirty} icon="arrow">Guardar banner</AdmBtn>
          </div>
        </AdmCard>
      )}

      {tab === 'horarios' && (
        <AdmCard title="Horarios de atención" padded>
          <p style={{fontSize: 13, color:'var(--adm-text-muted)', marginTop: 0}}>
            Los horarios aparecen en la barra superior y en la sección de contacto.
          </p>
          <div style={{maxWidth: 480}}>
            {horarios.map((h, i) => (
              <div key={h.day} style={{
                display:'grid',
                gridTemplateColumns:'120px 1fr auto',
                gap: 12,
                alignItems:'center',
                padding: '10px 0',
                borderBottom: i < horarios.length - 1 ? '1px solid var(--adm-border)' : 'none',
              }}>
                <div style={{fontWeight: 600, fontSize: 14}}>{h.day}</div>
                {h.closed ? (
                  <div style={{color:'var(--adm-danger)', fontFamily:'var(--vu-font-mono)', fontSize: 13}}>Cerrado</div>
                ) : (
                  <AdmInput
                    value={h.hr}
                    onChange={(v) => setHorarios(horarios.map((x, j) => j === i ? { ...x, hr: v } : x))}
                    placeholder="8:00 – 19:00"
                  />
                )}
                <label style={{display:'flex', alignItems:'center', gap: 10, fontSize: 12, color:'var(--adm-text-muted)'}}>
                  Cerrado
                  <AdmSwitch
                    checked={h.closed}
                    onChange={(v) => setHorarios(horarios.map((x, j) => j === i ? { ...x, closed: v, hr: v ? 'Cerrado' : '8:00 – 19:00' } : x))}
                  />
                </label>
              </div>
            ))}
          </div>
          <div style={{display:'flex', justifyContent:'flex-end', gap: 10, marginTop: 24}}>
            <AdmBtn variant="ghost" disabled={!horariosDirty} onClick={() => setHorarios(store.horarios)}>
              Descartar
            </AdmBtn>
            <AdmBtn onClick={saveHorarios} disabled={!horariosDirty} icon="arrow">Guardar horarios</AdmBtn>
          </div>
        </AdmCard>
      )}
    </>
  );
};

window.AdmSettings = AdmSettings;

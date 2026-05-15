// ============================================================
// Admin · Shell (login + sidebar + page routing)
// ============================================================

const AUTH_KEY = 'fc-admin-auth';
const DEFAULT_USER = 'admin';
const DEFAULT_PASS = 'admin1234';

const useAuth = () => {
  const [auth, setAuth] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem(AUTH_KEY)) || null; }
    catch { return null; }
  });
  const login = (user, pass) => {
    if (user === DEFAULT_USER && pass === DEFAULT_PASS) {
      const data = { user, ts: Date.now() };
      sessionStorage.setItem(AUTH_KEY, JSON.stringify(data));
      setAuth(data);
      return true;
    }
    return false;
  };
  const logout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setAuth(null);
  };
  return { auth, login, logout };
};

// ---------- LOGIN ----------
const AdmLogin = ({ onLogin }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (onLogin(user, pass)) setError('');
    else setError('Usuario o contraseña incorrectos.');
  };

  return (
    <div className="adm-login">
      <div className="adm-login-art">
        <div className="brand">
          <div className="mark"><FCIcon name="wrench"/></div>
          <div>
            <div className="brand-name">FERRETERÍA CENTRAL</div>
            <div className="brand-tag">Panel de administración</div>
          </div>
        </div>
        <div>
          <h1>GESTIONÁ TODO<br/>EL <span className="accent">CATÁLOGO</span>.</h1>
          <p className="lead">
            Productos, precios, stock, ofertas, marcas y datos del negocio. Los cambios se reflejan al instante en la web pública.
          </p>
        </div>
        <div className="foot">v1.0 · localStorage demo</div>
      </div>

      <div className="adm-login-form">
        <form className="box" onSubmit={submit}>
          <h2>Iniciar sesión</h2>
          <div className="sub">Acceso restringido para el administrador.</div>

          {error && <div className="error">{error}</div>}

          <AdmField label="Usuario">
            <AdmInput value={user} onChange={setUser} placeholder="admin" autoFocus/>
          </AdmField>
          <AdmField label="Contraseña">
            <AdmInput type="password" value={pass} onChange={setPass} placeholder="••••••••"/>
          </AdmField>

          <AdmBtn type="submit" block size="lg" icon="arrow">Entrar</AdmBtn>

          <div className="hint">
            <b>Demo:</b> usuario <b>admin</b> · contraseña <b>admin1234</b>
            <br/>
            En producción esto se conecta a un sistema de auth real (ver HANDOFF-DB.md).
          </div>
        </form>
      </div>
    </div>
  );
};

// ---------- SIDEBAR ----------
const PAGES = [
  { id: 'dashboard', label: 'Dashboard', icon: 'bolt', section: 'Inicio' },
  { id: 'products',  label: 'Productos', icon: 'drill', section: 'Catálogo' },
  { id: 'categories',label: 'Categorías', icon: 'brick', section: 'Catálogo' },
  { id: 'brands',    label: 'Marcas', icon: 'star', section: 'Catálogo' },
  { id: 'ofertas',   label: 'Ofertas', icon: 'paint-can', section: 'Catálogo' },
  { id: 'settings',  label: 'Configuración', icon: 'screwdriver', section: 'Negocio' },
];

const AdmSidebar = ({ active, onNav, onLogout, open, onCloseMobile }) => {
  const counts = window.fcCounts();
  const sections = [...new Set(PAGES.map(p => p.section))];

  return (
    <aside className={`adm-sidebar ${open ? 'open' : ''}`}>
      <div className="adm-side-brand">
        <div className="mark"><FCIcon name="wrench"/></div>
        <div>
          <div className="txt">FERRETERÍA<br/>CENTRAL</div>
          <div className="tag">Admin · v1.0</div>
        </div>
      </div>

      <nav className="adm-nav">
        {sections.map(sect => (
          <React.Fragment key={sect}>
            <div className="adm-nav-section">{sect}</div>
            {PAGES.filter(p => p.section === sect).map(p => (
              <button
                key={p.id}
                className={`adm-nav-item ${active === p.id ? 'active' : ''}`}
                onClick={() => { onNav(p.id); onCloseMobile?.(); }}
              >
                <FCIcon name={p.icon}/>
                {p.label}
                {p.id === 'products' && counts.lowStock.length > 0 && (
                  <span className="nav-badge">{counts.lowStock.length}</span>
                )}
              </button>
            ))}
          </React.Fragment>
        ))}
      </nav>

      <div className="adm-side-foot">
        <div className="user">
          <div className="avatar">A</div>
          <div>
            <div className="name">admin</div>
            <div style={{fontSize: 11, color:'#6A5B45'}}>Administrador</div>
          </div>
        </div>
        <a href="../index.html" target="_blank" style={{fontSize: 12, display:'flex', alignItems:'center', gap: 6}}>
          <FCIcon name="arrow" size={12}/>
          Ver web pública
        </a>
        <button className="logout" onClick={onLogout}>
          <FCIcon name="x" size={14}/>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

// ---------- APP SHELL ----------
const AdmShellApp = () => {
  const { auth, login, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [page, setPage] = useState(() => {
    const fromHash = location.hash.replace('#', '');
    return PAGES.find(p => p.id === fromHash)?.id || 'dashboard';
  });

  useEffect(() => { location.hash = page; }, [page]);

  useEffect(() => {
    const onHash = () => {
      const id = location.hash.replace('#', '');
      const found = PAGES.find(p => p.id === id);
      if (found) setPage(found.id);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (!auth) return <AdmLogin onLogin={login}/>;

  return (
    <AdmToastProvider>
      <header className="adm-mobile-header">
        <div className="mark"><FCIcon name="wrench"/></div>
        <div className="brand-text">
          FERRETERÍA CENTRAL
          <small>Admin</small>
        </div>
        <button className="hamburger" onClick={() => setMobileOpen(true)} aria-label="Abrir menú">
          <FCIcon name="menu"/>
        </button>
      </header>
      <div
        className={`adm-sidebar-backdrop ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
      />
      <div className="adm-shell">
        <AdmSidebar
          active={page}
          onNav={setPage}
          onLogout={logout}
          open={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />
        <main className="adm-main">
          {page === 'dashboard'  && <AdmDashboard goTo={setPage}/>}
          {page === 'products'   && <AdmProducts/>}
          {page === 'categories' && <AdmCategories/>}
          {page === 'brands'     && <AdmBrands/>}
          {page === 'ofertas'    && <AdmOfertas/>}
          {page === 'settings'   && <AdmSettings/>}
        </main>
      </div>
    </AdmToastProvider>
  );
};

ReactDOM.createRoot(document.getElementById('admin-root')).render(<AdmShellApp/>);

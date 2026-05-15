// ============================================================
// Admin shared UI primitives
// ============================================================

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ---------- Button ----------
const AdmBtn = ({ children, variant = 'primary', size = 'md', icon, iconRight, onClick, type = 'button', className = '', block, ...rest }) => {
  const classes = ['adm-btn'];
  if (variant !== 'primary') classes.push(variant);
  if (size !== 'md') classes.push(size);
  if (block) classes.push('block');
  if (!children && icon) classes.push('icon-only');
  if (className) classes.push(className);
  return (
    <button type={type} className={classes.join(' ')} onClick={onClick} {...rest}>
      {icon && <FCIcon name={icon}/>}
      {children}
      {iconRight && <FCIcon name={iconRight}/>}
    </button>
  );
};

// ---------- Input fields ----------
const AdmField = ({ label, help, children, span }) => (
  <div className="adm-field" style={span ? { gridColumn: `span ${span}` } : {}}>
    {label && <label>{label}</label>}
    {children}
    {help && <div className="help">{help}</div>}
  </div>
);

const AdmInput = ({ value, onChange, placeholder, type = 'text', prefix, ...rest }) => {
  const input = (
    <input
      type={type}
      value={value ?? ''}
      onChange={(e) => onChange(type === 'number' ? (e.target.value === '' ? '' : +e.target.value) : e.target.value)}
      placeholder={placeholder}
      className="adm-input"
      {...rest}
    />
  );
  if (prefix) {
    return (
      <div className="adm-input-prefix">
        <div className="prefix">{prefix}</div>
        {input}
      </div>
    );
  }
  return input;
};

const AdmTextarea = ({ value, onChange, placeholder, rows = 3, ...rest }) => (
  <textarea
    className="adm-textarea"
    rows={rows}
    value={value ?? ''}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    {...rest}
  />
);

const AdmSelect = ({ value, onChange, options, placeholder, ...rest }) => (
  <select
    className="adm-select"
    value={value ?? ''}
    onChange={(e) => onChange(e.target.value)}
    {...rest}
  >
    {placeholder && <option value="" disabled>{placeholder}</option>}
    {options.map(opt =>
      typeof opt === 'string'
        ? <option key={opt} value={opt}>{opt}</option>
        : <option key={opt.value} value={opt.value}>{opt.label}</option>
    )}
  </select>
);

const AdmSwitch = ({ checked, onChange }) => (
  <label className="adm-switch">
    <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)}/>
    <span className="track"/>
  </label>
);

// ---------- Modal ----------
const AdmModal = ({ open, onClose, title, children, footer, size = 'md' }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div className={`adm-modal-backdrop ${open ? 'open' : ''}`} onClick={onClose}>
      <div className={`adm-modal ${size === 'lg' ? 'lg' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="adm-modal-head">
          <h3>{title}</h3>
          <button className="adm-modal-close" onClick={onClose} aria-label="Cerrar">
            <FCIcon name="x"/>
          </button>
        </div>
        <div className="adm-modal-body">{children}</div>
        {footer && <div className="adm-modal-foot">{footer}</div>}
      </div>
    </div>
  );
};

// ---------- Confirm Dialog ----------
const AdmConfirm = ({ open, title, message, confirmLabel = 'Eliminar', danger = true, onConfirm, onCancel }) => (
  <AdmModal
    open={open}
    onClose={onCancel}
    title={title || 'Confirmar acción'}
    footer={
      <>
        <AdmBtn variant="ghost" onClick={onCancel}>Cancelar</AdmBtn>
        <AdmBtn variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>{confirmLabel}</AdmBtn>
      </>
    }
  >
    <p style={{margin:0, color: 'var(--adm-text)', fontSize: 14, lineHeight: 1.55}}>{message}</p>
  </AdmModal>
);

// ---------- Image Upload (file → data URL) ----------
const AdmImageUpload = ({ value, onChange, hint = 'JPG, PNG · máx 2MB' }) => {
  const inputRef = useRef();
  const handleFile = (file) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen supera los 2MB. Achicala antes de subirla.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };
  const onDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };
  return (
    <div
      className={`adm-image-drop ${value ? 'has-image' : ''}`}
      onClick={() => inputRef.current?.click()}
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {value && (
        <button
          className="clear-image"
          onClick={(e) => { e.stopPropagation(); onChange(null); }}
          aria-label="Quitar imagen"
        >
          <FCIcon name="x"/>
        </button>
      )}
      {value ? (
        <img src={value} alt="preview"/>
      ) : (
        <div className="placeholder">
          <FCIcon name="paint-can"/>
          <div className="lbl">Subir imagen</div>
          <div className="hint">{hint}</div>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  );
};

// ---------- Toast ----------
const AdmToastCtx = React.createContext({ toast: () => {} });
const useToast = () => React.useContext(AdmToastCtx).toast;

const AdmToastProvider = ({ children }) => {
  const [t, setT] = useState(null);
  const timer = useRef();
  const toast = useCallback((message, variant = 'success') => {
    clearTimeout(timer.current);
    setT({ message, variant });
    timer.current = setTimeout(() => setT(null), 2400);
  }, []);
  return (
    <AdmToastCtx.Provider value={{ toast }}>
      {children}
      {t && (
        <div className={`adm-toast ${t.variant} show`}>
          <FCIcon name={t.variant === 'danger' ? 'x' : 'arrow'}/>
          {t.message}
        </div>
      )}
    </AdmToastCtx.Provider>
  );
};

// ---------- Page Header ----------
const AdmPageHead = ({ title, sub, children }) => (
  <div className="adm-page-head">
    <div>
      <h1>{title}</h1>
      {sub && <div className="sub">{sub}</div>}
    </div>
    {children && <div className="actions">{children}</div>}
  </div>
);

// ---------- Icon picker grid ----------
const ICON_CHOICES = [
  'wrench','hammer','screwdriver','pliers','saw','tape','drill','grinder','circular',
  'screw','plug','paint-can','roller','cable','switch','bulb','pipe','faucet',
  'cement','brick','helmet','glove','goggles','bolt'
];
const AdmIconPicker = ({ value, onChange }) => (
  <div className="adm-icon-picker">
    {ICON_CHOICES.map(n => (
      <button
        key={n}
        type="button"
        className={value === n ? 'active' : ''}
        onClick={() => onChange(n)}
        title={n}
      >
        <FCIcon name={n}/>
      </button>
    ))}
  </div>
);

// ---------- Card ----------
const AdmCard = ({ title, action, children, padded = false }) => (
  <div className={`adm-card ${padded ? 'padded' : ''}`}>
    {title && (
      <div className="adm-card-head">
        <h3>{title}</h3>
        {action}
      </div>
    )}
    {!padded ? children : null}
    {padded && children}
  </div>
);

// ---------- Format helpers ----------
function fmtRelTime(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'ahora';
  if (m < 60) return `hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h} hs`;
  const d = Math.floor(h / 24);
  if (d < 7) return `hace ${d} día${d === 1 ? '' : 's'}`;
  return new Date(ts).toLocaleDateString('es-AR');
}

Object.assign(window, {
  AdmBtn, AdmField, AdmInput, AdmTextarea, AdmSelect, AdmSwitch,
  AdmModal, AdmConfirm, AdmImageUpload, AdmToastProvider, useToast,
  AdmPageHead, AdmIconPicker, AdmCard, fmtRelTime,
});

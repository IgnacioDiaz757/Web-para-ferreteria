// ============================================================
// FERRETERÍA CENTRAL — Catálogo + datos
// ============================================================

const FC_CATEGORIES = [
  { id: 'manuales', name: 'Herramientas Manuales', short: 'Manuales', count: 84, icon: 'wrench' },
  { id: 'electricas', name: 'Herramientas Eléctricas', short: 'Eléctricas', count: 56, icon: 'drill' },
  { id: 'tornilleria', name: 'Tornillería y Fijaciones', short: 'Tornillería', count: 142, icon: 'screw' },
  { id: 'pinturas', name: 'Pinturas y Accesorios', short: 'Pinturas', count: 38, icon: 'paint' },
  { id: 'electricidad', name: 'Electricidad', short: 'Electricidad', count: 71, icon: 'bolt' },
  { id: 'plomeria', name: 'Plomería y Sanitarios', short: 'Plomería', count: 49, icon: 'pipe' },
  { id: 'construccion', name: 'Construcción', short: 'Construcción', count: 33, icon: 'brick' },
  { id: 'seguridad', name: 'Seguridad / EPP', short: 'Seguridad', count: 27, icon: 'helmet' },
];

const FC_BRANDS = [
  'Stanley', 'Bahco', 'Black+Decker', 'Bosch', 'Makita', 'DeWalt',
  'Sika', 'Alba', 'Tigre', 'Sherwin', 'Truper', 'Bremen', 'Crivit', '3M'
];

// Helper to fabricate consistent SKU strings
const sku = (cat, n) => `FC-${cat.slice(0,3).toUpperCase()}-${String(n).padStart(4,'0')}`;

const FC_PRODUCTS = [
  // ---- HERRAMIENTAS MANUALES ----
  { id: 1,  cat: 'manuales', name: 'Martillo carpintero 16 oz mango fibra', brand: 'Stanley', price: 18400, oldPrice: null, sku: sku('manuales', 1), stock: 24, icon: 'hammer', unit: 'unidad',
    desc: 'Martillo de uña con cabeza forjada en acero y mango ergonómico de fibra de vidrio antichoque. Ideal para carpintería y trabajos generales.',
    specs: { 'Peso cabeza': '16 oz (453g)', 'Material': 'Acero forjado', 'Mango': 'Fibra de vidrio', 'Largo total': '330 mm' },
    badge: null },
  { id: 2,  cat: 'manuales', name: 'Juego de destornilladores 6 piezas Phillips/Plano', brand: 'Bahco', price: 24900, oldPrice: 32500, sku: sku('manuales', 2), stock: 12, icon: 'screwdriver', unit: 'set',
    desc: 'Set de 6 destornilladores profesionales con puntas magnéticas. Mango bimaterial antideslizante.',
    specs: { 'Cantidad': '6 piezas', 'Tipo': 'Phillips + Plano', 'Mango': 'Bimaterial', 'Garantía': '5 años' },
    badge: 'discount' },
  { id: 3,  cat: 'manuales', name: 'Pinza universal 8" mango bimaterial', brand: 'Truper', price: 9800, oldPrice: null, sku: sku('manuales', 3), stock: 38, icon: 'pliers', unit: 'unidad',
    desc: 'Pinza universal forjada para corte, agarre y torsión de cables y alambres.',
    specs: { 'Largo': '8" / 200 mm', 'Material': 'Acero al cromo vanadio', 'Aislación mango': '1000V' },
    badge: 'new' },
  { id: 4,  cat: 'manuales', name: 'Llave francesa 10" cromada', brand: 'Bremen', price: 15200, oldPrice: null, sku: sku('manuales', 4), stock: 18, icon: 'wrench', unit: 'unidad',
    desc: 'Llave inglesa ajustable de 10 pulgadas con acabado cromado y escala milimétrica grabada.',
    specs: { 'Largo': '10" / 250 mm', 'Apertura máx.': '30 mm', 'Acabado': 'Cromo pulido' },
    badge: null },
  { id: 5,  cat: 'manuales', name: 'Serrucho costilla 22" 8TPI', brand: 'Bahco', price: 21500, oldPrice: null, sku: sku('manuales', 5), stock: 7, icon: 'saw', unit: 'unidad',
    desc: 'Serrucho de costilla con hoja templada de 22" y dientes inducción endurecidos.',
    specs: { 'Largo hoja': '22" / 550 mm', 'Dientes': '8 TPI', 'Mango': 'Madera' },
    badge: 'stock-low' },
  { id: 6,  cat: 'manuales', name: 'Cinta métrica 8m × 25mm carcasa goma', brand: 'Stanley', price: 7800, oldPrice: null, sku: sku('manuales', 6), stock: 64, icon: 'tape', unit: 'unidad',
    desc: 'Cinta métrica con bloqueo automático, carcasa con recubrimiento de goma antichoque.',
    specs: { 'Largo': '8 m', 'Ancho cinta': '25 mm', 'Carcasa': 'ABS + goma' },
    badge: null },

  // ---- HERRAMIENTAS ELÉCTRICAS ----
  { id: 10, cat: 'electricas', name: 'Taladro percutor 750W con maletín', brand: 'Black+Decker', price: 89900, oldPrice: 112000, sku: sku('electricas', 10), stock: 6, icon: 'drill', unit: 'unidad',
    desc: 'Taladro percutor de 750W con velocidad variable, reversa y mandril autoajustable de 13mm.',
    specs: { 'Potencia': '750 W', 'Mandril': '13 mm', 'Velocidad': '0–3000 rpm', 'Incluye': 'Maletín plástico + brocas' },
    badge: 'discount' },
  { id: 11, cat: 'electricas', name: 'Amoladora angular 4.5" 850W', brand: 'Bosch', price: 124500, oldPrice: null, sku: sku('electricas', 11), stock: 9, icon: 'grinder', unit: 'unidad',
    desc: 'Amoladora angular profesional con protector de disco, mango lateral y bloqueo de eje.',
    specs: { 'Potencia': '850 W', 'Disco': '115 mm (4.5")', 'rpm': '11000', 'Peso': '1.9 kg' },
    badge: 'hot' },
  { id: 12, cat: 'electricas', name: 'Atornillador inalámbrico 12V 2 baterías', brand: 'Makita', price: 168000, oldPrice: null, sku: sku('electricas', 12), stock: 4, icon: 'drill', unit: 'unidad',
    desc: 'Atornillador a batería con dos packs de litio 1.5Ah y cargador rápido en maletín.',
    specs: { 'Voltaje': '12 V', 'Baterías': '2 × 1.5 Ah Li-ion', 'Torque máx.': '30 Nm' },
    badge: 'stock-low' },
  { id: 13, cat: 'electricas', name: 'Sierra circular 1400W disco 185mm', brand: 'DeWalt', price: 178900, oldPrice: null, sku: sku('electricas', 13), stock: 8, icon: 'circular', unit: 'unidad',
    desc: 'Sierra circular profesional con guía láser, profundidad de corte 65mm a 90°.',
    specs: { 'Potencia': '1400 W', 'Disco': '185 mm', 'Corte 90°': '65 mm', 'Corte 45°': '46 mm' },
    badge: 'new' },

  // ---- TORNILLERÍA ----
  { id: 20, cat: 'tornilleria', name: 'Tornillos T1 cabeza hexagonal × 1/2" (100u)', brand: 'Bremen', price: 4200, oldPrice: null, sku: sku('tornilleria', 20), stock: 156, icon: 'screw', unit: 'caja 100u',
    desc: 'Caja de 100 tornillos autoperforantes para chapa, cabeza hexagonal con arandela.',
    specs: { 'Cantidad': '100 unidades', 'Largo': '1/2" / 13 mm', 'Punta': 'Autoperforante', 'Acabado': 'Galvanizado' },
    badge: null },
  { id: 21, cat: 'tornilleria', name: 'Tarugos plásticos S-8 (50u)', brand: 'Crivit', price: 2400, oldPrice: null, sku: sku('tornilleria', 21), stock: 240, icon: 'plug', unit: 'bolsa 50u',
    desc: 'Tarugos plásticos universales S-8 para mampostería, hormigón y placas.',
    specs: { 'Cantidad': '50 unidades', 'Diámetro': '8 mm', 'Largo': '40 mm' },
    badge: null },
  { id: 22, cat: 'tornilleria', name: 'Tornillos tirafondo 6×60 mm zincado (50u)', brand: 'Bremen', price: 5800, oldPrice: null, sku: sku('tornilleria', 22), stock: 72, icon: 'screw', unit: 'caja 50u',
    desc: 'Tornillos tirafondo para madera con cabeza Pozidriv, zincados.',
    specs: { 'Cantidad': '50 unidades', 'Diámetro': '6 mm', 'Largo': '60 mm', 'Cabeza': 'Pozidriv' },
    badge: null },

  // ---- PINTURAS ----
  { id: 30, cat: 'pinturas', name: 'Látex interior blanco mate 4L lavable', brand: 'Alba', price: 38500, oldPrice: null, sku: sku('pinturas', 30), stock: 28, icon: 'paint-can', unit: '4L',
    desc: 'Pintura látex acrílica para interior, mate, lavable. Rinde 35–40 m² por mano.',
    specs: { 'Contenido': '4 litros', 'Acabado': 'Mate', 'Rendimiento': '35-40 m²/mano', 'Secado': '2 hs' },
    badge: null },
  { id: 31, cat: 'pinturas', name: 'Esmalte sintético brillante 1L negro', brand: 'Sherwin', price: 18900, oldPrice: 22400, sku: sku('pinturas', 31), stock: 14, icon: 'paint-can', unit: '1L',
    desc: 'Esmalte sintético de alto brillo para metales y maderas, secado rápido.',
    specs: { 'Contenido': '1 litro', 'Acabado': 'Brillante', 'Soporte': 'Metal / madera', 'Secado': '4 hs' },
    badge: 'discount' },
  { id: 32, cat: 'pinturas', name: 'Rodillo lana 22cm + bandeja plástica', brand: 'Alba', price: 6800, oldPrice: null, sku: sku('pinturas', 32), stock: 41, icon: 'roller', unit: 'kit',
    desc: 'Kit de rodillo de lana sintética 22cm con bandeja plástica reforzada y mango.',
    specs: { 'Ancho': '22 cm', 'Material': 'Lana sintética', 'Incluye': 'Rodillo + bandeja + mango' },
    badge: null },

  // ---- ELECTRICIDAD ----
  { id: 40, cat: 'electricidad', name: 'Cable unipolar 2.5mm² × 25m negro', brand: 'Sika', price: 14200, oldPrice: null, sku: sku('electricidad', 40), stock: 32, icon: 'cable', unit: 'rollo 25m',
    desc: 'Cable unipolar antiflama de 2.5 mm² para instalaciones fijas. Norma IRAM.',
    specs: { 'Sección': '2.5 mm²', 'Largo': '25 m', 'Color': 'Negro', 'Norma': 'IRAM 2183' },
    badge: null },
  { id: 41, cat: 'electricidad', name: 'Disyuntor diferencial 25A bipolar', brand: 'Bremen', price: 22800, oldPrice: null, sku: sku('electricidad', 41), stock: 17, icon: 'switch', unit: 'unidad',
    desc: 'Interruptor diferencial 2P 25A 30mA. Protección contra fugas a tierra.',
    specs: { 'Corriente': '25 A', 'Polos': '2P', 'Sensibilidad': '30 mA', 'Norma': 'IRAM 2301' },
    badge: 'new' },
  { id: 42, cat: 'electricidad', name: 'Lámpara LED 9W E27 luz fría (pack 4)', brand: 'Sika', price: 8400, oldPrice: null, sku: sku('electricidad', 42), stock: 48, icon: 'bulb', unit: 'pack x4',
    desc: 'Lámpara LED bulbo 9W rosca E27, 6500K luz fría. Equivalente a 60W incandescente.',
    specs: { 'Potencia': '9 W', 'Rosca': 'E27', 'Color': '6500K (fría)', 'Vida útil': '25.000 hs' },
    badge: null },

  // ---- PLOMERÍA ----
  { id: 50, cat: 'plomeria', name: 'Caño PVC 110mm × 4m desagüe', brand: 'Tigre', price: 12400, oldPrice: null, sku: sku('plomeria', 50), stock: 22, icon: 'pipe', unit: 'caño 4m',
    desc: 'Caño de PVC para desagüe cloacal, junta deslizante, color blanco.',
    specs: { 'Diámetro': '110 mm', 'Largo': '4 m', 'Uso': 'Desagüe cloacal', 'Norma': 'IRAM 13473' },
    badge: null },
  { id: 51, cat: 'plomeria', name: 'Canilla cocina pico móvil cromada', brand: 'Bremen', price: 28900, oldPrice: 34500, sku: sku('plomeria', 51), stock: 9, icon: 'faucet', unit: 'unidad',
    desc: 'Grifería monocomando para cocina con pico móvil 360° y aireador antical.',
    specs: { 'Tipo': 'Monocomando', 'Acabado': 'Cromo', 'Pico': 'Móvil 360°' },
    badge: 'discount' },

  // ---- CONSTRUCCIÓN ----
  { id: 60, cat: 'construccion', name: 'Cemento Portland 50kg bolsa', brand: 'Loma Negra', price: 11800, oldPrice: null, sku: sku('construccion', 60), stock: 84, icon: 'cement', unit: 'bolsa 50kg',
    desc: 'Cemento Portland normal CPN40 en bolsa de 50 kg. Uso estructural y albañilería.',
    specs: { 'Peso': '50 kg', 'Tipo': 'CPN40', 'Norma': 'IRAM 50000' },
    badge: null },
  { id: 61, cat: 'construccion', name: 'Cal hidratada 30kg bolsa', brand: 'Cacique', price: 6900, oldPrice: null, sku: sku('construccion', 61), stock: 58, icon: 'cement', unit: 'bolsa 30kg',
    desc: 'Cal hidratada para mezclas de albañilería y revoque. Bolsa de 30 kg.',
    specs: { 'Peso': '30 kg', 'Uso': 'Albañilería y revoques' },
    badge: null },

  // ---- SEGURIDAD ----
  { id: 70, cat: 'seguridad', name: 'Casco de seguridad clase B amarillo', brand: '3M', price: 12900, oldPrice: null, sku: sku('seguridad', 70), stock: 31, icon: 'helmet', unit: 'unidad',
    desc: 'Casco de seguridad industrial con arnés ajustable. Norma IRAM 3620.',
    specs: { 'Color': 'Amarillo', 'Clase': 'B (eléctrica)', 'Norma': 'IRAM 3620' },
    badge: 'new' },
  { id: 71, cat: 'seguridad', name: 'Guantes de trabajo nitrilo (par)', brand: '3M', price: 3400, oldPrice: null, sku: sku('seguridad', 71), stock: 124, icon: 'glove', unit: 'par',
    desc: 'Guantes de algodón con recubrimiento nitrilo en palma. Antideslizante.',
    specs: { 'Talle': 'L/9', 'Recubrimiento': 'Nitrilo', 'Norma': 'EN 388' },
    badge: null },
  { id: 72, cat: 'seguridad', name: 'Antiparras de seguridad incoloras', brand: '3M', price: 5400, oldPrice: null, sku: sku('seguridad', 72), stock: 67, icon: 'goggles', unit: 'unidad',
    desc: 'Antiparras de policarbonato antiempañante con protección lateral.',
    specs: { 'Material': 'Policarbonato', 'Protección': 'UV + impacto', 'Norma': 'ANSI Z87.1' },
    badge: null },
];

// Helper formatting
function fmtARS(n) {
  return '$' + n.toLocaleString('de-DE'); // dot thousands
}

Object.assign(window, { FC_CATEGORIES, FC_BRANDS, FC_PRODUCTS, fmtARS });

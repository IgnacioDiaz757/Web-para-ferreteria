# HANDOFF · Conectar el admin a una base de datos real

Este proyecto está **listo para conectarse a una DB real**, pero hoy guarda todo en el `localStorage` del navegador. Esto significa:

- ✅ Funciona offline, sin instalar nada
- ✅ Los cambios persisten al recargar
- ✅ Sirve para demos, capturas y pruebas
- ⚠️ Los datos viven en **un solo navegador** — otro usuario o dispositivo no los ve
- ⚠️ No hay seguridad real (cualquiera con la URL del admin entra con `admin / admin1234`)

Para producción hay que reemplazar la capa de persistencia. La buena noticia: **toda la lógica de la app ya pasa por un único punto** (`js/store.js`), así que conectarla a una DB real es cambiar **un solo archivo**.

---

## El "store" — único punto de contacto con los datos

Mirá `js/store.js`. Toda la app (web pública + admin) lee y escribe a través de:

```js
window.FCStore.getState()                 // estado completo
window.FCStore.subscribe(fn)              // re-render cuando cambia
window.FCStore.upsertProduct(p)           // crear o actualizar producto
window.FCStore.removeProduct(id)
window.FCStore.upsertCategory(c)
window.FCStore.removeCategory(id)
window.FCStore.reorderCategories(ids)
window.FCStore.addBrand(name)
window.FCStore.renameBrand(old, new)
window.FCStore.removeBrand(name)
window.FCStore.setOfertas(ids)
window.FCStore.updateSettings(patch)
window.FCStore.updateHero(patch)
window.FCStore.updateHorarios(arr)
```

Hoy estos métodos escriben a `localStorage`. Para producción, cada uno tiene que hacer una llamada HTTP a tu backend.

---

## Opción 1 (recomendada): **Supabase**

[Supabase](https://supabase.com) es Postgres como servicio con auth, REST API y realtime — **sin escribir backend**. Ideal para este caso.

### Pasos
1. Crear proyecto en supabase.com (plan gratis hasta 500MB DB y 50k usuarios)
2. Crear las tablas con el SQL de abajo (sección **Esquema SQL**)
3. Importar SDK en `index.html` (público) y `admin/index.html`:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   ```
4. Reemplazar el body de `store.js` con llamadas a Supabase (ejemplo más abajo)
5. Usar **Supabase Auth** para el login del admin (en lugar del hardcoded `admin1234`)

### Ejemplo de `store.js` con Supabase

```js
const supabase = window.supabase.createClient(
  'https://TU-PROYECTO.supabase.co',
  'TU_ANON_KEY'
);

let state = { products: [], categories: [], brands: [], settings: {}, hero: {}, horarios: [], ofertasIds: null };
const listeners = new Set();
const notify = () => listeners.forEach(fn => fn(state));

async function loadAll() {
  const [products, categories, brands, settings] = await Promise.all([
    supabase.from('products').select('*').order('id'),
    supabase.from('categories').select('*').order('sort_order'),
    supabase.from('brands').select('name'),
    supabase.from('settings').select('*').single(),
  ]);
  state = {
    products: products.data || [],
    categories: categories.data || [],
    brands: (brands.data || []).map(b => b.name),
    settings: settings.data?.business || {},
    hero: settings.data?.hero || {},
    horarios: settings.data?.horarios || [],
    ofertasIds: settings.data?.ofertas_ids || null,
  };
  notify();
}

// Realtime: cualquier cambio en DB se propaga a todos los usuarios conectados
supabase
  .channel('catalog')
  .on('postgres_changes', { event: '*', schema: 'public' }, () => loadAll())
  .subscribe();

loadAll();

window.FCStore = {
  getState: () => state,
  subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },

  async upsertProduct(p) {
    await supabase.from('products').upsert(p);
    // realtime trigger refresca el state
  },
  async removeProduct(id) {
    await supabase.from('products').delete().eq('id', id);
  },
  async upsertCategory(c) {
    await supabase.from('categories').upsert(c);
  },
  // ... y así con el resto
};
```

---

## Opción 2: **Firebase / Firestore**

Si ya usás Google Cloud, Firestore es similar:
1. Crear proyecto en console.firebase.google.com
2. Crear colecciones `products`, `categories`, `brands`, `settings`
3. Reemplazar `store.js` con llamadas a Firestore
4. Usar Firebase Auth para el login

Ventajas: muy fácil setup, generoso plan gratis.
Desventajas: NoSQL, no es Postgres, queries más limitadas.

---

## Opción 3: **Backend propio** (Node + Postgres)

Si necesitás más control (integración con sistemas existentes, ERP, AFIP, etc.):
1. Levantar un Node.js / Express en un VPS
2. Crear endpoints REST: `GET/POST /api/products`, `GET/POST /api/categories`, etc.
3. Reemplazar `store.js` con llamadas a `fetch()` a esos endpoints
4. Auth: JWT con `bcrypt` para contraseñas

---

## Esquema SQL (Postgres / Supabase)

```sql
-- Categorías
CREATE TABLE categories (
  id text PRIMARY KEY,         -- slug, ej: 'manuales'
  name text NOT NULL,
  short text NOT NULL,
  icon text DEFAULT 'wrench',
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Marcas
CREATE TABLE brands (
  name text PRIMARY KEY,
  created_at timestamptz DEFAULT now()
);

-- Productos
CREATE TABLE products (
  id serial PRIMARY KEY,
  name text NOT NULL,
  brand text REFERENCES brands(name) ON UPDATE CASCADE,
  cat text REFERENCES categories(id) ON UPDATE CASCADE,
  sku text UNIQUE,
  price numeric(12, 2) NOT NULL,
  old_price numeric(12, 2),
  stock int DEFAULT 0,
  unit text DEFAULT 'unidad',
  icon text DEFAULT 'wrench',
  image text,                  -- URL a Supabase Storage o data URL
  description text,
  specs jsonb DEFAULT '{}'::jsonb,
  badge text,                  -- 'new' | 'hot' | 'stock-low'
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Configuración global (un solo registro)
CREATE TABLE settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  business jsonb NOT NULL,     -- nombre, dirección, teléfono, etc.
  hero jsonb NOT NULL,         -- textos del banner
  horarios jsonb NOT NULL,     -- array de horarios
  ofertas_ids int[] DEFAULT NULL  -- productos destacados
);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION touch_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
```

---

## Subida de imágenes

Las imágenes de productos hoy se guardan **inline** como `data:image/...;base64,...` en `localStorage`. Esto está bien para demo, pero **no escala**: cada imagen pesa ~100-500 KB y localStorage tiene un límite de ~5 MB.

Para producción, hay que subirlas a un storage:

- **Supabase Storage** (incluido en la opción 1)
- **Cloudinary** (gratis hasta 25 GB, optimización automática)
- **S3 / Cloudflare R2** (más industrial)

El `AdmImageUpload` en `admin-ui.jsx` ya recibe el archivo — cambiá la función `handleFile` para que primero suba el archivo al storage y guarde solo la URL.

---

## Auth real

Hoy el login (`admin / admin1234`) está hardcoded en `shell.jsx`. Para producción:

- **Supabase Auth**: `supabase.auth.signInWithPassword()` reemplaza el chequeo. Soporta email/password, OAuth, magic links.
- **Backend propio**: endpoint `/auth/login` que devuelve JWT, guardado en `httpOnly cookie`.

En ambos casos, agregar **Row Level Security (RLS)** en la DB para que solo el rol `admin` pueda escribir.

---

## Tiempo estimado

| Tarea | Estimación |
|---|---|
| Crear cuenta Supabase + esquema | 1 h |
| Migrar `store.js` a Supabase | 3-4 h |
| Reemplazar login hardcoded por Supabase Auth | 1-2 h |
| Migrar imágenes a Storage | 2 h |
| Setup de dominio y deploy (Vercel/Netlify) | 1-2 h |
| **Total** | **~1 día de trabajo dev** |

---

## Checklist antes de salir a producción

- [ ] Cambiar password de admin a algo seguro
- [ ] Configurar HTTPS (Vercel / Netlify lo hacen automático)
- [ ] Activar RLS en Supabase para todas las tablas
- [ ] Migrar imágenes inline a Storage
- [ ] Definir backups automáticos de la DB
- [ ] Quitar el banner "Modo demo · localStorage" del dashboard
- [ ] Configurar el dominio del WhatsApp y email reales
- [ ] Quitar la sección "Demo" del login

---

¿Dudas? El código está comentado y la estructura es plana. Cualquier dev frontend que conozca React puede tomar este proyecto y conectarlo en un día.

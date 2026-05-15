const SUPABASE_URL = "https://gugcasbyewqvjqiiucnw.supabase.co";
const SUPABASE_KEY = "sb_publishable_Y5Ck0i9IOi8DJl07Dt0njQ_QQX9f3Z0";
const SUPER_ADMIN_EMAIL = "apexdigital70@gmail.com";

const seedProperties = [
  {
    id: "demo-1",
    title: "Casa Patio Norte",
    operation: "Venta",
    status: "Disponible",
    featured: true,
    property_type: "Casa",
    zone: "Equipetrol Norte",
    address: "Zona norte, Santa Cruz",
    price: 248000,
    bedrooms: 4,
    bathrooms: 4,
    parking: 2,
    built_area: 280,
    lot_area: 420,
    description: "Casa familiar con jardin, galeria social y ambientes conectados para recibir visitas.",
    features: "Jardin, suite master, churrasquera, escritorio, area de servicio",
    commercial_notes: "Propietario abierto a oferta seria con financiamiento validado.",
    agent_name: "Equipo I Like Home",
    agent_whatsapp: "+59170000000",
    photos: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=82"
    ]
  },
  {
    id: "demo-2",
    title: "Departamento Luz",
    operation: "Venta",
    status: "Disponible",
    featured: true,
    property_type: "Departamento",
    zone: "Urubo",
    address: "Urubo, Santa Cruz",
    price: 164000,
    bedrooms: 3,
    bathrooms: 3,
    parking: 2,
    built_area: 156,
    lot_area: 0,
    description: "Departamento luminoso con terraza social, cocina integrada y vista abierta.",
    features: "Terraza, piscina del condominio, seguridad, ascensor, baulera",
    commercial_notes: "Ideal para comprador joven o inversion de renta.",
    agent_name: "Equipo I Like Home",
    agent_whatsapp: "+59170000000",
    photos: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=82"
    ]
  },
  {
    id: "demo-3",
    title: "Villa Sauce",
    operation: "Venta",
    status: "Disponible",
    featured: false,
    property_type: "Casa",
    zone: "Zona Sur",
    address: "Zona Sur, Santa Cruz",
    price: 392000,
    bedrooms: 5,
    bathrooms: 5,
    parking: 3,
    built_area: 410,
    lot_area: 680,
    description: "Residencia amplia con piscina, cocina abierta y sala conectada al exterior.",
    features: "Piscina, galeria, cinco dormitorios, cocina abierta, jardin consolidado",
    commercial_notes: "Producto premium para familia grande.",
    agent_name: "Equipo I Like Home",
    agent_whatsapp: "+59170000000",
    photos: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=82"
    ]
  }
];

let supabaseClient = null;
let state = {
  properties: [],
  appointments: [],
  leads: [],
  tasks: [],
  policies:
    "I Like Home atiende compra, venta, valuacion y visitas. La comunicacion debe ser clara, respetuosa y orientada a agendar el siguiente paso. No se promete precio final sin valuacion. Toda visita requiere nombre, WhatsApp, fecha y tipo de cita."
};

const storage = {
  get(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(`ilh_${key}`)) ?? fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(`ilh_${key}`, JSON.stringify(value));
  }
};

function initSupabase() {
  if (!window.supabase) {
    setStatus("Supabase no cargo desde CDN. Usando respaldo local.");
    return;
  }
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

function setStatus(message) {
  const status = document.querySelector("#supabaseStatus");
  if (status) status.textContent = message;
}

function formatPrice(value) {
  const number = Number(value || 0);
  if (!number) return "Consultar";
  return `USD ${number.toLocaleString("es-BO")}`;
}

function normalizePhone(phone = "") {
  return phone.replace(/[^\d]/g, "");
}

function whatsappLink(phone, message) {
  const cleaned = normalizePhone(phone);
  const target = cleaned || "59170000000";
  return `https://wa.me/${target}?text=${encodeURIComponent(message)}`;
}

async function fetchTable(table, fallback) {
  if (!supabaseClient) return storage.get(table, fallback);
  const { data, error } = await supabaseClient.from(table).select("*").order("created_at", { ascending: false });
  if (error) {
    setStatus(`Supabase conectado, pero falta configurar tablas o permisos: ${error.message}. Usando respaldo local.`);
    return storage.get(table, fallback);
  }
  setStatus("Supabase conectado. Datos sincronizados con la base configurada.");
  return data?.length ? data : storage.get(table, fallback);
}

async function insertRow(table, row) {
  const localRow = { id: crypto.randomUUID(), created_at: new Date().toISOString(), ...row };
  const localRows = storage.get(table, []);
  storage.set(table, [localRow, ...localRows]);

  if (!supabaseClient) return localRow;
  const { data, error } = await supabaseClient.from(table).insert(row).select().single();
  if (error) {
    setStatus(`No se pudo escribir en Supabase: ${error.message}. Guardado localmente.`);
    return localRow;
  }
  setStatus("Guardado en Supabase correctamente.");
  return data;
}

async function loadData() {
  state.properties = await fetchTable("properties", seedProperties);
  state.appointments = await fetchTable("appointments", []);
  state.leads = await fetchTable("leads", []);
  state.tasks = await fetchTable("team_tasks", []);
  const policies = await fetchTable("company_policies", []);
  const localPolicy = storage.get("policies", state.policies);
  state.policies = policies?.[0]?.content || localPolicy;
  renderAll();
}

function renderAll() {
  renderProperties();
  renderAdminProperties();
  renderAppointments();
  renderLeads();
  renderTasks();
  renderPolicies();
  updateStats();
}

function renderProperties() {
  const grid = document.querySelector("#propertiesGrid");
  if (!grid) return;
  grid.innerHTML = "";
  state.properties.slice(0, 12).forEach((property) => {
    const image = property.photos?.[0] || property.photo_1 || seedProperties[0].photos[0];
    const card = document.createElement("article");
    card.className = `property-card ${property.featured ? "featured" : ""}`;
    card.innerHTML = `
      <img src="${image}" alt="${property.title || "Propiedad I Like Home"}" />
      <div class="property-body">
        <div>
          <h3>${property.title || "Propiedad sin titulo"}</h3>
          <p>${property.zone || "Zona por confirmar"} · ${property.bedrooms || 0} dorm. · ${property.bathrooms || 0} banos</p>
          <div class="badge-row">
            <span class="badge">${property.operation || "Venta"}</span>
            <span class="badge">${property.property_type || "Inmueble"}</span>
            <span class="badge">${property.status || "Disponible"}</span>
          </div>
        </div>
        <strong>${formatPrice(property.price)}</strong>
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderAdminProperties() {
  const list = document.querySelector("#adminProperties");
  if (!list) return;
  list.innerHTML = state.properties
    .map(
      (item) => `
        <div class="list-row">
          <div>
            <strong>${item.title || "Propiedad"}</strong>
            <p>${item.operation || "Venta"} · ${item.zone || "Sin zona"} · ${formatPrice(item.price)} · ${item.status || "Disponible"}</p>
          </div>
          <div class="list-actions">
            <a class="mini-button whatsapp" target="_blank" rel="noreferrer" href="${whatsappLink(
              item.agent_whatsapp,
              `Hola, quiero informacion comercial sobre ${item.title || "esta propiedad"}`
            )}">WhatsApp</a>
          </div>
        </div>
      `
    )
    .join("");
}

function renderAppointments() {
  const list = document.querySelector("#appointmentsList");
  if (!list) return;
  list.innerHTML = state.appointments.length
    ? state.appointments
        .map(
          (item) => `
          <div class="list-row">
            <div>
              <strong>${item.client_name}</strong>
              <p>${item.date || ""} ${item.time || ""} · ${item.appointment_type || "Cita"} · ${item.notes || "Sin notas"}</p>
            </div>
            <div class="list-actions">
              <a class="mini-button whatsapp" target="_blank" rel="noreferrer" href="${whatsappLink(
                item.phone,
                `Hola ${item.client_name}, confirmamos tu cita en I Like Home para ${item.date || "la fecha coordinada"}.`
              )}">WhatsApp</a>
            </div>
          </div>
        `
        )
        .join("")
    : "<p>No hay citas registradas todavia.</p>";
}

function renderLeads() {
  const list = document.querySelector("#leadsList");
  if (!list) return;
  list.innerHTML = state.leads.length
    ? state.leads
        .map(
          (lead) => `
          <div class="list-row">
            <div>
              <strong>${lead.name}</strong>
              <p>${lead.interest || "Interes"} · ${lead.zone || "Sin zona"} · ${lead.property_type || ""} · ${lead.budget || ""}</p>
            </div>
            <div class="list-actions">
              <a class="mini-button whatsapp" target="_blank" rel="noreferrer" href="${whatsappLink(
                lead.phone,
                `Hola ${lead.name}, soy de I Like Home. Te escribo para avanzar con tu solicitud de ${lead.interest || "inmuebles"}.`
              )}">WhatsApp</a>
            </div>
          </div>
        `
        )
        .join("")
    : "<p>No hay leads registrados todavia.</p>";
}

function renderTasks() {
  const list = document.querySelector("#tasksList");
  if (!list) return;
  list.innerHTML = state.tasks.length
    ? state.tasks
        .map(
          (task) => `
          <div class="list-row">
            <div>
              <strong>${task.title}</strong>
              <p>${task.owner} · ${task.due_date || "Sin fecha"} · ${task.status || "Pendiente"}</p>
            </div>
          </div>
        `
        )
        .join("")
    : "<p>No hay tareas de equipo todavia.</p>";
}

function renderPolicies() {
  const field = document.querySelector("#policiesContent");
  if (field) field.value = state.policies;
}

function updateStats() {
  const values = {
    properties: state.properties.length,
    propertiesAdmin: state.properties.length,
    appointments: state.appointments.length,
    appointmentsAdmin: state.appointments.length,
    leads: state.leads.length,
    tasks: state.tasks.length
  };
  Object.entries(values).forEach(([key, value]) => {
    const node = document.querySelector(`[data-stat="${key}"]`);
    if (node) node.textContent = value;
  });
}

function formData(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function setFormStatus(name, message) {
  const node = document.querySelector(`[data-status="${name}"]`);
  if (node) node.textContent = message;
}

function getPhotos(data) {
  return [1, 2, 3, 4, 5, 6].map((i) => data[`photo_${i}`]).filter(Boolean);
}

function openPropertyModal() {
  document.querySelector("#propertyModal")?.showModal();
}

function closePropertyModal() {
  document.querySelector("#propertyModal")?.close();
}

function openAdmin() {
  document.querySelector("#panel-admin")?.scrollIntoView({ behavior: "smooth" });
}

function bindEvents() {
  document.querySelectorAll(".mode-switch button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".mode-switch button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      const field = document.querySelector("[data-interest-field]");
      if (field) field.value = button.dataset.mode;
    });
  });

  document.querySelectorAll("[data-open-property]").forEach((button) => {
    button.addEventListener("click", openPropertyModal);
  });

  document.querySelector("[data-close-modal]")?.addEventListener("click", closePropertyModal);
  document.querySelector("[data-open-admin]")?.addEventListener("click", openAdmin);

  document.querySelector("[data-admin-login]")?.addEventListener("click", () => {
    const email = document.querySelector("#adminEmail")?.value.trim().toLowerCase();
    if (email === SUPER_ADMIN_EMAIL) {
      document.querySelector("[data-admin-shell]")?.classList.add("unlocked");
      setStatus(`Acceso Super Admin activo: ${SUPER_ADMIN_EMAIL}`);
    } else {
      setStatus("Acceso denegado. Usa el correo Super Admin autorizado.");
    }
  });

  document.querySelectorAll("[data-admin-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll("[data-admin-tab]").forEach((item) => item.classList.remove("active"));
      document.querySelectorAll("[data-admin-view]").forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");
      document.querySelector(`[data-admin-view="${tab.dataset.adminTab}"]`)?.classList.add("active");
    });
  });

  document.querySelector('[data-form="property"]')?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = formData(form);
    const property = {
      ...data,
      featured: data.featured === "true",
      price: Number(data.price || 0),
      bedrooms: Number(data.bedrooms || 0),
      bathrooms: Number(data.bathrooms || 0),
      parking: Number(data.parking || 0),
      built_area: Number(data.built_area || 0),
      lot_area: Number(data.lot_area || 0),
      photos: getPhotos(data)
    };
    [1, 2, 3, 4, 5, 6].forEach((i) => delete property[`photo_${i}`]);
    const row = await insertRow("properties", property);
    state.properties = [row, ...state.properties.filter((item) => item.id !== row.id)];
    renderAll();
    setFormStatus("property", "Propiedad guardada y publicada en inventario.");
    form.reset();
  });

  document.querySelector('[data-form="lead"]')?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const row = await insertRow("leads", formData(form));
    state.leads = [row, ...state.leads];
    renderAll();
    setFormStatus("lead", "Interes registrado. El equipo puede seguirlo desde CRM.");
    form.reset();
  });

  document.querySelector('[data-form="appointment"]')?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const row = await insertRow("appointments", formData(form));
    state.appointments = [row, ...state.appointments];
    renderAll();
    setFormStatus("appointment", "Cita registrada en calendario.");
    form.reset();
  });

  document.querySelector('[data-form="task"]')?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const row = await insertRow("team_tasks", formData(form));
    state.tasks = [row, ...state.tasks];
    renderAll();
    form.reset();
  });

  document.querySelector('[data-form="policies"]')?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = formData(event.currentTarget);
    state.policies = data.content;
    storage.set("policies", state.policies);
    await insertRow("company_policies", { content: state.policies, updated_by: SUPER_ADMIN_EMAIL });
    renderPolicies();
    setStatus("Politicas de la asesora guardadas.");
  });

  document.querySelector('[data-form="assistant"]')?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = formData(form);
    addMessage(data.message, "user");
    addMessage(await assistantReply(data.message), "assistant");
    form.reset();
  });
}

function addMessage(text, type) {
  const log = document.querySelector("#chatLog");
  if (!log) return;
  const message = document.createElement("div");
  message.className = `message ${type}`;
  message.textContent = text;
  log.appendChild(message);
  log.scrollTop = log.scrollHeight;
}

async function assistantReply(input) {
  const text = input.toLowerCase();
  if (text.includes("cita") || text.includes("visita") || text.includes("agenda")) {
    const row = await insertRow("leads", {
      name: "Lead desde asesora",
      phone: "",
      interest: "Agendar cita",
      zone: "Por confirmar",
      property_type: "Por confirmar",
      budget: "Por confirmar",
      source: "Asesora Virtual"
    });
    state.leads = [row, ...state.leads];
    renderAll();
    return "Puedo ayudarte a agendar. Dejame tu nombre, WhatsApp, fecha ideal y si buscas visita, valuacion o llamada. Ya deje un seguimiento creado en CRM.";
  }

  if (text.includes("precio") || text.includes("presupuesto") || text.includes("propiedad")) {
    const options = state.properties
      .slice(0, 3)
      .map((item) => `${item.title} en ${item.zone}, ${formatPrice(item.price)}`)
      .join("; ");
    return `Tengo estas opciones activas: ${options}. Si me indicas zona, presupuesto y tipo de inmueble, el equipo puede enviarte una seleccion por WhatsApp.`;
  }

  if (text.includes("vender") || text.includes("valuacion") || text.includes("tasacion")) {
    return "Para vender, I Like Home revisa precio defendible, documentacion, estado comercial, fotos, narrativa y estrategia de captacion. Puedes cargar la propiedad desde Agregar propiedad o pedir una valuacion.";
  }

  if (text.includes("politica") || text.includes("empresa") || text.includes("comision")) {
    return state.policies;
  }

  return "Soy la asesora virtual de I Like Home. Puedo orientarte sobre compra, venta, propiedades disponibles, citas, valuaciones y politicas de la empresa. Para avanzar rapido dime si quieres comprar o vender, zona y WhatsApp.";
}

document.addEventListener("DOMContentLoaded", async () => {
  bindEvents();
  initSupabase();
  await loadData();
  addMessage("Hola, soy la asesora virtual de I Like Home. Estoy disponible 24/7 para ayudarte con compra, venta, citas y propiedades.", "assistant");
});

<template>
  <div class="events-feed-page">
    <PasswordChangedBanner />

    <!-- ── HEADER ───────── -->
    <div class="feed-header">
      <div class="feed-header__left">
        <div class="feed-header__icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <div>
          <h1 class="feed-header__title">Muro de Eventos</h1>
          <p class="feed-header__sub">Explora y participa en las actividades de la comunidad UCB</p>
        </div>
      </div>

      <!-- Indicador de preferencias activas -->
      <div v-if="hasActivePreferences" class="prefs-indicator" @click="goToProfile">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        Ordenando por tus preferencias
      </div>
    </div>

    <!----- FILTROS ----->
    <div class="filters-bar">
      <!-- Buscador -->
      <div class="filter-search">
        <svg class="filter-search__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          v-model="searchInput"
          @input="onSearchInput"
          type="text"
          placeholder="Buscar eventos..."
          class="filter-search__input"
        />
        <button v-if="searchInput" @click="clearSearch" class="filter-clear-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Fila de selects -->
      <div class="filter-row">
        <!-- Carrera -->
        <select v-model="selectedCareer" @change="applyFilters" class="filter-select">
          <option value="">Todas las carreras</option>
          <option v-for="c in careers" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>

        <!-- Categoría -->
        <select v-model="selectedCategory" @change="applyFilters" class="filter-select">
          <option value="">Todas las categorías</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>

        <!-- Ordenamiento -->
        <select v-model="sortType" @change="applyFilters" class="filter-select filter-select--sort">
          <option value="DESC">Más recientes</option>
          <option value="ASC">Más antiguas</option>
        </select>

        <!-- Botón limpiar -->
        <button v-if="hasActiveFilters" @click="clearAllFilters" class="filter-reset-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
          </svg>
          Limpiar
        </button>
      </div>

      <div v-if="!loading" class="filter-result-info">
        <span v-if="totalElements > 0">
          {{ totalElements }} evento{{ totalElements !== 1 ? 's' : '' }} encontrado{{ totalElements !== 1 ? 's' : '' }}
          <span v-if="recommendedCount > 0" class="result-recommended-count">
            · {{ recommendedCount }} recomendado{{ recommendedCount !== 1 ? 's' : '' }} para ti
          </span>
        </span>
        <span v-else class="filter-result-info--empty">Sin resultados para los filtros aplicados</span>
      </div>
    </div>

    <!-- ── LOADING SKELETONS ──────────────────────────────────────── -->
    <div v-if="loading" class="feed-list">
      <div v-for="i in 3" :key="i" class="event-card skeleton-blink" style="height: 200px; background: #edeff2; border: none;"></div>
    </div>

    <!-- ── FEED LIST ───────────────────────────────────────────────── -->
    <div v-else-if="eventos.length > 0" class="feed-list">

      

      <article
        v-for="(evento, i) in eventos"
        :key="evento.id"
        class="event-card"
        :class="{ 'event-card--recommended': evento.recommended }"
        :style="{ '--delay': i * 0.07 + 's' }"
        @click="goToDetail(evento.id)"
      >
        <!-- Badge recomendado -->
        <div v-if="evento.recommended" class="badge-recommended">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Recomendado para ti
        </div>

        <!-- Separador entre recomendados y resto -->
        <div
          v-if="recommendedCount > 0 && i === recommendedCount"
          class="section-label section-label--rest"
          style="margin-bottom: 0.5rem;"
        >
          Otros eventos
        </div>

        <div class="event-card__header">
          <div class="author-avatar">{{ getInitials(evento.authorName) }}</div>
          <div class="author-meta">
            <span class="author-name">{{ evento.authorName }}</span>
            <div class="meta-row">
              <span class="event-date">{{ formatDateTime(evento.createdAt) }}</span>
              <span
                v-if="evento.category"
                class="cat-pill"
                :style="{ background: evento.category.colorHex || '#64748b' }"
              >{{ evento.category.name }}</span>
            </div>
          </div>
        </div>

        <div class="event-card__body">
          <h2 class="event-card__title">{{ evento.name }}</h2>
          <p class="event-card__text">{{ evento.description }}</p>
          <div class="event-meta-info">
            <span class="meta-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {{ formatEventDateTime(evento.startDatetime, evento.endDatetime) }}
            </span>
            <span class="meta-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              {{ evento.location?.name || 'No especificada' }}
            </span>
            <span class="meta-tag meta-tag--type">
              {{ evento.eventType }}
            </span>
          </div>
        </div>

        <div v-if="evento.posterUrl" class="event-card__media">
          <img :src="evento.posterUrl" :alt="evento.name" class="event-card__img" />
        </div>
      </article>
    </div>

    <div v-else class="empty-state">
      <div class="empty-state__visual">
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </div>
      <h3>Sin Resultados</h3>
      <p>Intenta con otros filtros o términos de búsqueda.</p>
    </div>

    <!-- ── PAGINACIÓN ──────────────────────────────────────────────── -->
    <div v-if="!loading && totalPages > 1" class="pagination">
      <button
        class="pagination__btn"
        :disabled="currentPage === 0"
        @click="goToPage(0)"
        title="Primera página"
      >«</button>

      <button
        class="pagination__btn"
        :disabled="currentPage === 0"
        @click="goToPage(currentPage - 1)"
        title="Página anterior"
      >‹</button>

      <template v-for="p in visiblePages" :key="p">
        <span v-if="p === '...'" class="pagination__ellipsis">...</span>
        <button
          v-else
          class="pagination__btn"
          :class="{ 'pagination__btn--active': p === currentPage }"
          @click="goToPage(p)"
        >{{ p + 1 }}</button>
      </template>

      <button
        class="pagination__btn"
        :disabled="currentPage === totalPages - 1"
        @click="goToPage(currentPage + 1)"
        title="Página siguiente"
      >›</button>

      <button
        class="pagination__btn"
        :disabled="currentPage === totalPages - 1"
        @click="goToPage(totalPages - 1)"
        title="Última página"
      >»</button>

      <span class="pagination__info">
        Página {{ currentPage + 1 }} de {{ totalPages }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PasswordChangedBanner from '../../components/PasswordChangedBanner.vue'
import { formatDateTime, formatEventDateTime } from '../../utils/index.js'
import { userService } from '../../services/api.js'

const API_BASE = import.meta.env.VITE_API_URL || ''

const router   = useRouter()
const eventos  = ref([])
const careers  = ref([])
const categories = ref([])
const loading  = ref(true)

// Preferencias del estudiante (para reordenación client-side si no viene del backend)
const userPreferences = ref({ eventTypes: [], categoryIds: [] })
const hasActivePreferences = computed(
  () => userPreferences.value.eventTypes.length > 0 || userPreferences.value.categoryIds.length > 0
)

// Cuenta cuántos eventos de la página actual son recomendados
const recommendedCount = computed(() => eventos.value.filter(e => e.recommended).length)

// ─── Filtros ───────────────────────────────────────────────────────────────
const searchInput    = ref('')
const selectedCareer = ref('')
const selectedCategory = ref('')
const sortType       = ref('DESC')

const currentPage    = ref(0)
const pageSize       = ref(10)
const totalPages     = ref(0)
const totalElements  = ref(0)

let searchTimer = null
function onSearchInput() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { currentPage.value = 0; fetchEventos() }, 450)
}
function clearSearch() { searchInput.value = ''; currentPage.value = 0; fetchEventos() }

const hasActiveFilters = computed(() =>
  searchInput.value.trim() !== '' ||
  selectedCareer.value !== '' ||
  selectedCategory.value !== '' ||
  sortType.value !== 'DESC'
)
function applyFilters() { currentPage.value = 0; fetchEventos() }
function clearAllFilters() {
  searchInput.value = ''; selectedCareer.value = ''; selectedCategory.value = ''; sortType.value = 'DESC'
  currentPage.value = 0; fetchEventos()
}

function goToPage(page) {
  if (page < 0 || page >= totalPages.value) return
  currentPage.value = page; fetchEventos()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
const visiblePages = computed(() => {
  const total = totalPages.value; const current = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i)
  if (current <= 3) return [0, 1, 2, 3, 4, '...', total - 1]
  if (current >= total - 4) return [0, '...', total - 5, total - 4, total - 3, total - 2, total - 1]
  return [0, '...', current - 1, current, current + 1, '...', total - 1]
})

// ─── Aplicar recomendaciones (client-side fallback) ────────────────────────
// El backend devuelve `recommended` si el endpoint lo soporta.
// Si no, lo calculamos aquí con las preferencias cargadas.
function applyRecommendations(list) {
  const prefs = userPreferences.value
  const hasPrefs = prefs.eventTypes.length > 0 || prefs.categoryIds.length > 0

  if (!hasPrefs) return list // SCRUM-406: sin prefs → sin badge, sin reordenación

  const enriched = list.map(e => {
    // Si el backend ya lo marcó, respetar eso
    if (e.recommended !== undefined && e.recommended !== null) return e

    const matchType     = prefs.eventTypes.includes(e.eventType)
    const matchCategory = e.category?.id != null && prefs.categoryIds.includes(e.category.id)
    return { ...e, recommended: matchType || matchCategory }
  })

  // Reordenar: recomendados primero (SCRUM-403)
  const rec  = enriched.filter(e => e.recommended)
  const rest = enriched.filter(e => !e.recommended)
  return [...rec, ...rest]
}

// ─── Fetch ─────────────────────────────────────────────────────────────────
const fetchEventos = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams({ page: currentPage.value, size: pageSize.value, sortBy: 'createdAt', sortType: sortType.value })
    if (searchInput.value.trim())   params.append('search',     searchInput.value.trim())
    if (selectedCareer.value)       params.append('careerId',   selectedCareer.value)
    if (selectedCategory.value)     params.append('categoryId', selectedCategory.value)

    const response = await fetch(`${API_BASE}/api/events/recent?${params.toString()}`)
    const result   = await response.json()

    const rawList = result.content || []
    eventos.value       = applyRecommendations(rawList)
    totalPages.value    = result.totalPages    || 0
    totalElements.value = result.totalElements || 0
  } catch (error) {
    console.error('Error al cargar eventos:', error)
    eventos.value = []
  } finally {
    loading.value = false
  }
}

const fetchCareers = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/careers`)
    const result = await res.json()
    careers.value = Array.isArray(result) ? result : (result.data || [])
  } catch { /* no crítico */ }
}

const fetchCategories = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/categories`)
    const result = await res.json()
    categories.value = Array.isArray(result) ? result : (result.data || [])
  } catch { /* no crítico */ }
}

const loadUserPreferences = async () => {
  try {
    const data = await userService.getPreferences()
    userPreferences.value = data
  } catch { /* no crítico */ }
}

const goToDetail = (id) => router.push(`/estudiante/eventos/${id}`)
const goToProfile = () => router.push('/estudiante/perfil')

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

onMounted(async () => {
  await loadUserPreferences()   // cargar prefs ANTES de eventos para marcar correctamente
  fetchCareers()
  fetchCategories()
  fetchEventos()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@400;500;600;700&display=swap');

.events-feed-page {
  --navy:    #1a3a52;
  --navy2:   #1e4d6b;
  --gold:    #FFD200;
  --ink:     #0f1f2e;
  --slate:   #64748b;
  --muted:   #94a3b8;
  --surface: #ffffff;
  --bg:      #f0f2f5;
  --border:  #e2e8f0;
  --radius:  12px;

  font-family: 'DM Sans', sans-serif;
  background: var(--bg);
  min-height: 100vh;
  padding: 0 0 4rem;
}

/* ── Header ───────── */
.feed-header {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 1.5rem 1.25rem;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 1px 8px rgba(0,0,0,0.07);
  gap: 1rem;
}
.feed-header__left { display: flex; align-items: center; gap: 0.875rem; }
.feed-header__icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, var(--navy), #2e6a8a);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gold);
  flex-shrink: 0;
}

.feed-header__title {
  font-family: 'Fraunces', serif; font-size: 1.35rem; font-weight: 700;
  color: var(--ink); margin: 0 0 0.1rem; line-height: 1.2;
}
.feed-header__sub { font-size: 0.78rem; color: var(--slate); margin: 0; }

/* Indicador de preferencias */
.prefs-indicator {
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.4rem 0.9rem;
  background: linear-gradient(135deg, #fffbeb, #fef9c3);
  border: 1.5px solid #fde68a;
  border-radius: 20px;
  font-size: 0.73rem; font-weight: 700; color: #92400e;
  cursor: pointer; white-space: nowrap; flex-shrink: 0;
  transition: all 0.15s;
}
.prefs-indicator:hover { background: #fef3c7; border-color: #fbbf24; }

/* ── Filtros ─────────────────────────────────────────────────────────────── */
.filters-bar {
  background: var(--surface); border-bottom: 1px solid var(--border);
  padding: 0.875rem 1.5rem; margin-bottom: 1.25rem;
  display: flex; flex-direction: column; gap: 0.6rem;
  position: sticky; top: 73px; z-index: 9;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.filter-search { position: relative; display: flex; align-items: center; }
.filter-search__icon { position: absolute; left: 0.75rem; color: var(--muted); pointer-events: none; }
.filter-search__input {
  width: 100%; padding: 0.58rem 2.4rem 0.58rem 2.4rem;
  border: 1.5px solid var(--border); border-radius: 8px;
  font-size: 0.875rem; font-family: inherit; color: var(--ink);
  background: #f8fafc; outline: none; transition: border-color 0.2s, box-shadow 0.2s;
}
.filter-search__input:focus { border-color: var(--navy); box-shadow: 0 0 0 3px rgba(26,58,82,0.08); background: #fff; }
.filter-clear-btn {
  position: absolute; right: 0.65rem; background: none; border: none; cursor: pointer;
  color: var(--muted); display: flex; align-items: center; padding: 0.25rem; border-radius: 4px; transition: color 0.15s;
}
.filter-clear-btn:hover { color: var(--ink); }
.filter-row { display: flex; gap: 0.55rem; flex-wrap: wrap; align-items: center; }
.filter-select {
  padding: 0.5rem 0.75rem;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  font-size: 0.8rem;
  font-family: inherit;
  color: var(--ink);
  background: #f8fafc;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
  flex: 1;
  min-width: 130px;
}
.filter-select:focus { border-color: var(--navy); }
.filter-select--sort { max-width: 150px; }
.filter-reset-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.9rem;
  border: 1.5px solid #fecdd3;
  border-radius: 8px;
  background: #fff1f2;
  color: #be123c;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}
.filter-reset-btn:hover { background: #ffe4e6; }
.filter-result-info { font-size: 0.78rem; color: var(--slate); padding: 0 0.1rem; }
.filter-result-info--empty { color: #d97706; font-weight: 600; }
.result-recommended-count { color: #92400e; font-weight: 700; }

.filter-result-info {
  font-size: 0.78rem;
  color: var(--slate);
  padding: 0 0.1rem;
}
.section-label--recommended { color: #92400e; }
.section-label--rest { color: var(--muted); }

/* ── Feed ────────────────────────────────────────────────────────────────── */
.feed-list {
  max-width: 680px;
  margin: 0 auto;
  padding: 0 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ── Card ────────── */
.event-card {
  background: var(--surface);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  overflow: hidden;
  animation: cardReveal 0.4s ease both;
  animation-delay: var(--delay, 0s);
  transition: box-shadow 0.2s, transform 0.15s;
  cursor: pointer;
  position: relative;
}
.event-card:hover { box-shadow: 0 6px 22px rgba(26,58,82,0.12); transform: translateY(-1px); }

/* Card recomendada: borde izquierdo dorado */
.event-card--recommended {
  border-left: 3px solid #FFD200;
}

@keyframes cardReveal {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Badge recomendado */
.badge-recommended {
  position: absolute; top: 0.75rem; right: 0.75rem;
  display: inline-flex; align-items: center; gap: 0.28rem;
  padding: 4px 10px 4px 8px;
  background: linear-gradient(135deg, #FFD200 0%, #f59e0b 100%);
  color: #1a3a52;
  font-size: 0.65rem; font-weight: 800;
  text-transform: uppercase; letter-spacing: 0.5px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(245,158,11,0.4);
  white-space: nowrap;
  z-index: 2;
}

/* Header de la card */
.event-card__header {
  display: flex; align-items: flex-start; gap: 0.75rem; padding: 1rem 1.1rem 0.5rem;
}
.author-avatar {
  width: 42px; height: 42px; border-radius: 50%;
  background: linear-gradient(135deg, var(--navy), var(--navy2));
  color: var(--gold); font-size: 0.75rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; letter-spacing: 0.5px;
}
.author-meta { display: flex; flex-direction: column; gap: 0.2rem; min-width: 0; }
.author-name { font-size: 0.875rem; font-weight: 700; color: var(--ink); line-height: 1.2; }
.event-date  { font-size: 0.73rem; color: var(--muted); }
.meta-row    { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
.cat-pill {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #fff;
  padding: 0.2rem 0.6rem;
  border-radius: 50px;
}

/* ── Card Body ──────── */
.event-card__body {
  padding: 0.5rem 1.1rem 0.9rem;
}

/* Body */
.event-card__body { padding: 0.4rem 1.1rem 0.9rem; }
.event-card__title {
  font-family: 'Fraunces', serif; font-size: 1.1rem; font-weight: 700;
  color: var(--ink); margin: 0 0 0.45rem; line-height: 1.3;
  padding-right: 100px; /* espacio para el badge */
}
.event-card__text {
  font-size: 0.9rem;
  color: #374151;
  margin: 0 0 0.7rem;
  line-height: 1.7;
  white-space: pre-line;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.event-meta-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.meta-tag {
  font-size: 0.8rem;
  color: var(--slate);
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

/* ── Card Media ──────────────── */
.event-card__media {
  width: 100%;
  overflow: hidden;
  background: #e8f0f6;
  margin-top: 0.5rem;
}

.event-card__img {
  width: 100%;
  display: block;
  object-fit: cover;
  max-height: 380px;
  transition: transform 0.4s ease;
}

.event-card:hover .event-card__img {
  transform: scale(1.02);
}

/* ── Empty State ───────── */
.empty-state {
  margin: 4rem auto;
  text-align: center;
  max-width: 380px;
  padding: 0 1.5rem;
}

.empty-state__visual {
  width: 88px;
  height: 88px;
  background: #e8f0f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
  color: #7fa8c4;
}

.empty-state h3 {
  font-family: 'Fraunces', serif;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--ink);
  margin: 0 0 0.5rem;
}

.empty-state p {
  font-size: 0.875rem;
  color: var(--slate);
  margin: 0;
  line-height: 1.6;
}

.skeleton-blink {
  animation: pulse 1.5s infinite ease-in-out;
  border: none !important;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
}

/* ── Paginación ────────────────────────────────────────────────── */
.pagination {
  max-width: 680px;
  margin: 2rem auto 0;
  padding: 0 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.pagination__btn {
  min-width: 36px;
  height: 36px;
  padding: 0 0.5rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface);
  color: var(--ink);
  font-size: 0.85rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination__btn:hover:not(:disabled) {
  background: #f8fafc;
  border-color: var(--navy);
  color: var(--navy);
}

.pagination__btn--active {
  background: var(--navy);
  color: var(--gold);
  border-color: var(--navy);
  font-weight: 700;
}

.pagination__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination__ellipsis {
  padding: 0 0.25rem;
  color: var(--muted);
  font-size: 0.85rem;
}

.pagination__info {
  margin-left: 0.75rem;
  font-size: 0.8rem;
  color: var(--slate);
  white-space: nowrap;
}

/* ── Responsive ──────────── */
@media (max-width: 720px) {
  .feed-list { padding: 0; }
  .event-card { border-radius: 0; border-left: none; border-right: none; }
  
  .filters-bar {
    top: 0;
    padding: 0.75rem 1rem;
  }
  
  .filter-row {
    flex-direction: column;
  }
  
  .filter-select {
    width: 100%;
    min-width: 100%;
    max-width: 100%;
  }
  
  .filter-reset-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
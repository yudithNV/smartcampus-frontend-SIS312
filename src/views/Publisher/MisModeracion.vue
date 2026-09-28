<template>
  <div class="mod-page">

    <!-- ── Modal: detalle de noticia con comentario reportado ── -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="newsModal.show" class="news-overlay" @click.self="closeNewsModal">
          <div class="news-modal">
            <div class="news-modal__header">
              <div>
                <span class="news-modal__label">Noticia</span>
                <h2 class="news-modal__title">{{ newsModal.title }}</h2>
              </div>
              <button class="news-modal__close" @click="closeNewsModal" aria-label="Cerrar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div class="news-modal__body" v-if="newsModal.loading">
              <div class="news-modal__spinner"></div>
            </div>

            <div class="news-modal__body" v-else>
              <!-- Imagen -->
              <img v-if="newsModal.coverUrl" :src="newsModal.coverUrl" class="news-modal__img" :alt="newsModal.title" />

              <!-- Cuerpo noticia -->
              <p class="news-modal__text">{{ newsModal.body || 'Sin contenido disponible.' }}</p>

              <!-- Separador -->
              <div class="news-modal__divider"></div>

              <!-- Comentario reportado resaltado -->
              <div class="news-modal__reported-section">
                <div class="reported-header">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                    <line x1="4" y1="22" x2="4" y2="15"/>
                  </svg>
                  Comentario reportado
                </div>
                <div class="reported-comment-box">
                  <!-- Autor del comentario -->
                  <div class="reported-comment-author">
                    <div class="reported-avatar">{{ getInitials(newsModal.commentAuthorName) }}</div>
                    <div class="reported-author-info">
                      <span class="reported-author-name">{{ newsModal.commentAuthorName || 'Usuario desconocido' }}</span>
                      <span class="reported-author-label">Autor del comentario</span>
                    </div>
                  </div>
                  <p class="reported-comment-text">{{ newsModal.commentBody }}</p>

                  <!-- Lista de reportadores con sus motivos -->
                  <div class="reporters-section" v-if="newsModal.reporters && newsModal.reporters.length">
                    <div class="reporters-section__header">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                      Reportado por {{ newsModal.reporters.length }} usuario{{ newsModal.reporters.length !== 1 ? 's' : '' }}:
                    </div>
                    <div class="reporters-list">
                      <div
                        v-for="(rep, i) in newsModal.reporters"
                        :key="i"
                        class="reporter-item"
                      >
                        <div class="reporter-avatar">{{ getInitials(rep.reporterName) }}</div>
                        <div class="reporter-details">
                          <span class="reporter-name">{{ rep.reporterName }}</span>
                          <div class="reporter-reason">
                            <span
                              class="reason-chip"
                              :style="{ background: getReasonColor(rep.reason) + '22', color: getReasonColor(rep.reason), border: '1.5px solid ' + getReasonColor(rep.reason) + '55' }"
                            >
                              {{ getReasonLabel(rep.reason) }}
                            </span>
                            <span v-if="rep.description" class="reporter-desc">"{{ rep.description }}"</span>
                          </div>
                        </div>
                        <span class="reporter-date">{{ formatDate(rep.createdAt) }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Fallback: solo motivos únicos si no hay reporters detallados -->
                  <div class="reported-reasons" v-else-if="newsModal.reasons && newsModal.reasons.length">
                    <span class="reported-reasons__label">Motivos reportados:</span>
                    <div class="reported-reasons__list">
                      <span
                        v-for="(r, i) in newsModal.reasons"
                        :key="i"
                        class="reason-chip"
                        :style="{ background: getReasonColor(r.reason) + '22', color: getReasonColor(r.reason), border: '1.5px solid ' + getReasonColor(r.reason) + '55' }"
                      >
                        {{ getReasonLabel(r.reason) }}
                        <span v-if="r.description" class="reason-chip__desc">"{{ r.description }}"</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="news-modal__footer">
              <span class="news-modal__total">
                {{ newsModal.totalReports }} reporte{{ newsModal.totalReports !== 1 ? 's' : '' }} en total
              </span>
              <button class="news-modal__close-btn" @click="closeNewsModal">Cerrar</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ── Modal eliminar ── -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="deleteModal.show" class="del-overlay" @click.self="deleteModal.show = false">
          <div class="del-modal">
            <div class="del-modal__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.8" stroke-linecap="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
              </svg>
            </div>
            <h3>¿Eliminar comentario?</h3>
            <blockquote class="del-modal__quote">{{ deleteModal.commentBody }}</blockquote>
            <p class="del-modal__warn">Esta acción no se puede deshacer.</p>
            <div class="del-modal__actions">
              <button class="del-btn-cancel" @click="deleteModal.show = false" :disabled="deleteModal.loading">Cancelar</button>
              <button class="del-btn-confirm" @click="confirmDeleteComment" :disabled="deleteModal.loading">
                <span v-if="deleteModal.loading" class="spinner"></span>
                <template v-else>Eliminar definitivamente</template>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Header -->
    <div class="mod-header">
      <div class="mod-header__left">
        <div class="mod-header__icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div>
          <h1 class="mod-header__title">Mis Moderaciones</h1>
          <p class="mod-header__sub">Comentarios reportados en tus noticias</p>
        </div>
      </div>
      <span v-if="pendingCount > 0" class="mod-badge">
        {{ pendingCount }} pendiente{{ pendingCount !== 1 ? 's' : '' }}
      </span>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <span>{{ summary.pending ?? pendingCount }}</span>
        <small>Pendientes</small>
      </div>
      <div class="stat-card">
        <span>{{ summary.hidden ?? hiddenCount }}</span>
        <small>Ocultados</small>
      </div>
    </div>

    <!-- Filtros -->
    <div class="mod-filters">
      <div class="filter-tabs">
        <button
          v-for="tab in STATUS_TABS"
          :key="tab.value"
          class="filter-tab"
          :class="{ active: activeStatus === tab.value }"
          @click="setStatus(tab.value)"
        >
          {{ tab.label }}
          <span v-if="tab.value === 'PENDIENTE' && pendingCount > 0" class="tab-count">
            {{ pendingCount }}
          </span>
        </button>
      </div>
      <div class="filter-search">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input v-model="searchTitle" type="text" placeholder="Buscar por título de noticia..." class="filter-search-input" />
        <button v-if="searchTitle" @click="searchTitle = ''" class="filter-clear">×</button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="mod-list">
      <div v-for="n in 3" :key="n" class="mod-card mod-card--skeleton">
        <div class="skeleton-line" style="width:55%;height:13px;"></div>
        <div class="skeleton-line" style="width:85%;height:11px;margin-top:10px;"></div>
        <div class="skeleton-line" style="width:40%;height:11px;margin-top:7px;"></div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="filteredGroups.length === 0" class="mod-empty">
      <div class="mod-empty__icon">
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      </div>
      <h3>¡Todo está en orden!</h3>
      <p>No hay comentarios reportados{{ activeStatus ? ' en este estado' : '' }} en tus noticias.</p>
    </div>

    <!-- Lista de grupos -->
    <div v-else class="mod-list">
      <TransitionGroup name="mod-list-anim">
        <article
          v-for="(group, i) in filteredGroups"
          :key="group.commentId"
          class="mod-card"
          :class="{ 'mod-card--alert': group.totalReportsForComment >= 5 }"
          :style="{ '--delay': i * 0.05 + 's' }"
        >
          <!-- Fila superior -->
          <div class="mod-card__top">
            <div class="mod-card__news-container">
              <div class="news-info">
                <span class="mod-card__news" :title="group.newsTitle">{{ group.newsTitle }}</span>
                <span class="news-label">Noticia con comentario reportado</span>
              </div>
              <button class="btn-view-news" @click="openNewsModal(group)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                Ver detalle
              </button>
            </div>

            <div class="mod-card__count-wrap">
              <span
                class="mod-card__count"
                :class="{ 'mod-card__count--alert': group.totalReportsForComment >= 5 }"
              >
                {{ group.totalReportsForComment }}
                reporte{{ group.totalReportsForComment !== 1 ? 's' : '' }}
              </span>
              <span v-if="group.totalReportsForComment >= 5" class="auto-hidden-label">
                ⚠ Oculto automáticamente
              </span>
            </div>
          </div>

          <!-- Cuerpo: comentario + motivos -->
          <div class="mod-card__comment">
            <div class="mod-card__avatar">{{ getInitials(group.commentAuthorName || group.reporterName) }}</div>
            <div class="mod-card__body">
              <div class="comment-box">
                <div class="comment-box__header">
                  Comentario reportado
                  <span v-if="group.commentAuthorName" class="comment-box__author">
                    — por <strong>{{ group.commentAuthorName }}</strong>
                  </span>
                </div>
                <p class="comment-box__text">{{ group.commentBody }}</p>
              </div>

              <!-- Lista de motivos únicos -->
              <div class="reason-list" v-if="group.reasons && group.reasons.length">
                <span class="reason-list__label">Motivos:</span>
                <div class="reason-list__chips">
                  <span
                    v-for="(r, idx) in group.reasons"
                    :key="idx"
                    class="reason-badge"
                    :style="{ background: getReasonColor(r.reason) }"
                    :title="r.description || ''"
                  >
                    {{ getReasonLabel(r.reason) }}
                    <span v-if="r.description" class="reason-badge__desc"> — "{{ r.description }}"</span>
                  </span>
                </div>
              </div>

              <div class="mod-card__meta">
                <span>Último reporte por <strong>{{ group.reporterName }}</strong></span>
                <span class="mod-card__dot">·</span>
                <span>{{ formatDate(group.createdAt) }}</span>
              </div>
            </div>
          </div>

          <!-- Estado actual si no es PENDIENTE -->
          <div v-if="group.status !== 'PENDIENTE'" class="mod-card__status-bar" :class="`mod-card__status-bar--${group.status.toLowerCase()}`">
            <span>Estado actual: <strong>{{ STATUS_LABELS[group.status] || group.status }}</strong></span>
          </div>

          <!-- Acciones -->
          <div class="mod-card__actions">
            <button
              class="mod-action-btn mod-action-btn--ignore"
              :disabled="processingId === group.latestReportId || group.status === 'ELIMINADO'"
              @click="processReport(group.latestReportId, 'IGNORADO', group)"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
              </svg>
              Ignorar
            </button>

            <button
              class="mod-action-btn mod-action-btn--hide"
              :disabled="processingId === group.latestReportId || group.status === 'ELIMINADO'"
              @click="processReport(group.latestReportId, 'OCULTO', group)"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
              Ocultar
            </button>

            <button
              class="mod-action-btn mod-action-btn--delete"
              :disabled="processingId === group.latestReportId || group.status === 'ELIMINADO'"
              @click="askDeleteComment(group)"
            >
              <span v-if="processingId === group.latestReportId" class="spinner"></span>
              <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14H6L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4h6v2"/>
              </svg>
              {{ group.status === 'ELIMINADO' ? 'Eliminado' : 'Eliminar comentario' }}
            </button>
          </div>
        </article>
      </TransitionGroup>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toastMsg" class="mod-toast" :class="`mod-toast--${toastType}`">
        {{ toastMsg }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { moderationService } from '../../services/api.js'

// ── State ──────────────────────────────────────────────────────────────────────
const groups       = ref([])   // Datos ya agrupados que vienen del backend
const loading      = ref(true)
const processingId = ref(null)
const toastMsg     = ref('')
const toastType    = ref('success')
const searchTitle  = ref('')
const activeStatus = ref('PENDIENTE')
const summary      = ref({})
let   pollTimer    = null

const STATUS_TABS = [
  { value: 'PENDIENTE', label: 'Pendientes' },
  { value: 'IGNORADO',  label: 'Ignorados'  },
  { value: 'OCULTO',    label: 'Ocultos'    },
  { value: '',          label: 'Todos'      },
]

const STATUS_LABELS = {
  PENDIENTE: 'Pendiente',
  IGNORADO:  'Ignorado',
  OCULTO:    'Oculto',
  ELIMINADO: 'Eliminado',
}

const REASON_MAP = {
  LENGUAJE_OFENSIVO: { label: 'Lenguaje ofensivo', color: '#dc2626' },
  ACOSO:             { label: 'Acoso',              color: '#9333ea' },
  SPAM:              { label: 'Spam',               color: '#0891b2' },
  DESINFORMACION:    { label: 'Desinformación',     color: '#d97706' },
  OTRO:              { label: 'Otro',               color: '#64748b' },
}

// ── Computed ───────────────────────────────────────────────────────────────────
const pendingCount = computed(() =>
  groups.value.filter(g => g.status === 'PENDIENTE').length
)
const hiddenCount  = computed(() =>
  groups.value.filter(g => g.status === 'OCULTO').length
)
const deletedCount = computed(() =>
  groups.value.filter(g => g.status === 'ELIMINADO').length
)

const filteredGroups = computed(() => {
  let list = groups.value

  // BUG FIX: los comentarios auto-ocultados llegan con status OCULTO desde el backend
  // El filtro los muestra en la pestaña correcta sin manipulación extra
  if (activeStatus.value) {
    list = list.filter(g => g.status === activeStatus.value)
  }

  if (searchTitle.value.trim()) {
    const q = searchTitle.value.toLowerCase()
    list = list.filter(g => g.newsTitle?.toLowerCase().includes(q))
  }

  return list
})

// ── Helpers ────────────────────────────────────────────────────────────────────
function getReasonLabel(r) { return REASON_MAP[r]?.label ?? r }
function getReasonColor(r) { return REASON_MAP[r]?.color ?? '#64748b' }

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleString('es-BO', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  })
}

function setStatus(val) { activeStatus.value = val }

// ── Fetch ──────────────────────────────────────────────────────────────────────
async function fetchReports() {
  loading.value = true
  try {
    // El backend devuelve PublisherCommentReportGroupDTO[] ya agrupados
    const res = await moderationService.getPublisherReports()
    // Normalizar: puede venir como array directo o dentro de .data
    const raw = Array.isArray(res) ? res : (res?.data ?? [])

    // BUG FIX: el DTO agrupa por comentario, cada item tiene latestReportId (no id)
    // Asegurar que status de auto-ocultados sea OCULTO correctamente
    groups.value = raw.map(g => ({
      ...g,
      // Garantizar que latestReportId siempre esté definido para evitar
      // el 400: PATCH /api/moderation/reports/undefined
      latestReportId: g.latestReportId ?? g.id ?? null,
      reasons:        g.reasons        ?? [],
    }))
  } catch {
    showToast('error', 'No se pudieron cargar los reportes.')
  } finally {
    loading.value = false
  }
}

// Polling liviano para el badge (no recarga toda la lista)
async function fetchSummary() {
  try {
    const res = await moderationService.getPublisherReportsSummary?.()
    if (res) summary.value = res?.data ?? res
  } catch { /* silencioso */ }
}

// ── Procesar reporte (ignorar / ocultar) ──────────────────────────────────────
async function processReport(reportId, action, group) {
  // BUG FIX: evitar llamada con undefined → 400 Bad Request
  if (!reportId) {
    showToast('error', 'No se pudo identificar el reporte. Recarga la página.')
    return
  }
  if (processingId.value === reportId) return

  processingId.value = reportId
  try {
    await moderationService.processReport(reportId, action)

    // Actualizar estado local del grupo
    const idx = groups.value.findIndex(g => g.commentId === deleteModal.commentId)
      if (idx !== -1) {
        groups.value.splice(idx, 1)  // ← eliminar del array en vez de marcar ELIMINADO
      }

    // Si ignoramos un auto-ocultado (5+), pasarlo a IGNORADO
    const msg = {
      IGNORADO: 'Reporte ignorado. El comentario vuelve a ser visible.',
      OCULTO:   'Comentario ocultado correctamente.',
    }[action] ?? 'Acción aplicada.'
    showToast('success', msg)

    // Si el filtro activo ya no incluye el nuevo estado, el item desaparecerá del listado
    // (esto es correcto: el usuario lo verá en la pestaña correspondiente)
  } catch (err) {
    showToast('error', 'No se pudo procesar el reporte.')
  } finally {
    processingId.value = null
  }
}

// ── Eliminar comentario ────────────────────────────────────────────────────────
const deleteModal = reactive({
  show:           false,
  commentId:      null,
  latestReportId: null,
  commentBody:    '',
  loading:        false,
})

function askDeleteComment(group) {
  Object.assign(deleteModal, {
    show:           true,
    commentId:      group.commentId,
    latestReportId: group.latestReportId,
    commentBody:    group.commentBody,
    loading:        false,
  })
}

async function confirmDeleteComment() {
  deleteModal.loading = true
  processingId.value  = deleteModal.latestReportId
  try {
    // Llama al endpoint que elimina físicamente el comentario
    await moderationService.deletePublisherComment(deleteModal.commentId)

    // BUG FIX (PA): marcar como ELIMINADO en el estado local, no remover,
    // para que aparezca en la pestaña "Eliminados"
    const idx = groups.value.findIndex(g => g.commentId === deleteModal.commentId)
    if (idx !== -1) {
      groups.value[idx] = { ...groups.value[idx], status: 'ELIMINADO' }
    }

    deleteModal.show = false
    showToast('success', 'Comentario eliminado permanentemente.')

    // Cambiar a pestaña Eliminados para que el usuario vea el resultado
  } catch {
    showToast('error', 'No se pudo eliminar el comentario.')
  } finally {
    deleteModal.loading = false
    processingId.value  = null
  }
}

// ── Modal de noticia ───────────────────────────────────────────────────────────
const newsModal = reactive({
  show:              false,
  loading:           false,
  newsId:            null,
  title:             '',
  body:              '',
  coverUrl:          '',
  commentBody:       '',
  commentAuthorName: '',   // BUG FIX: autor del comentario (no del reporte)
  totalReports:      0,
  reasons:           [],
  reporters:         [],   // BUG FIX: lista de reportadores individuales con motivos
})

async function openNewsModal(group) {
  newsModal.show              = true
  newsModal.loading           = true
  newsModal.title             = group.newsTitle
  newsModal.newsId            = group.newsId
  newsModal.commentBody       = group.commentBody
  // BUG FIX: commentAuthorName es el autor del comentario, no el reportador
  // El backend puede devolver commentAuthorName; si no, mostramos lo disponible
  newsModal.commentAuthorName = group.commentAuthorName || group.commentBody?.split(' ')[0] || 'Autor'
  newsModal.totalReports      = group.totalReportsForComment
  newsModal.reasons           = group.reasons ?? []
  newsModal.reporters         = group.reporters ?? []
  newsModal.body              = ''
  newsModal.coverUrl          = ''

  try {
    const API_BASE = import.meta.env.VITE_API_URL || ''
    const token    = localStorage.getItem('ucb_token')

    // Fetch noticia (cuerpo + imagen)
    const newsRes = await fetch(`${API_BASE}/api/news/${group.newsId}`, {
      headers: { Authorization: `Bearer ${token}` },
      mode: 'cors'
    })
    if (newsRes.ok) {
      const json = await newsRes.json()
      const data = json.data ?? json
      newsModal.body              = data.body              || data.content || ''
      newsModal.coverUrl          = data.coverUrl          || data.imageUrl || ''
      // Si el backend devuelve el autor del comentario en la noticia
      newsModal.commentAuthorName = group.commentAuthorName || data.commentAuthorName || 'Autor del comentario'
    }

    // BUG FIX: Fetch detalle de reportes del comentario para obtener reportadores individuales
    // Endpoint: GET /api/publisher/comments/{commentId}/reports
    if (group.commentId) {
      try {
        const repRes = await fetch(`${API_BASE}/api/publisher/comments/${group.commentId}/reports`, {
          headers: { Authorization: `Bearer ${token}` },
          mode: 'cors'
        })
        if (repRes.ok) {
          const repJson = await repRes.json()
          const repData = repJson.data ?? repJson
          if (Array.isArray(repData) && repData.length > 0) {
            newsModal.reporters = repData.map(r => ({
              reporterName: r.reporterName || r.reporter?.username || 'Usuario',
              reason:       r.reason,
              description:  r.description,
              createdAt:    r.createdAt,
            }))
            // También actualizar el nombre del autor si viene en los datos
            if (repData[0]?.commentAuthorName) {
              newsModal.commentAuthorName = repData[0].commentAuthorName
            }
          }
        }
      } catch { /* si falla, usamos los datos del grupo */ }
    }
  } catch { /* muestra lo que ya tenemos del grupo */ }
  finally  { newsModal.loading = false }
}

function closeNewsModal() {
  newsModal.show    = false
  newsModal.loading = false
}

// ── Toast ──────────────────────────────────────────────────────────────────────
function showToast(type, msg) {
  toastType.value = type
  toastMsg.value  = msg
  setTimeout(() => { toastMsg.value = '' }, 4000)
}

// ── Lifecycle ──────────────────────────────────────────────────────────────────
onMounted(() => {
  fetchReports()
  fetchSummary()
  pollTimer = setInterval(fetchSummary, 30_000)
})

onUnmounted(() => clearInterval(pollTimer))
</script>

<style scoped>
/* ─── Layout base ─────────────────────────────────────── */
.mod-page {
  padding: 1.5rem 1rem 4rem;
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

/* ─── Header ──────────────────────────────────────────── */
.mod-header {
  max-width: 760px;
  margin: 0 auto 1.5rem;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.mod-header__left { display: flex; align-items: center; gap: 0.85rem; }
.mod-header__icon {
  width: 42px; height: 42px;
  background: #1a3a52; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  color: #FFD200; flex-shrink: 0;
}
.mod-header__title { font-size: 1.2rem; font-weight: 700; color: #0f172a; margin: 0 0 2px; }
.mod-header__sub   { font-size: 0.8rem; color: #64748b; margin: 0; }
.mod-badge {
  background: #fef2f2; border: 1.5px solid #fecdd3;
  color: #be123c; font-size: 0.75rem; font-weight: 700;
  padding: 0.3rem 0.75rem; border-radius: 20px; white-space: nowrap; flex-shrink: 0;
}

/* ─── Stats ───────────────────────────────────────────── */
.stats-grid {
  max-width: 760px; margin: 0 auto 1rem; padding: 0 1rem;
  display: grid; grid-template-columns: repeat(2,1fr); gap: .75rem;
}
.stat-card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem; text-align: center; }
.stat-card span { display: block; font-size: 1.6rem; font-weight: 700; color: #1a3a52; }
.stat-card small { color: #64748b; }

/* ─── Filtros ─────────────────────────────────────────── */
.mod-filters {
  max-width: 760px; margin: 0 auto 1rem; padding: 0 1rem;
  display: flex; flex-direction: column; gap: 0.65rem;
}
.filter-tabs { display: flex; gap: 0.4rem; flex-wrap: wrap; }
.filter-tab {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.4rem 0.9rem; border: 1.5px solid #e2e8f0; border-radius: 20px;
  background: #fff; font-size: 0.78rem; font-weight: 600; font-family: inherit;
  cursor: pointer; color: #64748b; transition: all 0.15s;
}
.filter-tab:hover { border-color: #1a3a52; color: #1a3a52; }
.filter-tab.active { background: #1a3a52; border-color: #1a3a52; color: #FFD200; }
.tab-count {
  background: #ef4444; color: #fff; font-size: 0.6rem; font-weight: 700;
  min-width: 16px; height: 16px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; padding: 0 3px;
}
.filter-tab.active .tab-count { background: #FFD200; color: #1a3a52; }
.filter-search { position: relative; display: flex; align-items: center; }
.filter-search > svg { position: absolute; left: 0.75rem; color: #94a3b8; pointer-events: none; }
.filter-search-input {
  width: 100%; padding: 0.55rem 2.4rem 0.55rem 2.2rem;
  border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 0.82rem;
  font-family: inherit; outline: none; background: #fff; color: #0f172a;
  transition: border-color 0.18s;
}
.filter-search-input:focus { border-color: #1a3a52; }
.filter-clear { position: absolute; right: 0.65rem; background: none; border: none; cursor: pointer; color: #94a3b8; font-size: 1.1rem; }

/* ─── Lista ───────────────────────────────────────────── */
.mod-list { max-width: 760px; margin: 0 auto; padding: 0 1rem; display: flex; flex-direction: column; gap: 0.75rem; }

/* ─── Card ────────────────────────────────────────────── */
.mod-card {
  background: #fff; border: 1.5px solid #e2e8f0; border-radius: 12px;
  padding: 1rem 1.1rem; display: flex; flex-direction: column; gap: 0.85rem;
  animation: card-in 0.35s cubic-bezier(0.22,1,0.36,1) both;
  animation-delay: var(--delay, 0s);
  box-shadow: 0 2px 8px rgba(0,0,0,.04), 0 12px 24px rgba(0,0,0,.04);
  transition: box-shadow 0.18s, transform 0.18s;
}
.mod-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.07); transform: translateY(-2px); }
.mod-card--alert { border-color: #fecdd3; background: #fffafa; }
@keyframes card-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ─── Fila superior ───────────────────────────────────── */
.mod-card__top { display: flex; align-items: flex-start; gap: 0.55rem; flex-wrap: wrap; justify-content: space-between; }
.mod-card__news-container { flex: 1; display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
.news-info { display: flex; flex-direction: column; }
.mod-card__news { font-size: 0.8rem; font-weight: 600; color: #1a3a52; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 280px; }
.news-label { font-size: .72rem; color: #64748b; }
.mod-card__count-wrap { display: flex; flex-direction: column; align-items: flex-end; gap: 0.15rem; flex-shrink: 0; }
.mod-card__count { font-size: 0.73rem; font-weight: 600; color: #64748b; white-space: nowrap; }
.mod-card__count--alert { color: #dc2626; font-weight: 700; }
.auto-hidden-label {
  font-size: 0.65rem; font-weight: 700; color: #dc2626;
  background: #fff1f2; border: 1px solid #fecdd3;
  padding: 2px 7px; border-radius: 4px; white-space: nowrap;
}

/* ─── Botón ver noticia ───────────────────────────────── */
.btn-view-news {
  text-decoration: none; display: flex; align-items: center; gap: .4rem;
  padding: .55rem .9rem; border-radius: 8px; background: #eff6ff;
  color: #2563eb; font-size: .78rem; font-weight: 600;
  border: none; cursor: pointer; font-family: inherit; transition: .2s;
}
.btn-view-news:hover { background: #dbeafe; transform: translateY(-1px); }

/* ─── Cuerpo comentario ───────────────────────────────── */
.mod-card__comment { display: flex; gap: 0.75rem; align-items: flex-start; }
.mod-card__avatar {
  width: 34px; height: 34px; border-radius: 50%;
  background: linear-gradient(135deg,#1a3a52,#2d5a7b);
  color: #FFD200; font-size: 0.7rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.mod-card__body { flex: 1; min-width: 0; }
.comment-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem; }
.comment-box__header { font-size: .72rem; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: .6rem; }
.comment-box__author { text-transform: none; font-weight: 400; color: #94a3b8; }
.comment-box__author strong { color: #475569; }
.comment-box__text { margin: 0; color: #0f172a; line-height: 1.6; }

/* ─── Lista motivos ───────────────────────────────────── */
.reason-list { margin-top: 0.65rem; display: flex; flex-direction: column; gap: 0.35rem; }
.reason-list__label { font-size: 0.72rem; font-weight: 600; color: #64748b; text-transform: uppercase; }
.reason-list__chips { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-top: 0.2rem; }
.reason-badge {
  color: #fff; font-size: 0.68rem; font-weight: 700;
  padding: 0.22rem 0.6rem; border-radius: 20px; display: flex; align-items: center; gap: 0.3rem;
}
.reason-badge__desc { font-weight: 400; font-style: italic; opacity: 0.9; }

.mod-card__meta {
  display: flex; align-items: center; gap: 0.3rem;
  font-size: 0.75rem; color: #64748b; flex-wrap: wrap; margin-top: 0.5rem;
}
.mod-card__meta strong { color: #334155; }
.mod-card__dot { color: #cbd5e1; }

/* ─── Status bar ──────────────────────────────────────── */
.mod-card__status-bar {
  padding: 0.4rem 0.75rem; border-radius: 6px; font-size: 0.75rem; color: #334155;
}
.mod-card__status-bar--oculto    { background: #fffbeb; border: 1px solid #fde68a; color: #92400e; }
.mod-card__status-bar--ignorado  { background: #f8fafc; border: 1px solid #e2e8f0; color: #64748b; }
.mod-card__status-bar--eliminado { background: #fff1f2; border: 1px solid #fecdd3; color: #be123c; }

/* ─── Acciones ────────────────────────────────────────── */
.mod-card__actions {
  display: flex; gap: 0.5rem; flex-wrap: wrap;
  padding-top: 0.1rem; border-top: 1px solid #f1f5f9;
}
.mod-action-btn {
  display: inline-flex; align-items: center; gap: 0.35rem;
  padding: 0.42rem 0.85rem; border-radius: 7px; font-size: 0.78rem;
  font-weight: 600; font-family: inherit; cursor: pointer;
  border: 1.5px solid transparent; transition: all 0.15s;
}
.mod-action-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.mod-action-btn--ignore { background: #f8fafc; border-color: #e2e8f0; color: #64748b; }
.mod-action-btn--ignore:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; color: #334155; }
.mod-action-btn--hide { background: #fffbeb; border-color: #fde68a; color: #92400e; }
.mod-action-btn--hide:hover:not(:disabled) { background: #fef3c7; border-color: #fbbf24; }
.mod-action-btn--delete { background: #fff1f2; border-color: #fecdd3; color: #be123c; }
.mod-action-btn--delete:hover:not(:disabled) { background: #ffe4e6; border-color: #fda4af; }

/* ─── Skeleton ────────────────────────────────────────── */
.mod-card--skeleton { pointer-events: none; }
.skeleton-line {
  background: linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%);
  background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 4px;
}
@keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }

/* ─── Empty ───────────────────────────────────────────── */
.mod-empty { max-width: 760px; margin: 3rem auto 0; padding: 0 1rem; text-align: center; }
.mod-empty__icon {
  width: 72px; height: 72px; background: #f0fdf4; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; color: #16a34a;
}
.mod-empty h3 { font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0 0 0.4rem; }
.mod-empty p  { font-size: 0.85rem; color: #64748b; margin: 0; }

/* ─── Toast ───────────────────────────────────────────── */
.mod-toast {
  position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
  padding: 0.8rem 1.3rem; border-radius: 10px; font-size: 0.85rem;
  font-weight: 600; box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  z-index: 1500; white-space: nowrap; pointer-events: none;
}
.mod-toast--success { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #15803d; }
.mod-toast--error   { background: #fff1f2; border: 1.5px solid #fecdd3; color: #be123c; }
.toast-enter-active { transition: all 0.3s cubic-bezier(0.34,1.5,0.64,1); }
.toast-leave-active { transition: all 0.2s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(16px); }

/* ─── Transición lista ────────────────────────────────── */
.mod-list-anim-enter-active { transition: all 0.3s cubic-bezier(0.22,1,0.36,1); }
.mod-list-anim-leave-active { transition: all 0.2s ease; }
.mod-list-anim-enter-from, .mod-list-anim-leave-to { opacity: 0; transform: translateY(8px); }

/* ─── Modal eliminar ──────────────────────────────────── */
.del-overlay {
  position: fixed; inset: 0; z-index: 2000;
  background: rgba(15,23,42,0.55); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; padding: 1rem;
}
.del-modal {
  background: #fff; border-radius: 16px; padding: 2rem 1.75rem;
  max-width: 380px; width: 100%; text-align: center;
  box-shadow: 0 24px 64px rgba(0,0,0,0.2);
}
.del-modal__icon { width: 60px; height: 60px; background: #fff1f2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; }
.del-modal h3 { font-size: 1.05rem; font-weight: 700; color: #0f172a; margin: 0 0 0.75rem; }
.del-modal__quote {
  background: #f8fafc; border-left: 3px solid #e2e8f0; border-radius: 0 8px 8px 0;
  padding: 0.55rem 0.85rem; font-size: 0.83rem; color: #374151;
  margin: 0 0 0.75rem; text-align: left;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}
.del-modal__warn { font-size: 0.78rem; color: #dc2626; font-weight: 600; margin: 0 0 1.5rem; }
.del-modal__actions { display: flex; gap: 0.65rem; }
.del-btn-cancel {
  flex: 1; padding: 0.65rem; border: 1.5px solid #e2e8f0;
  border-radius: 8px; background: #f8fafc; color: #64748b;
  font-size: 0.84rem; font-weight: 600; cursor: pointer; font-family: inherit;
}
.del-btn-cancel:hover:not(:disabled) { background: #f1f5f9; }
.del-btn-confirm {
  flex: 1.5; padding: 0.65rem; border: none; border-radius: 8px;
  background: #dc2626; color: #fff; font-size: 0.84rem; font-weight: 700;
  cursor: pointer; font-family: inherit;
  display: flex; align-items: center; justify-content: center;
}
.del-btn-confirm:hover:not(:disabled) { background: #b91c1c; }
.del-btn-confirm:disabled, .del-btn-cancel:disabled { opacity: 0.5; cursor: not-allowed; }

/* ─── Modal de noticia ────────────────────────────────── */
.news-overlay {
  position: fixed; inset: 0; z-index: 2100;
  background: rgba(15,23,42,0.6); backdrop-filter: blur(5px);
  display: flex; align-items: center; justify-content: center; padding: 1rem;
  overflow-y: auto;
}
.news-modal {
  background: #fff; border-radius: 18px; width: 100%; max-width: 600px;
  box-shadow: 0 32px 80px rgba(0,0,0,0.22);
  display: flex; flex-direction: column; max-height: 90vh;
  animation: modal-pop 0.28s cubic-bezier(0.34,1.5,0.64,1);
}
@keyframes modal-pop {
  from { opacity: 0; transform: scale(0.92) translateY(16px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
.news-modal__header {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 1rem; padding: 1.4rem 1.5rem 0;
}
.news-modal__label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #64748b; display: block; margin-bottom: 0.25rem; }
.news-modal__title { font-size: 1.1rem; font-weight: 700; color: #0f172a; margin: 0; line-height: 1.35; }
.news-modal__close {
  background: #f1f5f9; border: none; border-radius: 8px; cursor: pointer;
  width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
  color: #64748b; flex-shrink: 0; transition: background 0.15s;
}
.news-modal__close:hover { background: #e2e8f0; color: #1e293b; }
.news-modal__body {
  flex: 1; overflow-y: auto; padding: 1.2rem 1.5rem;
  display: flex; flex-direction: column; gap: 1rem;
}
.news-modal__spinner {
  width: 32px; height: 32px; border: 3px solid #e2e8f0; border-top-color: #1a3a52;
  border-radius: 50%; animation: spin 0.65s linear infinite; margin: 2rem auto;
}
@keyframes spin { to { transform: rotate(360deg); } }
.news-modal__img { width: 100%; max-height: 280px; object-fit: cover; border-radius: 10px; }
.news-modal__text { font-size: 0.9rem; line-height: 1.7; color: #374151; margin: 0; white-space: pre-line; }
.news-modal__divider { height: 1px; background: #f1f5f9; }

/* Sección comentario reportado en modal */
.news-modal__reported-section { display: flex; flex-direction: column; gap: 0.65rem; }
.reported-header {
  display: flex; align-items: center; gap: 0.5rem;
  font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #be123c;
}
.reported-comment-box {
  background: #fff1f2; border: 1.5px solid #fecdd3; border-left: 4px solid #ef4444;
  border-radius: 0 10px 10px 0; padding: 1rem;
  display: flex; flex-direction: column; gap: 0.75rem;
}
.reported-comment-author { display: flex; align-items: center; gap: 0.6rem; }
.reported-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: #1a3a52; color: #FFD200;
  font-size: 0.65rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.reported-author-info { display: flex; flex-direction: column; }
.reported-author-name { font-size: 0.85rem; font-weight: 700; color: #0f172a; }
.reported-author-label { font-size: 0.7rem; color: #64748b; }
.reported-comment-text { margin: 0; font-size: 0.875rem; color: #1e293b; line-height: 1.6; }

/* Lista de reportadores individuales */
.reporters-section {
  padding-top: 0.65rem; border-top: 1px solid #fecdd3;
  display: flex; flex-direction: column; gap: 0.5rem;
}
.reporters-section__header {
  display: flex; align-items: center; gap: 0.45rem;
  font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; color: #64748b;
}
.reporters-list { display: flex; flex-direction: column; gap: 0.5rem; }
.reporter-item {
  display: flex; align-items: center; gap: 0.65rem;
  padding: 0.55rem 0.75rem; background: rgba(255,255,255,0.7); border-radius: 8px;
  border: 1px solid #fecdd3;
}
.reporter-avatar {
  width: 28px; height: 28px; border-radius: 50%;
  background: #e2e8f0; color: #475569;
  font-size: 0.6rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.reporter-details { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.25rem; }
.reporter-name { font-size: 0.8rem; font-weight: 600; color: #1e293b; }
.reporter-reason { display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }
.reporter-desc { font-size: 0.72rem; color: #64748b; font-style: italic; }
.reporter-date { font-size: 0.68rem; color: #94a3b8; white-space: nowrap; flex-shrink: 0; }

/* Chips en modal */
.reported-reasons { display: flex; flex-direction: column; gap: 0.35rem; padding-top: 0.5rem; border-top: 1px solid #fecdd3; }
.reported-reasons__label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: #64748b; }
.reported-reasons__list { display: flex; gap: 0.4rem; flex-wrap: wrap; }
.reason-chip {
  font-size: 0.72rem; font-weight: 700;
  padding: 0.25rem 0.7rem; border-radius: 20px;
  display: flex; align-items: center; gap: 0.35rem;
}
.reason-chip__desc { font-weight: 400; font-style: italic; opacity: 0.85; }

.news-modal__footer {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem 1.5rem; border-top: 1px solid #f1f5f9; flex-shrink: 0;
}
.news-modal__total { font-size: 0.78rem; color: #64748b; font-weight: 600; }
.news-modal__close-btn {
  padding: 0.55rem 1.2rem; background: #1a3a52; color: #FFD200;
  border: none; border-radius: 8px; font-size: 0.84rem; font-weight: 600;
  cursor: pointer; font-family: inherit; transition: background 0.15s;
}
.news-modal__close-btn:hover { background: #0f2438; }

/* Transitions */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.22s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

/* Spinner */
.spinner {
  width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff; border-radius: 50%;
  animation: spin 0.65s linear infinite; display: inline-block;
}
</style>
<template>
  <div class="profile-page">

    <!-- ── CARD PRINCIPAL ─────────────────────────────────────────────────── -->
    <div class="profile-card">

      <!-- Avatar + nombre — siempre visible -->
      <div class="profile-hero">
        <div
          class="avatar"
          :class="{ 'avatar--has-img': displayAvatarUrl }"
          @click="showAvatarModal = true"
          title="Cambiar foto de perfil"
          style="cursor:pointer; position:relative;"
        >
          <img v-if="displayAvatarUrl" :src="displayAvatarUrl" alt="Avatar" class="avatar-img" @error="onAvatarError" />
          <span v-else class="avatar-initials">{{ initials }}</span>
          <!-- Overlay de edición -->
          <div class="avatar-edit-overlay">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
        </div>
        <div class="profile-hero__info">
          <h2 class="profile-name">{{ profile.fullName || 'Estudiante' }}</h2>
          <p class="profile-email">{{ profile.email }}</p>
          <span class="profile-badge">{{ roleLabel }}</span>
        </div>
      </div>

      <div class="profile-divider"></div>

      <!-- ════════════════════════════════════════════════════════════════
           MODO VISTA — solo lectura
           ════════════════════════════════════════════════════════════════ -->
      <div v-if="!editMode" class="profile-view">

        <div class="form-section">
          <h3 class="form-section__title">Datos personales</h3>
          <div class="form-grid">
            <div class="view-field view-field--full">
              <span class="view-label">Nombre completo</span>
              <span class="view-value">{{ profile.fullName || '—' }}</span>
            </div>
            <div class="view-field">
              <span class="view-label">Teléfono de contacto</span>
              <span class="view-value">{{ profile.phone || '—' }}</span>
            </div>
            <div class="view-field">
              <span class="view-label">
                Carrera
                <span class="view-label__hint">— asignada por administración</span>
              </span>
              <span class="view-value">{{ careerName }}</span>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3 class="form-section__title">Sobre mí</h3>
          <div class="view-field">
            <span class="view-label">Biografía / descripción corta</span>
            <span class="view-value view-value--bio">{{ profile.bio || '—' }}</span>
          </div>
        </div>

        <!-- ── VISTA: Mis preferencias ── -->
        <div class="form-section">
          <h3 class="form-section__title">
            Mis preferencias de eventos
            <span v-if="preferences.eventTypes?.length || preferences.categoryIds?.length" class="prefs-count-badge">
              {{ (preferences.eventTypes?.length || 0) + (preferences.categoryIds?.length || 0) }} seleccionadas
            </span>
          </h3>

          <template v-if="preferences.eventTypes?.length || preferences.categoryIds?.length">
            <div v-if="preferences.eventTypes?.length" class="prefs-view-group">
              <span class="prefs-group-label">Tipos de evento</span>
              <div class="prefs-chips">
                <span
                  v-for="t in preferences.eventTypes"
                  :key="t"
                  class="pref-chip pref-chip--active pref-chip--static"
                >
                  <span class="pref-chip__dot"></span>
                  {{ EVENT_TYPES.find(x => x.value === t)?.label ?? t }}
                </span>
              </div>
            </div>

            <div v-if="preferences.categoryIds?.length" class="prefs-view-group">
              <span class="prefs-group-label">Categorías</span>
              <div class="prefs-chips">
                <span
                  v-for="cid in preferences.categoryIds"
                  :key="cid"
                  class="pref-chip pref-chip--static"
                  :style="{
                    background:  (availableCategories.find(c => c.id === cid)?.colorHex ?? '#1a3a52') + '18',
                    borderColor: availableCategories.find(c => c.id === cid)?.colorHex ?? '#1a3a52',
                    color:       availableCategories.find(c => c.id === cid)?.colorHex ?? '#1a3a52',
                  }"
                >
                  {{ availableCategories.find(c => c.id === cid)?.name ?? `#${cid}` }}
                </span>
              </div>
            </div>
          </template>

          <div v-else class="prefs-empty">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span>No configuraste preferencias aún. Edita tu perfil para personalizarlas.</span>
          </div>
        </div>

        <!-- Acciones -->
        <div class="form-actions">
          <button class="btn-primary" @click="startEdit">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Editar datos
          </button>
        </div>
      </div>

      <!-- ════════════════════════════════════════════════════════════════
           MODO EDICIÓN — formulario activo
           ════════════════════════════════════════════════════════════════ -->
      <form v-else class="profile-form" @submit.prevent="handleSave">

        <div class="form-section">
          <h3 class="form-section__title">Foto de perfil</h3>
          <div class="form-group">
            <label class="form-label">URL de imagen</label>
            <input
              v-model="form.avatarUrl"
              type="url"
              class="form-input"
              placeholder="https://... (URL de tu foto)"
            />
          </div>
        </div>

        <div class="form-section">
          <h3 class="form-section__title">Datos personales</h3>
          <div class="form-grid">
            <div class="form-group form-group--full">
              <label class="form-label">Nombre completo</label>
              <input
                v-model="form.fullName"
                type="text"
                class="form-input"
                placeholder="Tu nombre completo"
                maxlength="120"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Teléfono de contacto</label>
              <input
                v-model="form.phone"
                type="tel"
                class="form-input"
                placeholder="Ej: +591 70000000"
                maxlength="20"
              />
            </div>
            <div class="form-group">
              <label class="form-label">
                Carrera
                <span class="form-label__hint">— asignada por administración</span>
              </label>
              <input
                :value="careerName"
                type="text"
                class="form-input form-input--readonly"
                readonly
              />
            </div>
          </div>
        </div>

        <!-- Sobre mí -->
        <div class="form-section">
          <h3 class="form-section__title">Sobre mí</h3>
          <div class="form-group">
            <label class="form-label">Biografía / descripción corta</label>
            <textarea
              v-model="form.bio"
              class="form-input form-textarea"
              placeholder="Cuéntanos algo sobre ti..."
              rows="4"
              maxlength="300"
            ></textarea>
            <span class="char-count">{{ form.bio?.length || 0 }} / 300</span>
          </div>
        </div>

        <!-- ── EDICIÓN: Mis preferencias ── -->
        <div class="form-section prefs-edit-section">
          <h3 class="form-section__title">
            Mis preferencias de eventos
          </h3>
          <p class="prefs-hint">
            El muro mostrará primero los eventos que coincidan con tu selección y los marcará como recomendados.
          </p>

          <!-- Tipos de evento -->
          <div class="prefs-block">
            <span class="prefs-group-label">Tipo de evento</span>
            <div class="prefs-chips">
              <label
                v-for="opt in EVENT_TYPES"
                :key="opt.value"
                class="pref-chip pref-chip--selectable"
                :class="{ 'pref-chip--active': prefForm.eventTypes.includes(opt.value) }"
              >
                <input type="checkbox" :value="opt.value" v-model="prefForm.eventTypes" class="pref-chip__input" />
                <svg v-if="prefForm.eventTypes.includes(opt.value)" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                {{ opt.label }}
              </label>
            </div>
          </div>

          <!-- Categorías -->
          <div class="prefs-block">
            <span class="prefs-group-label">Categoría</span>
            <div class="prefs-chips" v-if="availableCategories.length">
              <label
                v-for="cat in availableCategories"
                :key="cat.id"
                class="pref-chip pref-chip--selectable"
                :class="{ 'pref-chip--active': prefForm.categoryIds.includes(cat.id) }"
                :style="prefForm.categoryIds.includes(cat.id) ? {
                  background:  cat.colorHex + '18',
                  borderColor: cat.colorHex,
                  color:       cat.colorHex,
                } : {}"
              >
                <input type="checkbox" :value="cat.id" v-model="prefForm.categoryIds" class="pref-chip__input" />
                <svg v-if="prefForm.categoryIds.includes(cat.id)" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                {{ cat.name }}
              </label>
            </div>
            <p v-else class="prefs-loading">Cargando categorías...</p>
          </div>
        </div>

        <!-- Acciones -->
        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="cancelEdit" :disabled="saving">
            Cancelar
          </button>
          <button type="submit" class="btn-primary" :disabled="saving">
            <svg v-if="saving" class="btn-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            {{ saving ? 'Guardando...' : 'Guardar cambios' }}
          </button>
        </div>

      </form>
    </div>

    <!-- ── CARD INFO DE CUENTA (siempre solo lectura) ─────────────────────── -->
    <div class="account-card">
      <h3 class="account-card__title">Información de cuenta</h3>
      <div class="account-fields">
        <div class="account-field">
          <span class="account-field__label">Correo electrónico</span>
          <span class="account-field__value">{{ profile.email || '—' }}</span>
        </div>
        <div class="account-field">
          <span class="account-field__label">Rol</span>
          <span class="account-field__value">{{ roleLabel }}</span>
        </div>
        <div class="account-field">
          <span class="account-field__label">Estado de cuenta</span>
          <span
            class="account-field__value account-field__value--status"
            :class="profile.status === 'ACTIVO' ? 'status--active' : 'status--inactive'"
          >
            {{ profile.status || '—' }}
          </span>
        </div>
        <div class="account-field">
          <span class="account-field__label">Miembro desde</span>
          <span class="account-field__value">{{ memberSince }}</span>
        </div>
      </div>
    </div>

    <!-- Modal de foto de perfil -->
    <AvatarUploadModal
      :is-open="showAvatarModal"
      :current-avatar-url="displayAvatarUrl"
      :initials="initials"
      @close="showAvatarModal = false"
      @avatar-updated="onAvatarUpdated"
      @avatar-removed="onAvatarRemoved"
    />

    <!-- ── TOAST ──────────────────────────────────────────────────────────── -->
    <Teleport to="body">
      <Transition name="toast">
        <div v-if="toast.show" class="toast" :class="`toast--${toast.type}`">
          <svg v-if="toast.type === 'success'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {{ toast.message }}
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { userService, careerService } from '../../services/api.js'
import AvatarUploadModal from '../../components/Student/AvatarUploadModal.vue'

// ─── Estado ───────────────────────────────────────────────────────────────────
const profile  = ref({})
const careers  = ref([])
const editMode = ref(false)   // false = vista | true = edición
const saving   = ref(false)
const loading  = ref(true)
const form     = ref({ fullName: '', phone: '', bio: '', avatarUrl: '' })
const toast    = ref({ show: false, type: 'success', message: '' })
const showAvatarModal = ref(false)

// ─── Preferencias ─────────────────────────────────────────────────────────────
const EVENT_TYPES = [
  { value: 'WEBINAR_VIRTUAL', label: 'Webinar virtual' },
  { value: 'CHARLA',          label: 'Charla'          },
  { value: 'TALLER',          label: 'Taller'          },
  { value: 'CONFERENCIA',     label: 'Conferencia'     },
  { value: 'AUDITORIA',       label: 'Auditoría'       },
  { value: 'FERIA',           label: 'Feria'           },
  { value: 'CONCURSO',        label: 'Concurso'        },
  { value: 'VISITA_GUIADA',   label: 'Visita guiada'  },
]

const availableCategories = ref([])
const preferences  = ref({ eventTypes: [], categoryIds: [] })
const prefForm     = ref({ eventTypes: [], categoryIds: [] })

// ─── Computed ─────────────────────────────────────────────────────────────────
const initials = computed(() => {
  const name = profile.value.fullName || ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'E'
})
const displayAvatarUrl = computed(() => profile.value.avatarUrl || '')
const roleLabel = computed(() => {
  const map = { ESTUDIANTE: 'Estudiante', PUBLICADOR: 'Publicador', ADMIN: 'Administrador' }
  return map[profile.value.role] || profile.value.role || 'Estudiante'
})
const careerName = computed(() => {
  if (!profile.value.careerId) return 'Sin carrera asignada'
  const found = careers.value.find(c => c.id === profile.value.careerId)
  return found ? found.name : `Carrera #${profile.value.careerId}`
})
const memberSince = computed(() => {
  if (!profile.value.createdAt) return '—'
  return new Date(profile.value.createdAt).toLocaleDateString('es-BO', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
})

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fillForm(data) {
  form.value = {
    fullName:  data.fullName  || '',
    phone:     data.phone     || '',
    bio:       data.bio       || '',
    avatarUrl: data.avatarUrl || '',
  }
}
function syncPrefForm() {
  prefForm.value = {
    eventTypes:  [...(preferences.value.eventTypes  ?? [])],
    categoryIds: [...(preferences.value.categoryIds ?? [])],
  }
}
function showToast(message, type = 'success') {
  toast.value = { show: true, type, message }
  setTimeout(() => { toast.value.show = false }, 3500)
}
function onAvatarError() {
  profile.value = { ...profile.value, avatarUrl: '' }
}
function onAvatarUpdated(newUrl) {
  profile.value = { ...profile.value, avatarUrl: newUrl }
  showToast('Foto de perfil actualizada correctamente')
}
function onAvatarRemoved() {
  profile.value = { ...profile.value, avatarUrl: '' }
  showToast('Foto de perfil eliminada')
}

// ─── Modo edición ─────────────────────────────────────────────────────────────
function startEdit() {
  fillForm(profile.value)
  syncPrefForm()
  editMode.value = true
}
function cancelEdit() {
  editMode.value = false
}

// ─── Carga de datos ───────────────────────────────────────────────────────────
async function loadProfile() {
  loading.value = true
  try {
    const data = await userService.getProfile()
    profile.value = data
  } catch (err) {
    showToast('No se pudo cargar el perfil', 'error')
  } finally {
    loading.value = false
  }
}
async function loadCareers() {
  try {
    const res = await careerService.getAll()
    careers.value = res.data ?? res
  } catch { /* no crítico */ }
}
async function loadCategories() {
  try {
    // Ajusta la URL según tu api.js / baseURL
    const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/categories`)
    const data = await res.json()
    availableCategories.value = (Array.isArray(data) ? data : data.data ?? []).map(c => ({
      id:       c.id,
      name:     c.name,
      colorHex: c.colorHex ?? c.color_hex ?? '#94a3b8',
    }))
  } catch (err) {
    console.error('[StudentProfile] loadCategories:', err)
  }
}
async function loadPreferences() {
  try {
    const data = await userService.getPreferences()
    preferences.value = data
    syncPrefForm()
  } catch (err) {
    console.error('[StudentProfile] loadPreferences:', err)
  }
}

// ─── Guardar ──────────────────────────────────────────────────────────────────
async function handleSave() {
  saving.value = true
  try {
    const [updated, updatedPrefs] = await Promise.all([
      userService.updateProfile({
        fullName:  form.value.fullName  || null,
        phone:     form.value.phone     || null,
        bio:       form.value.bio       || null,
        avatarUrl: form.value.avatarUrl || null,
      }),
      userService.savePreferences({
        eventTypes:  prefForm.value.eventTypes,
        categoryIds: prefForm.value.categoryIds,
      }),
    ])
    profile.value     = updated
    preferences.value = updatedPrefs
    editMode.value    = false
    showToast('Cambios guardados correctamente')
  } catch (err) {
    showToast(err.message || 'Error al guardar los cambios', 'error')
  } finally {
    saving.value = false
  }
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(async () => {
  await Promise.all([loadProfile(), loadCareers(), loadCategories(), loadPreferences()])
})
</script>

<style scoped>
/* ── Layout ─────────────────────────────────────────────────────────────── */
.profile-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 760px;
}

/* ── Cards ───────────────────────────────────────────────────────────────── */
.profile-card,
.account-card {
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

/* ── Hero ────────────────────────────────────────────────────────────────── */
.profile-hero {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.75rem 2rem;
  background: linear-gradient(135deg, #1a3a52 0%, #1e4d6b 100%);
  position: relative;
  overflow: hidden;
}
.profile-hero::after {
  content: '';
  position: absolute;
  right: -40px;
  top: -40px;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: rgba(255, 210, 0, 0.06);
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255,255,255,0.12);
  border: 3px solid rgba(255,210,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}
.avatar-img { width: 100%; height: 100%; object-fit: cover; }
.avatar-initials { font-size: 1.5rem; font-weight: 800; color: #FFD200; letter-spacing: -1px; }

.profile-hero__info { flex: 1; position: relative; z-index: 1; }
.profile-name  { font-size: 1.25rem; font-weight: 800; color: #ffffff; margin: 0 0 0.2rem; letter-spacing: -0.3px; }
.profile-email { font-size: 0.825rem; color: rgba(255,255,255,0.65); margin: 0 0 0.6rem; }
.profile-badge {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  background: rgba(255,210,0,0.18);
  color: #FFD200;
  border: 1px solid rgba(255,210,0,0.35);
  padding: 3px 10px;
  border-radius: 20px;
}

/* ── Avatar overlay de edición ───────────────────────────────────────── */
.avatar-edit-overlay {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  color: #fff;
}
.avatar:hover .avatar-edit-overlay { opacity: 1; }

/* ── Divider ─────────────────────────────────────────────────────────────── */
.profile-divider { height: 1px; background: #f1f5f9; }

/* ── Secciones compartidas (vista y edición) ─────────────────────────────── */
.profile-view,
.profile-form {
  padding: 1.75rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.form-section { display: flex; flex-direction: column; gap: 0; }

.form-section__title {
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #94a3b8;
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.prefs-count-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  background: #eff6ff;
  color: #1d4ed8;
  border-radius: 12px;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-transform: none;
}

.view-label__hint {
  font-weight: 400;
  color: #cbd5e1;
}

/* ── Vista: campos de lectura ────────────────────────────────────────────── */
.view-field { display: flex; flex-direction: column; gap: 0.3rem; }
.view-field--full { grid-column: 1 / -1; }
.view-label { font-size: 0.77rem; font-weight: 600; color: #94a3b8; }
.view-label__hint { font-weight: 400; color: #cbd5e1; }
.view-value {
  font-size: 0.9rem;
  color: #1e293b;
  font-weight: 500;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f1f5f9;
}
.view-value--bio { white-space: pre-wrap; line-height: 1.6; }

/* ── Preferencias: elementos comunes ─────────────────────────────────────── */
.prefs-view-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 0.85rem;
}
.prefs-block {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.1rem;
}
.prefs-group-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
.prefs-chips { display: flex; flex-wrap: wrap; gap: 0.45rem; }

.pref-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.35rem 0.85rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #64748b;
  background: #f8fafc;
  line-height: 1;
  transition: all 0.15s ease;
  user-select: none;
}
.pref-chip__dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.7;
}
.pref-chip--selectable { cursor: pointer; }
.pref-chip--selectable:hover {
  border-color: #1a3a52;
  color: #1a3a52;
  background: #f0f5f8;
}
.pref-chip--active {
  background: #1a3a52;
  border-color: #1a3a52;
  color: #FFD200 !important;
}
.pref-chip--active:hover { background: #243f57; border-color: #243f57; }
.pref-chip--static { cursor: default; pointer-events: none; }
.pref-chip__input {
  position: absolute; opacity: 0; width: 0; height: 0; pointer-events: none;
}

.prefs-hint {
  font-size: 0.82rem;
  color: #64748b;
  line-height: 1.55;
  margin: -0.4rem 0 1rem;
  padding: 0.6rem 0.875rem;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
}

.prefs-edit-section {
  background: #fafbfd;
  border: 1.5px solid #e8edf2;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
}

.prefs-empty {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  color: #94a3b8;
  font-style: italic;
  padding: 0.5rem 0;
}
.prefs-loading { font-size: 0.8rem; color: #94a3b8; font-style: italic; }

/* ── Edición: inputs ─────────────────────────────────────────────────────── */
.form-group { display: flex; flex-direction: column; gap: 0.4rem; }
.form-group--full { grid-column: 1 / -1; }
.form-label { font-size: 0.82rem; font-weight: 600; color: #374151; }
.form-label__hint { font-weight: 400; color: #94a3b8; }
.form-input {
  padding: 0.6rem 0.875rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #1e293b;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  font-family: inherit;
  background: white;
  width: 100%;
  box-sizing: border-box;
}
.form-input:focus { border-color: #1a3a52; box-shadow: 0 0 0 3px rgba(26,58,82,0.08); }
.form-input--readonly { background: #f8fafc; color: #94a3b8; cursor: not-allowed; }
.form-input--readonly:focus { border-color: #e2e8f0; box-shadow: none; }
.form-textarea { resize: vertical; min-height: 90px; }
.char-count { font-size: 0.75rem; color: #94a3b8; text-align: right; margin-top: -0.15rem; }

/* ── Acciones ────────────────────────────────────────────────────────────── */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid #f1f5f9;
}
.btn-primary {
  display: inline-flex; align-items: center; gap: 0.45rem;
  padding: 0.6rem 1.35rem;
  background: #1a3a52; color: white; border: none; border-radius: 8px;
  font-size: 0.875rem; font-weight: 700; cursor: pointer;
  transition: background 0.15s; font-family: inherit;
}
.btn-primary:hover:not(:disabled) { background: #1e4d6b; }
.btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }
.btn-secondary {
  padding: 0.6rem 1.2rem;
  background: white; color: #374151;
  border: 1.5px solid #e2e8f0; border-radius: 8px;
  font-size: 0.875rem; font-weight: 500; cursor: pointer;
  transition: background 0.15s, border-color 0.15s; font-family: inherit;
}
.btn-secondary:hover:not(:disabled) { background: #f8fafc; border-color: #cbd5e1; }
.btn-secondary:disabled { opacity: 0.55; cursor: not-allowed; }
.btn-spinner { animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Card info de cuenta ─────────────────────────────────────────────────── */
.account-card { padding: 1.5rem 2rem; }
.account-card__title {
  font-size: 0.72rem; font-weight: 800; text-transform: uppercase;
  letter-spacing: 0.8px; color: #94a3b8; margin: 0 0 1.1rem;
}

.account-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem 2rem;
}

.account-field { display: flex; flex-direction: column; gap: 0.25rem; }

.account-field__label { font-size: 0.75rem; color: #94a3b8; font-weight: 500; }
.account-field__value { font-size: 0.875rem; color: #1e293b; font-weight: 500; }

.account-field__value--status { display: inline-flex; align-items: center; gap: 0.3rem; }
.account-field__value--status::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
}
.status--active  { color: #059669; }
.status--active::before  { background: #059669; }
.status--inactive { color: #dc2626; }
.status--inactive::before { background: #dc2626; }

/* ── Toast ───────────────────────────────────────────────────────────────── */
.toast {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1.2rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  box-shadow: 0 8px 24px rgba(0,0,0,0.14);
  z-index: 9999;
  max-width: 340px;
}

.toast--success { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
.toast--error   { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }

/* ── Transiciones ────────────────────────────────────────────────────────── */
.toast-enter-active, .toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from { opacity: 0; transform: translateX(20px); }
.toast-leave-to   { opacity: 0; transform: translateX(20px); }

/* ── Responsive ──────────────────────────────────────────────────────────── */
@media (max-width: 640px) {
  .profile-hero { flex-direction: column; text-align: center; padding: 1.5rem; }
  .profile-view, .profile-form { padding: 1.25rem; }
  .form-grid { grid-template-columns: 1fr; }
  .view-field--full, .form-group--full { grid-column: 1; }
  .account-fields { grid-template-columns: 1fr; }
  .account-card { padding: 1.25rem; }
  .form-actions { flex-direction: column; }
  .btn-primary, .btn-secondary { width: 100%; justify-content: center; }
  .prefs-edit-section { padding: 1rem; }
}
</style>
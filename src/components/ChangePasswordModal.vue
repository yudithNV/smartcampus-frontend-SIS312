<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="visible" class="cp-overlay">

        <!-- Fondo oscuro no clickeable — bloquea todo lo de atrás -->
        <div class="cp-backdrop"></div>

        <!-- Card del formulario -->
        <div class="cp-card" role="dialog" aria-modal="true" aria-labelledby="cp-title">

          <!-- Brand -->
          <div class="cp-brand">
            <div class="cp-brand-mark">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 3L2 8l10 5 10-5-10-5z" fill="#0c1a27"/>
                <path d="M6 10.8V16c0 0 2.4 2.5 6 2.5S18 16 18 16v-5.2" stroke="#0c1a27" stroke-width="1.8" stroke-linecap="round"/>
                <line x1="20" y1="8" x2="20" y2="14" stroke="#0c1a27" stroke-width="1.8" stroke-linecap="round"/>
                <circle cx="20" cy="15.2" r="1.1" fill="#0c1a27"/>
              </svg>
            </div>
            <div>
              <span class="cp-brand-name">UCB SmartCampus</span>
              <span class="cp-brand-sub">Universidad Católica Boliviana · La Paz</span>
            </div>
          </div>

          <div class="cp-divider"></div>

          <!-- Encabezado -->
          <div class="cp-heading">
            <div class="cp-badge">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Seguridad de cuenta
            </div>
            <h2 id="cp-title">Cambiar contraseña</h2>
            <p>Por seguridad, debes establecer una contraseña personal antes de continuar.</p>
          </div>

          <!-- Formulario -->
          <form @submit.prevent="handleSubmit" novalidate>

            <!-- Contraseña actual -->
            <div class="cp-field" :class="{ 'cp-field--error': errors.currentPassword, 'cp-field--filled': form.currentPassword }">
              <label for="cp-current">Contraseña actual</label>
              <div class="cp-input-wrap">
                <svg class="cp-input-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>
                </svg>
                <input id="cp-current" v-model="form.currentPassword" :type="show.current ? 'text' : 'password'" placeholder="Tu contraseña actual" @input="clearError('currentPassword')" />
                <button type="button" class="cp-eye" @click="show.current = !show.current">
                  <svg v-if="!show.current" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17.94 17.94A10.06 10.06 0 0112 20C5 20 1 12 1 12a18.09 18.09 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </button>
              </div>
              <Transition name="err"><span class="cp-err" v-if="errors.currentPassword">{{ errors.currentPassword }}</span></Transition>
            </div>

            <!-- Nueva contraseña -->
            <div class="cp-field" :class="{ 'cp-field--error': errors.newPassword, 'cp-field--filled': form.newPassword }">
              <label for="cp-new">Nueva contraseña</label>
              <div class="cp-input-wrap">
                <svg class="cp-input-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>
                </svg>
                <input id="cp-new" v-model="form.newPassword" :type="show.new ? 'text' : 'password'" placeholder="Mín. 8 caracteres" @input="clearError('newPassword')" />
                <button type="button" class="cp-eye" @click="show.new = !show.new">
                  <svg v-if="!show.new" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17.94 17.94A10.06 10.06 0 0112 20C5 20 1 12 1 12a18.09 18.09 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </button>
              </div>

              <!-- Barra de fortaleza -->
              <div v-if="form.newPassword" class="cp-strength">
                <div class="cp-strength__track">
                  <div class="cp-strength__fill" :class="`s--${strength.level}`" :style="{ width: strength.pct + '%' }"></div>
                </div>
                <span class="cp-strength__label" :class="`st--${strength.level}`">{{ strength.label }}</span>
              </div>

              <!-- Requisitos -->
              <ul v-if="form.newPassword" class="cp-reqs">
                <li :class="{ met: reqs.length }"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg> Mínimo 8 caracteres</li>
                <li :class="{ met: reqs.upper }"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg> Una letra mayúscula</li>
                <li :class="{ met: reqs.lower }"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg> Una letra minúscula</li>
                <li :class="{ met: reqs.number }"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg> Un número</li>
                <li :class="{ met: reqs.symbol }"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg> Un símbolo (!@#$%...)</li>
              </ul>

              <Transition name="err"><span class="cp-err" v-if="errors.newPassword">{{ errors.newPassword }}</span></Transition>
            </div>

            <!-- Confirmar contraseña -->
            <div class="cp-field" :class="{ 'cp-field--error': errors.confirmPassword, 'cp-field--filled': form.confirmPassword }">
              <label for="cp-confirm">Confirmar nueva contraseña</label>
              <div class="cp-input-wrap">
                <svg class="cp-input-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>
                </svg>
                <input id="cp-confirm" v-model="form.confirmPassword" :type="show.confirm ? 'text' : 'password'" placeholder="Repite la nueva contraseña" @input="clearError('confirmPassword')" />
                <button type="button" class="cp-eye" @click="show.confirm = !show.confirm">
                  <svg v-if="!show.confirm" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17.94 17.94A10.06 10.06 0 0112 20C5 20 1 12 1 12a18.09 18.09 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </button>
              </div>
              <Transition name="err"><span class="cp-err" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</span></Transition>
            </div>

            <!-- Error global del servidor -->
            <Transition name="slide-err">
              <div class="cp-alert" v-if="globalError" role="alert">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.6" fill="currentColor"/></svg>
                <span>{{ globalError }}</span>
              </div>
            </Transition>

            <!-- Botón -->
            <button type="submit" class="cp-btn" :disabled="loading">
              <Transition name="swap" mode="out-in">
                <span v-if="!loading" key="label" class="cp-btn-inner">
                  Establecer contraseña
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </span>
                <span v-else key="spin" class="cp-btn-inner">
                  <svg class="cp-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 2a10 10 0 0110 10"/></svg>
                  Guardando
                </span>
              </Transition>
            </button>

          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

const emit = defineEmits(['done'])

// ─── Visibilidad — se muestra solo si el flag existe ─────────────────────────
const visible = ref(false)

onMounted(() => {
  if (localStorage.getItem('must_change_password') === '1') {
    visible.value = true
  }
})

// ─── Estado del formulario ────
const form    = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' })
const errors  = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' })
const show    = reactive({ current: false, new: false, confirm: false })
const globalError = ref('')
const loading = ref(false)

// ─── Requisitos reactivos ──
const reqs = computed(() => ({
  length: form.newPassword.length >= 8,
  upper:  /[A-Z]/.test(form.newPassword),
  lower:  /[a-z]/.test(form.newPassword),
  number: /\d/.test(form.newPassword),
  symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.newPassword),
}))

const strength = computed(() => {
  const met = Object.values(reqs.value).filter(Boolean).length
  if (met <= 1) return { level: 'weak',   label: 'Muy débil',  pct: 20 }
  if (met === 2) return { level: 'weak',   label: 'Débil',      pct: 40 }
  if (met === 3) return { level: 'fair',   label: 'Regular',    pct: 60 }
  if (met === 4) return { level: 'good',   label: 'Buena',      pct: 80 }
  return               { level: 'strong', label: 'Fuerte',     pct: 100 }
})

// ─── Helpers ──────────────────────────────────────────────────────────────────
function clearError(field) {
  errors[field] = ''
  globalError.value = ''
}

function validate() {
  let ok = true
  if (!form.currentPassword) { errors.currentPassword = 'Ingresa tu contraseña actual'; ok = false }
  if (!form.newPassword) {
    errors.newPassword = 'Ingresa la nueva contraseña'; ok = false
  } else if (!Object.values(reqs.value).every(Boolean)) {
    errors.newPassword = 'La contraseña no cumple todos los requisitos'; ok = false
  }
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Confirma la nueva contraseña'; ok = false
  } else if (form.newPassword !== form.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden'; ok = false
  }
  return ok
}

// ─── Submit ───────────────────
async function handleSubmit() {
  globalError.value = ''
  if (!validate()) return

  loading.value = true
  try {
    const token = localStorage.getItem('ucb_token')
    const res = await fetch('/api/auth/change-password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      mode: 'cors',
      body: JSON.stringify({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      })
    })

    const data = await res.json()

    if (!res.ok) {
      // Mensajes amigables para errores conocidos del backend
      const msg = data.error || data.message || ''
      if (msg.toLowerCase().includes('igual') || msg.toLowerCase().includes('same')) {
        globalError.value = 'No puedes usar la misma contraseña actual'
      } else if (msg.toLowerCase().includes('incorrecta') || msg.toLowerCase().includes('incorrect')) {
        globalError.value = 'La contraseña actual es incorrecta'
      } else {
        globalError.value = 'Error al cambiar la contraseña. Intenta de nuevo.'
      }
      return
    }

    // Éxito — limpiar flags y cerrar modal
    localStorage.removeItem('must_change_password')
    localStorage.setItem('pwd_changed', '1')
    visible.value = false
    emit('done')

  } catch (err) {
    globalError.value = 'No se pudo conectar con el servidor.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

/* ── Overlay — cubre toda la pantalla y bloquea interacción ─────────────────── */
.cp-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  font-family: 'DM Sans', sans-serif;
}

.cp-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(8, 20, 35, 0.85);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

/* ── Card ──*/
.cp-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 440px;
  max-height: 92vh;
  overflow-y: auto;
  background: rgba(14, 38, 65, 0.96);
  border-radius: 20px;
  padding: 2rem 2rem 1.75rem;
  box-shadow:
    0 0 0 1px rgba(255,210,0,0.25),
    0 2px 0 0 #FFD200 inset,
    0 32px 80px rgba(0,0,0,0.6),
    inset 0 1px 0 rgba(255,255,255,0.07);
  animation: cardIn 0.45s cubic-bezier(0.34,1.4,0.64,1) both;
}
@keyframes cardIn { from{opacity:0;transform:translateY(24px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }

/* ── Brand ──────────────────────────────────────────────────────────────────── */
.cp-brand { display:flex; align-items:center; gap:.75rem; margin-bottom:1.25rem; }
.cp-brand-mark { width:44px; height:44px; flex-shrink:0; background:linear-gradient(135deg,#FFD200,#ffc000); border-radius:11px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 16px rgba(255,210,0,0.3); }
.cp-brand-name { font-family:'Syne',sans-serif; font-weight:800; font-size:1rem; color:#fff; display:block; line-height:1.2; }
.cp-brand-sub  { font-size:.63rem; color:rgba(255,255,255,.35); display:block; }

.cp-divider { height:1px; background:linear-gradient(to right,transparent,rgba(255,255,255,0.1),transparent); margin-bottom:1.25rem; }

/* ── Heading ────────────────────────────────────────────────────────────────── */
.cp-heading { margin-bottom:1.4rem; }
.cp-badge {
  display:inline-flex; align-items:center; gap:.35rem;
  font-size:.67rem; font-weight:700; text-transform:uppercase; letter-spacing:.6px;
  color:#FFD200; background:rgba(255,210,0,.1); border:1px solid rgba(255,210,0,.2);
  padding:.25rem .65rem; border-radius:20px; margin-bottom:.7rem;
}
.cp-heading h2 { font-family:'Syne',sans-serif; font-size:1.55rem; font-weight:800; color:#fff; letter-spacing:-.6px; margin:0 0 .25rem; }
.cp-heading p  { font-size:.8rem; color:rgba(255,255,255,.4); line-height:1.5; margin:0; }

/* ── Fields ─────────────────────────────────────────────────────────────────── */
.cp-field { margin-bottom:.9rem; }
.cp-field label { display:block; font-size:.68rem; font-weight:600; color:rgba(255,255,255,.5); text-transform:uppercase; letter-spacing:.7px; margin-bottom:.35rem; }
.cp-input-wrap { position:relative; display:flex; align-items:center; }
.cp-input-icon { position:absolute; left:.8rem; color:rgba(255,255,255,.25); pointer-events:none; transition:color .2s; }
.cp-input-wrap:focus-within .cp-input-icon { color:#FFD200; }

.cp-field input {
  width:100%; padding:.7rem 2.5rem .7rem 2.3rem;
  border:1.5px solid rgba(255,255,255,.1); border-radius:9px;
  font-size:.85rem; font-family:'DM Sans',sans-serif; color:#fff;
  background:rgba(255,255,255,.07); outline:none;
  transition:border-color .2s, background .2s, box-shadow .2s;
}
.cp-field input::placeholder { color:rgba(255,255,255,.18); }
.cp-field input:focus { border-color:#FFD200; background:rgba(255,210,0,.05); box-shadow:0 0 0 3px rgba(255,210,0,.1); }
.cp-field--error input { border-color:rgba(248,113,113,.6); background:rgba(248,113,113,.06); }
.cp-field--filled input:not(:focus) { border-color:rgba(255,255,255,.16); background:rgba(255,255,255,.09); }

.cp-eye { position:absolute; right:.8rem; background:none; border:none; cursor:pointer; color:rgba(255,255,255,.25); display:flex; padding:3px; border-radius:5px; transition:color .2s; }
.cp-eye:hover { color:rgba(255,255,255,.65); }

.cp-err { display:block; margin-top:.25rem; font-size:.7rem; font-weight:600; color:#fca5a5; }

/* ── Fortaleza ──────────────────────────────────────────────────────────────── */
.cp-strength { display:flex; align-items:center; gap:.5rem; margin-top:.35rem; }
.cp-strength__track { flex:1; height:3px; background:rgba(255,255,255,.1); border-radius:3px; overflow:hidden; }
.cp-strength__fill  { height:100%; border-radius:3px; transition:width .3s, background .3s; }
.s--weak   { background:#ef4444; }
.s--fair   { background:#f59e0b; }
.s--good   { background:#3b82f6; }
.s--strong { background:#22c55e; }
.cp-strength__label { font-size:.67rem; font-weight:600; white-space:nowrap; }
.st--weak   { color:#ef4444; }
.st--fair   { color:#f59e0b; }
.st--good   { color:#3b82f6; }
.st--strong { color:#22c55e; }

/* ── Requisitos ─────────────────────────────────────────────────────────────── */
.cp-reqs { list-style:none; display:flex; flex-direction:column; gap:.2rem; margin-top:.4rem; padding:0; }
.cp-reqs li { display:flex; align-items:center; gap:.35rem; font-size:.69rem; color:rgba(255,255,255,.28); transition:color .2s; }
.cp-reqs li svg { opacity:.25; transition:opacity .2s; flex-shrink:0; }
.cp-reqs li.met { color:rgba(255,255,255,.65); }
.cp-reqs li.met svg { opacity:1; stroke:#22c55e; }

/* ── Alert ──────────────────────────────────────────────────────────────────── */
.cp-alert { display:flex; align-items:flex-start; gap:.5rem; padding:.65rem .9rem; background:rgba(220,38,38,.12); border:1px solid rgba(220,38,38,.25); border-left:3px solid #f87171; border-radius:9px; margin-bottom:.9rem; font-size:.78rem; font-weight:500; color:#fca5a5; line-height:1.4; }

/* ── Botón ──────────────────────────────────────────────────────────────────── */
.cp-btn { width:100%; padding:.78rem 1rem; background:linear-gradient(135deg,#FFD200,#ffca00); border:none; border-radius:9px; color:#0c1a27; font-family:'Syne',sans-serif; font-size:.9rem; font-weight:800; letter-spacing:.4px; cursor:pointer; transition:transform .2s, box-shadow .2s, opacity .2s; position:relative; overflow:hidden; margin-top:.5rem; }
.cp-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 24px rgba(255,210,0,.4); }
.cp-btn:disabled { opacity:.55; cursor:not-allowed; }
.cp-btn-inner { display:inline-flex; align-items:center; justify-content:center; gap:.45rem; }
.cp-spin { animation:spin .65s linear infinite; }
@keyframes spin { to{transform:rotate(360deg)} }

/* ── Transiciones ───────────────────────────────────────────────────────────── */
.modal-fade-enter-active { transition:opacity .25s ease; }
.modal-fade-leave-active { transition:opacity .2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity:0; }

.err-enter-active,.err-leave-active { transition:all .18s ease; }
.err-enter-from,.err-leave-to { opacity:0; transform:translateY(-3px); }

.slide-err-enter-active,.slide-err-leave-active { transition:all .22s ease; overflow:hidden; }
.slide-err-enter-from,.slide-err-leave-to { opacity:0; max-height:0; }
.slide-err-enter-to,.slide-err-leave-from { max-height:60px; }

.swap-enter-active,.swap-leave-active { transition:all .15s ease; }
.swap-enter-from { opacity:0; transform:translateY(5px); }
.swap-leave-to   { opacity:0; transform:translateY(-5px); }

@media(max-width:480px) {
  .cp-card { padding:1.5rem 1.4rem; }
  .cp-heading h2 { font-size:1.3rem; }
}
</style>
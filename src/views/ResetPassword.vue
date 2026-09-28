<template>
  <div class="login-container">

    <!-- Background -->
    <div class="bg-canvas" aria-hidden="true">
      <div class="orb orb-gold-bg"></div>
      <div class="orb orb-navy-bg"></div>
      <div class="orb orb-mid-bg"></div>
      <svg class="grid-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid2" width="52" height="52" patternUnits="userSpaceOnUse">
            <path d="M 52 0 L 0 0 0 52" fill="none" stroke="rgba(255,210,0,0.03)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid2)"/>
      </svg>
    </div>
    <div class="rings" aria-hidden="true">
      <div class="ring ring-1"></div><div class="ring ring-2"></div><div class="ring ring-3"></div>
    </div>

    <!-- Card -->
    <div class="glass-card">

      <!-- Brand -->
      <div class="brand">
        <div class="brand-mark">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M12 3L2 8l10 5 10-5-10-5z" fill="#0c1a27"/>
            <path d="M6 10.8V16c0 0 2.4 2.5 6 2.5S18 16 18 16v-5.2" stroke="#0c1a27" stroke-width="1.8" stroke-linecap="round"/>
            <line x1="20" y1="8" x2="20" y2="14" stroke="#0c1a27" stroke-width="1.8" stroke-linecap="round"/>
            <circle cx="20" cy="15.2" r="1.1" fill="#0c1a27"/>
          </svg>
        </div>
        <div class="brand-text">
          <span class="brand-name">UCB SmartCampus</span>
          <span class="brand-sub">Universidad Católica Boliviana · La Paz</span>
        </div>
      </div>

      <div class="divider"></div>

      <!-- Validating token state -->
      <div v-if="validating" class="center-state">
        <svg class="spin-large" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FFD200" stroke-width="2.5" stroke-linecap="round">
          <path d="M12 2a10 10 0 0110 10"/>
        </svg>
        <p>Verificando enlace...</p>
      </div>

      <!-- Invalid / expired token -->
      <div v-else-if="!tokenValid" class="center-state center-state--error">
        <div class="error-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="12" r="10" fill="#fee2e2" stroke="#ef4444"/>
            <line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <h2 class="error-title">Enlace inválido o expirado</h2>
        <p class="error-body">
          El enlace de recuperación ya fue utilizado o expiró (válido por 30 minutos).
          Solicita uno nuevo.
        </p>
        <router-link to="/forgot-password" class="btn-request-new">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
          </svg>
          Solicitar nuevo enlace
        </router-link>
      </div>

      <!-- Success state -->
      <div v-else-if="success" class="center-state center-state--success">
        <div class="success-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="12" r="10" fill="#dcfce7" stroke="#059669"/>
            <polyline points="20,6 9,17 4,12"/>
          </svg>
        </div>
        <h2 class="success-title">¡Contraseña restablecida!</h2>
        <p class="success-body">
          Tu contraseña fue actualizada correctamente. Ya puedes iniciar sesión con tu nueva contraseña.
        </p>
        <router-link to="/login" class="btn-submit" style="text-decoration:none;display:flex;align-items:center;justify-content:center;gap:.5rem;margin-top:.5rem;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
          Ir al inicio de sesión
        </router-link>
      </div>

      <!-- Reset form -->
      <div v-else>
        <div class="form-heading">
          <div class="shield-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Nueva contraseña
          </div>
          <h1>Restablecer contraseña</h1>
          <p>Elige una contraseña segura para tu cuenta UCB SmartCampus.</p>
        </div>

        <form @submit.prevent="handleReset" novalidate>

          <!-- New password -->
          <div class="field" :class="{ 'field--error': errors.newPassword, 'field--filled': form.newPassword }">
            <label for="newPassword">Nueva contraseña</label>
            <div class="input-wrap">
              <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>
              </svg>
              <input
                id="newPassword"
                v-model="form.newPassword"
                :type="show.new ? 'text' : 'password'"
                placeholder="Mín. 8 caracteres"
                @input="clearError('newPassword')"
              />
              <button type="button" class="eye-btn" @click="show.new = !show.new">
                <svg v-if="!show.new" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17.94 17.94A10.06 10.06 0 0112 20C5 20 1 12 1 12a18.09 18.09 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>

            <!-- Strength bar -->
            <div v-if="form.newPassword" class="strength-row">
              <div class="strength-track">
                <div class="strength-fill" :class="`s-${strength.level}`" :style="{ width: strength.pct + '%' }"></div>
              </div>
              <span class="strength-label" :class="`st-${strength.level}`">{{ strength.label }}</span>
            </div>

            <!-- Requirements -->
            <ul v-if="form.newPassword" class="reqs">
              <li :class="{ met: reqs.length }"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg> Mínimo 8 caracteres</li>
              <li :class="{ met: reqs.upper  }"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg> Una mayúscula</li>
              <li :class="{ met: reqs.lower  }"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg> Una minúscula</li>
              <li :class="{ met: reqs.number }"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg> Un número</li>
              <li :class="{ met: reqs.symbol }"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg> Un símbolo (!@#$%...)</li>
            </ul>

            <Transition name="err">
              <span class="err-msg" v-if="errors.newPassword">{{ errors.newPassword }}</span>
            </Transition>
          </div>

          <!-- Confirm password -->
          <div class="field" :class="{ 'field--error': errors.confirmPassword, 'field--filled': form.confirmPassword }">
            <label for="confirmPassword">Confirmar contraseña</label>
            <div class="input-wrap">
              <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>
              </svg>
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                :type="show.confirm ? 'text' : 'password'"
                placeholder="Repite la contraseña"
                @input="clearError('confirmPassword')"
              />
              <button type="button" class="eye-btn" @click="show.confirm = !show.confirm">
                <svg v-if="!show.confirm" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17.94 17.94A10.06 10.06 0 0112 20C5 20 1 12 1 12a18.09 18.09 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
            <Transition name="err">
              <span class="err-msg" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</span>
            </Transition>
          </div>

          <!-- Global error -->
          <Transition name="slide-err">
            <div class="alert-error" v-if="globalError" role="alert">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></svg>
              <span>{{ globalError }}</span>
            </div>
          </Transition>

          <button type="submit" class="btn-submit" :disabled="loading">
            <Transition name="swap" mode="out-in">
              <span v-if="!loading" key="label" class="btn-inner">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Establecer nueva contraseña
              </span>
              <span v-else key="spin" class="btn-inner">
                <svg class="spin-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 2a10 10 0 0110 10"/></svg>
                Guardando...
              </span>
            </Transition>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const API_BASE = import.meta.env.VITE_API_URL || ''
const route = useRoute()

const token      = ref('')
const validating = ref(true)
const tokenValid = ref(false)
const loading    = ref(false)
const success    = ref(false)
const globalError = ref('')

const form   = reactive({ newPassword: '', confirmPassword: '' })
const errors = reactive({ newPassword: '', confirmPassword: '' })
const show   = reactive({ new: false, confirm: false })

// Password requirements
const reqs = computed(() => ({
  length: form.newPassword.length >= 8,
  upper:  /[A-Z]/.test(form.newPassword),
  lower:  /[a-z]/.test(form.newPassword),
  number: /\d/.test(form.newPassword),
  symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.newPassword),
}))

const strength = computed(() => {
  const met = Object.values(reqs.value).filter(Boolean).length
  if (met <= 1) return { level: 'weak',   label: 'Muy débil', pct: 20 }
  if (met === 2) return { level: 'weak',   label: 'Débil',     pct: 40 }
  if (met === 3) return { level: 'fair',   label: 'Regular',   pct: 60 }
  if (met === 4) return { level: 'good',   label: 'Buena',     pct: 80 }
  return              { level: 'strong', label: 'Fuerte',    pct: 100 }
})

function clearError(field) { errors[field] = ''; globalError.value = '' }

function validate() {
  let ok = true
  if (!form.newPassword) { errors.newPassword = 'Ingresa la nueva contraseña'; ok = false }
  else if (!Object.values(reqs.value).every(Boolean)) {
    errors.newPassword = 'La contraseña no cumple todos los requisitos'; ok = false
  }
  if (!form.confirmPassword) { errors.confirmPassword = 'Confirma la contraseña'; ok = false }
  else if (form.newPassword !== form.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden'; ok = false
  }
  return ok
}

// Validate token on mount
onMounted(async () => {
  token.value = route.query.token || ''
  if (!token.value) { tokenValid.value = false; validating.value = false; return }

  try {
    const res = await fetch(
      `${API_BASE}/api/auth/validate-reset-token?token=${encodeURIComponent(token.value)}`,
      { mode: 'cors' }
    )
    const data = await res.json()
    tokenValid.value = data.valid === true
  } catch {
    tokenValid.value = false
  } finally {
    validating.value = false
  }
})

async function handleReset() {
  globalError.value = ''
  if (!validate()) return

  loading.value = true
  try {
    const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: JSON.stringify({
        token: token.value,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      })
    })
    const data = await res.json()

    if (!res.ok) {
      globalError.value = data.message || 'Error al restablecer la contraseña'
      return
    }

    success.value = true
  } catch {
    globalError.value = 'No se pudo conectar con el servidor.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.login-container {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  background: #0c1a27; font-family: 'DM Sans', sans-serif;
  overflow: hidden; position: relative; padding: 2rem;
}

/* Background */
.bg-canvas { position:absolute;inset:0;pointer-events:none; }
.grid-svg  { position:absolute;inset:0;width:100%;height:100%; }
.orb { position:absolute;border-radius:50%;filter:blur(120px); }
.orb-gold-bg { width:700px;height:700px;background:radial-gradient(circle,rgba(255,210,0,0.18) 0%,transparent 65%);top:-280px;right:-200px;animation:bgDriftA 18s ease-in-out infinite alternate; }
.orb-navy-bg { width:600px;height:600px;background:radial-gradient(circle,rgba(26,58,82,0.95) 0%,transparent 70%);bottom:-220px;left:-180px;animation:bgDriftB 22s ease-in-out infinite alternate; }
.orb-mid-bg  { width:380px;height:380px;background:radial-gradient(circle,rgba(255,210,0,0.08) 0%,transparent 70%);top:40%;left:5%;animation:bgDriftA 30s ease-in-out infinite alternate-reverse; }
@keyframes bgDriftA { from{transform:translate(0,0) scale(1)} to{transform:translate(50px,35px) scale(1.12)} }
@keyframes bgDriftB { from{transform:translate(0,0) scale(1)} to{transform:translate(-40px,28px) scale(1.08)} }

.rings { position:absolute;inset:0;pointer-events:none;display:flex;align-items:center;justify-content:center; }
.ring { position:absolute;border-radius:50%;animation:expandRing 10s ease-out infinite;opacity:0; }
.ring-1 { width:520px;height:520px;border:1px solid rgba(255,210,0,0.18);animation-delay:0s; }
.ring-2 { width:720px;height:720px;border:1px solid rgba(255,210,0,0.1);animation-delay:3.3s; }
.ring-3 { width:940px;height:940px;border:1px solid rgba(255,210,0,0.06);animation-delay:6.6s; }
@keyframes expandRing { 0%{opacity:.22;transform:scale(.78)} 100%{opacity:0;transform:scale(1.22)} }

/* Card */
.glass-card {
  position:relative;z-index:10;width:100%;max-width:440px;
  background:rgba(14,38,65,0.68);backdrop-filter:blur(32px) saturate(170%);
  -webkit-backdrop-filter:blur(32px) saturate(170%);
  border-radius:22px;padding:2.5rem 2.5rem 2rem;
  box-shadow:0 0 0 1px rgba(255,210,0,0.22),0 2px 0 0 #FFD200 inset,0 44px 100px rgba(0,0,0,0.55),inset 0 1px 0 rgba(255,255,255,0.08);
  animation:cardIn 0.6s cubic-bezier(0.34,1.5,0.64,1) both;
  max-height:95vh;overflow-y:auto;
}
@keyframes cardIn { from{opacity:0;transform:translateY(34px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }

/* Brand */
.brand { display:flex;align-items:center;gap:.85rem;margin-bottom:1.4rem; }
.brand-mark { width:50px;height:50px;flex-shrink:0;background:linear-gradient(135deg,#FFD200,#ffc000);border-radius:13px;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 20px rgba(255,210,0,0.32); }
.brand-name { font-family:'Syne',sans-serif;font-weight:800;font-size:1.05rem;color:#fff;letter-spacing:-.3px;line-height:1.15;display:block; }
.brand-sub  { font-size:.67rem;color:rgba(255,255,255,.38);display:block;margin-top:.15rem; }
.divider { height:1px;background:linear-gradient(to right,transparent,rgba(255,255,255,0.1),transparent);margin-bottom:1.4rem; }

/* States */
.center-state { display:flex;flex-direction:column;align-items:center;gap:1rem;text-align:center;padding:.5rem 0; }
.center-state p { font-size:.84rem;color:rgba(255,255,255,.42);line-height:1.6; }
.error-icon { width:64px;height:64px;background:#fee2e2;border-radius:50%;display:flex;align-items:center;justify-content:center; }
.error-title { font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:800;color:#fff;margin:0; }
.error-body  { font-size:.83rem;color:rgba(255,255,255,.45);line-height:1.6;margin:0; }
.success-icon { width:72px;height:72px;background:#dcfce7;border-radius:50%;display:flex;align-items:center;justify-content:center; }
.success-title { font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:800;color:#fff;margin:0; }
.success-body  { font-size:.83rem;color:rgba(255,255,255,.5);line-height:1.6;margin:0; }

.btn-request-new {
  display:inline-flex;align-items:center;gap:.5rem;
  padding:.65rem 1.4rem;background:rgba(239,68,68,0.15);color:#fca5a5;
  border:1px solid rgba(239,68,68,0.3);border-radius:10px;
  font-size:.84rem;font-weight:600;text-decoration:none;transition:all .2s;
}
.btn-request-new:hover { background:rgba(239,68,68,0.25); }

/* Loading spinner */
.spin-large { animation:spinAnim .8s linear infinite; }
@keyframes spinAnim { to{transform:rotate(360deg)} }

/* Badge */
.shield-badge {
  display:inline-flex;align-items:center;gap:.4rem;
  font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.6px;
  color:#FFD200;background:rgba(255,210,0,0.1);border:1px solid rgba(255,210,0,0.2);
  padding:.3rem .7rem;border-radius:20px;margin-bottom:.8rem;
}

/* Heading */
.form-heading { margin-bottom:1.4rem; }
.form-heading h1 { font-family:'Syne',sans-serif;font-size:1.5rem;font-weight:800;color:#fff;letter-spacing:-.8px;line-height:1;margin-bottom:.3rem; }
.form-heading p  { font-size:.82rem;color:rgba(255,255,255,.42); }

/* Fields */
.field { margin-bottom:.9rem; }
.field label { display:block;font-size:.71rem;font-weight:600;color:rgba(255,255,255,.55);text-transform:uppercase;letter-spacing:.7px;margin-bottom:.4rem; }
.input-wrap { position:relative;display:flex;align-items:center; }
.input-icon { position:absolute;left:.88rem;color:rgba(255,255,255,.28);pointer-events:none;transition:color .2s; }
.input-wrap:focus-within .input-icon { color:#FFD200; }
.field input { width:100%;padding:.76rem 2.75rem .76rem 2.5rem;border:1.5px solid rgba(255,255,255,.1);border-radius:10px;font-size:.875rem;font-family:'DM Sans',sans-serif;color:#fff;background:rgba(255,255,255,.07);outline:none;transition:border-color .22s,background .22s,box-shadow .22s; }
.field input::placeholder { color:rgba(255,255,255,.2); }
.field input:focus { border-color:#FFD200;background:rgba(255,210,0,.05);box-shadow:0 0 0 3.5px rgba(255,210,0,.1); }
.field--error input { border-color:rgba(248,113,113,.65);background:rgba(248,113,113,.06); }
.field--filled input:not(:focus) { border-color:rgba(255,255,255,.17);background:rgba(255,255,255,.09); }
.eye-btn { position:absolute;right:.85rem;background:none;border:none;cursor:pointer;color:rgba(255,255,255,.28);display:flex;align-items:center;padding:4px;border-radius:6px;line-height:0;transition:color .2s; }
.eye-btn:hover { color:rgba(255,255,255,.7); }
.err-msg { display:inline-flex;align-items:center;gap:4px;margin-top:.28rem;font-size:.72rem;font-weight:600;color:#fca5a5; }

/* Strength bar */
.strength-row { display:flex;align-items:center;gap:.6rem;margin-top:.4rem; }
.strength-track { flex:1;height:4px;background:rgba(255,255,255,.1);border-radius:4px;overflow:hidden; }
.strength-fill  { height:100%;border-radius:4px;transition:width .3s,background .3s; }
.s-weak   { background:#ef4444; }
.s-fair   { background:#f59e0b; }
.s-good   { background:#3b82f6; }
.s-strong { background:#22c55e; }
.strength-label { font-size:.7rem;font-weight:600;white-space:nowrap; }
.st-weak   { color:#ef4444; }
.st-fair   { color:#f59e0b; }
.st-good   { color:#3b82f6; }
.st-strong { color:#22c55e; }

/* Requirements */
.reqs { list-style:none;display:flex;flex-direction:column;gap:.22rem;margin-top:.45rem; }
.reqs li { display:flex;align-items:center;gap:.4rem;font-size:.72rem;color:rgba(255,255,255,.3);transition:color .2s; }
.reqs li svg { opacity:.3;transition:opacity .2s;flex-shrink:0; }
.reqs li.met { color:rgba(255,255,255,.7); }
.reqs li.met svg { opacity:1;stroke:#22c55e; }

/* Alert */
.alert-error { display:flex;align-items:flex-start;gap:.55rem;padding:.7rem 1rem;background:rgba(220,38,38,.12);border:1px solid rgba(220,38,38,.25);border-left:3px solid #f87171;border-radius:10px;margin-bottom:1rem;font-size:.81rem;font-weight:500;color:#fca5a5;line-height:1.45; }

/* Submit */
.btn-submit { width:100%;padding:.83rem 1.2rem;background:linear-gradient(135deg,#FFD200,#ffca00);border:none;border-radius:10px;color:#0c1a27;font-family:'Syne',sans-serif;font-size:.93rem;font-weight:800;letter-spacing:.5px;cursor:pointer;transition:transform .2s,box-shadow .2s,opacity .2s;margin-top:.5rem; }
.btn-submit:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 10px 28px rgba(255,210,0,.4); }
.btn-submit:disabled { opacity:.55;cursor:not-allowed; }
.btn-inner { display:inline-flex;align-items:center;justify-content:center;gap:.5rem; }
.spin-svg { animation:spinAnim .65s linear infinite; }

/* Transitions */
.err-enter-active,.err-leave-active { transition:all .2s ease; }
.err-enter-from,.err-leave-to { opacity:0;transform:translateY(-4px); }
.slide-err-enter-active,.slide-err-leave-active { transition:all .26s ease;overflow:hidden; }
.slide-err-enter-from,.slide-err-leave-to { opacity:0;max-height:0; }
.slide-err-enter-to,.slide-err-leave-from { max-height:80px; }
.swap-enter-active,.swap-leave-active { transition:all .17s ease; }
.swap-enter-from { opacity:0;transform:translateY(6px); }
.swap-leave-to   { opacity:0;transform:translateY(-6px); }
</style>
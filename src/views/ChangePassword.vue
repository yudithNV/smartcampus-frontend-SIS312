<template>
  <div class="login-container">

    <!-- ── Canvas de fondo (idéntico al login) ── -->
    <div class="bg-canvas" aria-hidden="true">
      <div class="orb orb-gold-bg"></div>
      <div class="orb orb-navy-bg"></div>
      <div class="orb orb-mid-bg"></div>
      <svg class="grid-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="52" height="52" patternUnits="userSpaceOnUse">
            <path d="M 52 0 L 0 0 0 52" fill="none" stroke="rgba(255,210,0,0.03)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)"/>
      </svg>
    </div>

    <div class="particles" aria-hidden="true">
      <span class="p p1"></span><span class="p p2"></span><span class="p p3"></span>
      <span class="p p4"></span><span class="p p5"></span><span class="p p6"></span>
      <span class="p p7"></span><span class="p p8"></span><span class="p p9"></span>
      <span class="p p10"></span><span class="p p11"></span><span class="p p12"></span>
    </div>

    <div class="rings" aria-hidden="true">
      <div class="ring ring-1"></div>
      <div class="ring ring-2"></div>
      <div class="ring ring-3"></div>
    </div>

    <!-- ── Glass card ── -->
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

      <!-- Encabezado con ícono de seguridad -->
      <div class="form-heading">
        <div class="security-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Seguridad de cuenta
        </div>
        <h1>Cambiar contraseña</h1>
        <p>Por seguridad, debes establecer una contraseña personal antes de continuar.</p>
      </div>

      <form @submit.prevent="handleSubmit" novalidate>

        <!-- Contraseña actual -->
        <div class="field" :class="{ 'field--error': errors.currentPassword, 'field--filled': form.currentPassword }">
          <label for="currentPassword">Contraseña actual</label>
          <div class="input-wrap">
            <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <rect x="5" y="11" width="14" height="10" rx="2"/>
              <path d="M8 11V7a4 4 0 018 0v4"/>
            </svg>
            <input
              id="currentPassword"
              v-model="form.currentPassword"
              :type="show.current ? 'text' : 'password'"
              placeholder="Tu contraseña actual"
              @input="clearError('currentPassword')"
            />
            <button type="button" class="eye-btn" @click="show.current = !show.current">
              <svg v-if="!show.current" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17.94 17.94A10.06 10.06 0 0112 20C5 20 1 12 1 12a18.09 18.09 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </button>
          </div>
          <Transition name="err">
            <span class="err-msg" v-if="errors.currentPassword">{{ errors.currentPassword }}</span>
          </Transition>
        </div>

        <!-- Nueva contraseña -->
        <div class="field" :class="{ 'field--error': errors.newPassword, 'field--filled': form.newPassword }">
          <label for="newPassword">Nueva contraseña</label>
          <div class="input-wrap">
            <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <rect x="5" y="11" width="14" height="10" rx="2"/>
              <path d="M8 11V7a4 4 0 018 0v4"/>
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
          <!-- Indicador de fortaleza -->
          <div v-if="form.newPassword" class="strength-bar">
            <div class="strength-bar__track">
              <div class="strength-bar__fill" :class="`strength--${strength.level}`" :style="{ width: strength.pct + '%' }"></div>
            </div>
            <span class="strength-bar__label" :class="`strength-text--${strength.level}`">{{ strength.label }}</span>
          </div>
          <!-- Requisitos -->
          <ul v-if="form.newPassword" class="requirements">
            <li :class="{ met: reqs.length }">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg>
              Mínimo 8 caracteres
            </li>
            <li :class="{ met: reqs.upper }">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg>
              Una letra mayúscula
            </li>
            <li :class="{ met: reqs.lower }">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg>
              Una letra minúscula
            </li>
            <li :class="{ met: reqs.number }">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg>
              Un número
            </li>
            <li :class="{ met: reqs.symbol }">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg>
              Un símbolo (!@#$%...)
            </li>
          </ul>
          <Transition name="err">
            <span class="err-msg" v-if="errors.newPassword">{{ errors.newPassword }}</span>
          </Transition>
        </div>

        <!-- Confirmar contraseña -->
        <div class="field" :class="{ 'field--error': errors.confirmPassword, 'field--filled': form.confirmPassword }">
          <label for="confirmPassword">Confirmar nueva contraseña</label>
          <div class="input-wrap">
            <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <rect x="5" y="11" width="14" height="10" rx="2"/>
              <path d="M8 11V7a4 4 0 018 0v4"/>
            </svg>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              :type="show.confirm ? 'text' : 'password'"
              placeholder="Repite la nueva contraseña"
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

        <!-- Error global del servidor -->
        <Transition name="slide-err">
          <div class="alert-error" v-if="globalError" role="alert">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.6" fill="currentColor"/></svg>
            <span>{{ globalError }}</span>
          </div>
        </Transition>

        <!-- Botón submit -->
        <button type="submit" class="btn-submit" :disabled="loading">
          <Transition name="swap" mode="out-in">
            <span v-if="!loading" key="label" class="btn-inner">
              Establecer contraseña
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </span>
            <span v-else key="spinner" class="btn-inner">
              <svg class="spin-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 2a10 10 0 0110 10"/></svg>
              Guardando
            </span>
          </Transition>
        </button>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// ─── Estado ───────────────────────────────────────────────────────────────────
const form = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' })
const errors = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' })
const show = reactive({ current: false, new: false, confirm: false })
const globalError = ref('')
const loading = ref(false)

// ─── Requisitos de contraseña (reactivos) ─────────────────────────────────────
const reqs = computed(() => ({
  length: form.newPassword.length >= 8,
  upper:  /[A-Z]/.test(form.newPassword),
  lower:  /[a-z]/.test(form.newPassword),
  number: /\d/.test(form.newPassword),
  symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.newPassword),
}))

// ─── Indicador de fortaleza ───────────────────────────────────────────────────
const strength = computed(() => {
  const met = Object.values(reqs.value).filter(Boolean).length
  if (met <= 1) return { level: 'weak',   label: 'Muy débil',  pct: 20 }
  if (met === 2) return { level: 'weak',   label: 'Débil',      pct: 40 }
  if (met === 3) return { level: 'fair',   label: 'Regular',    pct: 60 }
  if (met === 4) return { level: 'good',   label: 'Buena',      pct: 80 }
  return              { level: 'strong', label: 'Fuerte',     pct: 100 }
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
    errors.newPassword = 'La contraseña no cumple todos los requisitos de seguridad'; ok = false
  }
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Confirma la nueva contraseña'; ok = false
  } else if (form.newPassword !== form.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden'; ok = false
  }
  return ok
}

// ─── Submit ───────────────────────────────────────────────────────────────────
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
    if (!res.ok) throw new Error(data.error || data.message || 'Error al cambiar la contraseña')

    // Contraseña cambiada — redirigir al dashboard según el rol
    localStorage.setItem('pwd_changed', '1')
    const role = localStorage.getItem('ucb_role')
    const redirectMap = {
      ESTUDIANTE:    '/estudiante/dashboard',
      PUBLICADOR:    '/publicador/dashboard',
      ADMINISTRADOR: '/admin/dashboard',
    }
    router.push(redirectMap[role] || '/')

  } catch (err) {
    globalError.value = err.name === 'TypeError'
      ? 'No se pudo conectar con el servidor.'
      : (err.message || 'Error al cambiar la contraseña')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0c1a27;
  font-family: 'DM Sans', sans-serif;
  overflow: hidden;
  position: relative;
  padding: 2rem;
}

/* ── Fondo — idéntico al login ─────────────────────────────────────────────── */
.bg-canvas { position: absolute; inset: 0; pointer-events: none; }
.grid-svg  { position: absolute; inset: 0; width: 100%; height: 100%; }

.orb { position: absolute; border-radius: 50%; filter: blur(120px); }
.orb-gold-bg {
  width: 700px; height: 700px;
  background: radial-gradient(circle, rgba(255,210,0,0.18) 0%, transparent 65%);
  top: -280px; right: -200px;
  animation: bgDriftA 18s ease-in-out infinite alternate;
}
.orb-navy-bg {
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(26,58,82,0.95) 0%, transparent 70%);
  bottom: -220px; left: -180px;
  animation: bgDriftB 22s ease-in-out infinite alternate;
}
.orb-mid-bg {
  width: 380px; height: 380px;
  background: radial-gradient(circle, rgba(255,210,0,0.08) 0%, transparent 70%);
  top: 40%; left: 5%;
  animation: bgDriftA 30s ease-in-out infinite alternate-reverse;
}
@keyframes bgDriftA { from { transform: translate(0,0) scale(1); } to { transform: translate(50px,35px) scale(1.12); } }
@keyframes bgDriftB { from { transform: translate(0,0) scale(1); } to { transform: translate(-40px,28px) scale(1.08); } }

.rings { position: absolute; inset: 0; pointer-events: none; display: flex; align-items: center; justify-content: center; }
.ring { position: absolute; border-radius: 50%; animation: expandRing 10s ease-out infinite; opacity: 0; }
.ring-1 { width: 520px; height: 520px; border: 1px solid rgba(255,210,0,0.18); animation-delay: 0s; }
.ring-2 { width: 720px; height: 720px; border: 1px solid rgba(255,210,0,0.1);  animation-delay: 3.3s; }
.ring-3 { width: 940px; height: 940px; border: 1px solid rgba(255,210,0,0.06); animation-delay: 6.6s; }
@keyframes expandRing { 0% { opacity: 0.22; transform: scale(0.78); } 100% { opacity: 0; transform: scale(1.22); } }

.particles { position: absolute; inset: 0; pointer-events: none; }
.p { position: absolute; border-radius: 50%; }
.p1  { width:8px;  height:8px;  background:rgba(255,210,0,0.7);   box-shadow:0 0 12px rgba(255,210,0,0.6);   top:22%; left:18%;  animation:float1 7s  ease-in-out infinite; }
.p2  { width:5px;  height:5px;  background:rgba(255,210,0,0.5);   box-shadow:0 0 8px  rgba(255,210,0,0.5);   top:68%; left:12%;  animation:float2 9s  ease-in-out infinite; }
.p3  { width:10px; height:10px; background:rgba(255,210,0,0.55);  box-shadow:0 0 16px rgba(255,210,0,0.45);  top:15%; right:22%; animation:float3 8s  ease-in-out infinite; }
.p4  { width:6px;  height:6px;  background:rgba(255,210,0,0.65);  box-shadow:0 0 10px rgba(255,210,0,0.55);  top:75%; right:18%; animation:float4 11s ease-in-out infinite; }
.p5  { width:4px;  height:4px;  background:rgba(255,210,0,0.8);   box-shadow:0 0 8px  rgba(255,210,0,0.7);   top:45%; left:8%;   animation:float1 6s  ease-in-out infinite 1s; }
.p6  { width:7px;  height:7px;  background:rgba(255,210,0,0.45);  box-shadow:0 0 12px rgba(255,210,0,0.4);   top:55%; right:10%; animation:float2 10s ease-in-out infinite 2s; }
.p7  { width:9px;  height:9px;  background:rgba(100,180,255,0.55);box-shadow:0 0 14px rgba(100,180,255,0.45);top:30%; left:25%;  animation:float3 12s ease-in-out infinite 0.5s; }
.p8  { width:5px;  height:5px;  background:rgba(100,180,255,0.65);box-shadow:0 0 8px  rgba(100,180,255,0.55);top:80%; left:30%;  animation:float4 8s  ease-in-out infinite 1.5s; }
.p9  { width:7px;  height:7px;  background:rgba(100,180,255,0.5); box-shadow:0 0 12px rgba(100,180,255,0.4); top:10%; right:35%; animation:float1 9s  ease-in-out infinite 3s; }
.p10 { width:4px;  height:4px;  background:rgba(100,180,255,0.7); box-shadow:0 0 8px  rgba(100,180,255,0.6); top:62%; right:28%; animation:float2 7s  ease-in-out infinite 2.5s; }
.p11 { width:3px;  height:3px;  background:rgba(255,255,255,0.6);                                             top:38%; left:15%;  animation:float3 13s ease-in-out infinite 1s; }
.p12 { width:3px;  height:3px;  background:rgba(255,255,255,0.5);                                             top:50%; right:15%; animation:float4 11s ease-in-out infinite 4s; }

@keyframes float1 { 0%,100%{transform:translateY(0) translateX(0);opacity:.9} 25%{transform:translateY(-22px) translateX(8px);opacity:.6} 50%{transform:translateY(-14px) translateX(-6px);opacity:1} 75%{transform:translateY(-30px) translateX(4px);opacity:.7} }
@keyframes float2 { 0%,100%{transform:translateY(0) translateX(0);opacity:.8} 33%{transform:translateY(-18px) translateX(-10px);opacity:.5} 66%{transform:translateY(-28px) translateX(8px);opacity:1} }
@keyframes float3 { 0%,100%{transform:translateY(0) translateX(0) scale(1);opacity:.7} 50%{transform:translateY(-24px) translateX(12px) scale(1.3);opacity:1} }
@keyframes float4 { 0%,100%{transform:translateY(0) translateX(0);opacity:.6} 40%{transform:translateY(18px) translateX(-8px);opacity:1} 70%{transform:translateY(-12px) translateX(10px);opacity:.8} }

/* ── Card ──────────────────────────────────────────────────────────────────── */
.glass-card {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 460px;
  background: rgba(14, 38, 65, 0.68);
  backdrop-filter: blur(32px) saturate(170%);
  -webkit-backdrop-filter: blur(32px) saturate(170%);
  border-radius: 22px;
  padding: 2.5rem 2.5rem 2rem;
  box-shadow:
    0 0 0 1px rgba(255,210,0,0.22),
    0 2px 0 0 #FFD200 inset,
    0 0 60px rgba(255,210,0,0.06),
    0 44px 100px rgba(0,0,0,0.55),
    inset 0 1px 0 rgba(255,255,255,0.08);
  animation: cardIn 0.6s cubic-bezier(0.34,1.5,0.64,1) both;
  max-height: 95vh;
  overflow-y: auto;
}
@keyframes cardIn { from{opacity:0;transform:translateY(34px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }

/* ── Brand ─────────────────────────────────────────────────────────────────── */
.brand { display:flex; align-items:center; gap:.85rem; margin-bottom:1.4rem; }
.brand-mark { width:50px; height:50px; flex-shrink:0; background:linear-gradient(135deg,#FFD200 0%,#ffc000 100%); border-radius:13px; display:flex; align-items:center; justify-content:center; box-shadow:0 6px 20px rgba(255,210,0,0.32); }
.brand-text { display:flex; flex-direction:column; }
.brand-name { font-family:'Syne',sans-serif; font-weight:800; font-size:1.05rem; color:#fff; letter-spacing:-0.3px; line-height:1.15; }
.brand-sub  { font-size:.67rem; color:rgba(255,255,255,.38); margin-top:.15rem; }

.divider { height:1px; background:linear-gradient(to right,transparent,rgba(255,255,255,0.1),transparent); margin-bottom:1.4rem; }

/* ── Heading ───────────────────────────────────────────────────────────────── */
.form-heading { margin-bottom:1.5rem; }

.security-badge {
  display: inline-flex;
  align-items: center;
  gap: .4rem;
  font-size: .7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .6px;
  color: #FFD200;
  background: rgba(255,210,0,0.1);
  border: 1px solid rgba(255,210,0,0.2);
  padding: .3rem .7rem;
  border-radius: 20px;
  margin-bottom: .8rem;
}

.form-heading h1 { font-family:'Syne',sans-serif; font-size:1.7rem; font-weight:800; color:#fff; letter-spacing:-.8px; line-height:1; margin-bottom:.3rem; }
.form-heading p  { font-size:.82rem; color:rgba(255,255,255,.42); line-height:1.5; }

/* ── Fields ────────────────────────────────────────────────────────────────── */
.field { margin-bottom:1rem; }
.field label { display:block; font-size:.71rem; font-weight:600; color:rgba(255,255,255,.55); text-transform:uppercase; letter-spacing:.7px; margin-bottom:.4rem; }
.input-wrap  { position:relative; display:flex; align-items:center; }
.input-icon  { position:absolute; left:.88rem; color:rgba(255,255,255,.28); pointer-events:none; transition:color .2s; }
.input-wrap:focus-within .input-icon { color:#FFD200; }

.field input {
  width:100%; padding:.76rem 2.75rem .76rem 2.5rem;
  border:1.5px solid rgba(255,255,255,.1); border-radius:10px;
  font-size:.875rem; font-family:'DM Sans',sans-serif; color:#fff;
  background:rgba(255,255,255,.07); outline:none;
  transition:border-color .22s, background .22s, box-shadow .22s;
}
.field input::placeholder { color:rgba(255,255,255,.2); }
.field input:focus { border-color:#FFD200; background:rgba(255,210,0,.05); box-shadow:0 0 0 3.5px rgba(255,210,0,.1); }
.field--error input { border-color:rgba(248,113,113,.65); background:rgba(248,113,113,.06); box-shadow:0 0 0 3px rgba(220,38,38,.1); }
.field--filled input:not(:focus) { border-color:rgba(255,255,255,.17); background:rgba(255,255,255,.09); }

.eye-btn { position:absolute; right:.85rem; background:none; border:none; cursor:pointer; color:rgba(255,255,255,.28); display:flex; align-items:center; padding:4px; border-radius:6px; line-height:0; transition:color .2s, background .15s; }
.eye-btn:hover { color:rgba(255,255,255,.7); background:rgba(255,255,255,.07); }

.err-msg { display:inline-flex; align-items:center; gap:4px; margin-top:.28rem; font-size:.72rem; font-weight:600; color:#fca5a5; }

/* ── Indicador de fortaleza ────────────────────────────────────────────────── */
.strength-bar { display:flex; align-items:center; gap:.6rem; margin-top:.4rem; }
.strength-bar__track { flex:1; height:4px; background:rgba(255,255,255,.1); border-radius:4px; overflow:hidden; }
.strength-bar__fill  { height:100%; border-radius:4px; transition:width .3s ease, background .3s ease; }
.strength--weak   { background:#ef4444; }
.strength--fair   { background:#f59e0b; }
.strength--good   { background:#3b82f6; }
.strength--strong { background:#22c55e; }
.strength-bar__label { font-size:.7rem; font-weight:600; white-space:nowrap; }
.strength-text--weak   { color:#ef4444; }
.strength-text--fair   { color:#f59e0b; }
.strength-text--good   { color:#3b82f6; }
.strength-text--strong { color:#22c55e; }

/* ── Requisitos ────────────────────────────────────────────────────────────── */
.requirements { list-style:none; display:flex; flex-direction:column; gap:.25rem; margin-top:.5rem; }
.requirements li {
  display:flex; align-items:center; gap:.4rem;
  font-size:.72rem; color:rgba(255,255,255,.3);
  transition:color .2s;
}
.requirements li svg { opacity:.3; transition:opacity .2s; flex-shrink:0; }
.requirements li.met { color:rgba(255,255,255,.7); }
.requirements li.met svg { opacity:1; stroke:#22c55e; }

/* ── Alert ─────────────────────────────────────────────────────────────────── */
.alert-error { display:flex; align-items:flex-start; gap:.55rem; padding:.7rem 1rem; background:rgba(220,38,38,.12); border:1px solid rgba(220,38,38,.25); border-left:3px solid #f87171; border-radius:10px; margin-bottom:1rem; font-size:.81rem; font-weight:500; color:#fca5a5; line-height:1.45; }

/* ── Submit ────────────────────────────────────────────────────────────────── */
.btn-submit { width:100%; padding:.83rem 1.2rem; background:linear-gradient(135deg,#FFD200 0%,#ffca00 100%); border:none; border-radius:10px; color:#0c1a27; font-family:'Syne',sans-serif; font-size:.93rem; font-weight:800; letter-spacing:.5px; cursor:pointer; transition:transform .2s, box-shadow .2s, opacity .2s; position:relative; overflow:hidden; margin-top:.5rem; }
.btn-submit::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,.28) 0%,transparent 55%); opacity:0; transition:opacity .22s; }
.btn-submit:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 10px 28px rgba(255,210,0,.4); }
.btn-submit:hover:not(:disabled)::after { opacity:1; }
.btn-submit:disabled { opacity:.55; cursor:not-allowed; }
.btn-inner { position:relative; z-index:1; display:inline-flex; align-items:center; justify-content:center; gap:.5rem; }
.spin-svg { animation:spinAnim .65s linear infinite; }
@keyframes spinAnim { to{transform:rotate(360deg)} }

/* ── Transitions ───────────────────────────────────────────────────────────── */
.err-enter-active,.err-leave-active{transition:all .2s ease}
.err-enter-from,.err-leave-to{opacity:0;transform:translateY(-4px)}
.slide-err-enter-active,.slide-err-leave-active{transition:all .26s ease;overflow:hidden}
.slide-err-enter-from,.slide-err-leave-to{opacity:0;transform:translateY(-6px);max-height:0}
.slide-err-enter-to,.slide-err-leave-from{max-height:80px}
.swap-enter-active,.swap-leave-active{transition:all .17s ease}
.swap-enter-from{opacity:0;transform:translateY(6px)}
.swap-leave-to{opacity:0;transform:translateY(-6px)}

@media(max-width:480px){
  .glass-card{padding:2rem 1.6rem 1.6rem}
  .form-heading h1{font-size:1.4rem}
}
</style>
<template>
  <div class="login-container">

    <!-- ── Canvas de fondo ── -->
    <div class="bg-canvas" aria-hidden="true">
      <!-- Orbes grandes de fondo -->
      <div class="orb orb-gold-bg"></div>
      <div class="orb orb-navy-bg"></div>
      <div class="orb orb-mid-bg"></div>

      <!-- Grid sutil -->
      <svg class="grid-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="52" height="52" patternUnits="userSpaceOnUse">
            <path d="M 52 0 L 0 0 0 52" fill="none" stroke="rgba(255,210,0,0.03)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)"/>
      </svg>
    </div>

    <!-- ── Partículas flotantes alrededor del card ── -->
    <div class="particles" aria-hidden="true">
      <span class="p p1"></span>
      <span class="p p2"></span>
      <span class="p p3"></span>
      <span class="p p4"></span>
      <span class="p p5"></span>
      <span class="p p6"></span>
      <span class="p p7"></span>
      <span class="p p8"></span>
      <span class="p p9"></span>
      <span class="p p10"></span>
      <span class="p p11"></span>
      <span class="p p12"></span>
    </div>

    <!-- ── Anillos animados centrados en el card ── -->
    <div class="rings" aria-hidden="true">
      <div class="ring ring-1"></div>
      <div class="ring ring-2"></div>
      <div class="ring ring-3"></div>
    </div>

    <!-- ── Glass card ── -->
    <div class="glass-card">

      <!-- Logo -->
      <div class="brand">
        <div class="brand-mark">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3L2 8l10 5 10-5-10-5z" fill="#0c1a27" stroke-width="0"/>
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

      <div class="form-heading">
        <h1>Iniciar Sesión</h1>
        <p>Ingresa con tus credenciales institucionales</p>
      </div>

      <form @submit.prevent="handleLogin" novalidate>

        <!-- Email -->
        <div class="field" :class="{ 'field--error': errors.email, 'field--filled': form.email }">
          <label for="email">Correo Electrónico</label>
          <div class="input-wrap">
            <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="M2 7l10 7 10-7"/>
            </svg>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="usuario@ucb.edu.bo"
              autocomplete="email"
              @input="clearErrors"
            />
          </div>
          <Transition name="err">
            <span class="err-msg" v-if="errors.email" role="alert">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="currentColor"/></svg>
              {{ errors.email }}
            </span>
          </Transition>
        </div>

        <!-- Password -->
        <div class="field" :class="{ 'field--error': errors.password, 'field--filled': form.password }">
          <label for="password">Contraseña</label>
          <div class="input-wrap">
            <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="5" y="11" width="14" height="10" rx="2"/>
              <path d="M8 11V7a4 4 0 018 0v4"/>
            </svg>
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              autocomplete="current-password"
              @input="clearErrors"
            />
            <button
              type="button"
              class="eye-btn"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            >
              <svg v-if="!showPassword" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.94 17.94A10.06 10.06 0 0112 20C5 20 1 12 1 12a18.09 18.09 0 015.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </button>
          </div>
          <Transition name="err">
            <span class="err-msg" v-if="errors.password" role="alert">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="currentColor"/></svg>
              {{ errors.password }}
            </span>
          </Transition>
        </div>

        <!-- Global error -->
        <Transition name="slide-err">
          <div
            v-if="globalError"
            class="alert-error"
            :class="{ 'alert-error--blocked': isBlockedError }"
            role="alert"
          >
            <!-- Ícono candado si está bloqueado -->
            <svg
              v-if="isBlockedError"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <rect x="5" y="11" width="14" height="10" rx="2"/>
              <path d="M8 11V7a4 4 0 018 0v4"/>
            </svg>

            <!-- Ícono normal -->
            <svg
              v-else
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <circle cx="12" cy="16" r="0.6" fill="currentColor"/>
            </svg>

            <span>{{ globalError }}</span>
          </div>
        </Transition>

        <!-- Options row -->
        <div class="options-row">
          <label class="remember-label">
            <input type="checkbox" v-model="remember" />
            <span class="custom-check">
              <svg v-if="remember" width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="#0c1a27" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="1.5,6 5,9.5 10.5,2.5"/>
              </svg>
            </span>
            <span>Recordarme</span>
          </label>
          <router-link to="/forgot-password" class="forgot-link">
            ¿Olvidaste tu contraseña?
          </router-link>
        </div>

        <!-- Submit -->
        <<button  
          type="submit" 
          class="btn-submit" 
          :disabled="loading || !form.email.trim() || !form.password"
        >
          <Transition name="swap" mode="out-in">
            <span v-if="!loading" key="label" class="btn-inner">
              Ingresar
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </span>
            <span v-else key="spinner" class="btn-inner">
              <svg class="spin-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <path d="M12 2a10 10 0 0110 10"/>
              </svg>
              Verificando
            </span>
          </Transition>
        </button>
      </form>

      <div class="back-link">
        <router-link to="/">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Volver al sitio principal
        </router-link>
      </div>
    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, reactive, computed } from 'vue'

const router = useRouter()

const form      = reactive({ email: '', password: '' })
const errors    = reactive({ email: '', password: '' })
const globalError  = ref('')
const loading      = ref(false)
const showPassword = ref(false)
const remember     = ref(false)


const isBlockedError = computed(() =>
  globalError.value?.toLowerCase().includes('bloquead') ||
  globalError.value?.toLowerCase().includes('inactiv')
)


function clearErrors () {
  errors.email = ''
  errors.password = ''
  globalError.value = ''
}

function validate () {
  let ok = true
  if (!form.email.trim()) {
    errors.email = 'El correo es obligatorio'; ok = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Formato de correo inválido'; ok = false
  }
  if (!form.password) {
    errors.password = 'La contraseña es obligatoria'; ok = false
  }
  return ok
}

async function handleLogin () {
  clearErrors()

  if (!validate()) return

  loading.value = true

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email.trim(), password: form.password })
    })

    const data = await res.json()

    
    //  CASO 1: USUARIO BLOQUEADO
    if (
      res.status === 403 ||
      res.status === 423 ||
      data.error === 'USER_BLOCKED'
    ) {
      loading.value = false

      globalError.value =
        'Usuario bloqueado. Comuníquese con el administrador.'

      // limpieza de seguridad
      localStorage.removeItem('ucb_token')
      localStorage.removeItem('ucb_role')

      return
    }

    // ─────────────────────────────
    //  CASO 2: ERROR NORMAL LOGIN
    // ─────────────────────────────
    if (!res.ok) {
      loading.value = false

      if (res.status === 403 || res.status === 423) {
        globalError.value =
          'Usuario bloqueado. Comuníquese con el administrador.'
      } else {
        globalError.value =
          data.message || data.error || 'Error al iniciar sesión'
      }

      return
    }
    // ─────────────────────────────
    //  LOGIN OK
    // ─────────────────────────────
    // LOGIN OK
    localStorage.setItem('ucb_token', data.token)
    localStorage.setItem('ucb_role',  data.role)
    localStorage.setItem('ucb_email', form.email.trim())

    if (data.mustChangePassword) {
      localStorage.setItem('must_change_password', '1')
    }

    // ── AGREGAR: obtener id y nombre del usuario ──
    try {
      const meRes = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${data.token}`,
          'Content-Type': 'application/json'
        }
      })
      if (meRes.ok) {
        const meData = await meRes.json()
        const me = meData.data ?? meData
        localStorage.setItem('ucb_user_id', me.id)
        localStorage.setItem('ucb_name',    me.fullName)
      }
    } catch (e) {
      console.warn('No se pudo obtener perfil:', e)
    }
    // ─────────────────────────────────────────────

    let finalUrl = data.redirectUrl
    if (data.role === 'ESTUDIANTE') {
      finalUrl = '/estudiante/eventos'
    }
    router.push(finalUrl)

  } catch (err) {
    loading.value = false

    globalError.value =
      err.name === 'TypeError'
        ? 'No se pudo conectar con el servidor. Verifica que el backend esté activo.'
        : (err.message || 'Error al iniciar sesión')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

/* ─── Tokens ─── */
:root {
  --navy:     #0c1a27;
  --navy-mid: #1a3a52;
  --gold:     #FFD200;
  --gold-glow:rgba(255,210,0,0.32);
  --gold-dim: rgba(255,210,0,0.15);
  --danger:   #dc2626;
}


/* ─── bloqueado ─── */
.alert-error--blocked {
  background: rgba(220, 38, 38, 0.18);
  border-color: rgba(239, 68, 68, 0.45);
  border-left-color: #ef4444;
  color: #fca5a5;
}

/* ─── Contenedor ─── */
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

/* ─── Fondo general ─── */
.bg-canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.grid-svg {
  position: absolute;
  inset: 0;
  width: 100%; height: 100%;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
}

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

@keyframes bgDriftA {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(50px, 35px) scale(1.12); }
}
@keyframes bgDriftB {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(-40px, 28px) scale(1.08); }
}

/* ─── Anillos expandiéndose ─── */
.rings {
  position: absolute;
  inset: 0;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring {
  position: absolute;
  border-radius: 50%;
  animation: expandRing 10s ease-out infinite;
  opacity: 0;
}

.ring-1 {
  width: 520px; height: 520px;
  border: 1px solid rgba(255,210,0,0.18);
  animation-delay: 0s;
}
.ring-2 {
  width: 720px; height: 720px;
  border: 1px solid rgba(255,210,0,0.1);
  animation-delay: 3.3s;
}
.ring-3 {
  width: 940px; height: 940px;
  border: 1px solid rgba(255,210,0,0.06);
  animation-delay: 6.6s;
}

@keyframes expandRing {
  0%   { opacity: 0.22; transform: scale(0.78); }
  100% { opacity: 0;    transform: scale(1.22); }
}

/* ─── Partículas flotantes ─── */
.particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.p {
  position: absolute;
  border-radius: 50%;
}

/* Partículas doradas */
.p1 {
  width: 8px; height: 8px;
  background: rgba(255,210,0,0.7);
  box-shadow: 0 0 12px rgba(255,210,0,0.6);
  top: 22%; left: 18%;
  animation: float1 7s ease-in-out infinite;
}
.p2 {
  width: 5px; height: 5px;
  background: rgba(255,210,0,0.5);
  box-shadow: 0 0 8px rgba(255,210,0,0.5);
  top: 68%; left: 12%;
  animation: float2 9s ease-in-out infinite;
}
.p3 {
  width: 10px; height: 10px;
  background: rgba(255,210,0,0.55);
  box-shadow: 0 0 16px rgba(255,210,0,0.45);
  top: 15%; right: 22%;
  animation: float3 8s ease-in-out infinite;
}
.p4 {
  width: 6px; height: 6px;
  background: rgba(255,210,0,0.65);
  box-shadow: 0 0 10px rgba(255,210,0,0.55);
  top: 75%; right: 18%;
  animation: float4 11s ease-in-out infinite;
}
.p5 {
  width: 4px; height: 4px;
  background: rgba(255,210,0,0.8);
  box-shadow: 0 0 8px rgba(255,210,0,0.7);
  top: 45%; left: 8%;
  animation: float1 6s ease-in-out infinite 1s;
}
.p6 {
  width: 7px; height: 7px;
  background: rgba(255,210,0,0.45);
  box-shadow: 0 0 12px rgba(255,210,0,0.4);
  top: 55%; right: 10%;
  animation: float2 10s ease-in-out infinite 2s;
}

/* Partículas azul-celeste (color ucb complementario) */
.p7 {
  width: 9px; height: 9px;
  background: rgba(100,180,255,0.55);
  box-shadow: 0 0 14px rgba(100,180,255,0.45);
  top: 30%; left: 25%;
  animation: float3 12s ease-in-out infinite 0.5s;
}
.p8 {
  width: 5px; height: 5px;
  background: rgba(100,180,255,0.65);
  box-shadow: 0 0 8px rgba(100,180,255,0.55);
  top: 80%; left: 30%;
  animation: float4 8s ease-in-out infinite 1.5s;
}
.p9 {
  width: 7px; height: 7px;
  background: rgba(100,180,255,0.5);
  box-shadow: 0 0 12px rgba(100,180,255,0.4);
  top: 10%; right: 35%;
  animation: float1 9s ease-in-out infinite 3s;
}
.p10 {
  width: 4px; height: 4px;
  background: rgba(100,180,255,0.7);
  box-shadow: 0 0 8px rgba(100,180,255,0.6);
  top: 62%; right: 28%;
  animation: float2 7s ease-in-out infinite 2.5s;
}

/* Partículas blancas pequeñas */
.p11 {
  width: 3px; height: 3px;
  background: rgba(255,255,255,0.6);
  top: 38%; left: 15%;
  animation: float3 13s ease-in-out infinite 1s;
}
.p12 {
  width: 3px; height: 3px;
  background: rgba(255,255,255,0.5);
  top: 50%; right: 15%;
  animation: float4 11s ease-in-out infinite 4s;
}

@keyframes float1 {
  0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.9; }
  25%       { transform: translateY(-22px) translateX(8px); opacity: 0.6; }
  50%       { transform: translateY(-14px) translateX(-6px); opacity: 1; }
  75%       { transform: translateY(-30px) translateX(4px); opacity: 0.7; }
}
@keyframes float2 {
  0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.8; }
  33%       { transform: translateY(-18px) translateX(-10px); opacity: 0.5; }
  66%       { transform: translateY(-28px) translateX(8px); opacity: 1; }
}
@keyframes float3 {
  0%, 100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.7; }
  50%       { transform: translateY(-24px) translateX(12px) scale(1.3); opacity: 1; }
}
@keyframes float4 {
  0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.6; }
  40%       { transform: translateY(18px) translateX(-8px); opacity: 1; }
  70%       { transform: translateY(-12px) translateX(10px); opacity: 0.8; }
}

/* ─── Card ─── */
.glass-card {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 420px;
  background: rgba(14, 38, 65, 0.68);
  backdrop-filter: blur(32px) saturate(170%);
  -webkit-backdrop-filter: blur(32px) saturate(170%);
  border-radius: 22px;
  padding: 2.5rem 2.5rem 1.9rem;
  box-shadow:
    0 0 0 1px rgba(255,210,0,0.22),
    0 2px 0 0 #FFD200 inset,
    0 0 60px rgba(255,210,0,0.06),
    0 44px 100px rgba(0,0,0,0.55),
    inset 0 1px 0 rgba(255,255,255,0.08);
  animation: cardIn 0.6s cubic-bezier(0.34,1.5,0.64,1) both;
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(34px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

/* ─── Brand ─── */
.brand {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-bottom: 1.4rem;
}

.brand-mark {
  width: 50px; height: 50px;
  flex-shrink: 0;
  background: linear-gradient(135deg, #FFD200 0%, #ffc000 100%);
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 20px var(--gold-glow);
}

.brand-text { display: flex; flex-direction: column; }

.brand-name {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 1.05rem;
  color: #ffffff;
  letter-spacing: -0.3px;
  line-height: 1.15;
}

.brand-sub {
  font-size: 0.67rem;
  color: rgba(255,255,255,0.38);
  margin-top: 0.15rem;
  font-weight: 400;
}

/* ─── Divider ─── */
.divider {
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent);
  margin-bottom: 1.55rem;
}

/* ─── Heading ─── */
.form-heading { margin-bottom: 1.7rem; }

.form-heading h1 {
  font-family: 'Syne', sans-serif;
  font-size: 1.8rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.8px;
  line-height: 1;
  margin-bottom: 0.32rem;
}

.form-heading p {
  font-size: 0.82rem;
  color: rgba(255,255,255,0.42);
}

/* ─── Fields ─── */
.field { margin-bottom: 1.1rem; }

.field label {
  display: block;
  font-size: 0.71rem;
  font-weight: 600;
  color: rgba(255,255,255,0.55);
  text-transform: uppercase;
  letter-spacing: 0.7px;
  margin-bottom: 0.4rem;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 0.88rem;
  color: rgba(255,255,255,0.28);
  pointer-events: none;
  transition: color 0.2s;
}

.input-wrap:focus-within .input-icon { color: #FFD200; }

.field input {
  width: 100%;
  padding: 0.76rem 2.75rem 0.76rem 2.5rem;
  border: 1.5px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  font-size: 0.875rem;
  font-family: 'DM Sans', sans-serif;
  color: #ffffff;
  background: rgba(255,255,255,0.07);
  outline: none;
  transition: border-color 0.22s, background 0.22s, box-shadow 0.22s;
}

.field input::placeholder { color: rgba(255,255,255,0.2); }

.field input:focus {
  border-color: #FFD200;
  background: rgba(255,210,0,0.05);
  box-shadow: 0 0 0 3.5px rgba(255,210,0,0.1);
}

.field--error input {
  border-color: rgba(248,113,113,0.65);
  background: rgba(248,113,113,0.06);
  box-shadow: 0 0 0 3px rgba(220,38,38,0.1);
}

.field--filled input:not(:focus) {
  border-color: rgba(255,255,255,0.17);
  background: rgba(255,255,255,0.09);
}

.eye-btn {
  position: absolute;
  right: 0.85rem;
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(255,255,255,0.28);
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 6px;
  line-height: 0;
  transition: color 0.2s, background 0.15s;
}

.eye-btn:hover {
  color: rgba(255,255,255,0.7);
  background: rgba(255,255,255,0.07);
}

.err-msg {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 0.28rem;
  font-size: 0.72rem;
  font-weight: 600;
  color: #fca5a5;
}

/* ─── Alert ─── */
.alert-error {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  padding: 0.7rem 1rem;
  background: rgba(220,38,38,0.12);
  border: 1px solid rgba(220,38,38,0.25);
  border-left: 3px solid #f87171;
  border-radius: 10px;
  margin-bottom: 1.1rem;
  font-size: 0.81rem;
  font-weight: 500;
  color: #fca5a5;
  line-height: 1.45;
}

.alert-error svg { flex-shrink: 0; margin-top: 1px; }

/* ─── Options ─── */
.options-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.4rem;
}

.remember-label {
  display: inline-flex;
  align-items: center;
  gap: 0.48rem;
  cursor: pointer;
  font-size: 0.79rem;
  color: rgba(255,255,255,0.42);
  user-select: none;
}

.remember-label input[type="checkbox"] { display: none; }

.custom-check {
  width: 16px; height: 16px;
  border: 1.5px solid rgba(255,255,255,0.18);
  border-radius: 4px;
  background: rgba(255,255,255,0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.2s, background 0.2s;
}

.remember-label input:checked + .custom-check {
  background: #FFD200;
  border-color: #FFD200;
}

.forgot-link {
  font-size: 0.77rem;
  font-weight: 500;
  color: rgba(255,255,255,0.35);
  text-decoration: none;
  transition: color 0.2s;
}

.forgot-link:hover { color: #FFD200; }

/* ─── Submit ─── */
.btn-submit {
  width: 100%;
  padding: 0.83rem 1.2rem;
  background: linear-gradient(135deg, #FFD200 0%, #ffca00 100%);
  border: none;
  border-radius: 10px;
  color: #0c1a27;
  font-family: 'Syne', sans-serif;
  font-size: 0.93rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
  position: relative;
  overflow: hidden;
}

.btn-submit::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.28) 0%, transparent 55%);
  opacity: 0;
  transition: opacity 0.22s;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(255,210,0,0.4);
}

.btn-submit:hover:not(:disabled)::after { opacity: 1; }
.btn-submit:active:not(:disabled) { transform: translateY(0); }
.btn-submit:disabled { opacity: 0.55; cursor: not-allowed; }

.btn-inner {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.spin-svg { animation: spinAnim 0.65s linear infinite; }
@keyframes spinAnim { to { transform: rotate(360deg); } }

/* ─── Back link ─── */
.back-link {
  margin-top: 1.75rem;
  text-align: center;
}

.back-link a {
  display: inline-flex;
  align-items: center;
  gap: 0.38rem;
  font-size: 0.77rem;
  color: rgba(255,255,255,0.22);
  text-decoration: none;
  transition: color 0.2s;
}

.back-link a:hover { color: rgba(255,255,255,0.52); }

/* ─── Transitions ─── */
.err-enter-active, .err-leave-active { transition: all 0.2s ease; }
.err-enter-from, .err-leave-to { opacity: 0; transform: translateY(-4px); }

.slide-err-enter-active, .slide-err-leave-active { transition: all 0.26s ease; overflow: hidden; }
.slide-err-enter-from, .slide-err-leave-to { opacity: 0; transform: translateY(-6px); max-height: 0; }
.slide-err-enter-to, .slide-err-leave-from { max-height: 80px; }

.swap-enter-active, .swap-leave-active { transition: all 0.17s ease; }
.swap-enter-from { opacity: 0; transform: translateY(6px); }
.swap-leave-to   { opacity: 0; transform: translateY(-6px); }

/* ─── Responsive ─── */
@media (max-width: 480px) {
  .glass-card { padding: 2rem 1.6rem 1.6rem; }
  .form-heading h1 { font-size: 1.55rem; }
  .p7, .p8, .p9, .p10, .p11, .p12 { display: none; }
}
</style>
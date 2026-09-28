<template>
  <div class="login-container">

    <!-- Background (identical to Login) -->
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
    </div>
    <div class="rings" aria-hidden="true">
      <div class="ring ring-1"></div>
      <div class="ring ring-2"></div>
      <div class="ring ring-3"></div>
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

      <!-- Success state -->
      <Transition name="swap" mode="out-in">
        <div v-if="sent" key="success" class="success-state">
          <div class="success-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round">
              <circle cx="12" cy="12" r="10" fill="#dcfce7" stroke="#059669"/>
              <polyline points="20,6 9,17 4,12"/>
            </svg>
          </div>
          <h2 class="success-title">¡Revisa tu correo!</h2>
          <p class="success-body">
            Si el correo <strong>{{ sentEmail }}</strong> está registrado en UCB SmartCampus,
            recibirás un enlace para restablecer tu contraseña en los próximos minutos.
          </p>
          <p class="success-hint">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            El enlace expira en 30 minutos. Revisa también tu carpeta de spam.
          </p>
          <router-link to="/login" class="btn-back-login">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Volver al inicio de sesión
          </router-link>
        </div>

        <!-- Form state -->
        <div v-else key="form">
          <div class="form-heading">
            <div class="lock-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>
              </svg>
              Recuperar acceso
            </div>
            <h1>¿Olvidaste tu contraseña?</h1>
            <p>Ingresa tu correo institucional y te enviaremos un enlace para restablecerla.</p>
          </div>

          <form @submit.prevent="handleSubmit" novalidate>

            <!-- Email field -->
            <div class="field" :class="{ 'field--error': error, 'field--filled': form.email }">
              <label for="email">Correo institucional</label>
              <div class="input-wrap">
                <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/>
                </svg>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="usuario@ucb.edu.bo"
                  autocomplete="email"
                  @input="error = ''"
                />
              </div>
              <Transition name="err">
                <span class="err-msg" v-if="error">{{ error }}</span>
              </Transition>
            </div>

            <!-- Submit -->
            <button type="submit" class="btn-submit" :disabled="loading || !form.email.trim()">
              <Transition name="swap" mode="out-in">
                <span v-if="!loading" key="label" class="btn-inner">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                  Enviar enlace de recuperación
                </span>
                <span v-else key="spinner" class="btn-inner">
                  <svg class="spin-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <path d="M12 2a10 10 0 0110 10"/>
                  </svg>
                  Enviando...
                </span>
              </Transition>
            </button>
          </form>

          <div class="back-link">
            <router-link to="/login">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
              </svg>
              Volver al inicio de sesión
            </router-link>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const API_BASE = import.meta.env.VITE_API_URL || ''

const form    = reactive({ email: '' })
const error   = ref('')
const loading = ref(false)
const sent    = ref(false)
const sentEmail = ref('')

async function handleSubmit() {
  error.value = ''

  if (!form.email.trim()) { error.value = 'El correo es obligatorio'; return }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    error.value = 'Formato de correo inválido'; return
  }

  loading.value = true
  try {
    const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: JSON.stringify({ email: form.email.trim() })
    })

    // Always show success (even if email not found — security best practice)
    sentEmail.value = form.email.trim()
    sent.value = true

  } catch (err) {
    error.value = 'No se pudo conectar con el servidor. Intenta de nuevo.'
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

/* Background — same as Login */
.bg-canvas { position: absolute; inset: 0; pointer-events: none; }
.grid-svg  { position: absolute; inset: 0; width: 100%; height: 100%; }

.orb { position: absolute; border-radius: 50%; filter: blur(120px); }
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

.particles { position:absolute;inset:0;pointer-events:none; }
.p { position:absolute;border-radius:50%; }
.p1 { width:8px;height:8px;background:rgba(255,210,0,0.7);box-shadow:0 0 12px rgba(255,210,0,0.6);top:22%;left:18%;animation:float1 7s ease-in-out infinite; }
.p2 { width:5px;height:5px;background:rgba(255,210,0,0.5);box-shadow:0 0 8px rgba(255,210,0,0.5);top:68%;left:12%;animation:float2 9s ease-in-out infinite; }
.p3 { width:10px;height:10px;background:rgba(255,210,0,0.55);box-shadow:0 0 16px rgba(255,210,0,0.45);top:15%;right:22%;animation:float3 8s ease-in-out infinite; }
.p4 { width:6px;height:6px;background:rgba(255,210,0,0.65);box-shadow:0 0 10px rgba(255,210,0,0.55);top:75%;right:18%;animation:float4 11s ease-in-out infinite; }
.p5 { width:4px;height:4px;background:rgba(255,210,0,0.8);box-shadow:0 0 8px rgba(255,210,0,0.7);top:45%;left:8%;animation:float1 6s ease-in-out infinite 1s; }
.p6 { width:7px;height:7px;background:rgba(255,210,0,0.45);box-shadow:0 0 12px rgba(255,210,0,0.4);top:55%;right:10%;animation:float2 10s ease-in-out infinite 2s; }
@keyframes float1 { 0%,100%{transform:translateY(0);opacity:.9} 50%{transform:translateY(-22px);opacity:.6} }
@keyframes float2 { 0%,100%{transform:translateY(0);opacity:.8} 50%{transform:translateY(-18px);opacity:.5} }
@keyframes float3 { 0%,100%{transform:translateY(0) scale(1);opacity:.7} 50%{transform:translateY(-24px) scale(1.3);opacity:1} }
@keyframes float4 { 0%,100%{transform:translateY(0);opacity:.6} 50%{transform:translateY(18px);opacity:1} }

/* Card */
.glass-card {
  position:relative;z-index:10;width:100%;max-width:420px;
  background:rgba(14,38,65,0.68);
  backdrop-filter:blur(32px) saturate(170%);
  -webkit-backdrop-filter:blur(32px) saturate(170%);
  border-radius:22px;padding:2.5rem 2.5rem 1.9rem;
  box-shadow:0 0 0 1px rgba(255,210,0,0.22),0 2px 0 0 #FFD200 inset,0 44px 100px rgba(0,0,0,0.55),inset 0 1px 0 rgba(255,255,255,0.08);
  animation:cardIn 0.6s cubic-bezier(0.34,1.5,0.64,1) both;
}
@keyframes cardIn { from{opacity:0;transform:translateY(34px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }

/* Brand */
.brand { display:flex;align-items:center;gap:.85rem;margin-bottom:1.4rem; }
.brand-mark { width:50px;height:50px;flex-shrink:0;background:linear-gradient(135deg,#FFD200,#ffc000);border-radius:13px;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 20px rgba(255,210,0,0.32); }
.brand-name { font-family:'Syne',sans-serif;font-weight:800;font-size:1.05rem;color:#fff;letter-spacing:-.3px;line-height:1.15;display:block; }
.brand-sub  { font-size:.67rem;color:rgba(255,255,255,.38);display:block;margin-top:.15rem; }
.divider { height:1px;background:linear-gradient(to right,transparent,rgba(255,255,255,0.1),transparent);margin-bottom:1.55rem; }

/* Lock badge */
.lock-badge {
  display:inline-flex;align-items:center;gap:.4rem;
  font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.6px;
  color:#FFD200;background:rgba(255,210,0,0.1);border:1px solid rgba(255,210,0,0.2);
  padding:.3rem .7rem;border-radius:20px;margin-bottom:.8rem;
}

/* Heading */
.form-heading { margin-bottom:1.7rem; }
.form-heading h1 { font-family:'Syne',sans-serif;font-size:1.6rem;font-weight:800;color:#fff;letter-spacing:-.8px;line-height:1;margin-bottom:.32rem; }
.form-heading p  { font-size:.82rem;color:rgba(255,255,255,.42);line-height:1.5; }

/* Field */
.field { margin-bottom:1.2rem; }
.field label { display:block;font-size:.71rem;font-weight:600;color:rgba(255,255,255,.55);text-transform:uppercase;letter-spacing:.7px;margin-bottom:.4rem; }
.input-wrap { position:relative;display:flex;align-items:center; }
.input-icon { position:absolute;left:.88rem;color:rgba(255,255,255,.28);pointer-events:none;transition:color .2s; }
.input-wrap:focus-within .input-icon { color:#FFD200; }
.field input {
  width:100%;padding:.76rem 1rem .76rem 2.5rem;
  border:1.5px solid rgba(255,255,255,.1);border-radius:10px;
  font-size:.875rem;font-family:'DM Sans',sans-serif;color:#fff;
  background:rgba(255,255,255,.07);outline:none;
  transition:border-color .22s,background .22s,box-shadow .22s;
}
.field input::placeholder { color:rgba(255,255,255,.2); }
.field input:focus { border-color:#FFD200;background:rgba(255,210,0,.05);box-shadow:0 0 0 3.5px rgba(255,210,0,.1); }
.field--error input { border-color:rgba(248,113,113,.65);background:rgba(248,113,113,.06); }
.field--filled input:not(:focus) { border-color:rgba(255,255,255,.17);background:rgba(255,255,255,.09); }
.err-msg { display:inline-flex;align-items:center;gap:4px;margin-top:.28rem;font-size:.72rem;font-weight:600;color:#fca5a5; }

/* Submit */
.btn-submit { width:100%;padding:.83rem 1.2rem;background:linear-gradient(135deg,#FFD200,#ffca00);border:none;border-radius:10px;color:#0c1a27;font-family:'Syne',sans-serif;font-size:.93rem;font-weight:800;letter-spacing:.5px;cursor:pointer;transition:transform .2s,box-shadow .2s,opacity .2s;position:relative;overflow:hidden; }
.btn-submit:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 10px 28px rgba(255,210,0,.4); }
.btn-submit:disabled { opacity:.55;cursor:not-allowed; }
.btn-inner { display:inline-flex;align-items:center;justify-content:center;gap:.5rem; }
.spin-svg { animation:spinAnim .65s linear infinite; }
@keyframes spinAnim { to{transform:rotate(360deg)} }

/* Back link */
.back-link { margin-top:1.75rem;text-align:center; }
.back-link a { display:inline-flex;align-items:center;gap:.38rem;font-size:.77rem;color:rgba(255,255,255,.22);text-decoration:none;transition:color .2s; }
.back-link a:hover { color:rgba(255,255,255,.52); }

/* Success state */
.success-state { text-align:center;display:flex;flex-direction:column;align-items:center;gap:1rem; }
.success-icon { width:72px;height:72px;background:#dcfce7;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:.5rem; }
.success-title { font-family:'Syne',sans-serif;font-size:1.4rem;font-weight:800;color:#fff;margin:0; }
.success-body { font-size:.86rem;color:rgba(255,255,255,.55);line-height:1.6;margin:0; }
.success-body strong { color:rgba(255,255,255,.85); }
.success-hint { display:flex;align-items:center;gap:.4rem;font-size:.78rem;color:rgba(255,210,0,.7);background:rgba(255,210,0,.08);border:1px solid rgba(255,210,0,.18);padding:.6rem .9rem;border-radius:8px; }

.btn-back-login {
  display:inline-flex;align-items:center;gap:.5rem;
  padding:.7rem 1.5rem;background:rgba(255,255,255,.08);color:#fff;
  border:1.5px solid rgba(255,255,255,.15);border-radius:10px;
  font-size:.875rem;font-weight:600;text-decoration:none;
  transition:all .2s;margin-top:.5rem;
}
.btn-back-login:hover { background:rgba(255,255,255,.13);border-color:rgba(255,255,255,.25); }

/* Transitions */
.err-enter-active,.err-leave-active { transition:all .2s ease; }
.err-enter-from,.err-leave-to { opacity:0;transform:translateY(-4px); }
.swap-enter-active,.swap-leave-active { transition:all .22s ease; }
.swap-enter-from { opacity:0;transform:translateY(8px); }
.swap-leave-to   { opacity:0;transform:translateY(-8px); }
</style>
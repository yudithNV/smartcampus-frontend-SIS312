<template>
  <div class="create-news-page">

    <!-- Toast -->
    <Transition name="toast-slide">
      <div v-if="toast.show" class="toast" :class="`toast-${toast.type}`">
        <span class="toast-icon-wrap">
          <svg v-if="toast.type==='success'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <svg v-else-if="toast.type==='error'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </span>
        <div class="toast-body">
          <strong>{{ toast.title }}</strong>
          <span>{{ toast.message }}</span>
        </div>
        <button class="toast-close" @click="toast.show = false">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </Transition>

    <!-- Upload progress overlay -->
    <Transition name="fade">
      <div v-if="uploading" class="upload-overlay">
        <div class="upload-overlay-box">
          <div class="upload-spinner"></div>
          <p>{{ uploadStatus }}</p>
          <div class="upload-progress-bar">
            <div class="upload-progress-fill" :style="{ width: uploadProgress + '%' }"></div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Header -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a3a52" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        </div>
        <div>
          <h1>Crear Noticia</h1>
          <p>Publica información relevante para la comunidad UCB</p>
        </div>
      </div>
      <div class="header-actions">
        <!-- Vista Previa toggle: solo visible en mobile -->
        <button class="btn-secondary btn-preview-mobile" @click="togglePreview" :class="{ active: showPreview }">
          <svg v-if="!showPreview" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          {{ showPreview ? 'Editar' : 'Vista Previa' }}
        </button>
        <button class="btn-secondary" @click="saveDraft" :disabled="saving || uploading">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          Guardar Borrador
        </button>
        <button class="btn-primary" @click="submitNews" :disabled="saving || uploading || !isValid">
          <template v-if="!saving && !uploading">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            {{ form.newsStatus === 'PROGRAMADO' ? 'Programar' : 'Publicar' }}
          </template>
          <template v-else>
            <span class="spinner-sm"></span>
            {{ uploading ? 'Subiendo...' : (form.newsStatus === 'PROGRAMADO' ? 'Programando...' : 'Publicando...') }}
          </template>
        </button>
      </div>
    </div>

    <!-- Main layout -->
    <div class="editor-layout">

      <!-- EDITOR COLUMN: always visible on desktop, toggle on mobile -->
      <div class="editor-column" v-show="!showPreview || isWide">
        <form @submit.prevent="submitNews" novalidate>

          <!-- Title -->
          <div class="field-block title-block">
            <div class="field-label">
              <span class="field-num">01</span>
              <label>Título de la Noticia <span class="req">*</span></label>
              <span class="char-count" :class="{ warning: form.title.length > 220, danger: form.title.length > 255 }">
                {{ form.title.length }}/255
              </span>
            </div>
            <input
              v-model="form.title"
              type="text"
              class="title-input"
              placeholder="Escribe un título claro y atractivo..."
              maxlength="255"
              @input="clearFieldError('title')"
            />
            <span class="field-error" v-if="fieldErrors.title">{{ fieldErrors.title }}</span>
          </div>

          <!-- Category + Career -->
          <div class="field-row">
            <div class="field-block">
              <div class="field-label">
                <span class="field-num">02</span>
                <label>Categoría <span class="req">*</span></label>
              </div>
              <div class="category-grid">
                <button
                  type="button"
                  v-for="cat in categories"
                  :key="cat.value"
                  class="cat-btn"
                  :class="{ active: form.category === cat.value }"
                  @click="form.category = cat.value; clearFieldError('category')"
                >
                  <component :is="'svg'" v-bind="cat.svgAttrs" class="cat-icon">
                    <path v-for="(p,i) in cat.paths" :key="i" v-bind="p"/>
                  </component>
                  <span>{{ cat.label }}</span>
                </button>
              </div>
              <span class="field-error" v-if="fieldErrors.category">{{ fieldErrors.category }}</span>
            </div>

            <div class="field-block">
              <div class="field-label">
                <span class="field-num">03</span>
                <label>Dirigido a</label>
              </div>
              <div class="select-wrap">
                <select v-model="form.careerId" class="form-select">
                  <option :value="null">Toda la comunidad UCB</option>
                  <option v-for="career in careers" :key="career.id" :value="career.id">
                    {{ career.name }}
                  </option>
                </select>
                <svg class="select-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>
          </div>

          <!-- Body -->
          <div class="field-block">
            <div class="field-label">
              <span class="field-num">04</span>
              <label>Contenido de la Noticia <span class="req">*</span></label>
              <span class="char-count">{{ form.body.length }} car.</span>
            </div>
            <div class="toolbar">
              <button type="button" class="tb-btn tb-bold" @click="insertFormat('**','**')"><strong>B</strong></button>
              <button type="button" class="tb-btn tb-italic" @click="insertFormat('*','*')"><em>I</em></button>
              <button type="button" class="tb-btn" @click="insertFormat('\n## ','')">H2</button>
              <span class="tb-sep"></span>
              <button type="button" class="tb-btn" @click="insertFormat('\n- ','')">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              </button>
            </div>
            <textarea
              ref="bodyRef"
              v-model="form.body"
              class="body-textarea"
              placeholder="Redacta el contenido completo de la noticia..."
              rows="14"
              @input="clearFieldError('body')"
            ></textarea>
            <span class="field-error" v-if="fieldErrors.body">{{ fieldErrors.body }}</span>
          </div>

          <!-- ── Cover Image ── -->
          <div class="field-block">
            <div class="field-label">
              <span class="field-num">05</span>
              <label>Imagen de Portada</label>
              <span class="optional-tag">Opcional</span>
            </div>
            <div class="upload-tabs">
              <button type="button" class="upload-tab" :class="{ active: coverMode === 'url' }" @click="switchCoverMode('url')">Desde URL</button>
              <button type="button" class="upload-tab" :class="{ active: coverMode === 'file' }" @click="switchCoverMode('file')">Subir archivo</button>
            </div>

            <!-- URL mode -->
            <template v-if="coverMode === 'url'">
              <div class="input-icon-wrap">
                <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <input
                  v-model="form.coverUrl"
                  type="url"
                  class="form-input with-icon"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  @input="updateCoverPreview"
                />
                <button v-if="form.coverUrl" type="button" class="input-clear" @click="clearCover">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <Transition name="fade">
                <div class="cover-preview-url" v-if="coverPreviewUrl">
                  <img :src="coverPreviewUrl" alt="Vista previa" @error="coverPreviewUrl=''" />
                  <button type="button" class="cover-remove" @click="clearCover">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              </Transition>
            </template>

            <!-- File mode -->
            <template v-else>
              <input ref="coverFileInput" type="file" accept="image/jpeg,image/png,image/webp,image/gif" class="hidden-input" @change="onCoverFileChange" />
              <div class="file-drop-zone" :class="{ dragging: coverDragging }"
                @dragover.prevent="coverDragging = true"
                @dragleave="coverDragging = false"
                @drop.prevent="onCoverDrop"
                @click="!coverPreviewUrl && $refs.coverFileInput.click()">
                <div v-if="!coverPreviewUrl" class="drop-content">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <p>Arrastra una imagen aquí o <span class="drop-link">haz clic para seleccionar</span></p>
                  <small>JPG, PNG, WEBP, GIF — máx. 5MB</small>
                </div>
                <div v-else class="drop-preview-wrap">
                  <img :src="coverPreviewUrl" alt="Preview" class="drop-preview-img" />
                  <button type="button" class="cover-remove-btn" @click.stop="clearCover">Quitar</button>
                </div>
              </div>
            </template>
          </div>

          <!-- ── Attachment ── -->
          <div class="field-block">
            <div class="field-label">
              <span class="field-num">06</span>
              <label>Archivo Adjunto</label>
              <span class="optional-tag">Opcional</span>
            </div>
            <div class="upload-tabs">
              <button type="button" class="upload-tab" :class="{ active: attachMode === 'url' }" @click="switchAttachMode('url')">Desde URL</button>
              <button type="button" class="upload-tab" :class="{ active: attachMode === 'file' }" @click="switchAttachMode('file')">Subir archivo</button>
            </div>

            <!-- URL mode -->
            <template v-if="attachMode === 'url'">
              <div class="input-icon-wrap">
                <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
                <input
                  v-model="form.attachmentUrl"
                  type="url"
                  class="form-input with-icon"
                  placeholder="https://ejemplo.com/documento.pdf"
                />
                <button v-if="form.attachmentUrl" type="button" class="input-clear" @click="clearAttachment">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </template>
            <template v-else>
              <input ref="attachFileInput" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt" class="hidden-input" @change="onAttachFileChange" />
              <div class="file-drop-zone file-drop-doc" :class="{ dragging: attachDragging }" @dragover.prevent="attachDragging = true" @dragleave="attachDragging = false" @drop.prevent="onAttachDrop" @click="!attachFileName && $refs.attachFileInput.click()">
                <div v-if="!attachFileName" class="drop-content">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <p>Arrastra o <span class="drop-link">haz clic para seleccionar</span></p>
                  <small>PDF, DOC, DOCX, XLS, XLSX — máx. 10MB</small>
                </div>
                <div v-else class="attach-file-info" @click.stop>
                  <div class="attach-icon-wrap icon-file">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <div class="attach-details">
                    <span class="attach-name">{{ attachFileName }}</span>
                    <span class="attach-size">{{ attachFileSize }}</span>
                  </div>
                  <button type="button" class="attach-remove" @click="clearAttachment">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              </div>
            </template>
          </div>

          <!-- Published toggle -->
          <div class="field-block publish-block">
            <div class="field-label" style="margin-bottom:1rem">
              <span class="field-num">07</span>
              <label>Estado de Publicación <span class="req">*</span></label>
            </div>

            <!-- Tres botones de estado -->
            <div class="status-selector">
              <button
                type="button"
                class="status-opt"
                :class="{ active: form.newsStatus === 'BORRADOR' }"
                @click="setStatus('BORRADOR')"
              >
                <div class="status-opt-icon icon-draft">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                </div>
                <div class="status-opt-text">
                  <span class="status-opt-title">Borrador</span>
                  <span class="status-opt-desc">Solo visible para ti</span>
                </div>
                <span class="status-check" v-if="form.newsStatus === 'BORRADOR'">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
              </button>

              <button
                type="button"
                class="status-opt"
                :class="{ active: form.newsStatus === 'PROGRAMADO' }"
                @click="setStatus('PROGRAMADO')"
              >
                <div class="status-opt-icon icon-scheduled">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div class="status-opt-text">
                  <span class="status-opt-title">Programar</span>
                  <span class="status-opt-desc">Publicar en fecha/hora futura</span>
                </div>
                <span class="status-check" v-if="form.newsStatus === 'PROGRAMADO'">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
              </button>

              <button
                type="button"
                class="status-opt"
                :class="{ active: form.newsStatus === 'PUBLICADO' }"
                @click="setStatus('PUBLICADO')"
              >
                <div class="status-opt-icon icon-pub">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </div>
                <div class="status-opt-text">
                  <span class="status-opt-title">Publicar ahora</span>
                  <span class="status-opt-desc">Visible para todos de inmediato</span>
                </div>
                <span class="status-check" v-if="form.newsStatus === 'PUBLICADO'">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
              </button>
            </div>

            <Transition name="slide-down">
              <div v-if="form.newsStatus === 'PROGRAMADO'" class="scheduled-picker">
                <div class="scheduled-picker-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Fecha y hora de publicación automática
                </div>
                <input
                  v-model="form.scheduledAt"
                  type="datetime-local"
                  class="form-input scheduled-input"
                  :class="{ 'input-error': fieldErrors.scheduledAt }"
                  :min="minScheduledAt"
                  @change="onScheduledAtChange"
                />
                <Transition name="fade">
                  <div v-if="fieldErrors.scheduledAt" class="scheduled-error-banner">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {{ fieldErrors.scheduledAt }}
                  </div>
                </Transition>
                <p class="scheduled-hint" v-if="!fieldErrors.scheduledAt">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  Debe ser al menos 5 minutos en el futuro. El sistema la publicará automáticamente.
                </p>
              </div>
            </Transition>
          </div>
          <!-- ════════════════════════════════════════════════════ -->

        </form>
      </div>

      <!-- PREVIEW COLUMN: always visible on desktop, toggle on mobile -->
      <div class="preview-column" v-show="showPreview || isWide">
        <div class="preview-header">
          <span class="preview-label">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Vista Previa
          </span>
          <span class="preview-badge">{{ getCategoryLabel(form.category) }}</span>
        </div>
        <div class="preview-card">
          <div class="preview-cover-wrap">
            <img v-if="coverPreviewUrl" :src="coverPreviewUrl" alt="Cover" class="preview-img" @error="coverPreviewUrl=''" />
            <div v-else class="preview-cover-empty">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <small>Sin imagen de portada</small>
            </div>
          </div>
          <div class="preview-content">
            <div class="preview-meta-row">
              <span class="meta-cat">{{ getCategoryLabel(form.category) }}</span>
              <time class="meta-date">{{ todayFormatted }}</time>
            </div>
            <h2 class="preview-title">{{ form.title || 'Título de la noticia...' }}</h2>
            <div class="preview-body">
              <p v-if="!form.body" class="preview-empty">El contenido aparecerá aquí...</p>
              <div v-else v-html="renderBody(form.body)"></div>
            </div>
          </div>
        </div>

        <!-- SCRUM-385: badge de estado en la vista previa -->
        <div class="preview-status" :class="statusPreviewClass">
          <svg v-if="form.newsStatus === 'PUBLICADO'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <svg v-else-if="form.newsStatus === 'PROGRAMADO'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/></svg>
          {{ statusPreviewLabel }}
          <span v-if="form.newsStatus === 'PROGRAMADO' && form.scheduledAt" class="scheduled-preview-date">
            · {{ formatScheduledAt(form.scheduledAt) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { careerService } from '../../services/api.js'

const router  = useRouter()
const bodyRef = ref(null)
const coverFileInput  = ref(null)
const attachFileInput = ref(null)

const showPreview = ref(false)
const saving      = ref(false)
const uploading   = ref(false)
const uploadStatus   = ref('')
const uploadProgress = ref(0)
const isWide = ref(window.innerWidth >= 1200)

const coverMode    = ref('url')
const attachMode   = ref('url')
const coverDragging  = ref(false)
const attachDragging = ref(false)
const coverPreviewUrl = ref('')
const coverFileName   = ref('')
const coverFileObj    = ref(null)
const attachFileName  = ref('')
const attachFileSize  = ref('')
const attachFileObj   = ref(null)

const careers = ref([])
function onScheduledAtChange() {
  clearFieldError('scheduledAt')
  if (!form.scheduledAt) return
  const selected   = new Date(form.scheduledAt)
  const minAllowed = new Date(Date.now() + 5 * 60 * 1000)
  if (selected < minAllowed) {
    fieldErrors.scheduledAt = 'La fecha ingresada no es válida. Debe ser al menos 5 minutos en el futuro.'
  }
}
// ── SCRUM-382/384: form ahora usa newsStatus + scheduledAt ──
const form = reactive({
  title: '', body: '', category: '',
  careerId: null, coverUrl: '', attachmentUrl: '',
  newsStatus: 'PUBLICADO',   // BORRADOR | PROGRAMADO | PUBLICADO
  scheduledAt: ''            // ISO local string del <input datetime-local>
})

const fieldErrors = reactive({ title: '', body: '', category: '', scheduledAt: '' })
const toast = reactive({ show: false, type: 'success', title: '', message: '' })

// Mínimo para el datetime-local (ahora + 5 min)
const minScheduledAt = computed(() => {
  const d = new Date(Date.now() + 5 * 60 * 1000)
  return d.toISOString().slice(0, 16)
})

// ── SCRUM-385: label y clase del estado en la preview ──
const statusPreviewClass = computed(() => ({
  'status-pub':       form.newsStatus === 'PUBLICADO',
  'status-scheduled': form.newsStatus === 'PROGRAMADO',
  'status-draft':     form.newsStatus === 'BORRADOR',
}))

const statusPreviewLabel = computed(() => ({
  PUBLICADO:  'Se publicará al enviar',
  PROGRAMADO: 'Se publicará automáticamente',
  BORRADOR:   'Se guardará como borrador',
}[form.newsStatus]))

function setStatus(s) { form.newsStatus = s; if (s !== 'PROGRAMADO') form.scheduledAt = '' }

function formatScheduledAt(val) {
  if (!val) return ''
  return new Date(val).toLocaleString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const categories = [
  { value: 'ACADEMICO', label: 'Académico', svgAttrs: { width:'18', height:'18', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':'2' }, paths: [{ d:'M22 10v6M2 10l10-5 10 5-10 5z' }, { d:'M6 12v5c3 3 9 3 12 0v-5' }] },
  { value: 'EVENTOS',   label: 'Eventos',   svgAttrs: { width:'18', height:'18', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':'2' }, paths: [{ d:'M8 2v4M16 2v4' }, { d:'M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z' }] },
  { value: 'AVISOS',    label: 'Avisos',    svgAttrs: { width:'18', height:'18', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':'2' }, paths: [{ d:'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9' }, { d:'M13.73 21a2 2 0 01-3.46 0' }] },
  { value: 'DEPORTES',  label: 'Deportes',  svgAttrs: { width:'18', height:'18', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':'2' }, paths: [{ d:'M12 22a10 10 0 110-20 10 10 0 010 20z' }] },
  { value: 'CULTURA',   label: 'Cultura',   svgAttrs: { width:'18', height:'18', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':'2' }, paths: [{ d:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' }] },
  { value: 'OTRO',      label: 'Otro',      svgAttrs: { width:'18', height:'18', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':'2' }, paths: [{ d:'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z' }, { d:'M14 2v6h6M16 13H8M16 17H8M10 9H8' }] }
]

const todayFormatted = computed(() => new Date().toLocaleDateString('es-ES', { day:'numeric', month:'long', year:'numeric' }))
const isValid = computed(() => form.title.trim().length > 0 && form.body.trim().length > 0 && form.category !== '')

function getCategoryLabel(val) { return categories.find(c => c.value === val)?.label || 'Sin categoría' }
function renderBody(text) {
  if (!text) return ''
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^## (.+)$/gm, '<h3 style="font-size:1rem;font-weight:700;margin:0.75rem 0 0.25rem">$1</h3>')
    .replace(/^> (.+)$/gm, '<blockquote style="border-left:3px solid #FFD200;padding-left:0.75rem;color:#64748b;margin:0.5rem 0">$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li style="margin-left:1rem">$1</li>').replace(/\n/g, '<br/>')
}

function clearFieldError(field) { fieldErrors[field] = '' }
function togglePreview() { showPreview.value = !showPreview.value }
function switchCoverMode(mode) { coverMode.value = mode; clearCover() }
function switchAttachMode(mode) { attachMode.value = mode; clearAttachment() }
function updateCoverPreview() { coverPreviewUrl.value = (form.coverUrl && form.coverUrl.startsWith('http')) ? form.coverUrl : '' }
function clearCover() { form.coverUrl = ''; coverPreviewUrl.value = ''; coverFileName.value = ''; coverFileObj.value = null; if (coverFileInput.value) coverFileInput.value.value = '' }
function clearAttachment() { form.attachmentUrl = ''; attachFileName.value = ''; attachFileSize.value = ''; attachFileObj.value = null; if (attachFileInput.value) attachFileInput.value.value = '' }

function onCoverFileChange(e) {
  const file = e.target.files[0]; if (!file) return
  if (!file.type.startsWith('image/')) { showToastMsg('warning','Formato no válido','Solo imágenes.'); return }
  if (file.size > 5*1024*1024) { showToastMsg('error','Demasiado grande','Máx. 5MB.'); return }
  coverFileObj.value = file; coverFileName.value = file.name; coverPreviewUrl.value = URL.createObjectURL(file)
}
function onCoverDrop(e) { coverDragging.value = false; const file = e.dataTransfer.files[0]; if (!file||!file.type.startsWith('image/')) return; coverFileObj.value = file; coverFileName.value = file.name; coverPreviewUrl.value = URL.createObjectURL(file) }
function onAttachFileChange(e) { const file = e.target.files[0]; if (!file) return; if (file.size > 10*1024*1024) { showToastMsg('error','Demasiado grande','Máx. 10MB.'); return }; attachFileObj.value = file; attachFileName.value = file.name; attachFileSize.value = formatFileSize(file.size) }
function onAttachDrop(e) { attachDragging.value = false; const file = e.dataTransfer.files[0]; if (!file) return; attachFileObj.value = file; attachFileName.value = file.name; attachFileSize.value = formatFileSize(file.size) }
function formatFileSize(bytes) { if (bytes < 1024) return `${bytes} B`; if (bytes < 1048576) return `${(bytes/1024).toFixed(1)} KB`; return `${(bytes/1048576).toFixed(1)} MB` }
function insertFormat(prefix, suffix) { const ta = bodyRef.value; if (!ta) return; const s = ta.selectionStart, e = ta.selectionEnd; const sel = form.body.substring(s, e); form.body = form.body.substring(0, s) + prefix + sel + suffix + form.body.substring(e); setTimeout(() => { ta.focus(); ta.setSelectionRange(s + prefix.length, e + prefix.length) }, 0) }

function validateForm() {
  let ok = true
  if (!form.title.trim())  { fieldErrors.title    = 'El título es obligatorio'; ok = false }
  if (!form.body.trim())   { fieldErrors.body     = 'El contenido es obligatorio'; ok = false }
  if (!form.category)      { fieldErrors.category = 'Selecciona una categoría'; ok = false }
  if (form.newsStatus === 'PROGRAMADO') {
    if (!form.scheduledAt) {
      fieldErrors.scheduledAt = 'Selecciona una fecha y hora de publicación'
      ok = false
    } else {
      const selected   = new Date(form.scheduledAt)
      const minAllowed = new Date(Date.now() + 5 * 60 * 1000)
      if (selected < minAllowed) {
        fieldErrors.scheduledAt = 'La fecha ingresada no es válida. Debe ser al menos 5 minutos en el futuro.'
        ok = false
      }
    }
  }
  return ok
}

function showToastMsg(type, title, message) {
  toast.show = false
  setTimeout(() => { Object.assign(toast, { show: true, type, title, message }); setTimeout(() => { toast.show = false }, 4500) }, 60)
}

function getHeaders(isJson = true) {
  const token = localStorage.getItem('ucb_token')
  const h = {}
  if (isJson) h['Content-Type'] = 'application/json'
  if (token)  h['Authorization'] = `Bearer ${token}`
  return h
}

async function uploadFileToBacked(file, type) {
  const endpoint = type === 'image' ? '/api/files/upload/image' : '/api/files/upload/document'
  const formData = new FormData(); formData.append('file', file)
  const res = await fetch(endpoint, { method: 'POST', headers: getHeaders(false), mode: 'cors', body: formData })
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || `Error ${res.status}`) }
  return (await res.json()).url
}

// ── SCRUM-384: payload incluye newsStatus y scheduledAt ──
async function runSubmit(statusOverride) {
  let finalCoverUrl      = coverMode.value === 'url' ? (form.coverUrl || null) : null
  let finalAttachmentUrl = attachMode.value === 'url' ? (form.attachmentUrl || null) : null
  const totalSteps = (coverMode.value==='file'&&coverFileObj.value?1:0) + (attachMode.value==='file'&&attachFileObj.value?1:0) + 1
  let step = 0; uploading.value = true; uploadProgress.value = 0

  if (coverMode.value==='file'&&coverFileObj.value) { uploadStatus.value='Subiendo imagen...'; finalCoverUrl=await uploadFileToBacked(coverFileObj.value,'image'); step++; uploadProgress.value=Math.round((step/totalSteps)*100) }
  if (attachMode.value==='file'&&attachFileObj.value) { uploadStatus.value='Subiendo adjunto...'; finalAttachmentUrl=await uploadFileToBacked(attachFileObj.value,'document'); step++; uploadProgress.value=Math.round((step/totalSteps)*100) }

  uploadStatus.value = 'Guardando noticia...'

  const effectiveStatus = statusOverride || form.newsStatus

  // Construir scheduledAt en formato ISO para el backend
  let scheduledAtISO = null
  if (effectiveStatus === 'PROGRAMADO' && form.scheduledAt) {
    scheduledAtISO = new Date(form.scheduledAt).toISOString()
  }

  const res = await fetch('/api/news', {
    method: 'POST', headers: getHeaders(true), mode: 'cors',
    body: JSON.stringify({
      title:         form.title.trim(),
      body:          form.body.trim(),
      category:      form.category,
      newsStatus:    effectiveStatus,
      scheduledAt:   scheduledAtISO,
      coverUrl:      finalCoverUrl,
      attachmentUrl: finalAttachmentUrl,
      careerId:      form.careerId || null
    })
  })

  uploading.value = false
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || e.message || `Error ${res.status}`) }
  return await res.json()
}

async function submitNews() {
  if (form.newsStatus === 'PROGRAMADO') {
    if (!form.scheduledAt) {
      fieldErrors.scheduledAt = 'Selecciona una fecha y hora de publicación'
      showToastMsg('error', 'Fecha requerida', 'Debes seleccionar una fecha y hora para programar la noticia.')
      document.querySelector('.scheduled-picker')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    const selected   = new Date(form.scheduledAt)
    const minAllowed = new Date(Date.now() + 5 * 60 * 1000)
    if (selected < minAllowed) {
      fieldErrors.scheduledAt = 'La fecha ingresada no es válida. Debe ser al menos 5 minutos en el futuro.'
      showToastMsg('error', 'Fecha no válida',
        'La fecha programada debe ser al menos 5 minutos en el futuro. Por favor, elige una fecha válida.')
      document.querySelector('.scheduled-picker')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
  }
  if (!validateForm()) return
  saving.value = true
  try {
    await runSubmit()
    const msgs = {
      PUBLICADO:  'La noticia fue publicada correctamente.',
      PROGRAMADO: `Programada para ${formatScheduledAt(form.scheduledAt)}.`,
      BORRADOR:   'El borrador fue guardado.'
    }
    showToastMsg('success',
      form.newsStatus === 'PROGRAMADO' ? 'Noticia programada' : 'Noticia publicada',
      msgs[form.newsStatus])
    setTimeout(() => router.push('/publicador/mis-noticias'), 2000)
  } catch (err) {
    uploading.value = false
    showToastMsg('error', 'Error',
      err.name === 'TypeError' ? 'No se pudo conectar con el servidor.' : err.message)
  } finally {
    saving.value = false
  }
}

async function saveDraft() {
  if (!form.title.trim() && !form.body.trim()) { showToastMsg('warning', 'Sin contenido', 'Escribe algo antes de guardar.'); return }
  saving.value = true
  try {
    await runSubmit('BORRADOR')
    showToastMsg('success', 'Borrador guardado', 'Tu borrador fue guardado correctamente.')
    setTimeout(() => router.push('/publicador/mis-noticias'), 1500)
  } catch (err) { uploading.value = false; showToastMsg('error', 'Error', err.message) }
  finally { saving.value = false }
}

onMounted(async () => {
  window.addEventListener('resize', () => { isWide.value = window.innerWidth >= 1200 })
  try { careers.value = await careerService.getAll() } catch {}
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
.create-news-page { font-family: 'Inter', sans-serif; color: #1e293b; padding-bottom: 3rem; }

.upload-overlay { position: fixed; inset: 0; z-index: 2000; background: rgba(15,23,42,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; }
.upload-overlay-box { background: #fff; border-radius: 16px; padding: 2.5rem 2rem; min-width: 300px; text-align: center; box-shadow: 0 24px 60px rgba(0,0,0,0.25); }
.upload-spinner { width: 44px; height: 44px; border: 3.5px solid #f1f5f9; border-top-color: #FFD200; border-radius: 50%; animation: spin 0.65s linear infinite; margin: 0 auto 1.1rem; }
.upload-overlay-box p { font-size: 0.9rem; color: #475569; font-weight: 500; margin-bottom: 1rem; }
.upload-progress-bar { height: 6px; background: #f1f5f9; border-radius: 3px; overflow: hidden; }
.upload-progress-fill { height: 100%; background: #FFD200; border-radius: 3px; transition: width 0.35s ease; }

.toast { position: fixed; top: 1.5rem; right: 1.5rem; z-index: 9999; display: flex; align-items: center; gap: 0.75rem; padding: 0.9rem 1.1rem; background: #fff; border-radius: 10px; box-shadow: 0 4px 24px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05); border-left: 3px solid; min-width: 300px; max-width: 400px; }
.toast-success { border-left-color: #22c55e; } .toast-error { border-left-color: #ef4444; } .toast-warning { border-left-color: #f59e0b; }
.toast-icon-wrap { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.toast-success .toast-icon-wrap { background: #dcfce7; color: #16a34a; } .toast-error .toast-icon-wrap { background: #fee2e2; color: #dc2626; } .toast-warning .toast-icon-wrap { background: #fef3c7; color: #d97706; }
.toast-body { flex: 1; } .toast-body strong { display: block; font-size: 0.83rem; font-weight: 600; color: #1e293b; margin-bottom: 1px; } .toast-body span { font-size: 0.77rem; color: #64748b; }
.toast-close { background: none; border: none; cursor: pointer; color: #94a3b8; padding: 4px; border-radius: 4px; display: flex; }
.toast-slide-enter-active, .toast-slide-leave-active { transition: all 0.28s ease; }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateX(28px); }

.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding-bottom: 1.4rem; border-bottom: 1px solid #f1f5f9; }
.header-left { display: flex; align-items: center; gap: 1rem; }
.header-icon { width: 46px; height: 46px; background: #FFD200; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 2px 8px rgba(255,210,0,0.3); }
.page-header h1 { font-family: 'Syne', sans-serif; font-size: 1.55rem; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; margin-bottom: 0.1rem; }
.page-header p { font-size: 0.81rem; color: #64748b; }
.header-actions { display: flex; gap: 0.5rem; flex-shrink: 0; }
.btn-secondary, .btn-primary { display: flex; align-items: center; gap: 0.45rem; padding: 0.6rem 1.1rem; border-radius: 8px; font-size: 0.83rem; font-weight: 600; cursor: pointer; border: none; transition: all 0.18s; font-family: 'Inter', sans-serif; }
.btn-secondary { background: #f8fafc; color: #475569; border: 1.5px solid #e2e8f0; } .btn-secondary:hover:not(:disabled), .btn-secondary.active { background: #1a3a52; color: #fff; border-color: #1a3a52; } .btn-secondary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-primary { background: #1a3a52; color: #FFD200; } .btn-primary:hover:not(:disabled) { background: #0f2438; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(26,58,82,0.25); } .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
.spinner-sm { width: 13px; height: 13px; border: 2px solid rgba(255,210,0,0.3); border-top-color: #FFD200; border-radius: 50%; animation: spin 0.6s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.btn-preview-mobile { display: none; }
@media (max-width: 1199px) { .btn-preview-mobile { display: flex; } }

.editor-layout { display: grid; grid-template-columns: 1fr; gap: 2rem; }
@media (min-width: 1200px) { .editor-layout { grid-template-columns: 1fr 360px; } }

.field-block { background: #fff; border-radius: 12px; padding: 1.4rem; margin-bottom: 1rem; border: 1px solid #e2e8f0; transition: border-color 0.18s; }
.field-block:focus-within { border-color: #FFD200; box-shadow: 0 0 0 3px rgba(255,210,0,0.07); }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
@media (max-width: 720px) { .field-row { grid-template-columns: 1fr; } }
.field-label { display: flex; align-items: center; gap: 0.55rem; margin-bottom: 0.9rem; }
.field-num { font-family: 'Syne', sans-serif; font-size: 0.68rem; font-weight: 800; color: #FFD200; background: #1a3a52; padding: 2px 7px; border-radius: 20px; letter-spacing: 0.4px; flex-shrink: 0; }
.field-label label { font-size: 0.78rem; font-weight: 600; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }
.req { color: #ef4444; }
.optional-tag { margin-left: auto; font-size: 0.68rem; background: #f1f5f9; color: #94a3b8; padding: 2px 8px; border-radius: 20px; font-weight: 500; }
.char-count { margin-left: auto; font-size: 0.71rem; color: #94a3b8; }
.char-count.warning { color: #f59e0b; } .char-count.danger { color: #ef4444; }
.field-error { display: block; margin-top: 0.35rem; font-size: 0.73rem; color: #ef4444; font-weight: 500; }

.title-input { width: 100%; border: none; outline: none; font-family: 'Syne', sans-serif; font-size: 1.35rem; font-weight: 700; color: #0f172a; background: transparent; letter-spacing: -0.3px; }
.title-input::placeholder { color: #cbd5e1; font-weight: 400; }

.category-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 0.45rem; }
.cat-btn { display: flex; flex-direction: column; align-items: center; gap: 0.4rem; padding: 0.7rem 0.3rem; border: 1.5px solid #e2e8f0; border-radius: 10px; background: #f8fafc; cursor: pointer; transition: all 0.18s; font-size: 0.71rem; font-weight: 600; color: #64748b; font-family: 'Inter', sans-serif; }
.cat-btn:hover { border-color: #FFD200; background: #fffef5; color: #1a3a52; }
.cat-btn.active { border-color: #1a3a52; background: #1a3a52; color: #FFD200; }
.cat-btn.active .cat-icon { stroke: #FFD200; }

.select-wrap { position: relative; }
.form-select { width: 100%; padding: 0.68rem 2.2rem 0.68rem 0.9rem; border: 1.5px solid #e2e8f0; border-radius: 9px; font-size: 0.86rem; font-family: 'Inter', sans-serif; color: #1e293b; background: #f8fafc; outline: none; cursor: pointer; appearance: none; transition: all 0.18s; }
.form-select:focus { border-color: #FFD200; box-shadow: 0 0 0 3px rgba(255,210,0,0.08); }
.select-arrow { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); pointer-events: none; }

.toolbar { display: flex; align-items: center; gap: 0.3rem; margin-bottom: 0.6rem; padding: 0.45rem 0.6rem; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; }
.tb-btn { padding: 0.3rem 0.55rem; border: 1px solid #e2e8f0; border-radius: 5px; background: #fff; font-size: 0.78rem; cursor: pointer; color: #475569; transition: all 0.15s; font-family: 'Inter', sans-serif; display: flex; align-items: center; justify-content: center; }
.tb-btn:hover { background: #1a3a52; color: #FFD200; border-color: #1a3a52; }
.tb-bold { font-weight: 800; } .tb-italic { font-style: italic; }
.tb-sep { width: 1px; height: 18px; background: #e2e8f0; margin: 0 0.1rem; }
.body-textarea { width: 100%; min-height: 260px; padding: 0.85rem; border: 1.5px solid #e2e8f0; border-radius: 9px; font-size: 0.88rem; font-family: 'Inter', sans-serif; color: #1e293b; line-height: 1.7; background: #f8fafc; resize: vertical; outline: none; transition: all 0.18s; }
.body-textarea:focus { border-color: #FFD200; background: #fffef5; box-shadow: 0 0 0 3px rgba(255,210,0,0.07); }
.body-textarea::placeholder { color: #cbd5e1; }

.upload-tabs { display: flex; gap: 0.4rem; margin-bottom: 0.75rem; padding: 0.3rem; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; width: fit-content; }
.upload-tab { display: flex; align-items: center; gap: 0.4rem; padding: 0.38rem 0.85rem; border-radius: 6px; border: none; background: transparent; font-size: 0.78rem; font-weight: 600; color: #64748b; cursor: pointer; transition: all 0.18s; font-family: 'Inter', sans-serif; }
.upload-tab.active { background: #1a3a52; color: #FFD200; }

.input-icon-wrap { position: relative; display: flex; align-items: center; }
.input-icon { position: absolute; left: 0.85rem; pointer-events: none; flex-shrink: 0; }
.form-input { width: 100%; padding: 0.68rem 2.4rem 0.68rem 0.9rem; border: 1.5px solid #e2e8f0; border-radius: 9px; font-size: 0.86rem; font-family: 'Inter', sans-serif; color: #1e293b; background: #f8fafc; outline: none; transition: all 0.18s; }
.form-input.with-icon { padding-left: 2.4rem; }
.form-input:focus { border-color: #FFD200; background: #fffef5; box-shadow: 0 0 0 3px rgba(255,210,0,0.07); }
.input-clear { position: absolute; right: 0.7rem; background: none; border: none; cursor: pointer; color: #94a3b8; display: flex; align-items: center; padding: 3px; border-radius: 3px; }
.input-clear:hover { color: #ef4444; }

.hidden-input { display: none; }
.file-drop-zone { border: 2px dashed #e2e8f0; border-radius: 10px; background: #f8fafc; transition: all 0.2s; overflow: hidden; cursor: pointer; }
.file-drop-zone:hover, .file-drop-zone.dragging { border-color: #FFD200; background: #fffef5; }
.drop-content { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.65rem; padding: 2.2rem 1rem; text-align: center; }
.drop-content p { font-size: 0.84rem; color: #64748b; } .drop-content small { font-size: 0.72rem; color: #94a3b8; }
.drop-link { color: #1a3a52; font-weight: 600; text-decoration: underline; }
.drop-preview-wrap { position: relative; height: 200px; }
.drop-preview-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.cover-remove-btn { position: absolute; bottom: 0.6rem; right: 0.6rem; background: rgba(239,68,68,0.85); color: #fff; border: none; border-radius: 6px; padding: 4px 10px; font-size: 0.72rem; font-weight: 600; cursor: pointer; }
.cover-remove { position: absolute; top: 0.5rem; right: 0.5rem; background: rgba(0,0,0,0.55); color: #fff; border: none; width: 26px; height: 26px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.cover-preview-url { margin-top: 0.75rem; position: relative; border-radius: 9px; overflow: hidden; height: 170px; }
.cover-preview-url img { width: 100%; height: 100%; object-fit: cover; display: block; }

.attach-file-info { display: flex; align-items: center; gap: 0.85rem; padding: 1rem 1.1rem; }
.attach-icon-wrap { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.icon-file { background: #f1f5f9; color: #64748b; }
.attach-details { flex: 1; min-width: 0; }
.attach-name { display: block; font-size: 0.84rem; font-weight: 600; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.attach-size { font-size: 0.72rem; color: #94a3b8; }
.attach-remove { width: 30px; height: 30px; background: #fee2e2; border: none; border-radius: 7px; cursor: pointer; color: #ef4444; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

.publish-block { border-color: #f1f5f9; }

.status-selector { display: flex; flex-direction: column; gap: 0.5rem; }

.status-opt {
  display: flex; align-items: center; gap: 0.85rem; padding: 0.85rem 1rem;
  border: 1.5px solid #e2e8f0; border-radius: 10px; background: #f8fafc;
  cursor: pointer; transition: all 0.18s; font-family: 'Inter', sans-serif; text-align: left; width: 100%;
}
.status-opt:hover { border-color: #cbd5e1; background: #fff; }
.status-opt.active { border-color: #1a3a52; background: #fff; box-shadow: 0 0 0 3px rgba(26,58,82,0.07); }
.status-opt-icon { width: 36px; height: 36px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.icon-draft     { background: #fef3c7; color: #d97706; }
.icon-scheduled { background: #f5f3ff; color: #7c3aed; }
.icon-pub       { background: #dcfce7; color: #16a34a; }
.status-opt-text { flex: 1; }
.status-opt-title { display: block; font-size: 0.86rem; font-weight: 600; color: #1e293b; }
.status-opt-desc  { font-size: 0.75rem; color: #64748b; }
.status-check { width: 22px; height: 22px; border-radius: 50%; background: #1a3a52; color: #FFD200; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
form-input.input-error {
  border-color: #ef4444 !important;
  background: #fff8f8 !important;
}
.scheduled-input.input-error {
  border-color: #ef4444 !important;
  background: #fff8f8 !important;
}
.scheduled-input.input-error:focus {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 3px rgba(239,68,68,0.1) !important;
}
 
/* SCRUM-390: banner de error de fecha prominente */
.scheduled-error-banner {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  margin-top: 0.6rem;
  padding: 0.75rem 0.9rem;
  background: #fff1f2;
  border: 1.5px solid #fecdd3;
  border-left: 4px solid #ef4444;
  border-radius: 9px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #be123c;
  line-height: 1.5;
}
.scheduled-error-banner svg {
  flex-shrink: 0;
  margin-top: 1px;
  color: #ef4444;
}
/*  Scheduled datetime picker ── */
.scheduled-picker {
  margin-top: 0.85rem; background: #faf5ff; border-radius: 10px;
  padding: 1rem; border: 1.5px solid #e9d5ff;
}
.scheduled-picker-label {
  display: flex; align-items: center; gap: 0.5rem;
  font-size: 0.78rem; font-weight: 600; color: #7c3aed; margin-bottom: 0.65rem;
}
.scheduled-input {
  width: 100%; padding: 0.68rem 0.9rem; border: 1.5px solid #e9d5ff;
  border-radius: 9px; font-size: 0.86rem; font-family: 'Inter', sans-serif;
  color: #1e293b; background: #fff; outline: none; transition: all 0.18s;
}
.scheduled-input:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
.scheduled-hint {
  display: flex; align-items: flex-start; gap: 0.4rem; margin-top: 0.55rem;
  font-size: 0.73rem; color: #7c3aed; line-height: 1.5;
}

.slide-down-enter-active, .slide-down-leave-active { transition: all 0.25s ease; overflow: hidden; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; max-height: 0; }
.slide-down-enter-to, .slide-down-leave-from { opacity: 1; max-height: 200px; }

/* Preview */
.preview-column { position: sticky; top: 2rem; align-self: start; }
.preview-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.9rem; }
.preview-label { display: flex; align-items: center; gap: 0.4rem; font-size: 0.72rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.8px; }
.preview-badge { font-size: 0.68rem; font-weight: 600; padding: 3px 10px; border-radius: 20px; background: #f1f5f9; color: #64748b; }
.preview-card { background: #fff; border-radius: 14px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 16px rgba(0,0,0,0.05); }
.preview-cover-wrap { height: 170px; background: #f8fafc; display: flex; align-items: center; justify-content: center; }
.preview-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.preview-cover-empty { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
.preview-cover-empty small { font-size: 0.72rem; color: #94a3b8; }
.preview-content { padding: 1.1rem; }
.preview-meta-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.6rem; }
.meta-cat { font-size: 0.68rem; font-weight: 700; padding: 3px 9px; border-radius: 20px; background: #1a3a52; color: #FFD200; }
.meta-date { font-size: 0.68rem; color: #94a3b8; }
.preview-title { font-family: 'Syne', sans-serif; font-size: 1.05rem; font-weight: 800; color: #0f172a; line-height: 1.3; margin-bottom: 0.6rem; letter-spacing: -0.2px; }
.preview-body { font-size: 0.82rem; line-height: 1.7; color: #475569; }
.preview-empty { color: #cbd5e1; font-style: italic; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.22s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 900px) {
  .category-grid { grid-template-columns: repeat(2,1fr); }
  .field-block { padding: 1.1rem; }
}

.scheduled-input.input-error { border-color: #ef4444 !important; background: #fff8f8 !important; }
.scheduled-input.input-error:focus { box-shadow: 0 0 0 3px rgba(239,68,68,0.1) !important; }
.scheduled-error-banner {
  display: flex; align-items: flex-start; gap: 0.55rem; margin-top: 0.6rem;
  padding: 0.75rem 0.9rem; background: #fff1f2; border: 1.5px solid #fecdd3;
  border-left: 4px solid #ef4444; border-radius: 9px;
  font-size: 0.8rem; font-weight: 600; color: #be123c; line-height: 1.5;
}
.scheduled-error-banner svg { flex-shrink: 0; margin-top: 1px; color: #ef4444; }
</style>
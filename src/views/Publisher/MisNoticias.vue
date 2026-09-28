<template>
  <div class="mis-noticias">

    <!-- Toast -->
    <Transition name="toast-slide">
      <div v-if="toast.show" class="toast" :class="`toast-${toast.type}`">
        <span class="toast-icon-wrap">
          <svg v-if="toast.type==='success'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <svg v-else-if="toast.type==='error'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
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

    <!-- Confirm delete modal -->
    <Transition name="modal-fade">
      <div v-if="deleteModal.show" class="modal-overlay" @click.self="cancelDelete">
        <div class="modal-box">
          <div class="modal-trash-wrap">
            <div class="modal-trash-ring"></div>
            <svg class="modal-trash-icon" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
            </svg>
          </div>
          <h3 class="modal-title">¿Estás seguro de que deseas eliminar esta noticia?</h3>
          <p class="modal-desc">Vas a eliminar permanentemente<br/><strong class="modal-news-title">"{{ deleteModal.title }}"</strong></p>
          <p class="modal-warning">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Esta acción no se puede deshacer.
          </p>
          <div class="modal-actions">
            <button class="modal-btn-cancel" @click="cancelDelete" :disabled="deleteModal.loading">Cancelar</button>
            <button class="modal-btn-confirm" @click="confirmDelete" :disabled="deleteModal.loading">
              <template v-if="!deleteModal.loading">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                Eliminar definitivamente
              </template>
              <template v-else>
                <span class="spinner-xs white"></span> Eliminando...
              </template>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Page Header -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a3a52" stroke-width="2"><path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v8a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        </div>
        <div>
          <h1>Mis Noticias</h1>
          <p>Gestiona y administra tus publicaciones</p>
        </div>
      </div>
      <router-link to="/publicador/crear-noticia" class="btn-new">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Nueva Noticia
      </router-link>
    </div>

    <!-- Stats Row -->
    <div class="stats-row" v-if="!loading && !error">
      <button class="stat-pill" :class="{ active: activeFilter === 'all' }" @click="activeFilter = 'all'">
        <span class="stat-num">{{ news.length }}</span>
        <span class="stat-txt">Total</span>
      </button>
      <button class="stat-pill stat-pub" :class="{ active: activeFilter === 'published' }" @click="activeFilter = 'published'">
        <span class="stat-num">{{ countByStatus('PUBLICADO') }}</span>
        <span class="stat-txt">Publicadas</span>
      </button>
      <!-- SCRUM-391: nuevo filtro "Programadas" -->
      <button class="stat-pill stat-scheduled" :class="{ active: activeFilter === 'scheduled' }" @click="activeFilter = 'scheduled'">
        <span class="stat-num">{{ countByStatus('PROGRAMADO') }}</span>
        <span class="stat-txt">Programadas</span>
      </button>
      <button class="stat-pill stat-draft" :class="{ active: activeFilter === 'draft' }" @click="activeFilter = 'draft'">
        <span class="stat-num">{{ countByStatus('BORRADOR') }}</span>
        <span class="stat-txt">Borradores</span>
      </button>
    </div>

    <!-- Filters Bar -->
    <div class="filters-bar">
      <div class="search-wrap">
        <svg class="search-ico" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input v-model="search" type="text" class="search-input" placeholder="Buscar por título..." />
        <button v-if="search" class="search-clear" @click="search = ''">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="right-filters">
        <div class="select-wrap">
          <select v-model="categoryFilter" class="filter-select">
            <option value="">Todas las categorías</option>
            <option v-for="c in categories" :key="c.value" :value="c.value">{{ c.label }}</option>
          </select>
          <svg class="sel-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div class="select-wrap">
          <select v-model="careerFilter" class="filter-select">
            <option value="">Todas las carreras</option>
            <option value="null">General</option>
            <option v-for="c in availableCareers" :key="c.id" :value="String(c.id)">{{ c.name }}</option>
          </select>
          <svg class="sel-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div class="select-wrap">
          <select v-model="sortBy" class="filter-select">
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguas</option>
            <option value="title">A–Z título</option>
          </select>
          <svg class="sel-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div class="view-toggle">
          <button :class="{ active: viewMode === 'feed' }" @click="viewMode = 'feed'" title="Feed">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="5" rx="1"/><rect x="3" y="10" width="18" height="11" rx="1"/></svg>
          </button>
          <button :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'" title="Cuadrícula">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          </button>
          <button :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'" title="Lista">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Active filter chips -->
    <div class="active-chips" v-if="categoryFilter || careerFilter || search">
      <span class="chips-label">Filtros activos:</span>
      <span class="chip" v-if="search">
        "{{ search }}"
        <button @click="search = ''"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </span>
      <span class="chip" v-if="categoryFilter">
        {{ getCategoryLabel(categoryFilter) }}
        <button @click="categoryFilter = ''"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </span>
      <span class="chip" v-if="careerFilter">
        {{ careerFilter === 'null' ? 'General' : getCareerName(careerFilter) }}
        <button @click="careerFilter = ''"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </span>
      <button class="chip-clear-all" @click="clearAllFilters">Limpiar todo</button>
    </div>

     <!-- Loading -->
    <div v-if="loading" class="state-box">
      <div class="state-spinner"></div>
      <p>Cargando noticias...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="state-box state-error">
      <div class="state-icon-wrap error-wrap">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <p>{{ error }}</p>
      <button class="btn-retry" @click="loadNews">Reintentar</button>
    </div>

    <!-- ══════════════════════════════════════════
         FEED VIEW
    ══════════════════════════════════════════ -->
    <div v-else-if="viewMode === 'feed'" class="feed-list">
      <article v-for="item in filteredNews" :key="item.id" class="fb-card" :class="cardClass(item)">

        <div class="fb-card-header">
          <div class="fb-avatar">{{ getItemInitials(item) }}</div>
          <div class="fb-author-info">
            <div class="fb-author-name">{{ item.authorName || 'Publicador' }}<span class="fb-author-role">· Publicador UCB</span></div>
            <div class="fb-meta-row">
              <time class="fb-time">{{ formatDateRelative(item.createdAt) }}</time>
              <span class="fb-dot">·</span>
              <span class="fb-status-badge" :class="statusBadgeClass(item)">
                <span class="fb-status-dot"></span>
                {{ statusBadgeLabel(item) }}
              </span>
              <template v-if="item.newsStatus === 'PROGRAMADO' && item.scheduledAt">
                <span class="fb-dot">·</span>
               <!-- <span class="fb-scheduled-badge">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {{ formatScheduledAt(item.scheduledAt) }}
                </span> -->
              </template>
            </div>
          </div>
          <div class="fb-menu-wrap">
            <button class="fb-menu-btn" @click="toggleMenu(item.id)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
            </button>
            <Transition name="menu-drop">
              <div v-if="openMenu === item.id" class="fb-dropdown">
                <template v-if="item._isOwn">
                  <router-link :to="`/publicador/editar-noticia/${item.id}`" class="fb-dd-item" @click="closeMenu(item.id)"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Editar noticia</router-link>
                  <!-- SCRUM-391: acción diferente según estado -->
                    <button v-if="item.newsStatus === 'PROGRAMADO'" class="fb-dd-item" 
                      @click="cancelScheduled(item); closeMenu(item.id)" :disabled="item._saving">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                      </svg>
                      Cancelar programación
                    </button>
                  <button v-else class="fb-dd-item" @click="unpublish(item); closeMenu(item.id)" :disabled="item._saving"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 12H3"/><polyline points="7 8 3 12 7 16"/></svg>Despublicar</button>
                  <div class="fb-dd-divider"></div>
                  
                  <button class="fb-dd-item fb-dd-danger" @click="askDelete(item); closeMenu(item.id)">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                    Eliminar noticia
                  </button>
                </template>
              </div>
            </Transition>
          </div>
        </div>

        <div v-if="item.newsStatus === 'PROGRAMADO'" class="fb-scheduled-chip">
          <div class="chip-left">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span class="chip-label">Se publicará automáticamente el</span>
          </div>
          <span class="chip-date">{{ formatScheduledAt(item.scheduledAt) }}</span>
        </div>

        <div class="fb-cat-row"><span class="fb-cat-tag">{{ getCategoryLabel(item.category) }}</span></div>
        <h2 class="fb-title">{{ item.title }}</h2>

        <div class="fb-body-container">
          <div class="fb-body" :class="{ 'fb-body-expanded': item._expanded }"><div v-html="renderBody(item.body)"></div></div>
          <div v-if="!item._expanded && needsTruncation(item.body)" class="fb-body-gradient"></div>
          <button v-if="needsTruncation(item.body)" class="fb-see-more-btn" @click="item._expanded = !item._expanded">
            <span>{{ item._expanded ? 'Ver menos' : 'Ver más' }}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" :style="{ transform: item._expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.22s' }"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </div>

        <div class="fb-image-wrap" v-if="item.coverUrl"><img :src="item.coverUrl" :alt="item.title" class="fb-image" @error="item.coverUrl = null" /></div>

        <div class="fb-divider"></div>

        <div class="fb-action-bar">
          <router-link v-if="item._isOwn" :to="`/publicador/editar-noticia/${item.id}`" class="fb-act-btn fb-act-edit"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Editar</router-link>
          <!-- SCRUM-391: botón contextual según estado -->
          <button v-if="item._isOwn && item.newsStatus !== 'PUBLICADO'" class="fb-act-btn fb-act-pub" @click="publishNow(item)" :disabled="item._saving">
            <span class="spinner-xs" v-if="item._saving"></span>
            <template v-else><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>Publicar ahora</template>
          </button>
          <button v-if="item._isOwn && item.newsStatus === 'PROGRAMADO'" 
            class="fb-act-btn fb-act-unpub" 
            @click="cancelScheduled(item)" 
            :disabled="item._saving">
            <span class="spinner-xs" v-if="item._saving"></span>
            <template v-else>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              Cancelar programación
            </template>
          </button>
          <button v-if="item._isOwn && item.newsStatus === 'PUBLICADO'" class="fb-act-btn fb-act-unpub" @click="unpublish(item)" :disabled="item._saving">
            <span class="spinner-xs" v-if="item._saving"></span>
            <template v-else><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 12H3"/><polyline points="7 8 3 12 7 16"/></svg>Despublicar</template>
          </button>
          <button v-if="item._isOwn" class="fb-act-btn fb-act-del" @click="askDelete(item)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>Eliminar</button>
        </div>

        <!-- SCRUM-391: watermarks para los 3 estados -->
        <div class="draft-watermark" v-if="item.newsStatus === 'BORRADOR'">BORRADOR</div>
        <div class="scheduled-watermark" v-if="item.newsStatus === 'PROGRAMADO'">PROGRAMADO</div>
      </article>
    </div>

    <!-- ══════════ GRID ══════════ -->
    <div v-else-if="viewMode === 'grid'" class="news-grid">
      <article v-for="item in filteredNews" :key="item.id" class="news-card" :class="cardClass(item)">
        <div class="card-img-wrap">
          <img v-if="item.coverUrl" :src="item.coverUrl" :alt="item.title" class="card-img" @error="item.coverUrl = null" />
          <div v-else class="card-img-placeholder"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5"><path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v8a2 2 0 01-2 2z"/></svg></div>
          <div class="card-overlay-top">
            <span class="badge-cat">{{ getCategoryLabel(item.category) }}</span>
            <!-- SCRUM-385/391: badge con 3 estados -->
            <span class="badge-status" :class="statusBadgeClass(item)">
              <span class="status-dot"></span>{{ statusBadgeLabel(item) }}
            </span>
          </div>
          <!-- SCRUM-391: chip de fecha sobre la imagen -->
          <div v-if="item.newsStatus === 'PROGRAMADO'" class="card-scheduled-chip">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {{ formatScheduledAt(item.scheduledAt) }}
          </div>
        </div>
        <div class="card-content">
          <div class="card-meta-row">
            <time class="card-date">{{ formatDate(item.createdAt) }}</time>
          </div>
          <h3 class="card-title">{{ item.title }}</h3>
          <p class="card-excerpt">{{ excerpt(item.body) }}</p>
        </div>
        <div class="card-actions">
          <router-link v-if="item._isOwn" :to="`/publicador/editar-noticia/${item.id}`" class="action-btn btn-edit">Editar</router-link>
          <button v-if="item._isOwn && item.newsStatus === 'PROGRAMADO'" 
            class="action-btn btn-unpublish" 
            @click="cancelScheduled(item)" :disabled="item._saving">
            <span class="spinner-xs" v-if="item._saving"></span>
            <template v-else>Cancelar</template>
          </button>
          <button v-if="item._isOwn && item.newsStatus !== 'PUBLICADO'" class="action-btn btn-publish-action" @click="publishNow(item)" :disabled="item._saving"><span class="spinner-xs" v-if="item._saving"></span><template v-else>Publicar</template></button>
          <button v-if="item._isOwn && item.newsStatus === 'PUBLICADO'" class="action-btn btn-unpublish" @click="unpublish(item)" :disabled="item._saving">Despublicar</button>
          <button v-if="item._isOwn" class="action-btn btn-delete" @click="askDelete(item)">Eliminar</button>
        </div>
      </article>
    </div>

    <!-- ══════════ LIST ══════════ -->
    <div v-else class="news-list">
      <div v-for="item in filteredNews" :key="item.id" class="list-row" :class="cardClass(item)">
        <div class="list-img">
          <img v-if="item.coverUrl" :src="item.coverUrl" :alt="item.title" @error="item.coverUrl = null" />
          <div v-else class="list-img-placeholder"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5"><path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v8a2 2 0 01-2 2z"/></svg></div>
        </div>
        <div class="list-content">
          <div class="list-badges">
            <span class="badge-cat small">{{ getCategoryLabel(item.category) }}</span>
            <!-- SCRUM-385/391: badge con los 3 estados -->
            <span class="badge-status small" :class="statusBadgeClass(item)">
              <span class="status-dot"></span>{{ statusBadgeLabel(item) }}
            </span>
          </div>
          <h3 class="list-title">{{ item.title }}</h3>
          <!-- SCRUM-391: fecha programada en vista lista -->
          <p v-if="item.newsStatus === 'PROGRAMADO' && item.scheduledAt" class="list-scheduled">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Se publicará el {{ formatScheduledAt(item.scheduledAt) }}
          </p>
          <p class="list-excerpt">{{ excerpt(item.body) }}</p>
          <div class="list-meta"><time>{{ formatDate(item.createdAt) }}</time></div>
        </div>
        <div class="list-actions">
          <router-link v-if="item._isOwn" :to="`/publicador/editar-noticia/${item.id}`" class="icon-btn" title="Editar"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></router-link>
          <button v-if="item._isOwn && item.newsStatus === 'PROGRAMADO'" 
            class="icon-btn ico-unpublish" 
            @click="cancelScheduled(item)" :disabled="item._saving" 
            title="Cancelar programación">
            <span class="spinner-xs" v-if="item._saving"></span>
            <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </button>
          <button v-if="item._isOwn && item.newsStatus !== 'PUBLICADO'" class="icon-btn ico-publish" @click="publishNow(item)" :disabled="item._saving" title="Publicar ahora"><span class="spinner-xs" v-if="item._saving"></span><svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>
          <button v-if="item._isOwn && item.newsStatus === 'PUBLICADO'" class="icon-btn ico-unpublish" @click="unpublish(item)" :disabled="item._saving" title="Despublicar"><span class="spinner-xs" v-if="item._saving"></span><svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 12H3"/><polyline points="7 8 3 12 7 16"/></svg></button>
          <button v-if="item._isOwn" class="icon-btn ico-delete" @click="askDelete(item)" title="Eliminar"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg></button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, reactive } from 'vue'
import { careerService } from '../../services/api.js'
let pollingInterval = null
const news             = ref([])
const loading          = ref(false)
const error            = ref('')
const search           = ref('')
const activeFilter     = ref('all')
const categoryFilter   = ref('')
const careerFilter     = ref('')
const sortBy           = ref('newest')
const viewMode         = ref('feed')
const openMenu         = ref(null)
const availableCareers = ref([])

const authorEmail = localStorage.getItem('ucb_email') || ''
const authorName  = localStorage.getItem('ucb_name') || authorEmail.split('@')[0] || 'Publicador'

const toast       = reactive({ show:false, type:'success', title:'', message:'' })
const deleteModal = reactive({ show:false, id:null, title:'', loading:false })

// ── Categorías ─────────────────────────────────────────────────────────────
const categories = [
  { value:'ACADEMICO', label:'Académico' }, { value:'EVENTOS', label:'Eventos' },
  { value:'AVISOS',    label:'Avisos'    }, { value:'DEPORTES', label:'Deportes' },
  { value:'CULTURA',   label:'Cultura'   }, { value:'OTRO',     label:'Otro'     }
]

// ── Helpers ──────────────────────────────────────────────────────────
function getCategoryLabel(val) { return categories.find(c=>c.value===val)?.label||val||'—' }
function getCareerName(idStr) { if(!idStr||idStr==='null') return 'General'; return availableCareers.value.find(c=>String(c.id)===idStr)?.name||`Carrera ${idStr}` }
function getItemInitials(item) { const n=item.authorName||(item._isOwn?authorName:'PU'); return n.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase() }
function excerpt(text) { if(!text) return ''; const p=text.replace(/\*\*|__|\*|_|#{1,6}\s?|`/g,'').replace(/\n/g,' ').trim(); return p.length>120?p.substring(0,120)+'...':p }
function formatDate(d) { if(!d) return ''; return new Date(d).toLocaleDateString('es-ES',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}) }
function formatDateRelative(d) { if(!d) return ''; const diff=Date.now()-new Date(d).getTime(); const m=Math.floor(diff/60000),h=Math.floor(diff/3600000),dy=Math.floor(diff/86400000); if(m<1) return 'Ahora mismo'; if(m<60) return `Hace ${m} min`; if(h<24) return `Hace ${h}h`; if(dy<7) return `Hace ${dy} días`; return formatDate(d) }

// SCRUM-391: formatear fecha programada
function formatScheduledAt(val) { if(!val) return ''; return new Date(val).toLocaleString('es-ES',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}) }
function needsTruncation(body) { return body&&body.replace(/\*\*|__|\*|_|#{1,6}\s?|`/g,'').length>350 }
function renderBody(text) { if(!text) return ''; return text.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\*(.*?)\*/g,'<em>$1</em>').replace(/^## (.+)$/gm,'<h3 class="body-h3">$1</h3>').replace(/^> (.+)$/gm,'<blockquote class="body-quote">$1</blockquote>').replace(/^- (.+)$/gm,'<li class="body-li">$1</li>').replace(/---/g,'<hr class="body-hr"/>').replace(/\n/g,'<br/>') }
function clearAllFilters() { search.value=''; categoryFilter.value=''; careerFilter.value=''; activeFilter.value='all' }
function toggleMenu(id) { openMenu.value = openMenu.value === id ? null : id }
function closeMenu() { openMenu.value = null }
function handleOutsideClick(e) { if(!e.target.closest('.fb-menu-wrap')) openMenu.value=null; else if(e.target.closest('a[href]')) openMenu.value=null }

// SCRUM-391: contar por newsStatus (no por published)
function countByStatus(status) { return news.value.filter(n => n.newsStatus === status).length }

// SCRUM-385/391: clases y labels de estado
function statusBadgeClass(item) {
  return {
    'fb-pub':       item.newsStatus === 'PUBLICADO',
    'fb-scheduled': item.newsStatus === 'PROGRAMADO',
    'fb-draft':     item.newsStatus === 'BORRADOR',
    'status-pub':   item.newsStatus === 'PUBLICADO',
    'status-scheduled': item.newsStatus === 'PROGRAMADO',
    'status-draft': item.newsStatus === 'BORRADOR',
  }
}
function statusBadgeLabel(item) {
  return { PUBLICADO:'Publicada', PROGRAMADO:'Programada', BORRADOR:'Borrador' }[item.newsStatus] || (item.published ? 'Publicada' : 'Borrador')
}

// clase de card según estado
function cardClass(item) {
  return {
    'is-draft':     item.newsStatus === 'BORRADOR',
    'is-scheduled': item.newsStatus === 'PROGRAMADO',
  }
}

const filteredNews = computed(() => {
  let list = [...news.value]
  if (activeFilter.value === 'published')  list = list.filter(n => n.newsStatus === 'PUBLICADO')
  if (activeFilter.value === 'scheduled')  list = list.filter(n => n.newsStatus === 'PROGRAMADO')
  if (activeFilter.value === 'draft')      list = list.filter(n => n.newsStatus === 'BORRADOR')
  if (categoryFilter.value)                list = list.filter(n => n.category === categoryFilter.value)
  if (careerFilter.value === 'null')       list = list.filter(n => !n.careerId)
  else if (careerFilter.value)             list = list.filter(n => String(n.careerId) === careerFilter.value)
  if (search.value.trim()) { const q=search.value.toLowerCase(); list=list.filter(n=>n.title?.toLowerCase().includes(q)) }
  if(sortBy.value==='newest') list.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt))
  if(sortBy.value==='oldest') list.sort((a,b)=>new Date(a.createdAt)-new Date(b.createdAt))
  if(sortBy.value==='title')  list.sort((a,b)=>a.title?.localeCompare(b.title))
  return list
})

// ── Toast ──────────────────────────────────────────────────────────────────
function showToast(type,title,message) {
  toast.show=false
  setTimeout(()=>{ Object.assign(toast,{show:true,type,title,message}); setTimeout(()=>{toast.show=false},4500) },60)
}

// ── Auth ───────────────────────────────────────────────────────────────────
function getHeaders() {
  const token=localStorage.getItem('ucb_token')
  return {'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})}
}

// ── Cargar ─────────────────────────────────────────────────────────────────
async function loadNews() {
  loading.value=true; error.value=''
  try {
    const [resAll,reMy]=await Promise.all([
      fetch('/api/news',    {headers:getHeaders(),mode:'cors'}),
      fetch('/api/news/my', {headers:getHeaders(),mode:'cors'})
    ])
    const allNews=resAll.ok?await resAll.json():[]
    const myNews =reMy.ok ?await reMy.json() :[]
    const myIds  =new Set(myNews.map(n=>n.id))

    const normalize = (n, isOwn) => ({
      ...n,
      newsStatus: n.newsStatus || (n.published ? 'PUBLICADO' : 'BORRADOR'),
      scheduledAt: n.scheduledAt || null,
      _isOwn: isOwn, _saving: false, _expanded: false
    })

    const merged = [
      ...myNews.map(n => normalize(n, true)),
      ...allNews.filter(n => !myIds.has(n.id)).map(n => normalize(n, false))
    ]
    const seen = new Set()
    news.value = merged.filter(n=>{ if(seen.has(n.id)) return false; seen.add(n.id); return true })
  } catch(err) { error.value=err.name==='TypeError'?'No se pudo conectar con el servidor.':err.message }
  finally { loading.value=false }
}


// polling 
async function checkScheduledNews() {
  const scheduled = news.value.filter(n => n.newsStatus === 'PROGRAMADO')
  if (scheduled.length === 0) return  // nada que revisar

  const now = new Date()
  const dueItems = scheduled.filter(n => n.scheduledAt && new Date(n.scheduledAt) <= now)
  
  if (dueItems.length === 0) return  // ninguna ha vencido aún

  // Hay noticias que ya deberían estar publicadas → recargar del backend
  try {
    const reMy = await fetch('/api/news/my', {
      headers: getHeaders(), mode: 'cors'
    })
    if (!reMy.ok) return
    const myNews = await reMy.json()

    // Actualizar solo las que cambiaron
    myNews.forEach(updated => {
      const existing = news.value.find(n => n.id === updated.id)
      if (existing && existing.newsStatus !== updated.newsStatus) {
        existing.newsStatus = updated.newsStatus || (updated.published ? 'PUBLICADO' : 'BORRADOR')
        existing.published = updated.published
        existing.scheduledAt = updated.scheduledAt || null
        showToast('success', 'Noticia publicada automáticamente', 
          `"${existing.title}" ya está visible para todos.`)
      }
    })
  } catch { /* silencioso */ }
}

async function publishNow(item) {
  item._saving=true
  try {
    const res=await fetch(`/api/news/${item.id}`,{method:'PUT',headers:getHeaders(),mode:'cors',body:JSON.stringify({newsStatus:'PUBLICADO'})})
    if(!res.ok) throw new Error()
    const updated=await res.json()
    item.newsStatus=updated.newsStatus||'PUBLICADO'
    item.published=true
    item.scheduledAt=null
    showToast('success','Noticia publicada',`"${item.title}" ya está visible para todos.`)
  } catch { showToast('error','Error','No se pudo publicar la noticia.') }
  finally { item._saving=false }
}

async function cancelScheduled(item) {
  item._saving = true
  try {
    const res = await fetch(`/api/news/${item.id}`, {
      method: 'PUT', headers: getHeaders(), mode: 'cors',
      body: JSON.stringify({ newsStatus: 'BORRADOR', scheduledAt: null })
    })
    if (!res.ok) throw new Error()
    const updated = await res.json()
    item.newsStatus = updated.newsStatus || 'BORRADOR'
    item.published = false
    item.scheduledAt = null
    showToast('success', 'Programación cancelada', `"${item.title}" volvió a estado borrador.`)
  } catch {
    showToast('error', 'Error', 'No se pudo cancelar la programación.')
  } finally {
    item._saving = false
  }
}

// Despublicar (vuelve a BORRADOR)
async function unpublish(item) {
  item._saving=true
  try {
    const res=await fetch(`/api/news/${item.id}`,{method:'PUT',headers:getHeaders(),mode:'cors',body:JSON.stringify({newsStatus:'BORRADOR'})})
    if(!res.ok) throw new Error()
    const updated=await res.json()
    item.newsStatus=updated.newsStatus||'BORRADOR'
    item.published=false
    showToast('success','Noticia despublicada',`"${item.title}" fue movida a borrador.`)
  } catch { showToast('error','Error','No se pudo despublicar la noticia.') }
  finally { item._saving=false }
}

function cancelDelete() {
  if(deleteModal.loading) return
  deleteModal.show=false
}
function askDelete(item) { Object.assign(deleteModal,{show:true,id:item.id,title:item.title,loading:false}) }

async function confirmDelete() {
  deleteModal.loading=true
  const target=news.value.find(n=>n.id===deleteModal.id)
  if(target) target._deleting=true

  try {
    const res=await fetch(`/api/news/${deleteModal.id}`,{
      method:'DELETE', headers:getHeaders(), mode:'cors'
    })

    if(res.status===403) throw new Error('No tienes permiso para eliminar esta noticia.')
    if(res.status===404) throw new Error('La noticia ya no existe.')
    if(!res.ok) { const b=await res.json().catch(()=>({})); throw new Error(b.message||`Error ${res.status}`) }

    const deletedTitle=deleteModal.title

    news.value=news.value.filter(n=>n.id!==deleteModal.id)
    deleteModal.show=false

    showToast('success','Noticia borrada exitosamente',`"${deletedTitle}" fue eliminada correctamente.`)

  } catch(err) {
    if(target) target._deleting=false
    deleteModal.show=false
    showToast('error','Error al eliminar',err.message)
  } finally { deleteModal.loading=false }
}

// ── Lifecycle ──────────────────────────────────────────────────────────────
onMounted(async()=>{
  document.addEventListener('click',handleOutsideClick)
  await loadNews()
  try { availableCareers.value=await careerService.getAll() } catch {}

  pollingInterval = setInterval(checkScheduledNews, 30_000)

})
onBeforeUnmount(()=>{ document.removeEventListener('click',handleOutsideClick) })
  
</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.mis-noticias { font-family: 'Inter', sans-serif; color: #1e293b; padding-bottom: 3rem; }

.fb-edited-badge {
  display: inline-flex; align-items: center; gap: 0.25rem;
  font-size: 0.72rem; font-weight: 600; color: #7c3aed;
  background: #f5f3ff; padding: 2px 8px; border-radius: 20px;
  white-space: nowrap;   /* ← ESTO es lo clave */
}

.card-edited {
  font-size: 0.67rem; color: #7c3aed; font-weight: 500;
  background: #f5f3ff; padding: 2px 7px; border-radius: 10px;
}

.list-edited {
  font-size: 0.7rem; color: #7c3aed; font-weight: 500;
  margin-left: 0.3rem;
}
/* ── Toast ── */
.toast { position: fixed; top: 1.5rem; right: 1.5rem; z-index: 9999; display: flex; align-items: center; gap: 0.75rem; padding: 0.9rem 1.1rem; background: #fff; border-radius: 10px; box-shadow: 0 4px 24px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05); border-left: 3px solid; min-width: 300px; max-width: 400px; }
.toast-success { border-left-color: #22c55e; }
.toast-error   { border-left-color: #ef4444; }
.toast-warning { border-left-color: #f59e0b; }
.toast-icon-wrap { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.toast-success .toast-icon-wrap { background: #dcfce7; color: #16a34a; }
.toast-error   .toast-icon-wrap { background: #fee2e2; color: #dc2626; }
.toast-warning .toast-icon-wrap { background: #fef3c7; color: #d97706; }
.toast-body { flex: 1; }
.toast-body strong { display: block; font-size: 0.83rem; font-weight: 600; color: #1e293b; margin-bottom: 1px; }
.toast-body span   { font-size: 0.77rem; color: #64748b; }
.toast-close { background: none; border: none; cursor: pointer; color: #94a3b8; padding: 4px; border-radius: 4px; display: flex; }
.toast-slide-enter-active, .toast-slide-leave-active { transition: all 0.28s ease; }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateX(28px); }

/* ── Modal ── */
/* ── Modal ── */
.modal-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(15,23,42,0.6);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center; padding: 1rem;
}

.modal-box {
  background: #fff; border-radius: 20px;
  padding: 2.5rem 2rem 2rem;
  max-width: 400px; width: 100%;
  text-align: center;
  box-shadow: 0 32px 80px rgba(0,0,0,0.22);
  animation: popIn 0.25s cubic-bezier(0.34,1.56,0.64,1);
}

@keyframes popIn {
  from { opacity:0; transform: scale(0.88) translateY(16px); }
  to   { opacity:1; transform: scale(1)    translateY(0); }
}

/* Ícono del basurero con anillo animado */
.modal-trash-wrap {
  position: relative;
  width: 72px; height: 72px;
  margin: 0 auto 1.4rem;
  display: flex; align-items: center; justify-content: center;
}

.modal-trash-ring {
  position: absolute; inset: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, #fff1f2, #fee2e2);
  border: 2px solid #fecdd3;
  animation: ringPulse 2s ease-in-out infinite;
}

@keyframes ringPulse {
  0%, 100% { transform: scale(1);    opacity: 1; }
  50%       { transform: scale(1.06); opacity: 0.8; }
}

.modal-trash-icon {
  position: relative; z-index: 1;
}

.modal-title {
  font-family: 'Syne', sans-serif;
  font-size: 1.15rem; font-weight: 800;
  color: #0f172a; margin-bottom: 0.6rem;
  line-height: 1.35;
}

.modal-desc {
  font-size: 0.85rem; color: #64748b;
  line-height: 1.65; margin-bottom: 0.75rem !important;
}

.modal-news-title {
  color: #1e293b; font-weight: 700;
}

.modal-warning {
  display: inline-flex; align-items: center; gap: 0.4rem;
  font-size: 0.75rem; color: #dc2626; font-weight: 600;
  background: #fff1f2; border: 1px solid #fecdd3;
  padding: 5px 12px; border-radius: 20px;
  margin-bottom: 1.8rem !important;
}

.modal-actions {
  display: flex; gap: 0.75rem; justify-content: center;
}

.modal-btn-cancel {
  flex: 1;
  padding: 0.7rem 1rem;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc; color: #475569;
  border-radius: 10px; font-size: 0.84rem;
  font-weight: 600; cursor: pointer;
  transition: all 0.18s;
  font-family: 'Inter', sans-serif;
}
.modal-btn-cancel:hover:not(:disabled) {
  background: #f1f5f9; border-color: #cbd5e1; color: #1e293b;
}
.modal-btn-cancel:disabled { opacity: 0.5; cursor: not-allowed; }

.modal-btn-confirm {
  flex: 1;
  padding: 0.7rem 1rem;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #fff; border: none;
  border-radius: 10px; font-size: 0.84rem;
  font-weight: 600; cursor: pointer;
  transition: all 0.18s;
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 4px 14px rgba(239,68,68,0.35);
}
.modal-btn-confirm:hover:not(:disabled) {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(239,68,68,0.45);
}
.modal-btn-confirm:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.22s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

/* ── Header ── */
.page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:1.6rem; padding-bottom:1.4rem; border-bottom:1px solid #f1f5f9; }
.header-left { display:flex; align-items:center; gap:0.9rem; }
.header-icon { width:46px; height:46px; background:#FFD200; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow:0 2px 8px rgba(255,210,0,0.3); }
.page-header h1 { font-family:'Syne',sans-serif; font-size:1.55rem; font-weight:800; color:#0f172a; letter-spacing:-0.5px; margin-bottom:0.1rem; }
.page-header p { font-size:0.81rem; color:#64748b; }
.btn-new { display:flex; align-items:center; gap:0.5rem; padding:0.65rem 1.3rem; background:#1a3a52; color:#FFD200; border:none; border-radius:9px; font-size:0.83rem; font-weight:600; text-decoration:none; transition:all 0.18s; font-family:'Inter',sans-serif; }
.btn-new:hover { background:#0f2438; transform:translateY(-1px); box-shadow:0 4px 14px rgba(26,58,82,0.25); }

/* ── Stats ── */
.stats-row { display:flex; gap:0.7rem; margin-bottom:1.4rem; flex-wrap:wrap; }
.stat-pill { display:flex; align-items:center; gap:0.55rem; padding:0.58rem 1.1rem; border:1.5px solid #e2e8f0; border-radius:50px; background:#fff; cursor:pointer; transition:all 0.18s; font-family:'Inter',sans-serif; }
.stat-pill:hover { border-color:#1a3a52; }
.stat-pill.active { background:#1a3a52; border-color:#1a3a52; }
.stat-pill.active .stat-num, .stat-pill.active .stat-txt { color:#FFD200; }
.stat-num { font-family:'Syne',sans-serif; font-size:1rem; font-weight:800; color:#1e293b; }
.stat-txt { font-size:0.77rem; color:#64748b; font-weight:500; }
.stat-pub .stat-num { color:#16a34a; }
.stat-draft .stat-num { color:#d97706; }

/* ── Filters ── */
.filters-bar { display:flex; align-items:center; justify-content:space-between; gap:0.8rem; margin-bottom:0.9rem; flex-wrap:wrap; }
.search-wrap { position:relative; display:flex; align-items:center; flex:1; min-width:200px; }
.search-ico { position:absolute; left:0.85rem; pointer-events:none; }
.search-input { width:100%; padding:0.62rem 2.4rem 0.62rem 2.3rem; border:1.5px solid #e2e8f0; border-radius:9px; font-size:0.85rem; font-family:'Inter',sans-serif; color:#1e293b; background:#fff; outline:none; transition:border-color 0.18s; }
.search-input:focus { border-color:#FFD200; box-shadow:0 0 0 3px rgba(255,210,0,0.08); }
.search-clear { position:absolute; right:0.7rem; background:none; border:none; cursor:pointer; color:#94a3b8; display:flex; align-items:center; padding:3px; }
.search-clear:hover { color:#ef4444; }
.right-filters { display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap; }
.select-wrap { position:relative; }
.filter-select { padding:0.58rem 2rem 0.58rem 0.85rem; border:1.5px solid #e2e8f0; border-radius:8px; font-size:0.82rem; font-family:'Inter',sans-serif; color:#475569; background:#fff; outline:none; cursor:pointer; appearance:none; transition:border-color 0.18s; }
.filter-select:focus { border-color:#FFD200; }
.sel-arrow { position:absolute; right:0.6rem; top:50%; transform:translateY(-50%); pointer-events:none; }
.view-toggle { display:flex; border:1.5px solid #e2e8f0; border-radius:8px; overflow:hidden; }
.view-toggle button { padding:0.52rem 0.65rem; background:#fff; border:none; cursor:pointer; color:#94a3b8; transition:all 0.18s; display:flex; align-items:center; }
.view-toggle button:hover { background:#f8fafc; }
.view-toggle button.active { background:#1a3a52; color:#FFD200; }
.view-toggle button.active svg { stroke:#FFD200; }

/* ── Filter chips ── */
.active-chips { display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap; margin-bottom:1.2rem; }
.chips-label { font-size:0.74rem; color:#94a3b8; font-weight:600; }
.chip { display:flex; align-items:center; gap:0.35rem; background:#f1f5f9; color:#475569; border-radius:20px; padding:3px 10px; font-size:0.75rem; font-weight:500; }
.chip button { background:none; border:none; cursor:pointer; color:#94a3b8; display:flex; align-items:center; line-height:1; }
.chip button:hover { color:#ef4444; }
.chip-clear-all { background:none; border:1px solid #e2e8f0; border-radius:20px; padding:3px 10px; font-size:0.74rem; color:#64748b; cursor:pointer; font-family:'Inter',sans-serif; transition:all 0.15s; }
.chip-clear-all:hover { background:#fee2e2; border-color:#fecdd3; color:#dc2626; }

/* ── States ── */
.state-box { background:#fff; border-radius:14px; padding:4rem 2rem; text-align:center; border:1px solid #f1f5f9; display:flex; flex-direction:column; align-items:center; gap:0.85rem; }
.state-spinner { width:34px; height:34px; border:2.5px solid #f1f5f9; border-top-color:#FFD200; border-radius:50%; animation:spin 0.65s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }
.state-box p { font-size:0.86rem; color:#64748b; }
.state-box h3 { font-family:'Syne',sans-serif; font-size:1.05rem; color:#1e293b; font-weight:700; }
.state-icon-wrap { width:56px; height:56px; background:#f8fafc; border-radius:50%; display:flex; align-items:center; justify-content:center; }
.error-wrap { background:#fff1f2; }
.state-error p { color:#dc2626; }
.btn-retry { padding:0.55rem 1.3rem; background:#1a3a52; color:#FFD200; border:none; border-radius:7px; font-size:0.82rem; font-weight:600; cursor:pointer; font-family:'Inter',sans-serif; }
.btn-retry:hover { background:#0f2438; }
.btn-new-empty { display:flex; align-items:center; gap:0.5rem; padding:0.65rem 1.4rem; background:#1a3a52; color:#FFD200; border-radius:9px; text-decoration:none; font-size:0.84rem; font-weight:600; font-family:'Inter',sans-serif; }
.btn-new-empty:hover { background:#0f2438; }

/* ══════════════════════════════════════════
   FEED — estilo Facebook
══════════════════════════════════════════ */
.feed-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.2rem;
  align-items: start;
}

.fb-card {
  background: #fff;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  overflow: hidden;
  position: relative;
  transition: box-shadow 0.2s;
}
.fb-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
.fb-card.is-draft { border-color: #fde68a; background: linear-gradient(to bottom, #fffef7, #fff); }

/* Header */
.fb-card-header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1.1rem 1.2rem 0;
}

.fb-avatar {
  width: 44px; height: 44px;
  background: linear-gradient(135deg, #1a3a52, #2c5aa0);
  color: #FFD200;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Syne', sans-serif;
  font-size: 1rem; font-weight: 800;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(26,58,82,0.3);
}

.fb-author-info { flex: 1; min-width: 0; }
.fb-author-name {
  font-size: 0.9rem; font-weight: 700; color: #1e293b;
  display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap;
}
.fb-author-role { font-size: 0.78rem; font-weight: 400; color: #64748b; }
.fb-meta-row { display: flex; align-items: center; gap: 0.35rem; flex-wrap: wrap; margin-top: 0.2rem; row-gap: 0.2rem; }
.fb-time { font-size: 0.74rem; color: #94a3b8; }
.fb-dot { font-size: 0.7rem; color: #cbd5e1; }
.fb-audience { font-size: 0.74rem; color: #94a3b8; }
.fb-status-badge { display: flex; align-items: center; gap: 0.25rem; font-size: 0.7rem; font-weight: 600; padding: 2px 8px; border-radius: 20px; }
.fb-pub   { background: #dcfce7; color: #15803d; }
.fb-draft { background: #fef3c7; color: #92400e; }
.fb-status-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }

/* 3-dot menu */
.fb-menu-wrap { position: relative; flex-shrink: 0; }
.fb-menu-btn {
  width: 36px; height: 36px; border-radius: 50%;
  background: none; border: none; cursor: pointer; color: #94a3b8;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.15s;
}
.fb-menu-btn:hover { background: #f1f5f9; color: #475569; }
.fb-dropdown {
  position: absolute; top: calc(100% + 4px); right: 0; z-index: 50;
  background: #fff; border-radius: 10px; padding: 0.4rem;
  box-shadow: 0 8px 30px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.06);
  min-width: 180px;
}
.fb-dd-item {
  display: flex; align-items: center; gap: 0.7rem;
  padding: 0.55rem 0.75rem; border-radius: 7px;
  font-size: 0.83rem; font-weight: 500; color: #475569;
  text-decoration: none; border: none; background: none; cursor: pointer; width: 100%;
  transition: background 0.15s; font-family: 'Inter', sans-serif;
}
.fb-dd-item:hover { background: #f8fafc; color: #1e293b; }
.fb-dd-item:disabled { opacity: 0.5; cursor: not-allowed; }
.fb-dd-divider { height: 1px; background: #f1f5f9; margin: 0.3rem 0; }
.fb-dd-danger { color: #ef4444; }
.fb-dd-danger:hover { background: #fff1f2; }
.menu-drop-enter-active, .menu-drop-leave-active { transition: all 0.15s ease; }
.menu-drop-enter-from, .menu-drop-leave-to { opacity: 0; transform: translateY(-6px) scale(0.97); }

/* Category row */
.fb-cat-row { padding: 0.55rem 1.2rem 0; }
.fb-cat-tag {
  display: inline-block; font-size: 0.68rem; font-weight: 700;
  padding: 3px 10px; border-radius: 20px;
  background: #1a3a52; color: #FFD200; letter-spacing: 0.3px;
}

/* Title */
.fb-title {
  font-family: 'Syne', sans-serif;
  font-size: 1.15rem; font-weight: 800; color: #0f172a;
  line-height: 1.35; letter-spacing: -0.3px;
  padding: 0.45rem 1.2rem 0;
}

/* Body with see more */
.fb-body-container {
  padding: 0.55rem 1.2rem 0;
  position: relative;
}

.fb-body {
  font-size: 0.9rem; line-height: 1.7; color: #374151;
  max-height: 120px;
  overflow: hidden;
  transition: max-height 0.35s ease;
}
.fb-body.fb-body-expanded {
  max-height: 9999px;
}

/* Deep styles for rendered body content */
.fb-body :deep(.body-h3) { font-size: 0.95rem; font-weight: 700; margin: 0.65rem 0 0.25rem; color: #1e293b; }
.fb-body :deep(.body-quote) { border-left: 3px solid #FFD200; padding-left: 0.75rem; color: #64748b; margin: 0.5rem 0; font-style: italic; }
.fb-body :deep(.body-li) { margin-left: 1.1rem; }
.fb-body :deep(.body-hr) { border: none; border-top: 1px solid #e2e8f0; margin: 0.65rem 0; }

.fb-body-gradient {
  position: absolute; bottom: 0; left: 0; right: 0;
  height: 50px;
  background: linear-gradient(transparent, #fff);
  pointer-events: none;
}
.fb-card.is-draft .fb-body-gradient { background: linear-gradient(transparent, #fffef7); }

.fb-see-more-btn {
  display: flex; align-items: center; gap: 0.3rem;
  background: none; border: none; cursor: pointer;
  font-size: 0.84rem; font-weight: 600; color: #1a3a52;
  padding: 0.4rem 0 0; font-family: 'Inter', sans-serif;
  transition: color 0.15s;
}
.fb-see-more-btn:hover { color: #0f2438; }

/* Cover image */
.fb-image-wrap {
  margin-top: 0.9rem;
  border-top: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
}
.fb-image { width: 100%; max-height: 420px; object-fit: cover; display: block; }

/* Attachment */
.fb-attachment {
  display: flex; align-items: center; gap: 0.85rem;
  margin: 0.75rem 1.2rem 0;
  padding: 0.75rem 1rem;
  background: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0;
}
.fb-attach-icon { width: 40px; height: 40px; background: #eff6ff; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.fb-attach-info { flex: 1; }
.fb-attach-label { display: block; font-size: 0.72rem; color: #94a3b8; font-weight: 500; }
.fb-attach-link { font-size: 0.82rem; font-weight: 600; color: #1a3a52; text-decoration: none; }
.fb-attach-link:hover { text-decoration: underline; }

/* Divider */
.fb-divider { height: 1px; background: #f1f5f9; margin: 0.85rem 1.2rem 0; }

/* Action bar */
.fb-action-bar {
  display: flex; gap: 0.35rem; padding: 0.6rem 1.2rem 1rem;
}
.fb-act-btn {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.5rem 0.9rem; border-radius: 8px; border: 1.5px solid #e2e8f0;
  background: #fff; font-size: 0.78rem; font-weight: 600; cursor: pointer;
  color: #475569; transition: all 0.18s; font-family: 'Inter', sans-serif;
  text-decoration: none;
}
.fb-act-edit:hover   { background: #eff6ff; border-color: #bfdbfe; color: #1d4ed8; }
.fb-act-pub:hover    { background: #f0fdf4; border-color: #bbf7d0; color: #15803d; }
.fb-act-unpub:hover  { background: #fff7ed; border-color: #fed7aa; color: #c2410c; }
.fb-act-del:hover    { background: #fff1f2; border-color: #fecdd3; color: #be123c; }
.fb-act-btn:disabled { opacity: 0.45; cursor: not-allowed; }
/* ── Scheduled chip ── */
.fb-scheduled-chip {
  margin: 0.7rem 1.2rem 0;
  padding: 0.65rem 1rem;
  background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
  border: 1px solid #c4b5fd;
  border-left: 3px solid #7c3aed;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.chip-left {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  color: #6d28d9;
}

.chip-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6d28d9;
}

.chip-date {
  font-size: 0.78rem;
  font-weight: 700;
  color: #4c1d95;
  background: #fff;
  padding: 3px 10px;
  border-radius: 20px;
  border: 1px solid #c4b5fd;
  white-space: nowrap;
}

/* ── Badge programada en fb-status-badge ── */
.fb-scheduled { background: #f5f3ff; color: #6d28d9; }

/* ── Watermark programado ── */
.scheduled-watermark {
  position: absolute; inset: 0; pointer-events: none;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Syne', sans-serif; font-size: 2.5rem; font-weight: 800;
  color: rgba(124,58,237,0.05); letter-spacing: 6px;
  transform: rotate(-12deg); user-select: none;
}

/* ── Card scheduled border ── */
.fb-card.is-scheduled {
  border-color: #c4b5fd;
  background: linear-gradient(to bottom, #faf8ff, #fff);
}
.fb-card.is-scheduled .fb-body-gradient {
  background: linear-gradient(transparent, #faf8ff);
}

/* ── status-scheduled en grid/list ── */
.status-scheduled { background: rgba(245,243,255,0.92); color: #6d28d9; }



/* Draft watermark */
.draft-watermark {
  position: absolute; inset: 0; pointer-events: none;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Syne', sans-serif; font-size: 3rem; font-weight: 800;
  color: rgba(217,119,6,0.06); letter-spacing: 8px;
  transform: rotate(-12deg); user-select: none;
}

/* ══════════ GRID ══════════ */
.news-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:1.2rem; }
.news-card { background:#fff; border-radius:14px; overflow:hidden; border:1px solid #e2e8f0; transition:transform 0.2s, box-shadow 0.2s; display:flex; flex-direction:column; }
.news-card:hover { transform:translateY(-3px); box-shadow:0 10px 32px rgba(0,0,0,0.09); }
.news-card.is-draft { border-color:#fde68a; background:#fffef7; }
.card-img-wrap { position:relative; height:170px; background:#f8fafc; overflow:hidden; flex-shrink:0; }
.card-img { width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.35s; }
.news-card:hover .card-img { transform:scale(1.04); }
.card-img-placeholder { width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,#f8fafc,#f1f5f9); }
.card-overlay-top { position:absolute; top:0.7rem; left:0.7rem; right:0.7rem; display:flex; justify-content:space-between; align-items:flex-start; gap:0.4rem; }
.badge-cat { font-size:0.66rem; font-weight:700; padding:3px 9px; border-radius:20px; background:rgba(26,58,82,0.88); color:#FFD200; backdrop-filter:blur(4px); }
.badge-cat.small { font-size:0.64rem; }
.badge-status { display:flex; align-items:center; gap:0.3rem; font-size:0.66rem; font-weight:600; padding:3px 9px; border-radius:20px; backdrop-filter:blur(4px); }
.badge-status.small { font-size:0.64rem; }
.status-pub  { background:rgba(220,252,231,0.92); color:#15803d; }
.status-draft{ background:rgba(254,243,199,0.92); color:#92400e; }
.status-dot { width:5px; height:5px; border-radius:50%; background:currentColor; flex-shrink:0; }
.badge-career { font-size:0.64rem; font-weight:500; padding:2px 8px; border-radius:20px; background:#f1f5f9; color:#64748b; }
.card-content { padding:1rem 1.1rem 0.6rem; flex:1; }
.card-meta-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:0.4rem; }
.card-date { font-size:0.7rem; color:#94a3b8; }
.card-career { font-size:0.67rem; color:#64748b; background:#f1f5f9; padding:2px 7px; border-radius:10px; font-weight:500; }
.card-title { font-family:'Syne',sans-serif; font-size:0.93rem; font-weight:800; color:#0f172a; line-height:1.35; margin-bottom:0.4rem; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.card-excerpt { font-size:0.77rem; color:#64748b; line-height:1.6; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.card-actions { display:flex; gap:0.4rem; padding:0.75rem 1.1rem; border-top:1px solid #f1f5f9; }
.action-btn { flex:1; padding:0.48rem 0.3rem; border-radius:7px; border:1px solid #e2e8f0; background:#fff; font-size:0.71rem; font-weight:500; cursor:pointer; text-decoration:none; text-align:center; transition:all 0.18s; color:#475569; font-family:'Inter',sans-serif; display:flex; align-items:center; justify-content:center; gap:0.3rem; }
.btn-edit:hover       { background:#eff6ff; border-color:#bfdbfe; color:#1d4ed8; }
.btn-unpublish:hover  { background:#fff7ed; border-color:#fed7aa; color:#c2410c; }
.btn-publish-action:hover { background:#f0fdf4; border-color:#bbf7d0; color:#15803d; }
.btn-delete:hover     { background:#fff1f2; border-color:#fecdd3; color:#be123c; }
.action-btn:disabled  { opacity:0.45; cursor:not-allowed; }

/* ══════════ LIST ══════════ */
.news-list { display:flex; flex-direction:column; gap:0.65rem; }
.list-row { display:flex; align-items:center; gap:1rem; background:#fff; border-radius:12px; border:1px solid #e2e8f0; padding:0.9rem 1rem; transition:box-shadow 0.18s; }
.list-row:hover { box-shadow:0 4px 16px rgba(0,0,0,0.07); }
.list-row.is-draft { border-color:#fde68a; background:#fffef7; }
.list-img { width:78px; height:58px; border-radius:8px; overflow:hidden; flex-shrink:0; background:#f1f5f9; }
.list-img img { width:100%; height:100%; object-fit:cover; display:block; }
.list-img-placeholder { width:100%; height:100%; display:flex; align-items:center; justify-content:center; }
.list-content { flex:1; min-width:0; }
.list-badges { display:flex; gap:0.35rem; margin-bottom:0.25rem; flex-wrap:wrap; }
.list-title { font-family:'Syne',sans-serif; font-size:0.87rem; font-weight:800; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:0.18rem; }
.list-excerpt { font-size:0.75rem; color:#64748b; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:0.22rem; }
.list-meta { font-size:0.7rem; color:#94a3b8; }
.list-actions { display:flex; gap:0.4rem; flex-shrink:0; }
.icon-btn { width:32px; height:32px; border:1px solid #e2e8f0; border-radius:7px; background:#fff; cursor:pointer; color:#64748b; display:flex; align-items:center; justify-content:center; transition:all 0.18s; }
.icon-btn:hover       { background:#eff6ff; border-color:#bfdbfe; color:#1d4ed8; }
.ico-unpublish:hover  { background:#fff7ed; border-color:#fed7aa; color:#c2410c; }
.ico-publish:hover    { background:#f0fdf4; border-color:#bbf7d0; color:#15803d; }
.ico-delete:hover     { background:#fff1f2; border-color:#fecdd3; color:#be123c; }
.icon-btn:disabled    { opacity:0.45; cursor:not-allowed; }

/* Helpers */
.loading-row { display:flex; align-items:center; gap:0.4rem; }
.spinner-xs { display:inline-block; width:11px; height:11px; border:2px solid rgba(0,0,0,0.12); border-top-color:currentColor; border-radius:50%; animation:spin 0.5s linear infinite; flex-shrink:0; }

@media (max-width:720px) {
  .page-header { flex-direction:column; gap:1rem; align-items:flex-start; }
  .btn-new { width:100%; justify-content:center; }
  .stats-row { flex-wrap:wrap; }
  .filters-bar { flex-direction:column; align-items:stretch; }
  .news-grid { grid-template-columns:1fr; }
  .feed-list { grid-template-columns: 1fr; }
}
</style>
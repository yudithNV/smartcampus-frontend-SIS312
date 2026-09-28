<template>
  <div class="reports-container">
    <div class="header-section">
      <h2>Reportes del Sistema</h2>
      <div class="filter-section">
        <select v-model="selectedReportType" class="filter-select">
          <option value="all">Todos los Módulos</option>
          <option value="usuarios">Usuarios</option>
          <option value="eventos">Eventos</option>
          <option value="quejas">Quejas y Reclamos</option>
          <option value="publicaciones">Noticias</option>
          <option value="sugerencias">Sugerencias</option>
          <option value="accesos">Accesos / Logs</option>
        </select>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Buscar reportes..." 
          class="search-input"
        >
      </div>
    </div>

    <div class="reports-grid">
      <div v-for="report in filteredReports" :key="report.id" class="report-card">
        <div class="report-header">
          <span class="report-icon" :class="`icon-${report.type}`">
            <svg v-if="report.type === 'usuarios'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
            </svg>
            <svg v-else-if="report.type === 'eventos'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <svg v-else-if="report.type === 'quejas'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            <svg v-else-if="report.type === 'publicaciones'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <path d="M16 8h2"></path>
              <path d="M16 12h2"></path>
              <path d="M16 16h2"></path>
              <path d="M6 8h6v8H6z"></path>
            </svg>
            <svg v-else-if="report.type === 'sugerencias'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21h6v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"></path>
            </svg>
            <svg v-else-if="report.type === 'accesos'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </span>
          <div class="report-title">
            <h3>{{ report.title }}</h3>
            <p class="report-status-tag">Módulo del Sistema</p>
          </div>
        </div>
        <div class="report-content">
          <p>{{ report.description }}</p>
        </div>
        <div class="report-stats" style="margin-bottom: 1.5rem;">
          <div class="stat">
            <span class="stat-label">Registros:</span>
            <span class="stat-value" style="font-size: 1rem; color: #475569;">{{ report.records }}</span>
          </div>
        </div>
        <div class="report-actions">
          <button class="btn-download-excel" @click="openFilterModal(report.type, 'excel')" :disabled="downloading[`${report.type}-excel`]">
            <span v-if="downloading[`${report.type}-excel`]" class="spinner-xs"></span>
            <span v-else>Generar Excel</span>
          </button>
          <button class="btn-download-pdf" @click="openFilterModal(report.type, 'pdf')" :disabled="downloading[`${report.type}-pdf`]">
            <span v-if="downloading[`${report.type}-pdf`]" class="spinner-xs"></span>
            <span v-else>Generar PDF</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Filtros -->
    <transition name="modal-fade">
      <div v-if="showFilterModal" class="modal-overlay" @click.self="closeFilterModal">
        <div class="modal-content">
          <button class="modal-close" @click="closeFilterModal">&times;</button>
          
          <h3>Filtros de Reporte: {{ getReportTitle(selectedModuleForFilter) }}</h3>
          
          <div class="modal-body">
            <!-- Filtros para EVENTOS -->
            <div v-if="selectedModuleForFilter === 'eventos'" class="filter-group-container">
              <div class="form-group">
                <label>Estado del Evento</label>
                <select v-model="filters.isActive" class="form-select-modal">
                  <option value="">Todos</option>
                  <option :value="true">Activo / Publicado</option>
                  <option :value="false">Inactivo / Borrador</option>
                </select>
              </div>
              <div class="form-group">
                <label>Categoría del Evento</label>
                <select v-model="filters.categoryId" class="form-select-modal">
                  <option value="">Todas</option>
                  <option v-for="cat in eventCategories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
              </div>
              <div class="form-group-dates">
                <div class="form-group">
                  <label>Fecha Desde</label>
                  <input type="date" v-model="filters.fechaInicio" class="form-input-modal">
                </div>
                <div class="form-group">
                  <label>Fecha Hasta</label>
                  <input type="date" v-model="filters.fechaFin" class="form-input-modal">
                </div>
              </div>
            </div>

            <!-- Filtros para USUARIOS -->
            <div v-if="selectedModuleForFilter === 'usuarios'" class="filter-group-container">
              <div class="form-group">
                <label>Rol de Usuario</label>
                <select v-model="filters.role" class="form-select-modal">
                  <option value="">Todos</option>
                  <option value="ESTUDIANTE">Estudiante</option>
                  <option value="PUBLICADOR">Publicador</option>
                  <option value="ADMINISTRADOR">Administrador</option>
                </select>
              </div>
              <div class="form-group">
                <label>Estado de Cuenta</label>
                <select v-model="filters.status" class="form-select-modal">
                  <option value="">Todos</option>
                  <option value="ACTIVO">Activo</option>
                  <option value="INACTIVO">Inactivo</option>
                  <option value="BLOQUEADO">Bloqueado</option>
                </select>
              </div>
              <div class="form-group">
                <label>Carrera</label>
                <select v-model="filters.careerId" class="form-select-modal">
                  <option value="">Todas</option>
                  <option v-for="car in careers" :key="car.id" :value="car.id">
                    {{ car.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Filtros para QUEJAS -->
            <div v-if="selectedModuleForFilter === 'quejas'" class="filter-group-container">
              <div class="form-group">
                <label>Estado del Reclamo</label>
                <select v-model="filters.status" class="form-select-modal">
                  <option value="">Todos</option>
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="EN_REVISION">En Revisión</option>
                  <option value="RESUELTO">Resuelto</option>
                </select>
              </div>
              <div class="form-group">
                <label>Categoría (Texto)</label>
                <input type="text" v-model="filters.category" placeholder="Ej. Académico, Infraestructura..." class="form-input-modal">
              </div>
              <div class="form-group-dates">
                <div class="form-group">
                  <label>Fecha Desde</label>
                  <input type="date" v-model="filters.fechaInicio" class="form-input-modal">
                </div>
                <div class="form-group">
                  <label>Fecha Hasta</label>
                  <input type="date" v-model="filters.fechaFin" class="form-input-modal">
                </div>
              </div>
            </div>

            <!-- Filtros para PUBLICACIONES -->
            <div v-if="selectedModuleForFilter === 'publicaciones'" class="filter-group-container">
              <div class="form-group">
                <label>Categoría de la Publicación</label>
                <select v-model="filters.category" class="form-select-modal">
                  <option value="">Todas</option>
                  <option value="ACADEMICO">Académico</option>
                  <option value="EVENTOS">Eventos</option>
                  <option value="AVISOS">Avisos</option>
                  <option value="DEPORTES">Deportes</option>
                  <option value="CULTURA">Cultura</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>
              <div class="form-group">
                <label>Estado de Publicación</label>
                <select v-model="filters.published" class="form-select-modal">
                  <option value="">Todos</option>
                  <option :value="true">Publicado</option>
                  <option :value="false">Borrador</option>
                </select>
              </div>
              <div class="form-group-dates">
                <div class="form-group">
                  <label>Fecha Desde</label>
                  <input type="date" v-model="filters.fechaInicio" class="form-input-modal">
                </div>
                <div class="form-group">
                  <label>Fecha Hasta</label>
                  <input type="date" v-model="filters.fechaFin" class="form-input-modal">
                </div>
              </div>
            </div>

            <!-- Filtros para SUGERENCIAS -->
            <div v-if="selectedModuleForFilter === 'sugerencias'" class="filter-group-container">
              <div class="form-group">
                <label>Categoría de Sugerencia</label>
                <select v-model="filters.category" class="form-select-modal">
                  <option value="">Todas</option>
                  <option value="INFRAESTRUCTURA">Infraestructura</option>
                  <option value="TRAMITES">Trámites</option>
                  <option value="CLASES">Clases</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>
              <div class="form-group-dates">
                <div class="form-group">
                  <label>Fecha Desde</label>
                  <input type="date" v-model="filters.fechaInicio" class="form-input-modal">
                </div>
                <div class="form-group">
                  <label>Fecha Hasta</label>
                  <input type="date" v-model="filters.fechaFin" class="form-input-modal">
                </div>
              </div>
            </div>

            <!-- Filtros para ACCESOS -->
            <div v-if="selectedModuleForFilter === 'accesos'" class="filter-group-container">
              <div class="form-group">
                <label>Resultado del Intento</label>
                <select v-model="filters.success" class="form-select-modal">
                  <option value="">Todos</option>
                  <option :value="true">Exitoso</option>
                  <option :value="false">Fallido</option>
                </select>
              </div>
              <div class="form-group-dates">
                <div class="form-group">
                  <label>Fecha Desde</label>
                  <input type="date" v-model="filters.fechaInicio" class="form-input-modal">
                </div>
                <div class="form-group">
                  <label>Fecha Hasta</label>
                  <input type="date" v-model="filters.fechaFin" class="form-input-modal">
                </div>
              </div>
            </div>
          </div>
          <p v-if="dateError" class="date-error-msg">{{ dateError }}</p>
          <div class="modal-actions">
            <button class="btn-download-modal" @click="confirmDownload" :disabled="downloading[`${selectedModuleForFilter}-${selectedFormatForFilter}`]">
              <span v-if="downloading[`${selectedModuleForFilter}-${selectedFormatForFilter}`]" class="spinner-xs"></span>
              <span v-else>Confirmar y Descargar</span>
            </button>
            <button class="btn-close-modal" @click="closeFilterModal">Cancelar</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const selectedReportType = ref('all')
const searchQuery = ref('')
const downloading = ref({})

// Modal and filters state
const showFilterModal = ref(false)
const selectedModuleForFilter = ref(null)
const selectedFormatForFilter = ref(null)

const filters = ref({
  isActive: '',
  categoryId: '',
  fechaInicio: '',
  fechaFin: '',
  role: '',
  status: '',
  careerId: '',
  category: '',
  published: '',
  success: ''
})

const careers = ref([])
const eventCategories = ref([])

// Configuración de los reportes por módulo disponibles
const reportsList = [
  {
    id: 1,
    type: 'usuarios',
    title: 'Reporte de Usuarios',
    description: 'Resumen completo de todos los usuarios registrados, incluyendo nombres, correos, roles, estados y carreras.',
    records: 'Todos los registros (Base de Datos)'
  },
  {
    id: 2,
    type: 'eventos',
    title: 'Reporte de Eventos',
    description: 'Listado detallado de los eventos del campus creados, sus fechas de realización, ubicaciones asignadas y tipos.',
    records: 'Todos los registros (Base de Datos)'
  },
  {
    id: 3,
    type: 'quejas',
    title: 'Reporte de Quejas y Reclamos',
    description: 'Consolidado de reclamos enviados por los estudiantes con detalle de categorías, cuerpo del mensaje y estados de atención.',
    records: 'Todos los registros (Base de Datos)'
  },
  {
    id: 4,
    type: 'publicaciones',
    title: 'Reporte de Noticias',
    description: 'Registro de noticias y comunicados del campus publicados por los organizadores autorizados.',
    records: 'Todos los registros (Base de Datos)'
  },
  {
    id: 5,
    type: 'sugerencias',
    title: 'Reporte de Sugerencias',
    description: 'Historial de propuestas y sugerencias de mejora emitidas por los estudiantes de la comunidad universitaria.',
    records: 'Todos los registros (Base de Datos)'
  },
  {
    id: 6,
    type: 'accesos',
    title: 'Reporte de Accesos / Logs',
    description: 'Registro de todos los intentos de acceso al sistema: email, dirección IP, resultado (exitoso o fallido), user agent y fecha.',
    records: 'Todos los registros (Base de Datos)'
  }
]
const dateError = ref('')

// Fetch dependencies on mount
onMounted(() => {
  fetchCareers()
  fetchEventCategories()
})

async function fetchCareers() {
  try {
    const response = await fetch('/api/careers')
    if (response.ok) {
      careers.value = await response.json()
    }
  } catch (error) {
    console.error('Error al obtener carreras:', error)
  }
}

async function fetchEventCategories() {
  try {
    const response = await fetch('/api/categories')
    if (response.ok) {
      eventCategories.value = await response.json()
    }
  } catch (error) {
    console.error('Error al obtener categorías de eventos:', error)
  }
}

function getReportTitle(modulo) {
  const report = reportsList.find(r => r.type === modulo)
  return report ? report.title : modulo
}

function openFilterModal(modulo, formato) {
  if (modulo === 'reservas') {
    downloadReportFile(modulo, formato)
    return
  }
  
  selectedModuleForFilter.value = modulo
  selectedFormatForFilter.value = formato
  dateError.value = ''
  
  // Reset filters
  filters.value = {
    isActive: '',
    categoryId: '',
    fechaInicio: '',
    fechaFin: '',
    role: '',
    status: '',
    careerId: '',
    category: '',
    published: '',
    success: ''
  }
  
  showFilterModal.value = true
}

function closeFilterModal() {
  showFilterModal.value = false
  selectedModuleForFilter.value = null
  selectedFormatForFilter.value = null
}

function confirmDownload() {
  dateError.value = ''
  
  if (filters.value.fechaInicio || filters.value.fechaFin) {
    const hoy = new Date()
    const minFecha = new Date('2020-01-01')
    
    if (filters.value.fechaInicio) {
      const desde = new Date(filters.value.fechaInicio)
      if (desde < minFecha || desde > hoy) {
        dateError.value = 'La fecha "Desde" no es válida. Debe estar entre 2020 y hoy.'
        return
      }
    }
    
    if (filters.value.fechaFin) {
      const hasta = new Date(filters.value.fechaFin)
      if (hasta < minFecha || hasta > hoy) {
        dateError.value = 'La fecha "Hasta" no es válida. Debe estar entre 2020 y hoy.'
        return
      }
    }

    if (filters.value.fechaInicio && filters.value.fechaFin && filters.value.fechaFin < filters.value.fechaInicio) {
      dateError.value = 'La fecha "Hasta" no puede ser menor que "Desde".'
      return
    }
  }

  downloadReportFile(selectedModuleForFilter.value, selectedFormatForFilter.value)
  closeFilterModal()
}

// Filtrar reportes según selección e input
const filteredReports = computed(() => {
  return reportsList.filter(report => {
    const matchesType = selectedReportType.value === 'all' || report.type === selectedReportType.value
    const matchesSearch = 
      report.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesType && matchesSearch
  })
})

// Función para descargar reporte real desde backend con parámetros
async function downloadReportFile(modulo, formato) {
  const key = `${modulo}-${formato}`
  if (downloading.value[key]) return
  downloading.value[key] = true
  
  try {
    const token = localStorage.getItem('ucb_token')
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {}
    
    // Build query params
    const queryParams = new URLSearchParams()
    if (modulo === 'eventos') {
      if (filters.value.isActive !== '') queryParams.append('isActive', filters.value.isActive)
      if (filters.value.categoryId !== '') queryParams.append('categoryId', filters.value.categoryId)
      if (filters.value.fechaInicio) queryParams.append('fechaInicio', filters.value.fechaInicio)
      if (filters.value.fechaFin) queryParams.append('fechaFin', filters.value.fechaFin)
    } else if (modulo === 'usuarios') {
      if (filters.value.role !== '') queryParams.append('role', filters.value.role)
      if (filters.value.status !== '') queryParams.append('status', filters.value.status)
      if (filters.value.careerId !== '') queryParams.append('careerId', filters.value.careerId)
    } else if (modulo === 'quejas') {
      if (filters.value.status !== '') queryParams.append('status', filters.value.status)
      if (filters.value.category !== '') queryParams.append('category', filters.value.category)
      if (filters.value.fechaInicio) queryParams.append('fechaInicio', filters.value.fechaInicio)
      if (filters.value.fechaFin) queryParams.append('fechaFin', filters.value.fechaFin)
    } else if (modulo === 'publicaciones') {
      if (filters.value.category !== '') queryParams.append('category', filters.value.category)
      if (filters.value.published !== '') queryParams.append('published', filters.value.published)
      if (filters.value.fechaInicio) queryParams.append('fechaInicio', filters.value.fechaInicio)
      if (filters.value.fechaFin) queryParams.append('fechaFin', filters.value.fechaFin)
    } else if (modulo === 'sugerencias') {
      if (filters.value.category !== '') queryParams.append('category', filters.value.category)
      if (filters.value.fechaInicio) queryParams.append('fechaInicio', filters.value.fechaInicio)
      if (filters.value.fechaFin) queryParams.append('fechaFin', filters.value.fechaFin)
    } else if (modulo === 'accesos') {
      if (filters.value.success !== '') queryParams.append('success', filters.value.success)
      if (filters.value.fechaInicio) queryParams.append('fechaInicio', filters.value.fechaInicio)
      if (filters.value.fechaFin) queryParams.append('fechaFin', filters.value.fechaFin)
    }
    
    const queryString = queryParams.toString()
    const endpoint = `/api/reportes/${modulo}/${formato}${queryString ? '?' + queryString : ''}`
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers
    })
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }
    
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    
    const extension = formato === 'excel' ? 'xlsx' : 'pdf'
    const dateStr = new Date().toISOString().split('T')[0]
    link.download = `reporte-${modulo}-${dateStr}.${extension}`
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error al descargar el reporte:', error)
    alert('Ocurrió un error al generar o descargar el reporte. Verifique que el servidor backend esté en ejecución y tenga los privilegios necesarios.')
  } finally {
    downloading.value[key] = false
  }
}
</script>

<style scoped>
.date-error-msg {
  color: #dc2626;
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
  text-align: center;
}
.reports-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.header-section {
  margin-bottom: 2rem;
}

.header-section h2 {
  font-size: 1.8rem;
  color: #1a3a52;
  margin: 0 0 1.5rem 0;
  font-weight: 700;
}

.filter-section {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-select,
.search-input {
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: 'Inter', sans-serif;
  transition: all 0.3s ease;
}

.filter-select {
  min-width: 200px;
  background: #ffffff;
  color: #1a3a52;
  cursor: pointer;
}

.filter-select:hover,
.filter-select:focus {
  border-color: #FFD200;
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 210, 0, 0.1);
}

.search-input {
  flex: 1;
  min-width: 250px;
  color: #1a3a52;
}

.search-input:focus {
  outline: none;
  border-color: #FFD200;
  box-shadow: 0 0 0 3px rgba(255, 210, 0, 0.1);
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.report-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.report-card:hover {
  border-color: #FFD200;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.report-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: flex-start;
}

.report-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-usuarios {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.icon-eventos {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.icon-reclamos,
.icon-quejas {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.icon-publicaciones {
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.icon-sugerencias {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.icon-accesos {
  background: rgba(6, 182, 212, 0.1);
  color: #06b6d4;
}

.report-title h3 {
  font-size: 1.1rem;
  color: #1a3a52;
  margin: 0 0 0.25rem 0;
  font-weight: 700;
}

.report-date {
  font-size: 0.85rem;
  color: #94a3b8;
  margin: 0;
}

.report-content {
  margin-bottom: 1rem;
}

.report-content p {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

.report-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
}

.stat {
  flex: 1;
}

.stat-label {
  display: block;
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 500;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.stat-value {
  display: block;
  font-size: 1.2rem;
  color: #1a3a52;
  font-weight: 700;
}

.status-completado {
  color: #22c55e;
}

.status-pendiente {
  color: #f59e0b;
}

.report-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-download-excel,
.btn-download-pdf {
  flex: 1;
  padding: 0.7rem 0.5rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
  gap: 0.35rem;
}

.btn-download-excel {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.btn-download-excel:hover:not(:disabled) {
  background: #16a34a;
  color: #ffffff;
  border-color: #16a34a;
  transform: translateY(-1px);
}

.btn-download-pdf {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.btn-download-pdf:hover:not(:disabled) {
  background: #dc2626;
  color: #ffffff;
  border-color: #dc2626;
  transform: translateY(-1px);
}

.btn-download-excel:disabled,
.btn-download-pdf:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.report-status-tag {
  font-size: 0.8rem;
  color: #94a3b8;
  margin: 0;
}

.spinner-xs {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  animation: modalPopIn 0.3s ease;
  position: relative;
}

@keyframes modalPopIn {
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #94a3b8;
  transition: color 0.3s ease;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: #1a3a52;
}

.modal-content h3 {
  font-size: 1.5rem;
  color: #1a3a52;
  margin: 0 0 1.5rem 0;
  font-weight: 700;
}

.modal-body {
  margin-bottom: 1.5rem;
}

.modal-body p {
  margin: 0 0 0.75rem 0;
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.6;
}

.modal-body strong {
  color: #1a3a52;
  font-weight: 600;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-download-modal,
.btn-close-modal {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
}

.btn-download-modal {
  background: #FFD200;
  color: #1a3a52;
}

.btn-download-modal:hover {
  background: #ffed4e;
}

.btn-close-modal {
  background: #f8fafc;
  color: #1a3a52;
  border: 1px solid #e2e8f0;
}

.btn-close-modal:hover {
  background: #e2e8f0;
}

/* Transición modal */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
  }

  .filter-select,
  .search-input {
    width: 100%;
    min-width: unset;
  }

  .reports-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .modal-content {
    padding: 1.5rem;
  }
}

/* Nuevos estilos para los filtros del modal */
.filter-group-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
}

.form-select-modal,
.form-input-modal {
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #1e293b;
  background-color: #ffffff;
  transition: all 0.2s ease;
  width: 100%;
}

.form-select-modal:focus,
.form-input-modal:focus {
  outline: none;
  border-color: #ffd200;
  box-shadow: 0 0 0 3px rgba(255, 210, 0, 0.1);
}

.form-group-dates {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
</style>


// Configuración base de API
const API_BASE_URL = '/api'

// ─────────────────────────────────────────────────────────────────────────────
// apiRequest (forma nueva correcta)
// ─────────────────────────────────────────────────────────────────────────────
async function apiRequest(endpoint, options = {}) {
  try {
    const token = localStorage.getItem('ucb_token')
    const isFormData = options.body instanceof FormData

    const headers = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      mode: 'cors',
      method: 'GET',
      ...options,
      headers
    })

    // ── SCRUM-57: Si el backend retorna 401, cerrar sesión inmediatamente ──
    if (response.status === 401) {
      const errorData = await response.json().catch(() => ({}))
      const msg =
        errorData?.message ||
        'Tu sesión ha expirado o tu cuenta ha sido bloqueada. Contacta al administrador.'

      // Limpiar sesión
      localStorage.removeItem('ucb_token')
      localStorage.removeItem('ucb_role')
      localStorage.removeItem('ucb_email')
      localStorage.removeItem('ucb_user_id')
      localStorage.removeItem('must_change_password')

      // Redirigir al login con flag
      window.location.href = '/?blocked=1'

      throw new Error(msg)
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      const errorMessage =
        errorData?.message ||
        errorData?.error ||
        `Error ${response.status}`
      throw new Error(errorMessage)
    }

    return await response.json()
  } catch (error) {
    console.error('API Request failed:', error)
    throw error
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Servicios de Autenticación
// ─────────────────────────────────────────────────────────────────────────────
export const userService = {
  login: (email, password) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  logout: () =>
    apiRequest('/auth/logout', { method: 'POST' }),
 // ── Recuperación de contraseña 
  forgotPassword: (email) =>
    apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    }),

  validateResetToken: (token) =>
    apiRequest(
      `/auth/validate-reset-token?token=${encodeURIComponent(token)}`
    ),

  resetPassword: (token, newPassword, confirmPassword) =>
    apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        token,
        newPassword,
        confirmPassword
      })
    }),
  getMe: () =>
    apiRequest('/auth/me'),

  getProfile: () =>
    apiRequest('/profile'),

  updateProfile: (data) =>
    apiRequest('/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  // Preferencias
  getPreferences: () =>
    apiRequest('/profile/preferences'),

  savePreferences: (dto) =>
    apiRequest('/profile/preferences', {
      method: 'PUT',
      body: JSON.stringify(dto)
    }),

  // NUEVO: AVATAR
  uploadAvatar: (file) => {
    const formData = new FormData()
    formData.append('file', file)

    return apiRequest('/profile/avatar', {
      method: 'POST',
      body: formData
    })
  },

  removeAvatar: async () => {
	  const token = localStorage.getItem('ucb_token')

	  const response = await fetch(`${API_BASE_URL}/profile/avatar`, {
		  method: 'DELETE',
		  mode: 'cors',
		  headers: {
			  ...(token ? { 'Authorization': `Bearer ${token}` } : {})
		  }
	  })

	  if (!response.ok) {
		  const errorData = await response.json().catch(() => null)
		  throw new Error(errorData?.message || `Error ${response.status}`)
	  }

	// 204 No Content → no parsear JSON
	  return
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Servicios de Usuarios (Admin)
// ─────────────────────────────────────────────────────────────────────────────
export const adminUserService = {
  getAll: (page = 0, size = 10, search = '', role = '', status = '', career = '', sortBy = 'createdAt', sortType = 'DESC') => {
    const params = new URLSearchParams({ page, size, sortBy, sortType })
    if (search) params.append('search', search)
    if (role)   params.append('role', role)
    if (status) params.append('status', status)
    if (career) params.append('career', career)
    return apiRequest(`/users?${params}`)
  },

  create: (data) =>
    apiRequest('/users', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) =>
    apiRequest(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  
  updateStatus: (id, status) =>
    apiRequest(`/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  delete: (id) =>
    apiRequest(`/users/${id}`, { method: 'DELETE' }),

  getPublicProfile: (id) => apiRequest(`/users/${id}/public`)
}

// ─────────────────────────────────────────────────────────────────────────────
// Servicios de Noticias
// ─────────────────────────────────────────────────────────────────────────────
export const newsService = {
  getAll: () => apiRequest('/news'),
  getById: (id) => apiRequest(`/news/${id}`),
  create: (data) => apiRequest('/news', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/news/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/news/${id}`, { method: 'DELETE' }),
  getMy: () => apiRequest('/news/my'),
  getRecent: (queryString) => apiRequest(`/news/recent?${queryString}`)
}

// ─────────────────────────────────────────────────────────────────────────────
// Normalizador de eventos
// ─────────────────────────────────────────────────────────────────────────────
function normalizeEvent(event) {
  let cleanDescription = event.description
  if (typeof cleanDescription === 'string' && cleanDescription.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(cleanDescription)
      cleanDescription = parsed.description || ''
    } catch {
      cleanDescription = ''
    }
  }
  return {
    id: event.id,
    name: event.name,
    date: event.startDatetime,
    description: cleanDescription || 'Sin descripción',
    location: event.location
      ? `${event.location.name} - ${event.location.block}`
      : 'Por confirmar',
    eventType: event.eventType,
    posterUrl: event.posterUrl
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Servicios de Eventos
// ─────────────────────────────────────────────────────────────────────────────
export const eventService = {
  getAll: (page = 0, size = 10, sortBy = 'createdAt', sortType = 'DESC') => {
    const params = new URLSearchParams({ page, size, sortBy, sortType })
    return apiRequest(`/events?${params}`)
  },

  getUpcoming: async () => {
    const response = await apiRequest('/events/upcoming')
    const list = response?.data ?? response
    return Array.isArray(list) ? list.map(normalizeEvent) : []
  },

  getMy: (page = 0, size = 10, sortBy = 'createdAt', sortType = 'DESC') => {
    const params = new URLSearchParams({ page, size, sortBy, sortType })
    return apiRequest(`/events/my?${params}`)
  },
  
  getRegistered: (startDate, endDate) => {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)
    const queryString = params.toString()
    return apiRequest(`/events/registered${queryString ? '?' + queryString : ''}`)
  },

  getByCareer: (careerId) => apiRequest(`/events/career/${careerId}`),

  getCalendarEvents: async (year, month, day = null, careerId = null, categoryId = null) => {
    const params = new URLSearchParams({ year, month })
    if (day) params.append('day', day)
    if (careerId) params.append('careerId', careerId)
    if (categoryId) params.append('categoryId', categoryId)
    
    const response = await apiRequest(`/events/calendar?${params}`)
    return response?.data ?? response
  },

  getById: (id) => apiRequest(`/events/${id}`),
  create: (data) => apiRequest('/events', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/events/${id}`, { method: 'DELETE' }),
  register: (eventId) => apiRequest(`/events/${eventId}/register`, { method: 'POST' }),
  unregister: (eventId) => apiRequest(`/events/${eventId}/register`, { method: 'DELETE' }),
  getAttendees: (eventId, page = 0, size = 100) => {
    const params = new URLSearchParams({ page, size })
    return apiRequest(`/events/${eventId}/inscritos?${params}`)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Servicios de Calendario Académico
// ─────────────────────────────────────────────────────────────────────────────
export const academicCalendarService = {
  getMy: () => apiRequest('/academic-calendar'),
  create: (data) => apiRequest('/academic-calendar', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/academic-calendar/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/academic-calendar/${id}`, { method: 'DELETE' })
}

// ─────────────────────────────────────────────────────────────────────────────
// Servicios de Reservas
// ─────────────────────────────────────────────────────────────────────────────
export const reservationService = {
  getAll: () => apiRequest('/reservations'),
  create: (data) => apiRequest('/reservations', { method: 'POST', body: JSON.stringify(data) }),
  cancel: (id) => apiRequest(`/reservations/${id}/cancel`, { method: 'POST' })
}

// ─────────────────────────────────────────────────────────────────────────────
// Servicios básicos
// ─────────────────────────────────────────────────────────────────────────────
export const careerService   = { getAll: () => apiRequest('/careers') }
export const categoryService = { getAll: () => apiRequest('/categories') }
export const locationService = { getAll: () => apiRequest('/locations') }

// ─────────────────────────────────────────────────────────────────────────────
// Servicios de Sugerencias
// ─────────────────────────────────────────────────────────────────────────────
export const suggestionService = {
  create: (data) => apiRequest('/suggestions', { method: 'POST', body: JSON.stringify(data) }),
  getMy:  () => apiRequest('/suggestions/my'),
  delete: (id) => apiRequest(`/suggestions/${id}`, { method: 'DELETE' }),
  getAll: (category = '') => apiRequest(`/suggestions/admin${category ? `?category=${category}` : ''}`),
  reply:  (id, data) => apiRequest(`/suggestions/${id}/reply`, { method: 'PUT', body: JSON.stringify(data) })
}

// ─────────────────────────────────────────────────────────────────────────────
// Servicios de Reclamos (VERSIÓN CORRECTA)
// ─────────────────────────────────────────────────────────────────────────────
export const complaintService = {
  getMy: async () => {
    const response = await apiRequest('/complaints/my')
    return response.data || response
  },

  create: async (dto) => {
    const response = await apiRequest('/complaints', {
      method: 'POST',
      body: JSON.stringify({
        title: dto.title,
        category: dto.category,
        body: dto.body
      })
    })
    return response.data || response
  },

  addAttachments: async (id, files) => {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))

    const response = await apiRequest(`/complaints/${id}/adjuntos`, {
      method: 'POST',
      body: formData
    })
    return response.data || response
  },

  getResponses: async (id) => {
    const response = await apiRequest(`/complaints/${id}/responses`)
    return response.data || response
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard Admin
// ─────────────────────────────────────────────────────────────────────────────
export const dashboardAdminService = {
  getMetrics: async () => {
    const response = await apiRequest('/dashboard/admin')
    return response.data || response
  },

  getTemporalMetrics: async (fromYear, fromMonth, toYear, toMonth) => {
    const params = new URLSearchParams({ fromYear, fromMonth, toYear, toMonth })
    const response = await apiRequest(`/dashboard/admin/temporal?${params}`)
    return response.data || response
  }
}
// ─────────────────────────────────────────────────────────────────────────────
export const adminComplaintService = {
  getAll: async () => {
    const response = await apiRequest('/admin/complaints')
    return response.data || response
  },

  getById: async (id) => {
    const response = await apiRequest(`/admin/complaints/${id}`)
    return response.data || response
  },

  patchStatus: async (id) => {
    const response = await apiRequest(`/admin/complaints/${id}/status`, {
      method: 'PATCH'
    })
    return response.data || response
  },

  postResponse: async (id, body) => {
    const response = await apiRequest(`/admin/complaints/${id}/responses`, {
      method: 'POST',
      body: JSON.stringify({ body })
    })
    return response.data || response
  },

  listResponses: async (id) => {
    const response = await apiRequest(`/admin/complaints/${id}/responses`)
    return response.data || response
  }
}


export const accessLogService = {
  getAll: () => apiRequest('/access-logs')
}

// ─────────────────────────────────────────────────────────────────────────────
// Servicios del ChatBot
// ─────────────────────────────────────────────────────────────────────────────
export const chatbotService = {
  ask: async (question) => {
    const response = await apiRequest('/chatbot/ask', {
      method: 'POST',
      body: JSON.stringify({ question })
    })
    return response.data || response
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Servicios de Favoritos
// ─────────────────────────────────────────────────────────────────────────────
export const favoriteService = {
  add: (newsId) =>
    apiRequest(`/news/favorites/${newsId}`, { method: 'POST' }),

  remove: (newsId) =>
    apiRequest(`/news/favorites/${newsId}`, { method: 'DELETE' }),

  getMy: () =>
    apiRequest('/news/favorites'),

  getStatus: (newsId) =>
    apiRequest(`/news/favorites/${newsId}/status`),
}
// ─────────────────────────────────────────────────────────────────────────────
// Servicios de Notificaciones
// ─────────────────────────────────────────────────────────────────────────────
export const notificationService = {
  getAll: () => apiRequest('/notifications'),
  getUnreadCount: () => apiRequest('/notifications/unread-count'),
  markAllRead: () => apiRequest('/notifications/mark-read', { method: 'PATCH' })
}

// ─────────────────────────────────────────────────────────────────────────────
// Servicios de Reportes de Comentarios
// ─────────────────────────────────────────────────────────────────────────────
export const commentReportService = {
  report: (newsId, commentId, dto) =>
    apiRequest(`/news/${newsId}/comments/${commentId}/report`, {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  checkStatus: (newsId, commentId) =>
    apiRequest(`/news/${newsId}/comments/${commentId}/report/status`),
}

// ─────────────────────────────────────────────────────────────────────────────
// Servicios de Moderación (
// ─────────────────────────────────────────────────────────────────────────────
export const moderationService = {
  getPendingReports: () =>
    apiRequest('/moderation/reports'),

  processReport: (reportId, action) =>
    apiRequest(`/moderation/reports/${reportId}`, {
      method: 'PATCH',
      body: JSON.stringify({ action }),
    }),

  getPublisherReports: (status = '') => {
    const q = status ? `?status=${status}` : ''
    return apiRequest(`/publisher/reports${q}`)
  },

  getPublisherSummary: () =>
    apiRequest('/publisher/reports/summary'),

  deletePublisherComment: (commentId) =>
    apiRequest(`/publisher/comments/${commentId}`, { method: 'DELETE' }),

}
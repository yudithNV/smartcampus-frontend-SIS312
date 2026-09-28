import { ref, reactive } from 'vue'

const API_BASE = import.meta.env.VITE_API_URL || ''

// ── Estado GLOBAL (fuera del composable para persistir entre renders) ──
const reactions      = reactive({})
const comments       = reactive({})
const commentCounts  = reactive({})

function getAuthHeaders() {
  const token = localStorage.getItem('ucb_token')
  if (!token) console.warn('[Auth] Token no encontrado')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}
// Agrega esta función helper arriba, antes de useNewsInteractions()
function getCurrentUserId() {
  return localStorage.getItem('ucb_user_id') || null
}

function getCurrentUserName() {
  return localStorage.getItem('ucb_name') || null
}

function enrichComments(list) {
  const userId   = getCurrentUserId()
  const userName = getCurrentUserName()
  return list.map(c => ({
    ...c,
    isOwn: c.own === true                                           // ← c.own, no c.isOwn
      || (userId   && String(c.userId) === String(userId))
      || (userName && c.userFullName   === userName)
  }))
}
export function useNewsInteractions() {
  const reactionLoading = ref(null)
  const commentLoading  = ref(null)
  const commentError    = ref('')


  function reEnrichAll() {
    Object.keys(comments).forEach(newsId => {
      if (comments[newsId]?.length) {
        comments[newsId] = enrichComments(comments[newsId])
      }
    })
  }

  return {
    reactions, reactionLoading, loadReactions, toggleReaction,
    comments, commentCounts, commentLoading, commentError,
    loadComments, postComment, deleteComment, toggleHideComment,
    reEnrichAll  
  }
  // ────────────────────────────────────────────────────────
  // REACCIONES
  // ────────────────────────────────────────────────────────
  async function loadReactions(newsId) {
    try {
      const res = await fetch(`${API_BASE}/api/news/${newsId}/reactions`, {
        headers: getAuthHeaders(), mode: 'cors'
      })
      if (!res.ok) { console.error('loadReactions HTTP', res.status); return }
      const json = await res.json()
      const data = json.data ?? json
      reactions[newsId] = {
        myReaction: data.myReaction ?? null,
        total:      data.total      ?? 0,
        counts: {
          LIKE: data.counts?.LIKE ?? 0,
          LOVE: data.counts?.LOVE ?? 0,
          WOW:  data.counts?.WOW  ?? 0,
        }
      }
    } catch (err) {
      console.error('[loadReactions]', err)
    }
  }

  async function toggleReaction(newsId, reactionType) {
    if (reactionLoading.value === newsId) return
    reactionLoading.value = newsId

    const prev = reactions[newsId]
      ? JSON.parse(JSON.stringify(reactions[newsId]))
      : null

    if (reactions[newsId]) {
      const cur = reactions[newsId].myReaction
      if (cur === reactionType) {
        reactions[newsId].counts[reactionType] = Math.max(0, (reactions[newsId].counts[reactionType] || 1) - 1)
        reactions[newsId].total = Math.max(0, (reactions[newsId].total || 1) - 1)
        reactions[newsId].myReaction = null
      } else {
        if (cur) reactions[newsId].counts[cur] = Math.max(0, (reactions[newsId].counts[cur] || 1) - 1)
        else     reactions[newsId].total = (reactions[newsId].total || 0) + 1
        reactions[newsId].counts[reactionType] = (reactions[newsId].counts[reactionType] || 0) + 1
        reactions[newsId].myReaction = reactionType
      }
    }

    try {
      const res = await fetch(`${API_BASE}/api/news/${newsId}/reactions`, {
        method:  'POST',
        headers: getAuthHeaders(),
        mode:    'cors',
        body:    JSON.stringify({ reactionType })
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      const data = json.data ?? json
      reactions[newsId] = {
        myReaction: data.myReaction ?? null,
        total:      data.total      ?? 0,
        counts: {
          LIKE: data.counts?.LIKE ?? 0,
          LOVE: data.counts?.LOVE ?? 0,
          WOW:  data.counts?.WOW  ?? 0,
        }
      }
    } catch (err) {
      console.error('[toggleReaction]', err)
      if (prev) reactions[newsId] = prev
    } finally {
      reactionLoading.value = null
    }
  }

  // ────────────────────────────────────────────────────────
  // COMENTARIOS
  // ────────────────────────────────────────────────────────
  async function loadComments(newsId) {
    commentLoading.value = newsId
    try {
      const res = await fetch(`${API_BASE}/api/news/${newsId}/comments`, {
        headers: getAuthHeaders(), mode: 'cors'
      })
      if (!res.ok) { console.error('loadComments HTTP', res.status); return }
      const json = await res.json()
      const data = json.data ?? json
      const list = Array.isArray(data) ? data : []
      comments[newsId]      = enrichComments(list)
      commentCounts[newsId] = list.length
    } catch (err) {
      console.error('[loadComments]', err)
    } finally {
      commentLoading.value = null
    }
  }

  async function postComment(newsId, body) {
    const trimmed = body.trim()
    if (!trimmed) return null
    try {
      const res = await fetch(`${API_BASE}/api/news/${newsId}/comments`, {
        method:  'POST',
        headers: getAuthHeaders(),
        mode:    'cors',
        body:    JSON.stringify({ body: trimmed })
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json       = await res.json()
      const newComment = json.data ?? json
      if (!comments[newsId]) comments[newsId] = []
      const [enriched] = enrichComments([newComment])
      comments[newsId].unshift(enriched)
      commentCounts[newsId] = comments[newsId].length
      return newComment
    } catch (err) {
      commentError.value = 'No se pudo publicar el comentario.'
      setTimeout(() => { commentError.value = '' }, 3500)
      return null
    }
  }

  async function deleteComment(newsId, commentId) {
    try {
      const res = await fetch(
        `${API_BASE}/api/news/${newsId}/comments/${commentId}`,
        { method: 'DELETE', headers: getAuthHeaders(), mode: 'cors' }
      )
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      if (comments[newsId]) {
        comments[newsId]      = comments[newsId].filter(c => c.id !== commentId)
        commentCounts[newsId] = comments[newsId].length
      }
    } catch {
      commentError.value = 'No se pudo eliminar el comentario.'
      setTimeout(() => { commentError.value = '' }, 3500)
    }
  }

  async function toggleHideComment(newsId, commentId) {
    try {
      const res = await fetch(
        `${API_BASE}/api/news/${newsId}/comments/${commentId}/hide`,
        { method: 'PATCH', headers: getAuthHeaders(), mode: 'cors' }
      )
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json    = await res.json()
      const updated = json.data ?? json
      if (comments[newsId]) {
        const idx = comments[newsId].findIndex(c => c.id === commentId)
        if (idx !== -1) comments[newsId][idx] = updated
      }
    } catch {
      commentError.value = 'No se pudo cambiar la visibilidad.'
      setTimeout(() => { commentError.value = '' }, 3500)
    }
  }

  return {
    reactions, reactionLoading, loadReactions, toggleReaction,
    comments, commentCounts, commentLoading, commentError,
    loadComments, postComment, deleteComment, toggleHideComment
  }
}
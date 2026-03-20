import { fetchNews, createNews, updateNews, removeNews } from './services/newsService'
import { appLayout } from './ui/layout'
import { getDomRefs } from './ui/dom'

const PREVIEW_FALLBACK =
  'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80'

export const initApp = () => {
  const root = document.querySelector('#app')
  if (!root) return
  root.innerHTML = appLayout

  const refs = getDomRefs()
  let newsList = []
  let currentView = 'dashboard'

  const viewTitles = {
    dashboard: 'Dashboard',
    'news-manager': 'News Management',
    users: 'Users',
    'review-queue': 'Review Queue',
    settings: 'Settings',
  }

  const setNotice = (message, variant = 'info') => {
    refs.notice.textContent = message
    refs.notice.className = `notice ${variant}`
  }

  const switchView = (viewKey) => {
    currentView = viewKey
    refs.navLinks.forEach((link) => {
      link.classList.toggle('active', link.dataset.nav === viewKey)
    })
    refs.views.forEach((view) => {
      view.classList.toggle('is-hidden', view.dataset.view !== viewKey)
    })
    refs.pageTitle.textContent = viewTitles[viewKey] || 'Dashboard'
    refs.refreshButton.style.display = viewKey === 'news-manager' ? 'inline-flex' : 'none'
    if (viewKey === 'news-manager') {
      refs.searchInput.value = ''
      refs.placementFilter.value = ''
      renderRows()
    }
    if (viewKey !== 'news-manager') {
      setNotice(`Switched to ${viewTitles[viewKey]}.`, 'info')
    }
  }

  const setStats = () => {
    refs.totalNews.textContent = String(newsList.length)
    refs.allNewsCount.textContent = String(newsList.length)
    refs.spotlightNews.textContent = String(
      newsList.filter((item) => item.placement === 'spotlight').length
    )
    refs.sideNews.textContent = String(
      newsList.filter((item) => item.placement === 'side').length
    )
    refs.featureNews.textContent = String(
      newsList.filter((item) => item.placement === 'feature').length
    )
  }

  const renderPreview = () => {
    const title = refs.form.elements.title.value?.trim() || 'News title preview'
    const summary =
      refs.form.elements.summary.value?.trim() || 'Summary preview appears here while typing.'
    const label = refs.form.elements.label.value?.trim() || 'News'
    const imageUrl = refs.form.elements.imageUrl.value?.trim()
    const fallbackImage = refs.form.elements.fallbackImage.value?.trim()
    const bg = imageUrl || fallbackImage || PREVIEW_FALLBACK

    refs.previewTitle.textContent = title
    refs.previewSummary.textContent = summary
    refs.previewLabel.textContent = label
    refs.previewImage.style.backgroundImage = `url(${bg})`
  }

  const resetForm = () => {
    refs.form.reset()
    refs.form.elements.id.value = ''
    refs.form.elements.label.value = 'News'
    refs.form.elements.placement.value = 'feature'
    refs.form.elements.isPublished.checked = true
    refs.saveButton.textContent = 'Save news'
    refs.formMode.textContent = 'Create mode'
    renderPreview()
  }

  const getFormData = () => {
    const formData = new FormData(refs.form)
    return {
      id: formData.get('id')?.toString(),
      title: formData.get('title')?.toString().trim(),
      summary: formData.get('summary')?.toString().trim() || '',
      imageUrl: formData.get('imageUrl')?.toString().trim() || '',
      fallbackImage: formData.get('fallbackImage')?.toString().trim() || '',
      label: formData.get('label')?.toString().trim() || 'News',
      placement: formData.get('placement')?.toString() || 'feature',
      isPublished: Boolean(formData.get('isPublished')),
    }
  }

  const renderRows = () => {
    const searchValue = refs.searchInput.value.trim().toLowerCase()
    const placementValue = refs.placementFilter.value
    const filteredItems = newsList.filter((item) => {
      const titleMatch = item.title.toLowerCase().includes(searchValue)
      const placementMatch = placementValue ? item.placement === placementValue : true
      return titleMatch && placementMatch
    })

    if (filteredItems.length === 0) {
      refs.tbody.innerHTML = `
      <tr>
        <td colspan="4" class="muted">No matching news items.</td>
      </tr>
    `
      return
    }

    refs.tbody.innerHTML = filteredItems
      .map(
        (item) => `
      <tr>
        <td>${item.title}</td>
        <td><span class="status ${item.placement}">${item.placement}</span></td>
        <td><span class="${item.isPublished ? 'published' : 'unpublished'}">${item.isPublished ? 'Yes' : 'No'}</span></td>
        <td class="actions">
          <button data-action="edit" data-id="${item._id}" class="small-btn">Edit</button>
          <button data-action="delete" data-id="${item._id}" class="small-btn danger">Delete</button>
        </td>
      </tr>
    `
      )
      .join('')
  }

  const loadNews = async () => {
    setNotice('Loading latest news...', 'info')
    newsList = await fetchNews()
    setStats()
    renderRows()
    setNotice('News loaded successfully.', 'success')
  }

  refs.form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const payload = getFormData()
    if (!payload.title) {
      setNotice('Title is required', 'error')
      return
    }

    try {
      if (payload.id) {
        await updateNews(payload.id, payload)
      } else {
        await createNews(payload)
      }
      resetForm()
      await loadNews()
      setNotice('News item saved.', 'success')
    } catch (error) {
      setNotice(error.message, 'error')
    }
  })

  refs.tbody.addEventListener('click', async (event) => {
    const button = event.target.closest('button')
    if (!button) return

    const action = button.dataset.action
    const id = button.dataset.id
    const item = newsList.find((entry) => entry._id === id)
    if (!item) return

    if (action === 'edit') {
      refs.form.elements.id.value = item._id
      refs.form.elements.title.value = item.title || ''
      refs.form.elements.summary.value = item.summary || ''
      refs.form.elements.imageUrl.value = item.imageUrl || ''
      refs.form.elements.fallbackImage.value = item.fallbackImage || ''
      refs.form.elements.label.value = item.label || 'News'
      refs.form.elements.placement.value = item.placement || 'feature'
      refs.form.elements.isPublished.checked = Boolean(item.isPublished)
      refs.saveButton.textContent = 'Update news'
      refs.formMode.textContent = 'Edit mode'
      setNotice('Editing selected news item.', 'info')
      renderPreview()
      return
    }

    if (action === 'delete') {
      const confirmed = window.confirm('Delete this news item?')
      if (!confirmed) return

      try {
        await removeNews(id)
        await loadNews()
        setNotice('News item deleted.', 'success')
      } catch (error) {
        setNotice(error.message, 'error')
      }
    }
  })

  refs.refreshButton.addEventListener('click', () =>
    loadNews().catch((error) => setNotice(error.message, 'error'))
  )
  refs.clearButton.addEventListener('click', () => {
    resetForm()
    setNotice('Form cleared.', 'info')
  })
  refs.searchInput.addEventListener('input', renderRows)
  refs.placementFilter.addEventListener('change', renderRows)
  refs.form.addEventListener('input', renderPreview)
  refs.navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault()
      switchView(link.dataset.nav)
    })
  })

  loadNews().catch(() => {
    setNotice('Could not connect backend. Start backend on http://localhost:5000', 'error')
  })
  switchView(currentView)
  renderPreview()
}

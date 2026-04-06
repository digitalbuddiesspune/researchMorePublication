import { useEffect, useState } from 'react'
import { fetchSettings, saveSettings } from '../../services/settingsService'
import { tw } from '../../lib/adminUi'

export default function SettingsPage({ active, setNotice, bumpLogs }) {
  const [submissionRules, setSubmissionRules] = useState('')
  const [reviewGuidelines, setReviewGuidelines] = useState('')
  const [platformNotice, setPlatformNotice] = useState('')
  const [articleTypes, setArticleTypes] = useState('')
  const [reviewDeadlineDays, setReviewDeadlineDays] = useState('14')
  const [emailTemplates, setEmailTemplates] = useState('{}')

  const load = async () => {
    const settings = await fetchSettings()
    setSubmissionRules(settings.submissionRules || '')
    setReviewGuidelines(settings.reviewGuidelines || '')
    setPlatformNotice(settings.platformNotice || '')
    setReviewDeadlineDays(settings.reviewDeadlineDays || '14')
    let types = []
    try {
      const parsed = JSON.parse(settings.articleTypes || '[]')
      types = Array.isArray(parsed) ? parsed : []
    } catch {
      types = []
    }
    setArticleTypes(types.join('\n'))
    let templates = {}
    try {
      templates = JSON.parse(settings.emailTemplates || '{}')
    } catch {
      templates = {}
    }
    setEmailTemplates(JSON.stringify(templates, null, 2))
  }

  useEffect(() => {
    load().catch(() => setNotice('Could not load settings.', 'error'))
  }, [])

  useEffect(() => {
    if (!active) return
    load().catch((e) => setNotice(e.message, 'error'))
  }, [active])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await saveSettings({
        submissionRules,
        reviewGuidelines,
        platformNotice,
        reviewDeadlineDays,
        emailTemplates: JSON.parse(emailTemplates || '{}'),
        articleTypes: articleTypes
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean),
      })
      bumpLogs()
      setNotice('Settings saved successfully.', 'success')
    } catch (err) {
      setNotice(err.message, 'error')
    }
  }

  return (
    <section className={tw.view(active)} data-view="settings">
      <section className={tw.card}>
        <h3 className={tw.cardTitle}>Platform copy</h3>
        <p className={`${tw.cardDesc} mb-6 max-w-2xl`}>
          Text shown to authors and reviewers. Article types are stored as a list (one label per line).
        </p>
        <form className="grid max-w-3xl gap-4" onSubmit={handleSubmit}>
          <label className={tw.label}>
            <span className={tw.labelText}>Submission rules</span>
            <textarea
              className={`${tw.input} ${tw.textarea}`}
              rows={4}
              placeholder="Define submission policy"
              value={submissionRules}
              onChange={(e) => setSubmissionRules(e.target.value)}
            />
          </label>
          <label className={tw.label}>
            <span className={tw.labelText}>Review guidelines</span>
            <textarea
              className={`${tw.input} ${tw.textarea}`}
              rows={4}
              placeholder="Define reviewer guidelines"
              value={reviewGuidelines}
              onChange={(e) => setReviewGuidelines(e.target.value)}
            />
          </label>
          <label className={tw.label}>
            <span className={tw.labelText}>Platform notice</span>
            <textarea
              className={`${tw.input} ${tw.textarea}`}
              rows={3}
              placeholder="Visible note for users"
              value={platformNotice}
              onChange={(e) => setPlatformNotice(e.target.value)}
            />
          </label>
          <label className={tw.label}>
            <span className={tw.labelText}>Review deadline (days)</span>
            <input
              className={tw.input}
              type="number"
              min={1}
              value={reviewDeadlineDays}
              onChange={(e) => setReviewDeadlineDays(e.target.value)}
            />
          </label>
          <label className={tw.label}>
            <span className={tw.labelText}>Article types (one per line)</span>
            <textarea
              className={`${tw.input} ${tw.textarea}`}
              rows={5}
              placeholder={'Research Article\nOpinion\nBrief Research Report'}
              value={articleTypes}
              onChange={(e) => setArticleTypes(e.target.value)}
            />
          </label>
          <label className={tw.label}>
            <span className={tw.labelText}>Email templates (JSON)</span>
            <textarea
              className={`${tw.input} ${tw.textarea}`}
              rows={8}
              value={emailTemplates}
              onChange={(e) => setEmailTemplates(e.target.value)}
            />
          </label>
          <button type="submit" className={`${tw.btnPrimary} w-fit`}>
            Save settings
          </button>
        </form>
      </section>
    </section>
  )
}

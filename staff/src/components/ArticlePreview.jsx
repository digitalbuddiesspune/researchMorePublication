export default function ArticlePreview({ journal, articleType, abstract }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap gap-2 text-sm text-slate-600">
        <span>Journal: {journal || 'General'}</span>
        {articleType ? <span>Type: {articleType}</span> : null}
      </div>
      {abstract ? (
        <div className="mt-3 text-sm leading-relaxed text-slate-700">
          {abstract}
        </div>
      ) : (
        <div className="mt-3 text-sm text-slate-500">No abstract provided.</div>
      )}
    </div>
  )
}


export const appLayout = `
<div class="layout">
  <aside class="sidebar">
    <div class="brand">
      <span class="brand-dot"></span>
      <h1>Admin Panel</h1>
    </div>
    <nav>
      <a href="#" class="active" data-nav="dashboard">Dashboard</a>
      <a href="#" data-nav="news-manager">News Manager</a>
      <a href="#" data-nav="users">Users</a>
      <a href="#" data-nav="review-queue">Review Queue</a>
      <a href="#" data-nav="settings">Settings</a>
    </nav>
    <p class="sidebar-note">Manage homepage news content and publishing workflow.</p>
  </aside>

  <main class="content">
    <header class="topbar">
      <div>
        <p class="eyebrow">researchMorePublication</p>
        <h2 id="page-title">Dashboard</h2>
      </div>
      <div class="topbar-actions">
        <button type="button" id="refresh-news">Refresh</button>
      </div>
    </header>
    <p id="notice" class="notice" role="status" aria-live="polite"></p>

    <section class="view" data-view="dashboard">
      <section class="stats">
        <article class="card">
          <p>Total news</p>
          <strong id="total-news">0</strong>
        </article>
        <article class="card">
          <p>Spotlight</p>
          <strong id="spotlight-news">0</strong>
        </article>
        <article class="card">
          <p>Side news</p>
          <strong id="side-news">0</strong>
        </article>
        <article class="card">
          <p>Features</p>
          <strong id="feature-news">0</strong>
        </article>
      </section>
      <section class="table-card">
        <h3>Quick overview</h3>
        <p class="muted">Use the sidebar to open News Manager for add, edit, and delete operations.</p>
      </section>
    </section>

    <section class="view is-hidden" data-view="news-manager">
    <section class="panel">
      <section class="table-card">
      <div class="form-header">
        <h3>Add / Edit news</h3>
        <p id="form-mode" class="form-mode">Create mode</p>
      </div>
      <form id="news-form" class="news-form">
        <input type="hidden" name="id" />
        <label class="field">
          <span>News title <em>*</em></span>
          <input name="title" placeholder="e.g. Soil microbes can protect crops from climate extremes" required />
        </label>
        <label class="field">
          <span>Short summary</span>
          <textarea name="summary" placeholder="Optional: add 1-2 line summary for spotlight cards"></textarea>
        </label>
        <label class="field">
          <span>Primary image URL</span>
          <input name="imageUrl" placeholder="https://..." />
        </label>
        <label class="field">
          <span>Fallback image URL</span>
          <input name="fallbackImage" placeholder="https://..." />
        </label>
        <div class="form-row">
          <label class="field">
            <span>Label</span>
            <input name="label" placeholder="News / Feature / Spotlight" value="News" />
          </label>
          <label class="field">
            <span>Placement</span>
            <select name="placement">
            <option value="spotlight">spotlight</option>
            <option value="side">side</option>
            <option value="feature" selected>feature</option>
            </select>
          </label>
          <label class="checkbox">
            <input type="checkbox" name="isPublished" checked />
            Published
          </label>
        </div>
        <p class="form-help">Tip: choose <strong>spotlight</strong> for main hero card, <strong>side</strong> for right-side list, and <strong>feature</strong> for bottom grid cards.</p>
        <div class="form-actions">
          <button type="submit" id="save-btn">Save news</button>
          <button type="button" id="clear-form" class="ghost">Clear</button>
        </div>
      </form>
      </section>

      <section class="table-card preview-card">
        <h3>Live preview</h3>
        <article class="preview-item">
          <div id="preview-image" class="preview-image"></div>
          <div class="preview-content">
            <p id="preview-label" class="preview-label">News</p>
            <h4 id="preview-title">News title preview</h4>
            <p id="preview-summary">Summary preview appears here while typing.</p>
          </div>
        </article>
      </section>
    </section>

    <section class="table-card">
      <div class="table-header">
        <h3>All news (<span id="all-news-count">0</span>)</h3>
        <div class="table-tools">
          <input id="search-news" type="search" placeholder="Search title..." />
          <select id="filter-placement">
            <option value="">All placements</option>
            <option value="spotlight">Spotlight</option>
            <option value="side">Side</option>
            <option value="feature">Feature</option>
          </select>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Placement</th>
            <th>Published</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="news-table-body">
          <tr>
            <td colspan="4" class="muted">Loading news...</td>
          </tr>
        </tbody>
      </table>
    </section>
    </section>

    <section class="view is-hidden" data-view="users">
      <section class="table-card placeholder-card">
        <h3>Users</h3>
        <p class="muted">Users management module will be added next.</p>
      </section>
    </section>

    <section class="view is-hidden" data-view="review-queue">
      <section class="table-card placeholder-card">
        <h3>Review Queue</h3>
        <p class="muted">Review queue workflow will be added next.</p>
      </section>
    </section>

    <section class="view is-hidden" data-view="settings">
      <section class="table-card placeholder-card">
        <h3>Settings</h3>
        <p class="muted">System settings module will be added next.</p>
      </section>
    </section>
  </main>
  </div>
`

export const appLayout = `
<div class="layout">
  <aside class="sidebar">
    <div class="brand">
      <span class="brand-dot"></span>
      <h1>Admin Panel</h1>
    </div>
    <nav class="sidebar-nav">
      <a href="#" class="active" data-nav="dashboard">
        <span class="sidebar-nav__icon" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6C3.75 4.75736 4.75736 3.75 6 3.75H8.25C9.49264 3.75 10.5 4.75736 10.5 6V8.25C10.5 9.49264 9.49264 10.5 8.25 10.5H6C4.75736 10.5 3.75 9.49264 3.75 8.25V6Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 15.75C3.75 14.5074 4.75736 13.5 6 13.5H8.25C9.49264 13.5 10.5 14.5074 10.5 15.75V18C10.5 19.2426 9.49264 20.25 8.25 20.25H6C4.75736 20.25 3.75 19.2426 3.75 18V15.75Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6C13.5 4.75736 14.5074 3.75 15.75 3.75H18C19.2426 3.75 20.25 4.75736 20.25 6V8.25C20.25 9.49264 19.2426 10.5 18 10.5H15.75C14.5074 10.5 13.5 9.49264 13.5 8.25V6Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 15.75C13.5 14.5074 14.5074 13.5 15.75 13.5H18C19.2426 13.5 20.25 14.5074 20.25 15.75V18C20.25 19.2426 19.2426 20.25 18 20.25H15.75C14.5074 20.25 13.5 19.2426 13.5 18V15.75Z" />
          </svg>
        </span>
        <span>Dashboard</span>
      </a>
      <a href="#" data-nav="news-manager">
        <span class="sidebar-nav__icon" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5H13.5M12 10.5H13.5M6 13.5H13.5M6 16.5H13.5M16.5 7.5H19.875C20.4963 7.5 21 8.00368 21 8.625V18C21 19.2426 19.9926 20.25 18.75 20.25M16.5 7.5V18C16.5 19.2426 17.5074 20.25 18.75 20.25M16.5 7.5V4.875C16.5 4.25368 15.9963 3.75 15.375 3.75H4.125C3.50368 3.75 3 4.25368 3 4.875V18C3 19.2426 4.00736 20.25 5.25 20.25H18.75M6 7.5H9V10.5H6V7.5Z" />
          </svg>
        </span>
        <span>News Manager</span>
      </a>
      <a href="#" data-nav="users">
        <span class="sidebar-nav__icon" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.1276C15.8329 19.37 16.7138 19.5 17.625 19.5C19.1037 19.5 20.5025 19.1576 21.7464 18.5478C21.7488 18.4905 21.75 18.4329 21.75 18.375C21.75 16.0968 19.9031 14.25 17.625 14.25C16.2069 14.25 14.956 14.9655 14.2136 16.0552M15 19.1276V19.125C15 18.0121 14.7148 16.9658 14.2136 16.0552M15 19.1276C15 19.1632 14.9997 19.1988 14.9991 19.2343C13.1374 20.3552 10.9565 21 8.625 21C6.29353 21 4.11264 20.3552 2.25092 19.2343C2.25031 19.198 2.25 19.1615 2.25 19.125C2.25 15.6042 5.10418 12.75 8.625 12.75C11.0329 12.75 13.129 14.085 14.2136 16.0552M12 6.375C12 8.23896 10.489 9.75 8.625 9.75C6.76104 9.75 5.25 8.23896 5.25 6.375C5.25 4.51104 6.76104 3 8.625 3C10.489 3 12 4.51104 12 6.375ZM20.25 8.625C20.25 10.0747 19.0747 11.25 17.625 11.25C16.1753 11.25 15 10.0747 15 8.625C15 7.17525 16.1753 6 17.625 6C19.0747 6 20.25 7.17525 20.25 8.625Z" />
          </svg>
        </span>
        <span>Users</span>
      </a>
      <a href="#" data-nav="review-queue">
        <span class="sidebar-nav__icon" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12H12.75M9 15H12.75M9 18H12.75M15.75 18.75H18C19.2426 18.75 20.25 17.7426 20.25 16.5V6.10822C20.25 4.97324 19.405 4.01015 18.2739 3.91627C17.9006 3.88529 17.5261 3.85858 17.1505 3.83619M11.3495 3.83619C11.2848 4.04602 11.25 4.26894 11.25 4.5C11.25 4.91421 11.5858 5.25 12 5.25H16.5C16.9142 5.25 17.25 4.91421 17.25 4.5C17.25 4.26894 17.2152 4.04602 17.1505 3.83619M11.3495 3.83619C11.6328 2.91757 12.4884 2.25 13.5 2.25H15C16.0116 2.25 16.8672 2.91757 17.1505 3.83619M11.3495 3.83619C10.9739 3.85858 10.5994 3.88529 10.2261 3.91627C9.09499 4.01015 8.25 4.97324 8.25 6.10822V8.25M8.25 8.25H4.875C4.25368 8.25 3.75 8.75368 3.75 9.375V20.625C3.75 21.2463 4.25368 21.75 4.875 21.75H14.625C15.2463 21.75 15.75 21.2463 15.75 20.625V9.375C15.75 8.75368 15.2463 8.25 14.625 8.25H8.25ZM6.75 12H6.7575V12.0075H6.75V12ZM6.75 15H6.7575V15.0075H6.75V15ZM6.75 18H6.7575V18.0075H6.75V18Z" />
          </svg>
        </span>
        <span>Review Queue</span>
      </a>
      <a href="#" data-nav="settings">
        <span class="sidebar-nav__icon" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.59356 3.94014C9.68397 3.39768 10.1533 3.00009 10.7033 3.00009H13.2972C13.8472 3.00009 14.3165 3.39768 14.4069 3.94014L14.6204 5.22119C14.6828 5.59523 14.9327 5.9068 15.2645 6.09045C15.3387 6.13151 15.412 6.17393 15.4844 6.21766C15.8095 6.41393 16.2048 6.47495 16.5604 6.34175L17.7772 5.88587C18.2922 5.69293 18.8712 5.9006 19.1462 6.37687L20.4432 8.6233C20.7181 9.09957 20.6085 9.70482 20.1839 10.0544L19.1795 10.8812C18.887 11.122 18.742 11.4938 18.7491 11.8726C18.7498 11.915 18.7502 11.9575 18.7502 12.0001C18.7502 12.0427 18.7498 12.0852 18.7491 12.1275C18.742 12.5064 18.887 12.8782 19.1795 13.119L20.1839 13.9458C20.6085 14.2953 20.7181 14.9006 20.4432 15.3769L19.1462 17.6233C18.8712 18.0996 18.2922 18.3072 17.7772 18.1143L16.5604 17.6584C16.2048 17.5252 15.8095 17.5862 15.4844 17.7825C15.412 17.8263 15.3387 17.8687 15.2645 17.9097C14.9327 18.0934 14.6828 18.4049 14.6204 18.779L14.4069 20.06C14.3165 20.6025 13.8472 21.0001 13.2972 21.0001H10.7033C10.1533 21.0001 9.68397 20.6025 9.59356 20.06L9.38005 18.779C9.31771 18.4049 9.06774 18.0934 8.73597 17.9097C8.66179 17.8687 8.58847 17.8263 8.51604 17.7825C8.19101 17.5863 7.79568 17.5252 7.44011 17.6584L6.22325 18.1143C5.70826 18.3072 5.12926 18.0996 4.85429 17.6233L3.55731 15.3769C3.28234 14.9006 3.39199 14.2954 3.81657 13.9458L4.82092 13.119C5.11343 12.8782 5.25843 12.5064 5.25141 12.1276C5.25063 12.0852 5.25023 12.0427 5.25023 12.0001C5.25023 11.9575 5.25063 11.915 5.25141 11.8726C5.25843 11.4938 5.11343 11.122 4.82092 10.8812L3.81657 10.0544C3.39199 9.70484 3.28234 9.09958 3.55731 8.62332L4.85429 6.37688C5.12926 5.90061 5.70825 5.69295 6.22325 5.88588L7.4401 6.34176C7.79566 6.47496 8.19099 6.41394 8.51603 6.21767C8.58846 6.17393 8.66179 6.13151 8.73597 6.09045C9.06774 5.9068 9.31771 5.59523 9.38005 5.22119L9.59356 3.94014Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3432 10.3431 9.00001 12 9.00001C13.6569 9.00001 15 10.3432 15 12Z" />
          </svg>
        </span>
        <span>Settings</span>
      </a>
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

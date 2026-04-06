import { useEffect, useState } from 'react'
import { createUser, deleteUser, fetchUsers, updateUser } from '../../services/userService'
import { tw } from '../../lib/adminUi'

const ROLES = ['author', 'reviewer', 'editor', 'admin']

export default function UsersPage({ active, setNotice, bumpLogs }) {
  const [users, setUsers] = useState([])
  const [drafts, setDrafts] = useState({})
  const [roleFilter, setRoleFilter] = useState('')

  const loadUsers = async () => {
    const list = await fetchUsers()
    setUsers(list)
    const next = {}
    list.forEach((u) => {
      next[u.id] = {
        role: u.role,
        status: u.status,
        reviewsCompleted: Number(u.reviewsCompleted || 0),
        avgResponseTimeHours: Number(u.avgResponseTimeHours || 0),
      }
    })
    setDrafts(next)
  }

  useEffect(() => {
    if (!active) return
    loadUsers().catch((e) => setNotice(e.message, 'error'))
  }, [active, setNotice])

  const handleCreate = async (e) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    try {
      await createUser({
        name: fd.get('name')?.toString().trim(),
        email: fd.get('email')?.toString().trim(),
        password: fd.get('password')?.toString(),
        role: fd.get('role')?.toString(),
      })
      e.target.reset()
      await loadUsers()
      bumpLogs()
      setNotice('User created successfully.', 'success')
    } catch (err) {
      setNotice(err.message, 'error')
    }
  }

  const saveUser = async (userId) => {
    const d = drafts[userId]
    if (!d) return
    try {
      await updateUser(userId, {
        role: d.role,
        status: d.status,
        reviewsCompleted: Number(d.reviewsCompleted || 0),
        avgResponseTimeHours: Number(d.avgResponseTimeHours || 0),
      })
      await loadUsers()
      bumpLogs()
      setNotice('User updated successfully.', 'success')
    } catch (err) {
      setNotice(err.message, 'error')
    }
  }

  const removeUser = async (user) => {
    const confirmed = window.confirm(`Delete user "${user.email}"?`)
    if (!confirmed) return
    try {
      const payload = await deleteUser(user.id)
      await loadUsers()
      bumpLogs()
      if (payload?.disabled) {
        setNotice(payload.message || 'User disabled (linked records found).', 'info')
      } else {
        setNotice('User deleted successfully.', 'success')
      }
    } catch (err) {
      setNotice(err.message, 'error')
    }
  }

  return (
    <section className={tw.view(active)} data-view="users">
      <section className={tw.card}>
        <h3 className={tw.cardTitle}>Create user</h3>
        <p className={`${tw.cardDesc} mb-3`}>Adds an account with the selected role. Password must meet your backend rules.</p>
        <form className="grid gap-3" onSubmit={handleCreate}>
          <div className="grid gap-2 md:grid-cols-3">
            <label className={tw.label}>
              <span className={tw.labelText}>Name</span>
              <input className={`${tw.input} py-2`} name="name" placeholder="Full name" required />
            </label>
            <label className={tw.label}>
              <span className={tw.labelText}>Email</span>
              <input className={`${tw.input} py-2`} name="email" type="email" placeholder="user@example.com" required />
            </label>
            <label className={tw.label}>
              <span className={tw.labelText}>Password</span>
              <input
                className={`${tw.input} py-2`}
                name="password"
                type="password"
                placeholder="Min 8 chars"
                autoComplete="new-password"
                required
              />
            </label>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <label className={`${tw.label} min-w-[200px]`}>
              <span className={tw.labelText}>Role</span>
              <select className={`${tw.select} py-2`} name="role" defaultValue="author">
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className={`${tw.btnPrimary} sm:self-end`}>
              Create user
            </button>
          </div>
        </form>
      </section>
      <section className={tw.card}>
        <div className={`${tw.toolbar} mb-3`}>
          <div>
            <h3 className={tw.cardTitleInline}>
              Directory{' '}
              <span className="font-normal text-slate-400">·</span>{' '}
              <span className="text-blue-600">{users.length}</span>
            </h3>
            <p className={tw.cardDesc}>Change role or status, then save per row.</p>
          </div>
          <select className={`${tw.select} w-full sm:max-w-[220px]`} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">All roles</option>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className={tw.tableWrap}>
          <table className={tw.table}>
            <thead>
              <tr>
                <th className={tw.th}>Name</th>
                <th className={tw.th}>Email</th>
                <th className={tw.th}>Role</th>
                <th className={tw.th}>Status</th>
                <th className={tw.th}>Activity</th>
                <th className={tw.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.filter((u) => (roleFilter ? u.role === roleFilter : true)).length ? (
                users.filter((u) => (roleFilter ? u.role === roleFilter : true)).map((user) => (
                  <tr key={user.id} className="odd:bg-slate-50/80">
                    <td className={`${tw.td} py-2 text-xs`}>{user.name}</td>
                    <td className={`${tw.td} py-2 text-xs`}>{user.email}</td>
                    <td className={`${tw.td} py-2`}>
                      <select
                        className={`${tw.select} ${tw.selectInTable} py-1.5`}
                        value={drafts[user.id]?.role ?? user.role}
                        onChange={(e) =>
                          setDrafts((prev) => ({
                            ...prev,
                            [user.id]: {
                              ...prev[user.id],
                              role: e.target.value,
                              status: prev[user.id]?.status ?? user.status,
                            },
                          }))
                        }
                      >
                        {ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className={`${tw.td} py-2`}>
                      <select
                        className={`${tw.select} ${tw.selectInTable} py-1.5`}
                        value={drafts[user.id]?.status ?? user.status}
                        onChange={(e) =>
                          setDrafts((prev) => ({
                            ...prev,
                            [user.id]: {
                              ...prev[user.id],
                              status: e.target.value,
                              role: prev[user.id]?.role ?? user.role,
                            },
                          }))
                        }
                      >
                        <option value="active">active</option>
                        <option value="disabled">disabled</option>
                      </select>
                    </td>
                    <td className={`${tw.td} py-2 text-xs`}>
                      submissions {user.submissionsCount || 0}, reviews {user.reviewsCount || 0}
                      <div className="mt-1 text-xs text-slate-500">
                        perf: {drafts[user.id]?.reviewsCompleted || 0} done, {drafts[user.id]?.avgResponseTimeHours || 0}h avg
                      </div>
                    </td>
                    <td className={`${tw.td} py-2`}>
                      <div className={tw.actions}>
                        <button type="button" className={tw.btnSm} onClick={() => saveUser(user.id)}>
                          Save
                        </button>
                        <button type="button" className={tw.btnDangerSm} onClick={() => removeUser(user)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className={tw.tdEmpty}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  )
}

import { createBrowserRouter } from 'react-router-dom'
import App from '../App.jsx'
import OverviewPage from '../pages/OverviewPage.jsx'
import MyProjectsPage from '../pages/MyProjectsPage.jsx'
import ResourcesPage from '../pages/ResourcesPage.jsx'
import CertificatesPage from '../pages/CertificatesPage.jsx'
import InboxPage from '../pages/InboxPage.jsx'
import SubmitResearchPage from '../pages/SubmitResearchPage.jsx'
import LoginPage from '../pages/LoginPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <OverviewPage /> },
      { path: 'my-projects', element: <MyProjectsPage /> },
      { path: 'resources', element: <ResourcesPage /> },
      { path: 'certificates', element: <CertificatesPage /> },
      { path: 'inbox', element: <InboxPage /> },
      { path: 'submit-research', element: <SubmitResearchPage /> },
      { path: 'login', element: <LoginPage /> },
    ],
  },
])

export default router

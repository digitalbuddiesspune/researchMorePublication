import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import RootLayout from './layouts/RootLayout.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import AboutTopic from './pages/AboutTopic.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import TermsAndConditions from './pages/TermsAndConditions.jsx'
import CookiesPolicy from './pages/CookiesPolicy.jsx'
import AllJournals from './pages/AllJournals.jsx'
import AllArticles from './pages/AllArticles.jsx'
import SubmitResearch from './pages/SubmitResearch.jsx'
import JournalDetail from './pages/JournalDetail.jsx'
import ArticleDetail from './pages/ArticleDetail.jsx'
import AuthorDashboard from './pages/AuthorDashboard.jsx'
import AuthorSubmit from './pages/AuthorSubmit.jsx'
import AuthorSubmissions from './pages/AuthorSubmissions.jsx'
import AuthorSubmissionDetail from './pages/AuthorSubmissionDetail.jsx'
import AuthorMessages from './pages/AuthorMessages.jsx'
import MyProfile from './pages/MyProfile.jsx'
import MyWorkspace from './pages/MyWorkspace.jsx'
import SettingsPrivacy from './pages/SettingsPrivacy.jsx'
import HelpCenter from './pages/HelpCenter.jsx'
import Register from './pages/Register.jsx'
import AuthorLayout from './layouts/AuthorLayout.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="about/:slug" element={<AboutTopic />} />
          <Route path="journals" element={<AllJournals />} />
          <Route path="journals/:id" element={<JournalDetail />} />
          <Route path="articles" element={<AllArticles />} />
          <Route path="articles/:id" element={<ArticleDetail />} />
          <Route path="submit" element={<SubmitResearch />} />
          <Route path="author" element={<AuthorLayout />}>
            <Route path="dashboard" element={<AuthorDashboard />} />
            <Route path="submit" element={<AuthorSubmit />} />
            <Route path="submissions" element={<AuthorSubmissions />} />
            <Route path="submissions/:id" element={<AuthorSubmissionDetail />} />
            <Route path="messages" element={<AuthorMessages />} />
          </Route>
          <Route path="my-profile" element={<MyProfile />} />
          <Route path="my-workspace" element={<MyWorkspace />} />
          <Route path="settings-privacy" element={<SettingsPrivacy />} />
          <Route path="help-center" element={<HelpCenter />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="cookies" element={<CookiesPolicy />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

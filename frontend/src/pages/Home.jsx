import { useState } from 'react'
import HeroSection from '../sections/HeroSection.jsx'
import ContentTabs from '../sections/ContentTabs.jsx'
import FeaturedTopics from '../sections/FeaturedTopics.jsx'
import OpenScienceSection from '../sections/OpenScienceSection.jsx'
import NewsSection from '../sections/NewsSection.jsx'
import NewsletterSection from '../sections/NewsletterSection.jsx'
import SiteFooter from '../sections/SiteFooter.jsx'

export default function Home() {
  const [activeTab, setActiveTab] = useState('Articles')

  return (
    <>
      <HeroSection />
      <ContentTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <FeaturedTopics />
      <OpenScienceSection />
      <NewsSection />
      <NewsletterSection />
      <SiteFooter />
    </>
  )
}


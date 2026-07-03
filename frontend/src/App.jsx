import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import CodeAnalysis from './pages/CodeAnalysis'
import WebsiteTesting from './pages/WebsiteTesting'
import Settings from './pages/Settings'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/code-analysis" element={<CodeAnalysis />} />
        <Route path="/website-testing" element={<WebsiteTesting />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  )
}

export default App

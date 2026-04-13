import { Navigate, Route, Routes } from 'react-router-dom'
import { RequireAuth } from './Components/Auth/RequireAuth'
import { Navbar } from './Components/Layout/Navbar'
import { HomePage } from './Pages/HomePage'
import { LibraryPage } from './Pages/LibraryPage'
import { MediaDetailPage } from './Pages/MediaDetailPage'
import { NewMediaPage } from './Pages/NewMediaPage'
import { NotFoundPage } from './Pages/NotFoundPage'
import { SignInPage } from './Pages/SignInPage'
import { SignUpPage } from './Pages/SignUpPage'
import { MediaProvider } from './storage/MediaContext'
import { useMediaStore } from './storage/useMediaStore'

function App() {
  const store = useMediaStore()
  return (
    <MediaProvider value={store}>
      <div className="min-h-dvh">
        <Navbar />
        {store.toastMessage ? (
          <div className="pointer-events-none fixed bottom-4 right-4 z-50 rounded-xl border border-emerald-400/30 bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-100 shadow-lg backdrop-blur">
            {store.toastMessage}
          </div>
        ) : null}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/library/:id" element={<MediaDetailPage />} />
          <Route
            path="/new"
            element={
              <RequireAuth>
                <NewMediaPage />
              </RequireAuth>
            }
          />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </MediaProvider>
  )
}

export default App

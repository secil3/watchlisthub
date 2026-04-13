import { useNavigate } from 'react-router-dom'
import { MediaForm } from '../Components/Media/MediaForm'
import { useMedia } from '../storage/MediaContext'

export function NewMediaPage() {
  const { addItem } = useMedia()
  const nav = useNavigate()

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Add new</h1>
        <p className="mt-1 text-sm text-slate-300">
          This creates a new item (saved to LocalStorage).
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        <MediaForm
          submitLabel="Save"
          onSubmit={(value) => {
            addItem(value)
            nav('/library')
          }}
        />
      </div>
    </div>
  )
}


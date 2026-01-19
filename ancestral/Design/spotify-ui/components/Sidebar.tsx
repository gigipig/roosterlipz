import { Home, Search, Library, PlusSquare, Heart, Download } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const playlists = [
  "Chill Vibes",
  "Workout Mix",
  "90s Throwback",
  "Indie Acoustic",
  "Focus Playlist",
  "Road Trip Tunes",
  "Rainy Day Jazz",
  "Summer Hits",
  "Classical Essentials",
  "Hip Hop Favorites",
]

export function Sidebar() {
  return (
    <div className="w-60 bg-black text-gray-300 flex flex-col h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Spotify</h1>
        <nav>
          <ul className="space-y-2">
            <li>
              <a href="#" className="flex items-center space-x-2 hover:text-white">
                <Home size={24} />
                <span>Home</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-2 hover:text-white">
                <Search size={24} />
                <span>Search</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-2 hover:text-white">
                <Library size={24} />
                <span>Your Library</span>
              </a>
            </li>
          </ul>
        </nav>
        <div className="mt-8 space-y-4">
          <button className="flex items-center space-x-2 hover:text-white">
            <PlusSquare size={24} />
            <span>Create Playlist</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-white">
            <Heart size={24} />
            <span>Liked Songs</span>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6">
            <h2 className="text-sm uppercase font-semibold mb-4">Playlists</h2>
            <ul className="space-y-2">
              {playlists.map((playlist, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-white">
                    {playlist}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </ScrollArea>
      </div>
      <div className="p-6">
        <button className="flex items-center space-x-2 hover:text-white">
          <Download size={24} />
          <span>Install App</span>
        </button>
      </div>
    </div>
  )
}

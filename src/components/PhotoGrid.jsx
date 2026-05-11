const rotations = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2', 'rotate-0']

function PhotoCard({ url, caption, year, index }) {
  const rot = rotations[index % rotations.length]
  return (
    <div
      className={`polaroid ${rot} transition-all duration-300 hover:scale-105 hover:rotate-0 hover:shadow-2xl cursor-pointer`}
    >
      <img
        src={url}
        alt={caption}
        loading="lazy"
        className="w-full object-cover"
        style={{ aspectRatio: '4/3' }}
        onError={(e) => {
          e.target.src = `https://placehold.co/400x300/0077be/white?text=${encodeURIComponent(caption)}`
        }}
      />
      <p className="font-handwritten text-center text-gray-600 mt-2 text-sm">{caption}</p>
      <p className="font-handwritten text-center text-gray-400 text-xs">{year}</p>
    </div>
  )
}

export default function PhotoGrid({ photos, albums }) {
  return (
    <section id="photos">
      <h2 className="section-title">📸 The Photo Reel</h2>

      {/* Masonry-style grid */}
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4 mb-12">
        {photos.map((photo, i) => (
          <div key={i} className="break-inside-avoid">
            <PhotoCard {...photo} index={i} />
          </div>
        ))}
      </div>

      {/* Album links */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="font-handwritten text-2xl text-ocean mb-4">📁 Full Albums by Year</h3>
        <div className="flex flex-wrap gap-3">
          {albums.map((album) => (
            <a
              key={album.year}
              href={album.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-ocean/10 hover:bg-ocean hover:text-white text-ocean font-semibold px-4 py-2 rounded-full transition-colors text-sm"
            >
              📸 {album.year}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

import { useEffect, useState, useRef } from "react";
import app from "./firebase";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [current, setCurrent] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const db = getFirestore(app);

  useEffect(() => {
    const fetchBooks = async () => {
      const snapshot = await getDocs(collection(db, "books"));

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setBooks(data);
      if (data.length > 0) setCurrent(data[0]);
    };

    fetchBooks();
  }, []);

  const handlePlay = (book) => {
    setCurrent(book);
    setIsPlaying(true);

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play().catch(() => {});
      }
    }, 100);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="app">
      {/* TOP BAR */}
      <header className="topbar">
        <h2>StillPages</h2>
      </header>

      {/* MAIN */}
      <main className="main">
        <div className="grid">
          {books.map((book) => (
            <div
              key={book.id}
              className={`card ${
                current?.id === book.id ? "active" : ""
              }`}
              onClick={() => handlePlay(book)}
            >
              <img
                src={book.coverUrl}
                alt={book.title}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/300x300?text=Book";
                }}
              />
              <h4>{book.title}</h4>
              <p>{book.author}</p>
            </div>
          ))}
        </div>
      </main>

      {/* PLAYER */}
      {current && (
        <div className="player">
          <div className="player-left">
            <img
              src={current.coverUrl}
              alt=""
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/50x50?text=Book";
              }}
            />
            <div>
              <h4>{current.title}</h4>
              <p>{current.author}</p>
            </div>
          </div>

          <div className="player-center">
            <button onClick={togglePlay}>
              {isPlaying ? "⏸" : "▶"}
            </button>

            <audio ref={audioRef} key={current.audioUrl}>
              <source src={current.audioUrl} type="audio/mpeg" />
            </audio>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
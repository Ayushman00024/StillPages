import { useEffect, useState, useRef } from "react";
import app from "./firebase";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [current, setCurrent] = useState(null);
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

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play().catch(() => {});
      }
    }, 100);
  };

  return (
    <div className="app">
      <h1 className="logo">StillPages</h1>

      {/* 🎯 BIG CENTERED CARDS */}
      <div className="list">
        {books.map((book) => (
          <div
            key={book.id}
            className={`card ${
              current?.id === book.id ? "active" : ""
            }`}
            onClick={() => handlePlay(book)}
          >
            <div className="cover">
              <img
                src={book.coverUrl}
                alt={book.title}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/300x300?text=Book";
                }}
              />
            </div>

            <h2>{book.title}</h2>
            <p>{book.author}</p>
          </div>
        ))}
      </div>

      {/* 🎵 PLAYER */}
      {current && (
        <div className="player">
          <div className="left">
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

          <audio
            ref={audioRef}
            controls
            preload="auto"
            key={current.audioUrl}
          >
            <source src={current.audioUrl} type="audio/mpeg" />
          </audio>
        </div>
      )}
    </div>
  );
}

export default App;
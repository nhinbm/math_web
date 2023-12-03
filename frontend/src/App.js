import About from "./components/About";
import Chatbot from "./components/Chatbot";
import Header from "./components/Header";

function App() {
  return (
    <div className="App">
      <Header />
      {window.location.href === "http://localhost:3000/" ? (
        <Chatbot />
      ) : (
        <About />
      )}
    </div>
  );
}

export default App;

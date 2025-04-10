import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./styles/index.css"
import { ThemeProvider } from "./components/theme-provider.jsx"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="attendance-theme">
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)

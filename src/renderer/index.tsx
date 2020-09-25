import React from "react"
import ReactDOM from "react-dom"
import { App } from "./components/App"
import { Providers } from "./providers"
import "./index.css"

ReactDOM.render(
    <Providers>
        <App />
    </Providers>,
    document.getElementById("app")
)

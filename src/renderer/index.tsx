import React from "react"
import ReactDOM from "react-dom"
import { AppContainer } from "./components/AppContainer"
import { Providers } from "./providers"
import "./index.css"

ReactDOM.render(
    <Providers>
        <AppContainer />
    </Providers>,
    document.getElementById("app")
)

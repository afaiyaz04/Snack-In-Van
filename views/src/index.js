import React from "react";
import ReactDOM from "react-dom";
import App from "./app/App";
import reportWebVitals from "./tests/reportWebVitals";

// Routing
import { BrowserRouter } from "react-router-dom";

// redux-persist
import { PersistGate } from "redux-persist/integration/react";

// Redux
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";

ReactDOM.render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			<React.StrictMode>
				<BrowserRouter>
					<link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
					<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
					<App />
				</BrowserRouter>
			</React.StrictMode>
		</PersistGate>
	</Provider>,

	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

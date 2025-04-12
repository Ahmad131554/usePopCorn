import ReactDOM from "react-dom/client";
import React from "react";
import App from "./App.js";
import "./index.css";

// function CurrencyConverter() {
//   const [fromCurrency, setFromCurrency] = useState("USD");
//   const [toCurrency, setToCurrency] = useState("EUR");
//   const [amount, setAmount] = useState("");
//   const [output, setOuptput] = useState("");

//   useEffect(
//     function () {
//       async function Convert() {
//         if (!amount) return;
//         const res = await fetch(
//           `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
//         );
//         const data = await res.json();
//         setOuptput(Object.values(data.rates)[0]);
//       }
//       Convert();
//     },
//     [amount, fromCurrency, toCurrency]
//   );

//   return (
//     <div>
//       <input
//         type="text"
//         value={amount}
//         onChange={(e) => setAmount(Number(e.target.value))}
//       />
//       <select
//         value={fromCurrency}
//         onChange={(e) => setFromCurrency(e.target.value)}
//       >
//         <option value="USD">USD</option>
//         <option value="EUR">EUR</option>
//         <option value="CAD">CAD</option>
//         <option value="INR">INR</option>
//       </select>
//       <select
//         value={toCurrency}
//         onChange={(e) => setToCurrency(e.target.value)}
//       >
//         <option value="USD">USD</option>
//         <option value="EUR">EUR</option>
//         <option value="CAD">CAD</option>
//         <option value="INR">INR</option>
//       </select>
//       {amount ? <p>Output: {output}</p> : <p></p>}
//     </div>
//   );
// }

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const axios = require('axios');

// Wymagane dane wejściowe
const userid = 7709;
const serviceid = 750;
const code = 'trncbtty';
const number = '71480';

// Adres wejściowy API Paybylink
const apiUrl = 'https://www.Paybylink.pl/api/v2/index.php';

// Przygotowanie parametrów do przekazania
const params = {
  userid,
  serviceid,
  code,
  number,
};

// Wywołanie zapytania HTTP z użyciem Axios
axios.get(apiUrl, { params })
  .then(response => {
    // Obsługa odpowiedzi od serwera Paybylink (response.data zawiera dane w formacie JSON)
    console.log('Odpowiedź z serwera Paybylink:', response.data);
  })
  .catch(error => {
    // Obsługa błędów zapytania
    console.error('Błąd zapytania do serwera Paybylink:', error.message);
  });

//In questo esercizio, utilizzerai Promise.all() per creare la funzione getDashboardData(query), che accetta una città come input e recupera simultaneamente:
//Nome completo della città e paese da  /destinations?search=[query]
//(result.name, result.country, nelle nuove proprietà city e country).
//Il meteo attuale da /weathers?search={query}
//(result.temperature e result.weather_description nella nuove proprietà temperature e weather).
//Il nome dell’aeroporto principale da /airports?search={query}
//(result.name nella nuova proprietà airport).
//Utilizzerai Promise.all() per eseguire queste richieste in parallelo e poi restituirai un oggetto con i dati aggregati.

//Note del docente
//Scrivi la funzione getDashboardData(query), che deve:
//Essere asincrona (async).
//Utilizzare Promise.all() per eseguire più richieste in parallelo.
//Restituire una Promise che risolve un oggetto contenente i dati aggregati.
//Stampare i dati in console in un messaggio ben formattato.
//Testa la funzione con la query "london"


//🎯 Bonus 1 - Risultato vuoto
//Se l’array di ricerca è vuoto, invece di far fallire l'intera funzione, 
//semplicemente i dati relativi a quella chiamata verranno settati a null e  la frase relativa non viene stampata. 
//Testa la funzione con la query “vienna” (non trova il meteo).


//🎯 Bonus 2 - Chiamate fallite
//Attualmente, se una delle chiamate fallisce, **Promise.all()** rigetta l'intera operazione.

//Modifica `getDashboardData()` per usare **Promise.allSettled()**, in modo che:
//Se una chiamata fallisce, i dati relativi a quella chiamata verranno settati a null.
//Stampa in console un messaggio di errore per ogni richiesta fallita.
//Testa la funzione con un link fittizio per il meteo (es. https://www.meteofittizio.it).

async function fetchJSON(url) {
    const resp = await fetch(url);
    const obj = await resp.json();
    return obj
};


const getDashboardData = async (query) => {
    console.log(`Caricamento della dashboard di ${query}...`);

    try {

        const promiseDestinations = fetchJSON(`http://localhost:3333/destinations?search=${query}`);
        const promiseWeathers = fetchJSON(`http://localhost:3333/weathers?search=${query}`);
        const promiseAirports = fetchJSON(`http://localhost:3333/airports?search=${query}`);

        const promises = [promiseDestinations, promiseWeathers, promiseAirports];
        const [destinationsResult, weathersResult, airportsResult] = await Promise.allSettled(promises)
        console.log([destinationsResult, weathersResult, airportsResult]);
        
        

        let data = {};

        if (destinationsResult.status === "rejected") {
            console.error(`Errore nei dati destination`, destinationsResult.reason);
            data.city = null
            data.country = null
        } else {
            const destinations = destinationsResult.value[0]
            data.city = destinations ? destinations.name : null
            data.country = destinations ? destinations.country : null
        }

         if (weathersResult.status === "rejected") {
            console.error(`Errore nei dati weathers`, weathersResult.reason);
            data.temperature = null
            data.weather = null
        } else {
            const weathers = weathersResult.value[0]
            data.temperature = weathers ? weathers.temperature : null  
            data.weather = weathers ? weathers.weather_description : null
        }

         if (airportsResult.status === "rejected") {
            console.error(`Errore nei dati airports`, airportsResult.reason);
            data.airport = null          
        } else {
            const airports = airportsResult.value[0]
            data.airport = airports ? airports.name : null
        }

        return data
      
    } catch (error) {
        throw new Error(`Errore nel recupero dei dati: ${error.message}`)
    }


    // const resultDestinations = await fetchJSON(`http://localhost:3333/destinations?search=${query}`);
    // console.log(resultDestinations);
    // const resultWeathers = await fetchJSON(`http://localhost:3333/weathers?search=${query}`);
    // const resultAirports = await fetchJSON(`http://localhost:3333/airports?search=${query}`);

    // return {
    //     name: resultDestinations[0].name,
    //     country: resultDestinations[0].country,
    //     temperature: resultWeathers[0].temperature,
    //     weather: resultWeathers[0].weather_description,
    //     airport: resultAirports[0].name
    // }

};

(async () => {


    try {
        const data = await getDashboardData("london")
        console.log(data);
        let frase = "";
        if (data.city !== null && data.country !== null) {
            frase += `${data.city} is in ${data.country}.\n`
        }
        if (data.temperature !== null && data.weather !== null) {
            frase += `Today there are ${data.temperature} degrees and the weather is ${data.weather}.\n`
        }
        if (data.airport !== null) {
            frase += `The main airport is ${data.airport}.\n`
        }

        console.log(frase);

    } catch (error) {
        console.error(error);

    }
})()




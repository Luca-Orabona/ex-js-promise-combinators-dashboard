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

async function fetchJSON(url) {
    const resp = await fetch(url);
    const obj = await resp.json();
    return obj
};





const getDashboardData = async (query) => {
    console.log(`Caricamento della dashboard di ${query}...`);

    try{

        const promiseDestinations = fetchJSON(`http://localhost:3333/destinations?search=${query}`);
        const promiseWeathers = fetchJSON(`http://localhost:3333/weathers?search=${query}`);
        const promiseAirports = fetchJSON(`http://localhost:3333/airports?search=${query}`);
    
        const promises = [promiseDestinations, promiseWeathers, promiseAirports];
        const [destinations, weathers, airports] = await Promise.all(promises)
    
        return {
            name: destinations[0].name,
            country: destinations[0].country,
            temperature: weathers[0].temperature,
            weather: weathers[0].weather_description,
            airport: airports[0].name
        }
    } catch(error){
        throw new Error(`Non sono riuscito a recuperare i dati`)
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
        console.log(
            `${data.name} is in ${data.country}.\n` +
            `Today there are ${data.temperature} degrees and the weather is ${data.weather}.\n` +
            `The main airport is ${data.airport}.\n`
        );
    } catch (error) {
        console.error( error.message);

    }
})()




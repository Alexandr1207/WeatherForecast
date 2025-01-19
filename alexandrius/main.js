import * as storage from './storage.js';

const cityCall = document.querySelector('.cityName');
const tempField = document.querySelector('.temperature');
const searchButton = document.querySelector('.searchButton');
const cityName = document.getElementById('searchField');
const cityItem = document.querySelector('.item');
const cityList = document.querySelector('.locList');
const deleteButton = document.querySelector('.delBut');
const addButton = document.querySelector('.addBut');

const serverUrl = 'http://api.openweathermap.org/data/2.5/weather';
const apiKey = 'f660a2fb1e4bad108d6160b7f58c555f';

let cities = [];

render();

function getCelcium(deg){
    return Math.round((deg - 273.15));
}

function calcSun( data ) {
	const localOffset = new Date().getTimezoneOffset();
	const localOffsetInSeconds = localOffset * 60;

	const sunriseLocal = data.sys.sunrise + localOffsetInSeconds;
	const sunsetLocal = data.sys.sunset + localOffsetInSeconds;

	const sunriseInTarget = sunriseLocal + data.timezone;
	const sunsetInTarget = sunsetLocal + data.timezone;

	const sunriseDate = new Date( sunriseInTarget * 1000 );
	const sunsetDate = new Date( sunsetInTarget * 1000 );

	const sunriseHours = addZero(sunriseDate.getHours());
	const sunriseMinutes = addZero(sunriseDate.getMinutes());
	const sunsetHours = addZero(sunsetDate.getHours());
	const sunsetMinutes = addZero(sunsetDate.getMinutes());

	return [ `${ sunriseHours }:${ sunriseMinutes }`, `${ sunsetHours }:${ sunsetMinutes }` ];
}

function addZero(num) {
	return num.toString().padStart(2, '0');
}

function ent(event, text){
    event.preventDefault();
    const url = `${serverUrl}?q=${text}&appid=${apiKey}`;
    fetch(url)
        .then(response => {
            if(response.ok){
                return response.json();
            }
            else{
                alert(`Ошибка: ${response.status}`)
            }
        })
        .then(data => {
            tempField.textContent = getCelcium(data.main.temp)
            cityCall.textContent = data.name;
            document.querySelector('.fl').textContent = getCelcium(data.main.feels_like);

            const sun = calcSun(data);
            document.querySelector('.sr').textContent = sun[0];
            document.querySelector('.ss').textContent = sun[1];

            const tempa = document.querySelectorAll('.temp');
            const feeling = document.querySelectorAll('.fln')
            for(let i = 0; i < tempa.length; i++){
                tempa[i].textContent = getCelcium(data.main.temp);
                feeling[i].textContent = getCelcium(data.main.feels_like);
            }
        })
}

function render(){
    let oldElems = document.querySelectorAll('.item');
    for(let i = 0; i < oldElems.length; i++){
        oldElems[i].remove();
    }

    const favs = storage.getFavoirites();
    let keys = Object.keys(localStorage);
    for(let key of keys) {
        if(localStorage.getItem(key) != null)
        {
                const item = cityItem.cloneNode(true);
                item.querySelector('.town').textContent = localStorage.getItem(key);
                cityList.append(item);
        }
    }
}

function deleteCity(event){
    let task = event.target.closest('.delBut');
    if(task){
        let delText = task.closest('.item').querySelector('.town').textContent;
        const favs = storage.getFavoirites();
        let keys = Object.keys(localStorage);
        for(let key of keys) {
            if(localStorage.getItem(key) == delText){
                localStorage.removeItem(key);
            }
        }
    }
    render();
}

function addCity(event){
    event.preventDefault();
    let nameOf = cityCall.textContent;
    if(storage.getCurrent(nameOf) == -1){
        storage.saveFavourite(nameOf);
    }
    render();
}

function enterCity(event){
    let city = event.target.closest('.town');
    if(city)
    {
        ent(event, city.textContent);
    }
}

searchButton.addEventListener('click', (event) => ent(event, cityName.value));
document.querySelector('.addedLocs').addEventListener('click', (event) => deleteCity(event));
addButton.addEventListener('click', (event) => addCity(event));
cityList.addEventListener('click', (event) => enterCity(event));
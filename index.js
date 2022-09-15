// https://api.nasa.gov/index.html

// CREATING ELEMENTS
const createLi = () => document.createElement('li');
const createUl = () => document.createElement('ul');
const createA = () => document.createElement('a');
const createImg = () => document.createElement('img');

const sideNav = () => document.querySelector('.side-nav');
const sideInfo = () => document.querySelector('.side-info');
const main = () => document.querySelector('.main-content');
const title = () => document.querySelector('.title');

let danger = false;

// CLEARING THE DOM containers
function clearCont(array){
    if (array.length === 1){
        const arr = Array.from(array[0].children);
	    arr.forEach(elem => elem.remove());
    } else {
        array.forEach(element => {
            const arr = Array.from(element.children);
            arr.forEach(elem => elem.remove());
        })
    }
}

// Date
function liveTime(){
    const currentDay = Date().slice(0, 15);
    const currentTime = Date().slice(16, 24);

    document.querySelector('.currentDay').innerText = currentDay;
    document.querySelector('.currentTime').innerText = currentTime;
}
liveTime();
setInterval(liveTime, 1000);


//FETCHING DATA

// ASTRONOMY PIC OF THE DAY
async function fetchAstroPicData(){
    try {
        const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=fD1szVroHVtYYnbqRjAy1rEguJLo6FgL5S0SFd10');
        const data = await response.json();
        return data;
    } catch (err){
        console.log(err);
    }
}


// EXTRA MARS ROVER API'S
// https://api.nasa.gov/mars-photos/api/v1/rovers/{rover}/photos
// https://api.nasa.gov/mars-photos/api/v1/manifests/${e.target.innerText}/?api_key=fD1szVroHVtYYnbqRjAy1rEguJLo6FgL5S0SFd10
// https://api.nasa.gov/mars-photos/api/v1/rovers/${e.target.innerText}/photos?sol=1&page=1&camera=NAVCAM&api_key=fD1szVroHVtYYnbqRjAy1rEguJLo6FgL5S0SFd10
// https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?api_key=fD1szVroHVtYYnbqRjAy1rEguJLo6FgL5S0SFd10

// MARS ROVERS PICTURES
async function fetchMarsData(){
    try {
        const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?api_key=fD1szVroHVtYYnbqRjAy1rEguJLo6FgL5S0SFd10`)
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

// CLOSEST ASTEROIDS TO EARTH
async function fetchAsteroidsData(){
    try {
        const resp = await fetch('https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=fD1szVroHVtYYnbqRjAy1rEguJLo6FgL5S0SFd10')
        const data = await resp.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}



// RENDERING ASTRONOMY PIC OF THE DAY
async function renderAstroPic(){
    const p = document.createElement('p');
    const span = document.createElement('span');
    const h3 = document.createElement('h3');
    const astroPicData = await fetchAstroPicData();
   
    if (astroPicData.media_type === 'video'){
        const iframe = document.createElement('iframe');
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.src = astroPicData.url;
        main().appendChild(iframe);
    } else {
        const img = createImg();
        img.src = astroPicData.url;
        img.alt = 'Astronomy Photo of the Day';
        img.style.width = '100%';
        img.style.height = '100%';
        main().appendChild(img);
    }
    
    p.innerText = astroPicData.explanation;
    span.innerText = astroPicData.date;
    h3.innerText = astroPicData.title;

    sideInfo().append(h3, p, span);
}

// RENDERING MARS PICTURES
async function renderMarsPics(){
    const marsPicData = await fetchMarsData();
    marsPicData.latest_photos.forEach(obj => {
        const li = createLi();
        const a = createA();
        const img = createImg();

        a.innerText = obj.id;
    img.src = obj.img_src;
    img.style.width = '100%';
    img.style.height = '100%';

    li.appendChild(a);
    li.addEventListener('click', () => {
        clearCont([main()]);
        main().appendChild(img);
    })

    sideInfo().appendChild(li);
    })
}

// RENDERING ASTEROIDS
async function renderAsteroidsToSide(){
    const asteroidContainer = await fetchAsteroidsData();
    asteroidContainer.near_earth_objects.forEach(obj => {
        const li = createLi();
        li.innerText = obj.name_limited;
        if (obj.is_potentially_hazardous_asteroid === true) {
            li.classList.add('hazardous');
        }
        li.addEventListener('click', () => {
            renderAsteroidToMain(obj)
        })
        sideNav().appendChild(li);
    })
}

// LOAD ASTEROID TO MAIN
function renderAsteroidToMain(obj){
    const h2 = document.createElement('h2');
    const ul = createUl();
    const li = createLi();
    const li2 = createLi();
    const li3 = createLi();
    const li4 = createLi();
 
    h2.innerText =`-Name: ${obj.name}`;
    li.innerText = `-Absolute magnitude: ${obj.absolute_magnitude_h}`;
    li2.innerText = `-Estimated diamater max: ${obj.estimated_diameter.miles.estimated_diameter_max} miles
    -Estimated diamater min: ${obj.estimated_diameter.miles.estimated_diameter_min} miles`
    if(obj.is_potentially_hazardous_asteroid){
        li3.innerText = 'POTENTIALLY HAZARDOUS!';
        li3.style.color = 'red';
        li3.classList.add('blink');
        li3.style.fontSize = '2rem';
    } else {
        li3.innerText = '-Asteroid is not hazardous';
    }
    for(const date of obj.close_approach_data) {
        const li = createLi();
        const li2 = createLi();
        li.innerText = date.close_approach_date_full;
        li2.innerText = date.miss_distance.miles;
        ul.appendChild(li, li2)
    }
    li4.innerText = '-Dates of close approaches:'

    clearCont([main()]);
    li4.appendChild(ul);
    main().append(h2, li3, li, li2, li4)
}

function dangerousAsteroids(danger){
    const hazardous = document.querySelectorAll('.hazardous');
    const button = document.querySelector('#danger-button');
    button.innerText = danger ? 'ON' : 'OFF';
    hazardous.forEach(elem => {
        danger ? elem.classList.add('blink') : elem.classList.remove('blink');
        elem.style.color = `${danger ? 'red' : 'black'}`;
    })
}
    
function addButton(){
    const span = document.createElement('span');
    const button = document.createElement('button');

    span.innerText = 'Show potentially hazardous asteroids';
    span.style.color = 'red';
    button.innerText = 'OFF';
    button.setAttribute('id', 'danger-button');
    button.addEventListener('click', () => {
        danger = !danger;
        dangerousAsteroids(danger);

    })
    sideNav().append(span, button);
}


// .nav-bar event listeners
document.querySelector('#astro').addEventListener('click', astroPicCallback);
document.querySelector('#mars_photos').addEventListener('click', marsPhotosCallback);
document.querySelector('#asteroid_watcher').addEventListener('click', asteroidCallback);

// event listener callbacks
function astroPicCallback(){
    clearCont([main(), sideNav(), sideInfo()]);
    title().innerText = 'Astronomy picture of the day';
    renderAstroPic();
}

function marsPhotosCallback(){
    clearCont([sideNav(), sideInfo()]);
    title().innerText = 'Check out the latest photos of Curiosity!';
    renderMarsPics();
}

function asteroidCallback(){
    clearCont([sideNav(), sideInfo()]);
    title().innerText = 'Watch out for the approching asteroids!';
    addButton();
    renderAsteroidsToSide();
}
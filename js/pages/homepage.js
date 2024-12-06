const $sensorsWrapper = document.querySelector('.sensors-wrapper')
const $dropdownForm = document.querySelector('.dropdown-form')

const ITEMS_PER_PAGE = 8

const retrieveSensorsData = () => fetch('/debuggez-l-interface-de-votre-site/data/homepage-data.json')
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        if (!data || !data.facades) {
            throw new Error('Data structure is invalid');
        }
        return data.facades;
    })
    .catch(err => {
        console.error("Error loading data:", err);
        return [];
    });

const createSensorCardImg = sensor => {
    const $sensorImg = document.createElement('img')
    $sensorImg.classList.add('sensor-img')
    $sensorImg.setAttribute('src', `/debuggez-l-interface-de-votre-site/assets/${sensor.img}`)
    $sensorImg.setAttribute('alt', `Capteur numéro ${sensor.id}`)
    return $sensorImg
}

const createSensorCardInfo = sensor => {
    const $sensorInfo = document.createElement('div')
    $sensorInfo.classList.add('sensor-info')
    
    const $sensorInfoTitle = document.createElement('h3')
    $sensorInfoTitle.textContent = `Capteur #${sensor.id}`

    const $sensorInfoLocation = document.createElement('span')
    $sensorInfoLocation.classList.add('sensor-info-location')
    $sensorInfoLocation.textContent = `Localisation : ${sensor.location}`
    
    const $sensorInfoStatus = document.createElement('span')
    $sensorInfoStatus.classList.add('sensor-info-status')
    $sensorInfoStatus.innerHTML = sensor.isActive
        ? `Status : <span class="on">actif</span>`
        : `Status : <span class="off">inactive</span>`
    
    const $sensorInfoBtn = document.createElement('a')
    $sensorInfoBtn.classList.add('sensor-info-btn')
    $sensorInfoBtn.setAttribute('href', `/debuggez-l-interface-de-votre-site/pages/sensor-details.html?facadeId=${sensor.id}`)
    $sensorInfoBtn.textContent = 'Voir les détails'

    $sensorInfo.appendChild($sensorInfoTitle)
    $sensorInfo.appendChild($sensorInfoLocation)
    $sensorInfo.appendChild($sensorInfoStatus)
    $sensorInfo.appendChild($sensorInfoBtn)

    return $sensorInfo
}

const createSensorCard = sensor => {
    const $sensorCard = document.createElement('div')
    $sensorCard.classList.add('sensor-card')

    const $sensorImg = createSensorCardImg(sensor)
    const $sensorInfo = createSensorCardInfo(sensor)

    $sensorCard.appendChild($sensorImg)
    $sensorCard.appendChild($sensorInfo)

    return $sensorCard
}

const createPagination = (numberOfSensors) => {
    const $paginationList = document.querySelector('.pagination-list')
    const numberOfPages = Math.ceil(numberOfSensors / ITEMS_PER_PAGE)

    for (let i = 1; i <= numberOfPages; i++) {
        const $paginationListItem = document.createElement('li')
        const $paginationLink = document.createElement('a')

        $paginationListItem.classList.add('pagination-list-item')

        $paginationLink.setAttribute('href', `/debuggez-l-interface-de-votre-site/pages/homepage.html?page=${i}`)
        $paginationLink.textContent = i

        $paginationListItem.appendChild($paginationLink)
        $paginationList.appendChild($paginationListItem)
    }
}

const calculateOffset = () => {
    const params = new URLSearchParams(window.location.search)
    const pageParams = params.get('page')

    if (!pageParams || Number(pageParams) === 1) {
        return 0
    }

    return (Number(pageParams) - 1) * ITEMS_PER_PAGE
}

// @TODO: Need to finish the function implementation
$dropdownForm.addEventListener('change', function(e) {
    console.log(e.target.value)
})

const main = async () => {
    try {
        const sensorsData = await retrieveSensorsData();
        
        if (sensorsData && sensorsData.length > 0) {
            createPagination(sensorsData.length);
            
            const offset = calculateOffset();

            for (let i = offset; i < ITEMS_PER_PAGE + offset; i++) {
                if (sensorsData[i]) {
                    $sensorsWrapper.appendChild(createSensorCard(sensorsData[i]));
                }
            }
        } else {
            $sensorsWrapper.innerHTML = '<p>Aucun capteur disponible</p>';
        }
    } catch (error) {
        console.error("Error in main:", error);
        $sensorsWrapper.innerHTML = '<p>Une erreur est survenue lors du chargement des données</p>';
    }
}

main()

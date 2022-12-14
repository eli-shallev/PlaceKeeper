'use srtice'

function onIndexInit(doc) {
    const elBody = doc.body
    const userPreps = getUserPreps()
    if (userPreps) {
        elBody.style.color = userPreps.txtColor
        elBody.style.backgroundColor = userPreps.bgColor
        doc.querySelector('.nameHolder').innerText = userPreps.name !== '' ? userPreps.name : 'Friend'
    } else {
        doc.querySelector('.nameHolder').innerText = 'Friend'
    }
}

function onUserPrepsInit() {
    const elBody = document.body
    const userPreps = getUserPreps()
    if (userPreps) {
        elBody.style.color = userPreps.txtColor
        elBody.style.backgroundColor = userPreps.bgColor

        const inputs = Array.from(document.querySelectorAll('input'))
        inputs.forEach(input => input.value = userPreps[input.id])
    }
}

function onMapInit() {
    const elBody = document.body
    const userPreps = getUserPreps()
    elBody.style.color = userPreps.txtColor
    elBody.style.backgroundColor = userPreps.bgColor
    
    updateSavedLocations()
    updateMarkersArry()
    getPosition()
    renderLocationList()
}

function renderLocationList() {
    elList = document.querySelector('.location-container')
    const strHtml = getSavedLocations().map(location => {
        return `<li>
            <div onclick="onCenterMap('${location.id}')">
            <button class="list-btn" onClick="onRemoveLoaction(event,'${location.id}')">X</button>
                <h3>${location.name}</h3>
                <label>lat: ${location.lat.toFixed(3)}, lng: ${location.lng.toFixed(3)}</label>
            </div>
        </li>`
    }).join('')

    elList.innerHTML = strHtml
}

function onCenterMap(locationId) {
    const savedLocations = getSavedLocations()
    const idx = savedLocations.findIndex(location => location.id === locationId)
    const lat = savedLocations[idx].lat
    const lng = savedLocations[idx].lng
    centerMap(lat, lng)
}

function onMyLocationClick(){
    getCurrLocation()
}

function onRemoveLoaction(ev, locationId) {
    ev.stopPropagation()
    removeLocation(locationId)
    renderLocationList()

}

function onUpdateUserPreps(ev) {
    ev.preventDefault()

    const inputs = Array.from(ev.target.querySelectorAll('input'))
    const userPreps = inputs.reduce((acc, input) => {
        if (input.id) acc[input.id] = input.value
        return acc
    }, {})

    updateUserPreps(userPreps)
    onUserPrepsInit()
}
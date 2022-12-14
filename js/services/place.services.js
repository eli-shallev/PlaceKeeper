'use strict'
const SAVED_LOCATIONS_STORAGE_KEY = 'savedLocations'
var gsavedLocations = []
var gMarkers
var gMap

function getPosition() {
    if (!navigator.geolocation) {
        alert('HTML5 Geolocation is not supported in your browser')
        return
    }
    navigator.geolocation.getCurrentPosition(initMap, handleLocationError)
}

function updateSavedLocations(){
    gsavedLocations = loadFromStorage(SAVED_LOCATIONS_STORAGE_KEY)
    if (!gsavedLocations || !gsavedLocations.length) {
        gsavedLocations = []
        gsavedLocations.push(createLocation('Start', 31, 31))
    }
}

function getSavedLocations() {
    return gsavedLocations
}

function removeLocation(locationId) {
    const idx = gsavedLocations.findIndex(location => location.id === locationId)
    const title = gsavedLocations[idx].name
    gsavedLocations.splice(idx, 1)
    saveToStorage(SAVED_LOCATIONS_STORAGE_KEY, gsavedLocations)
    removeMarker(title)

}

function addSavedLocation(name, lat, lng) {
    gsavedLocations.push(createLocation(name, lat, lng))
    saveToStorage(SAVED_LOCATIONS_STORAGE_KEY, gsavedLocations)
    addMarker(name,lat,lng)
    renderLocationList()
}

function addMarker(title,lat,lng){
    gMarkers.push(new google.maps.Marker({
        position: { lat, lng },
        map: gMap,
        title: title
    }))
}

function removeMarker(title){
    const idx = gMarkers.findIndex(marker=> marker.title === title)
    gMarkers[idx].setMap(null)
    gMarkers.splice(idx,1)
}

function centerMap(lat,lng){
    gMap.setCenter({ lat, lng})

}

function initMap(position) {
    let userPreps = loadFromStorage(USER_PREPS_STORAGE_KEY)
    var elMap = document.querySelector('.map')

    if(!userPreps) userPreps = {mapStartLocation: '31,31', zoomFactor: 15}
    let initPositionArray = userPreps.mapStartLocation.split(',')
    if (!initPositionArray || initPositionArray.length === 1) initPositionArray = [31, 31]
    const lat = +initPositionArray[0]
    const lng = +initPositionArray[1]

    const zoom = +userPreps.zoomFactor

    var options = {
        center: { lat, lng },
        zoom: zoom
    }

    gMap = new google.maps.Map(
        elMap,
        options
    )

    // var marker = new google.maps.Marker({
    //     position: { lat, lng },
    //     map: gMap,
    //     title: 'Default Location',
    // })

    addAllMarkersFromSavedLocations()

    gMap.addListener("click", (mapsMouseEvent) => {
        const name = prompt("Insert new location name")
        addSavedLocation(name, mapsMouseEvent.latLng.lat(), mapsMouseEvent.latLng.lng())
    })
}

function addAllMarkersFromSavedLocations(){
    gMarkers.forEach(marker => marker.setMap(gMap))
}

function updateMarkersArry(){
    gMarkers=[]
    gsavedLocations.forEach(location =>{
        var lat = location.lat
        var lng = location.lng
        var title = location.name
        gMarkers.push(new google.maps.Marker({
            position: { lat, lng },
            map: null,
            title: title
        }))
    })
}

function getCurrLocation(){
    navigator.geolocation.getCurrentPosition(
        function (position) {
           centerMap(position.coords.latitude, position.coords.longitude)
        },
        function errorCallback(error) {
           console.log(error)
        }
     )

     console.log(gMarkers)
}

function createLocation(name, lat, lng) {
    return {
        id: makeId(),
        name,
        lat,
        lng
    }
}

function handleLocationError(error) {
    var locationError = document.getElementById("locationError")

    switch (error.code) {
        case 0:
            locationError.innerHTML = "There was an error while retrieving your location: " + error.message
            break
        case 1:
            locationError.innerHTML = "The user didn't allow this page to retrieve a location."
            break
        case 2:
            locationError.innerHTML = "The browser was unable to determine your location: " + error.message
            break
        case 3:
            locationError.innerHTML = "The browser timed out before retrieving the location."
            break
    }
}
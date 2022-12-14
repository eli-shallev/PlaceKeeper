'use srtict'
const USER_PREPS_STORAGE_KEY = 'userPreps'

function updateUserPreps(userPreps){
    saveToStorage(USER_PREPS_STORAGE_KEY,userPreps)
}

function getUserPreps(){
    return loadFromStorage(USER_PREPS_STORAGE_KEY)
}
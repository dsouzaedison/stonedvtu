import React from 'react';
import store from '../components/store';
import * as DeviceInfo from "react-native-device-info";

let meta = {
    uniqueID: DeviceInfo.getUniqueID(),
    bundleId: DeviceInfo.getBundleId(),
    version: DeviceInfo.getVersion()
};

syncState = () => {
    state = store.getState();
    localAppData = state.localAppData;
};

handleError = (e) => {
    console.log(e);
};

const unsubscribe = store.subscribe(syncState);
let state = store.getState();
let localAppData = state.localAppData;

let headers = {
    'Cache-Control': 'no-cache',
    ...meta
};

export default {
    registerDevice: (deviceInfo) => {
        return fetch(state.baseUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(deviceInfo)
        })
            .then(res => res.json())
            .catch(e => handleError(e));
    },
    mapDeviceToInstallId: (mappingInfo) => {
        return fetch(state.mappingUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(mappingInfo)
        })
            .then(res => res)
            .catch(e => handleError(e));
    },
    fetchFavoritesBackup: (token) => {
        return fetch(state.baseUrl + 'syncFavorites/' + '?token=' + token, {headers})
            .then(res => res.json())
            .catch(e => handleError(e));
    },
    deleteFavoritesBackup: () => {
        return fetch(state.baseUrl + 'deleteFavoritesBackup/' + '?token=' + state.token, {headers})
            .then(res => res.json())
            .catch(e => handleError(e));
    },
    syncFavorites: (data) => {
        return fetch(state.baseUrl + state.endpoints.syncFavorites, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .catch(e => handleError(e));
    },
    verifyCache: () => {
        return fetch(state.baseUrl + 'verifycache?hash=' + localAppData.hash, {headers})
            .then(res => res.json())
            .catch(e => handleError(e));
    },
    getAppData: () => {
        return fetch(state.baseUrl + 'old?token=' + state.token + '&studyMaterialsHash=' + localAppData.studyMaterialsHash, {headers})
            .then(res => {
                if (res.status === 401) {
                    return {status: 401};
                }
                else return res.json();
            })
            .catch(e => handleError(e));
    },
    testConnectivity: () => {
        return fetch(state.baseUrl + state.endpoints.networkTest, {headers})
            .then(res => res.json())
            .catch(e => handleError(e));
    },
    getTechnologyNews: () => {
        return fetch(state.newsUrl)
            .then(res => res.json())
            .catch(e => handleError(e));
    },
    addFavorite: (data) => {
        return fetch(state.baseUrl + state.endpoints.addFavorite, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .catch(e => handleError(e));
    },
    deleteFavorite: (data) => {
        return fetch(state.baseUrl + state.endpoints.deleteFavorite, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        })
            .catch(e => handleError(e));
    },
    getRegularResults: (usn) => {
        console.log('URL: ' + state.baseUrl + state.endpoints.regularResults + '?usn=' + usn);
        return fetch(state.baseUrl + state.endpoints.regularResults + '?usn=' + usn, {headers})
            .then(res => res.json())
            .catch(e => handleError(e));
    },
    getRevalResults: (usn) => {
        console.log('URL: ' + state.baseUrl + state.endpoints.revalResults + '?usn=' + usn);
        return fetch(state.baseUrl + state.endpoints.revalResults + '?usn=' + usn, {headers})
            .then(res => res.json())
            .catch(e => handleError(e));
    }
}
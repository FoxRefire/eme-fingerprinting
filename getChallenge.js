export default async function() {
    let keySystemAccess;
    try{
        keySystemAccess = await navigator.requestMediaKeySystemAccess('com.widevine.alpha', config)
    } catch {
        config[0]['sessionTypes'] = ['temporary']
        keySystemAccess = await navigator.requestMediaKeySystemAccess('com.widevine.alpha', config)
    }
    let challenge = await getChallenge(keySystemAccess);
    return challenge
};

// Tears of Steel Init data Widevine
let initData = Uint8Array.from(atob('AAAARHBzc2gAAAAA7e+LqXnWSs6jyCfc1R0h7QAAACQIARIBMRoNd2lkZXZpbmVfdGVzdCIKMjAxNV90ZWFycyoCU0Q='), c => c.charCodeAt(0))

// Widevine CDM config MediaKeyAccess default
let config = [{
    initDataTypes: ['cenc'],
    sessionTypes: ['persistent-license'],
    videoCapabilities: [{
        contentType: 'video/mp4; codecs="avc1.640029"'
    }],
    audioCapabilities: [{
        contentType: 'audio/mp4; codecs="mp4a.40.2"'
    }]
}];

async function getChallenge(keySystemAccess) {
    return new Promise((resolve, reject) => {
        try{
            keySystemAccess.createMediaKeys().then(mediaKeys => {
                let keySession = mediaKeys.createSession(config[0]['sessionTypes'])
                keySession.addEventListener("message", event => resolve(event.message));
                keySession.generateRequest("cenc", initData)
            })
        } catch(err) {
            reject("Unable to create MediaKeys : " + err)
        }
    })
}

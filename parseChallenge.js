import './protobuf.min.js'
export default async function(challenge) {
    let Proto = await loadProto()
    let SignedMessage = Proto.lookupType("pywidevine_license_protocol.SignedMessage")
    let LicenseRequest = Proto.lookupType("pywidevine_license_protocol.LicenseRequest")

    let sm = SignedMessage.decode(new Uint8Array(challenge))
    let lr = LicenseRequest.decode(sm.msg)

    return JSON.stringify(lr, null , "\t")
};

function loadProto(){
    return new Promise((resolve, reject) => {
        protobuf.load("license_protocol.proto", (err, proto) => {
            err ? reject(err) : null
            resolve(proto)
        })
    })
}

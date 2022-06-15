class ProfileRegister {
    constructor() {
        this.client = new RestClient()
    }
    #getUrl() {
        const id = 'AKfycbwsoKbgKwuMUCsLXeVGifX2j5bDHyld3R7vfa78Qx3hTEhPtqq43ZgEdbg3UDUvRD4g8A'
        return `https://script.google.com/macros/s/${ID}/exec`
    }
    get() { return this.client.get(this.#getUrl()) }
    #getPostData(address, profileJsonStr) { return {address: address, profile: profileJsonStr} }
    post(data) { return this.client.post(url, null, data) }
}

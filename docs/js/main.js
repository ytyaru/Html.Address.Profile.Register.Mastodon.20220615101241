window.addEventListener('DOMContentLoaded', async(event) => {
    try {
        window.mpurse.updateEmitter.removeAllListeners()
          .on('stateChanged', isUnlocked => console.log(isUnlocked))
          .on('addressChanged', address => console.log(address));
    } catch(e) { console.debug(e) }
    //const profiles = new ProfileRegister().get()
    document.getElementById('address').addEventListener('change', async(event) => {
        const index = profiles.findindex(p=>p.address === event.target.value)
        if (-1 < index) { showMyData(profiles[index]) }
    });
    document.getElementById('regist').addEventListener('click', async(event) => {
        const register = new ProfileRegister()
        const json = await register.post(makeJson())
    });

    function showMyData(json) {
        const primary = primarySnsUser()
        document.getElementById('url').value = json.url || primary.url
        document.getElementById('name').value = json.name || primary.name
        document.getElementById('avatar').value = json.avatar || primary.avatar
        document.getElementById('description').value = json.description || primary.description
        const fields = (json.hasOwnProperty('fields')) ? json.fields : (primary.hasOwnProperty('fields')) ? primary.fields : null
        if (fields) {
            for (let i=0; i<fields.length; i++) {
                document.getElementById(`field-${i}-key`).value = fields[i].key
                document.getElementById(`field-${i}-value`).value = fields[i].value
            }
        }
    }
    function makeMastodonProfiles(json, primary) {
        if (!json.hasOwnProperty('mastodon')) { return '' }
        return json.mastodon.map(p=>makeMastodonProfile(p))
    }
    function makeMastodonProfile(json, primary) {
        const table = document.createElement('table')
        const one = document.createElement('tr')
        const two = document.createElement('tr')
        one.innerHTML = `<td>${makeAvatar(json.url || primary.url, json.avatar || primary.avatar, 96)}</td><td>${makeDescription(json.description || primary.description)}</td>`
        table.appendChild(one)
        table.appendChild(two)
        return table.outerHTML
    }
    function makeMisskeyProfile(json) {
    }

    function makeLink(url) { return `<a href="${url}" rel="noopener noreferrer">${url}</a>` }
    function makeAvatar(url, src, size) { return `<a href="${url}" rel="noopener noreferrer"><img src="${src}" width="${size}" height="${size}"></a>` }
    function primarySnsUser(json) {
        if (json.hasOwnProperty('primary_sns')) {
            console.debug(json.primary_sns)
            //json.primary_sns.service
            //json.primary_sns.domain
            //json.primary_sns.id
            const index = json[json.primary_sns.service][json.primary_sns.domain].findindex(user=>user.id===json.primary_sns.id)
            return json[json.primary_sns.service][json.primary_sns.domain][index]
        }
        return null
    }
    function makeDescription(description) {
        description = description.replace('\n', '<br>')
    }
    function makeJson() {
        const address = document.getElementById('address').value
        const url = document.getElementById('url').value
        const name = document.getElementById('name').value
        const avatar = document.getElementById('avatar').value
        const description = document.getElementById('description').value
        const fields = []
        for (let i=0; i<4; i++) {
            const key = document.getElementById(`field-${i}-key`).value
            const value = document.getElementById(`field-${i}-value`).value
            if (key && value) { fields.push({key:key, value:value}) }
        }
        const json = {address:address, url:url, name:name, avatar:avatar, description:description}
        if (0 < fields.length) { json.fields = fields }
        return json
    }
    document.getElementById('get-mastodon-account-info').addEventListener('click', async(event) => {
        const domain = document.getElementById('mastodon-instance').value
        if ('' == domain.trim()) { Toaster.toast(`インスタンスのドメイン名またはURLを入力してください。`, true); return; }
        if (await MastodonInstance.isExist(domain)) {
            console.debug('指定したインスタンスは存在する')
            const authorizer = new MastodonAuthorizer(domain, '')
            await authorizer.authorize(['accounts'], null)
        } else {
            Toaster.toast('指定したインスタンスは存在しません。', true)
        }
    });
    document.addEventListener('mastodon_redirect_approved', async(event) => {
        console.debug('===== mastodon_redirect_approved =====')
        console.debug(event.detail)
        // actionを指定したときの入力と出力を表示する
        for (let i=0; i<event.detail.actions.length; i++) {
            console.debug(event.detail.actions[i], (event.detail.params) ? event.detail.params[i] : null, event.detail.results[i])
            console.debug(`----- ${event.detail.actions[i]} -----`)
            console.debug((event.detail.params) ? event.detail.params[i] : null)
            console.debug(event.detail.results[i])
        }
        // 認証リダイレクトで許可されたあとアクセストークンを生成して作成したclientを使ってAPIを発行する
        //const res = event.detail.client.toot(JSON.parse(event.detail.params[0]))
        // 独自処理（）
        for (let i=0; i<event.detail.actions.length; i++) {
            if ('accounts' == event.detail.actions[i]) {
                const gen = new MastodonProfileGenerator(event.detail.domain)
                document.getElementById('export-mastodon').innerHTML = gen.generate(event.detail.results[i])
            }
            else if ('status' == event.detail.actions[i]) {
                const html = new Comment().mastodonResToComment(event.detail.results[i])
                const comment = document.querySelector(`mention-section`).shadowRoot.querySelector(`#web-mention-comment`)
                comment.innerHTML = html + comment.innerHTML
            }
        }
    });
    document.addEventListener('mastodon_redirect_rejected', async(event) => {
        console.debug('認証エラーです。認証を拒否しました。')
        console.debug(event.detail.error)
        console.debug(event.detail.error_description)
        Toaster.toast('キャンセルしました')
    });

    document.getElementById('get-misskey-account-info').addEventListener('click', async(event) => {
        const domain = document.getElementById('misskey-instance').value
        if ('' == domain.trim()) { Toaster.toast(`インスタンスのドメイン名またはURLを入力してください。`, true); return; }
        if (await MisskeyInstance.isExist(domain)) {
            console.debug('指定したインスタンスは存在する')
            const authorizer = await MisskeyAuthorizer.get(domain, 'read:account')
            console.debug(authorizer)
            await authorizer.authorize(['i'], null)
        } else {
            Toaster.toast('指定したインスタンスは存在しません。', true)
        }
    });
    document.addEventListener('misskey_redirect_approved', async(event) => {
        console.debug('===== misskey_redirect_approved =====')
        console.debug(event.detail)
        // actionを指定したときの入力と出力を表示する
        for (let i=0; i<event.detail.actions.length; i++) {
            console.debug(event.detail.actions[i], (event.detail.params) ? event.detail.params[i] : null, event.detail.results[i])
            console.debug(`----- ${event.detail.actions[i]} -----`)
            console.debug((event.detail.params) ? event.detail.params[i] : null)
            console.debug(event.detail.results[i])
        }
        // 認証リダイレクトで許可されたあとアクセストークンを生成して作成したclientを使ってAPIを発行する
        //const res = event.detail.client.toot(JSON.parse(event.detail.params[0]))
        // 独自処理
        for (let i=0; i<event.detail.actions.length; i++) {
            if ('i' == event.detail.actions[i]) {
                const gen = new MisskeyProfileGenerator(event.detail.domain)
                document.getElementById('export-misskey').innerHTML = gen.generate(event.detail.results[i])
            }
            else if ('note' == event.detail.actions[i]) {
                const html = new Comment().misskeyResToComment(event.detail.results[i].createdNote, event.detail.domain)
                const comment = document.querySelector(`mention-section`).shadowRoot.querySelector(`#web-mention-comment`)
                comment.innerHTML = html + comment.innerHTML
            }
        }
    });
    document.addEventListener('misskey_redirect_rejected', async(event) => {
        console.debug('認証エラーです。認証を拒否しました。')
        console.debug(event.detail.error)
        console.debug(event.detail.error_description)
        Toaster.toast('キャンセルしました')
    });
    // リダイレクト認証後
    const reciverMastodon = new MastodonRedirectCallbackReciver()
    await reciverMastodon.recive()
    const reciverMisskey = new MisskeyRedirectCallbackReciver()
    await reciverMisskey.recive()
});


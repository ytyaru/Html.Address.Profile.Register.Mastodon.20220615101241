# モナコインのアドレスとユーザのプロフィール情報を紐付けるJSON-schemaについて

# 目的

　アドレスとプロフィールを紐づけたい。

　アドレスはbase58やbech32により英数字の羅列である。一見して誰が誰だかわからない。そこで、ユーザ名、アバター画像、自己紹介文、サイトURLによって、どんな人なのかを伝えられるようにしたい。

# 完成予想図

```
+--------+ 自己紹介文
|アバター| field-key  field-value
|  画像  | mastodon   domain  @username  @username ...
+--------+ misskey    domain  @username  @username ...
 ユーザ名  ●モナコイン・アドレス
```

リンク対象|リンク先
----------|--------
アバター画像|代表URL（ユーザが指定した自作サイト。またはSNSプロフィールページ）
ユーザ名|代表URL（ユーザが指定した自作サイト。またはSNSプロフィールページ）
自己紹介文|ユーザが指定したプレーンテキストから作る。またはSNSプロフィールから作る。
field|プロフィール補足情報。マストドンやミスキーに存在する４つまで作れるキーと値の組み合わせ。
mastodon|マストドンのインスタンスURLとそれに紐づくユーザのプロフィールURL。
misskey|ミスキーのインスタンスURLとそれに紐づくユーザのプロフィールURL。

# 入力画面

```
URL     [              ]
名前    [              ]
画像URL [              ]
プロフィール
  +--------------------+
  |                    |
  +--------------------+
プロフィール補足情報
  [キー][値]
  [キー][値]
  [キー][値]
  [キー][値]
mastodon
  domain A
    
  domain B

  ...
misskey
  domain A
    
  domain B

  ...
```

# 紐づけ

　モナコインのアドレスとSNSのプロフィールを紐づけたい。これを設定できるのは本人だけにしたい。この情報はすべての人が自分の情報だけを編集できるようにしたい。

* mpurseを使って本人であるか署名する
* SNSは認証によりログインし本人確認する
* SNSのプロフィールにあるアドレスを使い、mpurseの署名でクリアできたらOK
    * でもmpurseの署名はただハッシュを返すだけ。どうやって一致確認するの？
    * https://qiita.com/Raiu1210/items/af87cb5f7bf155e9aaac

## アドレスの本人確認ができない

　どうやらNode.jsを使わねば試すことすらできなさそう。[試してみた][]が、Node.js上でなら確認できた。だが、ブラウザ上で動作するコードに変換することができなかった。

　なのでアドレスの本人確認については一旦諦める。他人のアドレスを書くこともできる状態となるが、今はそれで妥協する。

[試してみた]:https://monaledge.com/article/401

　もしかしたらイジメっ子が「お前のSNSプロフィールに俺様のアドレスを書け！」と脅迫する事案が発生しないとも限らない。なので本人のアドレスしか書けないようにしたかったのに。

# JSON

　必要なデータのJSON-schemaについて考える。

```
[
    "address": {
        "name": "",
        "url": "",
        "avatar": "",
        "mastodon": {
            "mstdn.jp": [
                {
                    "id": "",
                    "username": "",
                    "display_name": "",
                    "avatar": "",
                    "text": "",
                },
            ],
            "pawoo.net": [
                ...
            ]
        },
        "misskey": {
            "misskey.io": [
                ...
            ],
            "misskey.dev": [
                ...
            ]
        }
    }
]
```

```
[
    {
        "address": "",
        "name": "",
        "url": "",
        "avatar": "",
        "mastodon": {
            "mstdn.jp": [
                {
                    "id": "",
                    "username": "",
                    "display_name": "",
                    "avatar": "",
                    "text": "",
                },
            ],
            "pawoo.net": [
                ...
            ]
        },
        "misskey": {
            "misskey.io": [
                ...
            ],
            "misskey.dev": [
                ...
            ]
        }
    }
]
```

```
[
    {
        "address": "",
        "profile": {
            "name": "",
            "url": "",
            "avatar": "",
            "mastodon": {
                "mstdn.jp": [
                    {
                        "id": "",
                        "username": "",
                        "display_name": "",
                        "avatar": "",
                        "text": "",
                    },
                ],
                "pawoo.net": [
                    ...
                ]
            },
            "misskey": {
                "misskey.io": [
                    ...
                ],
                "misskey.dev": [
                    ...
                ]
            }
        }
    }
]
```

```
[
    {
        "address": "",
        "profile": {
            "name": "",
            "url": "",
            "avatar": "",
            "mastodon": [
                {
                    "domain": "mstdn.jp"
                    "id": "",
                    "username": "",
                    "display_name": "",
                    "avatar": "",
                    "text": "",
                },
            },
            "misskey": {
                ...
            }
        }
    }
]
```


```
[
    {
        "address": "",
        "profile": {
            "url": "",
            "name": "",
            "avatar": "",
            "description": "",
            "primary_sns": {
                "service": "mastodon",
                "domain": "mstdn.jp",
                "id": "ユーザID",
            }
            "sns": [
                {
                    "service": "mastodon",
                    "domain": "mstdn.jp"
                    "id": "",
                    "username": "",
                    "display_name": "",
                    "avatar": "",
                    "text": "",
                },
                {
                    "service": "misskey",
                    "domain": "misskey.io"
                    "id": "",
                    "username": "",
                    "display_name": "",
                    "avatar": "",
                    "text": "",
                },
                 
            ]
        }
    }
]
```

```
[
    {
        "address": "",
        "profile": {
            "url": "",
            "name": "",
            "avatar": "",
            "description": "",
            "field": [
                {"key": "value"},
                {"key": "value"},
                {"key": "value"},
                {"key": "value"}
            ]
            "primary_sns": {
                "service": "mastodon",
                "domain": "mstdn.jp",
                "id": "ユーザID",
            }
            "mastodon": {
                "mstdn.jp": [
                    {
                        "id": "",
                        "username": "",
                        "name": "",
                        "avatar": "",
                        "description": "",
                        "field": [
                            {"key": "", "value": ""},
                            {"key": "", "value": ""},
                            {"key": "", "value": ""},
                            {"key": "", "value": ""}
                        ]
                    },
                ],
                "pawoo.net": [
                    ...
                ]
            },
            "misskey": {
                "misskey.io": [
                    ...
                ],
                "misskey.dev": [
                    ...
                ]
            }
        }
    }
]
```


　もしTSVのようなリレーションシップなDBに保存するなら、アドレスを一意の主キーにしつつ、プロフィールをJSONのテキスト形式で保存したい。そうなると最後の形式がよさそう。

```javascript
const datas = getDatas() // どうにかしてJSONデータを取得する
const i = datas.findindex(d=> d.address == 指定アドレス)
datas[i].profile // 指定アドレスのプロフィール情報
const profile = JSON.parse(datas[i].profile)
```


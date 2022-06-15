# GASでmpurseのアドレスとプロフィール情報をSpreadSheetに保存する

GASでmpurseのアドレスとプロフィール情報をSpreadSheetに保存する

　とりあえず実現できることはわかった。

<!-- more -->

# ブツ

* [mona-address-profile][]

[mona-address-profile]:https://docs.google.com/spreadsheets/d/1r3dS6Q6bm7RduRagrHzHbPlGXtvxCg63NE3TXZIVXFc/edit?usp=sharing

　スプレッドシートです。これ自体は私しか編集できず、皆さんは閲覧しかできないはずです。が、以下のようにAPIを使えば、JSONでデータを取得したり、自分のアドレスとプロフィールをセットできます。

## 取得

```sh
ID=AKfycbwsoKbgKwuMUCsLXeVGifX2j5bDHyld3R7vfa78Qx3hTEhPtqq43ZgEdbg3UDUvRD4g8A
URL="https://script.google.com/macros/s/${ID}/exec"
curl -L $URL
```

　すると以下のようにJSONが返ってきます。

```javascript
[{"address":"MEHCqJbgiNERCH3bRAtNSSD9uxPViEX1nu","profile":"{\"name\":\"ytyaru\",\"url\":\"https://ytyaru.github.io/\",\"avatar\":\"https://s3.arkjp.net/misskey/thumbnail-4820c61e-3194-48a6-b3a7-7d7319a67966.png\",\"mastodon\":{\"mstdn.jp\":[{\"id\":\"233143\",\"username\":\"ytyaru\"}]},\"misskey\":{\"misskey.io\":[{\"id\":\"918va5mxda\",\"username\":\"ytyaru\"}]}}","created":"2022-06-13T07:45:56.787Z","updated":"2022-06-13T08:03:55.738Z"}]
```

## セット

```sh
ID=AKfycbwsoKbgKwuMUCsLXeVGifX2j5bDHyld3R7vfa78Qx3hTEhPtqq43ZgEdbg3UDUvRD4g8A
URL="https://script.google.com/macros/s/${ID}/exec"
ADDRESS=MEHCqJbgiNERCH3bRAtNSSD9uxPViEX1nu
PROFILE='{\"name\":\"ytyaru\",\"url\":\"https://ytyaru.github.io/\",\"avatar\":\"https://s3.arkjp.net/misskey/thumbnail-4820c61e-3194-48a6-b3a7-7d7319a67966.png\",\"mastodon\":{\"mstdn.jp\":[{\"id\":\"233143\",\"username\":\"ytyaru\"}]},\"misskey\":{\"misskey.io\":[{\"id\":\"918va5mxda\",\"username\":\"ytyaru\"}]}}'
JSON='{"address":"'"$ADDRESS"'","profile":"'"$PROFILE"'"}'
curl -H 'Accept: application/json' \
     -H 'Content-Type: application/json' \
     -d "$JSON" \
     -L "$URL"
```

　mpurseアドレスが一意キーとなっています。もし同じアドレスがあれば上書きします。なので、勝手に他人のアドレスに紐づくプロフィール情報を書き換えることもできてしまいます。認証した本人だけ追加・更新可能にしたいのですが、どうすればいいかわかりません。

　ところで、これは書くのが面倒すぎます。

* クォーテーションがウザすぎる
* これ専用のJSON-schemaに従った形式で自動生成したい（エンドユーザにJSON形式のことを考えさせたくない）
* ユーザはただSNSの承認とmpurseの署名をするだけで登録できるようにしたい

　この課題については、いずれ専用ページを作ることで対応したいと思います。

# 技術の話

　これはGAS（Google Apps Script）で実装しました。GASによりGET/POSTを受け取り、Google Spread Sheetの値を返したり、受け取った値をシートに追記、編集したりします。

1. Google Drive へアクセスする
1. Google スプレッドシートを新規作成する
1. メニューの`拡張機能`→`Apps Script`をクリックする
1. Apps Script画面でコードを作成する（後述）
1. `デプロイ`→`新しいデプロイ`→アクセスできるユーザを`全員`にして`デプロイ`する

　なお、デプロイはコードを更新したらその都度やらないと反映されないので注意。

## GET

　スプレッドシートの値をJSONで返すコード。

```javascript
function doGet(e) {
  var ss        = SpreadsheetApp.getActiveSpreadsheet();
  var sheet     = ss.getSheetByName('list');
  var sheetData = sheet.getRange('A2:D' + sheet.getLastRow()).getValues();

  // データの成形
  var responseList = [];
  sheetData.map(function(d) {
    responseList.push({ address: d[0], profile: d[1], created: d[2], updated: d[3] });
  });

  // レスポンス
  var response = {
    data: responseList,
    meta: { status: 'success' }
  };
  //return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
  return ContentService.createTextOutput(JSON.stringify(responseList)).setMimeType(ContentService.MimeType.JSON);
}
```

## POST

　渡された値をスプレッドシートへ書き込むコード。

```javascript
function doPost(e) {
  var ss       = SpreadsheetApp.getActiveSpreadsheet();
  var sheet    = ss.getSheetByName('list');
  var PostData = JSON.parse(e.postData.contents);
  var addrs = sheet.getRange('A2:A' + sheet.getLastRow()).getValues();
  var targetIdRow = addrs.findIndex(addr=>addr[0]==PostData.address);
  var now = new Date().toISOString();
  if (0 <= targetIdRow) { // 一致するアドレスが既存なら上書きする
    targetIdRow += 2;
    sheet.getRange(targetIdRow, 2).setValue(PostData.profile);
    sheet.getRange(targetIdRow, 4).setValue(now);
  } else { // 一致するアドレスが未存なら新規追加する
    sheet.appendRow([PostData.address, PostData.profile, now, now]);
  }
}
```

　doPostのデバッグは以下のメソッドでできる。

```javascript
function doPostTest() {
  var e = {
    postData: {
      contents: {
        address: 'test-address-2',
        profile: 'test-profile',
        created: 'test-created',
        updated: 'test-created',
      }
    }
  };
  doPost(e);
}
```


　doPostのeの中身。

```
{"contentLength":333,"postData":{"contents":"{\"address\":\"MEHCqJbgiNERCH3bRAtNSSD9uxPViEX1nu\",\"profile\":\"{\"name\":\"ytyaru\",\"url\":\"https://ytyaru.github.io/\",\"avatar\":\"https://s3.arkjp.net/misskey/thumbnail-4820c61e-3194-48a6-b3a7-7d7319a67966.png\",\"mastodon\":{\"mstdn.jp\":[{\"id\":\"233143\", \"username\":\"ytyaru\"]}},\"misskey\":{\"misskey.io\":[{\"id\":\"918va5mxda\",\"username\":\"ytyaru\"}]}}\"}","length":333,"name":"postData","type":"application/json"},"contextPath":"","queryString":"","parameters":{},"parameter":{}}
```


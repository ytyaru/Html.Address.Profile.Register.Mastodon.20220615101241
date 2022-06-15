* https://misskey.m544.net/api-doc/#section/Permissions

Permissions
Permisson (kind)	Description	Endpoints
read:account	アカウントの情報を見る	i/reactions, user-filter/list, users/lists/list, users/lists/show, users/recommendation
write:account	アカウントの情報を変更する	i/clear-follow-request-notification, i/pin, i/read-all-messaging-messages, i/read-all-unread-notes, i/unpin, i/update, notes/watching/create, notes/watching/delete-all, notes/watching/delete, user-filter/update, users/lists/create, users/lists/delete, users/lists/pull-host, users/lists/pull, users/lists/push-host, users/lists/push, users/lists/update, usertags/add, usertags/remove
read:blocks	ブロックを見る	blocking/list
write:blocks	ブロックを操作する	blocking/create, blocking/delete
read:drive	ドライブを見る	drive, drive/files, drive/files/attached-notes, drive/files/check-existence, drive/files/find, drive/files/show, drive/folders, drive/folders/find, drive/folders/show, drive/stream
write:drive	ドライブを操作する	drive/files/create, drive/files/delete, drive/files/update, drive/files/upload-from-url, drive/folders/create, drive/folders/delete, drive/folders/update
read:favorites	お気に入りを見る	i/favorites
write:favorites	お気に入りを操作する	notes/favorites/create, notes/favorites/delete
read:following	フォローの情報を見る	following/requests/list
write:following	フォロー・フォロー解除する	following/create, following/delete, following/requests/accept, following/requests/cancel, following/requests/reject
read:messaging	チャットを見る	messaging/history, messaging/messages
write:messaging	チャットを操作する	messaging/messages/create, messaging/messages/delete, messaging/messages/read
read:mutes	ミュートを見る	mute/list
write:mutes	ミュートを操作する	mute/create, mute/delete
write:notes	ノートを作成・削除する	notes/create, notes/delete
read:notifications	通知を見る	i/notifications
write:notifications	通知を操作する	notifications/mark-all-as-read
write:reactions	リアクションを操作する	notes/reactions/create, notes/reactions/delete
write:votes	投票する	notes/polls/vote
read:pages	ページを見る	i/pages
write:pages	ページを操作する	pages/create, pages/delete, pages/update
write:page-likes	ページのいいねを操作する	pages/like, pages/unlike
read:page-likes	ページのいいねを見る	i/page-likes
unspecified	追加の権限は不要	active-users-count, aggregation/hashtags, ap/fetch-outbox, ap/interact, ap/show, app/create, app/show, auth/session/generate, auth/session/show, auth/session/userkey, charts/active-users, charts/drive, charts/federation, charts/hashtag, charts/instance, charts/network, charts/notes, charts/queue, charts/user/drive, charts/user/following, charts/user/notes, charts/user/reactions, charts/users, emojis, emojis/recommendation, endpoint, endpoints, federation/instances, federation/show-instance, games/reversi/games, games/reversi/games/show, games/reversi/games/surrender, games/reversi/invitations, games/reversi/match, games/reversi/match/cancel, hashtags/list, hashtags/search, hashtags/trend, hashtags/users, i, meta, my/apps, notes, notes/children, notes/conversation, notes/featured, notes/global-timeline, notes/hot-timeline, notes/hybrid-timeline, notes/local-timeline, notes/locao-timeline, notes/mentions, notes/polls/recommendation, notes/reactions, notes/reactions/ranking, notes/reactions/trend, notes/renotes, notes/replies, notes/search-by-tag, notes/search, notes/show, notes/state, notes/timeline, notes/user-list-timeline, pages/show, ping, request-reset-password, reset-password, room/show, room/update, stats, sw/register, username/available, users, users/followers, users/following, users/get-frequently-replied-users, users/notes, users/reaction-stats, users/relation, users/report-abuse, users/search, users/show, version, words/trend

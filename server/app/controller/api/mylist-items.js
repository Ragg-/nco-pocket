export default function* apiMyListItems(mylistId) {
    if (! this.nicoSession) {
        this.body = {
            success: false,
            reason: 'ログインしていません'
        };
        return;
    }


    try {
        let nicoSession = this.nicoSession.session;
        const handler = yield nicoSession.mylist.getHandlerFor(mylistId);
        this.body = {
            success: true,
            items: handler.items.map(item => item.get()),
        }
    } catch (e) {
        this.body = {success: false, reason: 'マイリストの取得に失敗しました。'};
        return;
    }
};

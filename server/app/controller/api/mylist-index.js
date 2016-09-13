export default function* apiMyListIndex() {
    if (! this.nicoSession) {
        this.body = {
            success: false,
            reason: 'ログインしていません'
        };
        return;
    }

    let nicoSession = this.nicoSession.session;

    try {
        const list = yield nicoSession.mylist.fetchOwnedListIndex();
        this.body = {
            success: true,
            list
        };
    } catch (e) {
        this.body = {success: false, reason: 'マイリストの取得に失敗しました。'};
        return;
    }
};

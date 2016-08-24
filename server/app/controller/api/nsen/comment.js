export default function* apiNsenComment() {
    if (! this.nicoSession) {
        this.body = {
            success: false,
            reason: 'ログインしていません'
        };
        return;
    }

    const {comment, anony} = this.request.fields;
    const channel = this.nicoSession.channel;

    try {
        let post = yield channel.postComment(comment, anony ? '184' : '');
        this.body = {success:true};
    } catch (e) {
        this.body = {
            success: false,
            reason: 'コメントの送信に失敗しました。',
        };
    }
}

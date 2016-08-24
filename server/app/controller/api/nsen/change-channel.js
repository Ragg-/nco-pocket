import NsenChannelToSocketConnector from '../../../utils/nsen-channel-to-socket-connector';

import NsenChannels from '../../../../../shared/NsenChannels';
const channelIds = Object.values(NsenChannels).map(channel => channel.id);

export default function* apiNsenChangeChannel()
{
    const nico = this.nicoSession;
    const {channel} = this.request.query;

    if (! nico || ! nico.socket) {
        this.body = {
            success: false,
            reason: 'ログインしていません',
        };
        return;
    }

    if (! channelIds.includes(channel)) {
        this.body = {
            success: false,
            reason: 'チャンネルIDが正しくありません。',
        };
        return;
    }

    if (nico.channel) {
        NsenChannelToSocketConnector.disconnect(nico.socket);
        nico.channel.dispose();
    }
    nico.channel = yield nico.session.live.getNsenChannelHandlerFor(channel, {
        connect: true,
        firstGetComments: 200,
    });
    NsenChannelToSocketConnector.connect(nico.socket, nico.channel);

    this.body = {
        success: true,
    };
}

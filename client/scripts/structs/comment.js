import * as _ from "lodash";
import deepFreeze from "deep-freeze";

const AccountTypes = deepFreeze({
    GENERAL: 0,
    PREMIUM: 1,
    DISTRIBUTOR: 3,
    ADMIN: 6
});

export {AccountTypes};

export default class CommentPayloadStruct
{
    static wrap(commentPayload)
    {
        return new CommentWrapper(commentPayload._attr);
    }

    constructor(_attr)
    {
        this._attr = _attr;
        Object.defineProperties(this, {
            command: {
                value: this.get("command")
            },
            comment: {
                value: this.get("comment")
            }
        });
    }

    get(path)
    {
        return _.deepGet(this._attr, path);
    }

    isNormalComment()
    {
        return !(this.isControlComment() && this.isPostByDistributor());
    }

    isControlComment()
    {
        const userId = this.get("user.id");
        const accountType = this.get("user.accountType");
        return (userid === 900000000) || (accountType === CommentWrapper.AccountTypes.ADMIN);
    }

    isPostByDistributor()
    {
        return this.get("user.accountType") === CommentWrapper.AccountTypes.DISTRIBUTOR;
    }

    isPostBySelf()
    {
        return this.get("isMyPost");
    }

    isPostByAnonymous()
    {
      return this.get("user.isAnonymous");
    }

    isPostByPremiumUser()
    {
        return this.get("user.isPremium");
    }
}

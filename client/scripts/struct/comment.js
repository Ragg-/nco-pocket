import * as _ from "lodash";

export const AccountTypes = {
    GENERAL: 0,
    PREMIUM: 1,
    DISTRIBUTOR: 3,
    ADMIN: 6
};

export default class Comment
{
    static fromJSON(comment)
    {
        return new Comment(comment);
    }

    constructor(_attr)
    {
        this._attr = _attr;
    }

    get(path)
    {
        return _.get(this._attr, path);
    }

    get comment()
    {
        return this.get('comment');
    }

    get command()
    {
        return this.get('command');
    }

    get isNormalComment()
    {
        return !(this.isControlComment() && this.isPostByDistributor());
    }

    get isControlComment()
    {
        const userId = this.get("user.id");
        const accountType = this.get("user.accountType");
        return (userid === 900000000) || (accountType === AccountTypes.ADMIN);
    }

    get isPostByDistributor()
    {
        return this.get("user.accountType") === AccountTypes.DISTRIBUTOR;
    }

    get isPostBySelf()
    {
        return this.get("isMyPost");
    }

    get isPostByAnonymous()
    {
      return this.get("user.isAnonymous");
    }

    get isPostByPremiumUser()
    {
        return this.get("user.isPremium");
    }
}

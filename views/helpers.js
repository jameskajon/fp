const helpers = {
    section: function(name, options) {
        if (!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
    },
};


module.exports.helpers = helpers;
var Components = function() {
    },
    parseName = function(component) {
        if (component.prototype && component.prototype.name) {
            return '-' + component.prototype.name;
        }
        if (component.name) {
            return component.name.replace(/([A-Z])/g, $1 => "-" + $1.toLowerCase());
        }
        return false;
    },
    jscInit = window.jscInit,
    jscAdd = window.jscAdd,
    components;

Components.prototype._CList = {};
Components.prototype._cList = {};
Components.prototype._cNamedList = {};

Components.prototype.init = function(name, id, parentId, options = {}, content = false) {
    var Component = this._CList[name],
        elId = '#jsc' + name + id,
        component;
    options.uId = options.uId || id;
    options.parentId = parentId;
    options.manager = this;
    // options.components is deprecated
    options.components = this;
    options.customContent = content ? content.replace(/^\s+|\s+$/g, "") : undefined;

    if (!Component) {
        return false
    }
    options.el = elId;
    options.name = name;
    component = new Component(options);
    this._cList[id] = component;
    this._cNamedList[name] = this._cNamedList[name] || [];

    return component;
};
Components.prototype.add = function(component) {
    var name = parseName(component),
        i;

    if (component instanceof Function && name) {
        this._CList[name] = component;
    } else if (component instanceof Array) {
        for (i = 0; i < component.length; i++){
           name = parseName(component[i]);
           if (component[i] instanceof Function && name) {
                this._CList[name] = component[i];
           }
        }
    }
};

if (!jscInit || !jscAdd) {
    components = new Components();
    jscInit = window.jscInit = function() {
        components.init.apply(components, arguments);
    }
    jscAdd = window.jscAdd = function() {
        components.add.apply(components, arguments);
    }
}

module.exports = jscAdd;

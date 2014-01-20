'use strict';

var Circle = require('./circle'),
    A = require('./a'),
    Text = require('./text'),
    ForeignObject = require('./foreignobject');

function SvgBuilder() {

    this.root = '<svg height="100" width="100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">';
    this.elements = [];

    function formatRoot(name, value) {
        var formatted = this.root,
            regexp = new RegExp(name + '([^=,]*)=("[^"]*"|[^,"]*)');
        return formatted.replace(regexp, name + '="' + value + '"');
    };

    this.closeTag = function closeTag(name) {
        return '</' + name + '>'
    };

    this.width = function width(value) {
        this.root = formatRoot.call(this, 'width', value);
        return this
    };

    this.height = function height(value) {
        this.root = formatRoot.call(this, 'height', value);
        return this
    };

    this.addElement = function addElement(element) {
        if (!element.content) {
            element.node += this.closeTag(element.name);
            this.elements.push(element.node);
        } else if (typeof element.content === 'string' && element.name === 'text') {
            element.node += element.content + this.closeTag(element.name);
            this.elements.push(element.node);
        } else if (typeof element.content === 'object') {
            var elements = this.elements.join('');
            this.elements = [];
            this.elements.unshift(element.node, elements);
            this.elements.push(this.closeTag(element.name))
        }
    };

};

SvgBuilder.prototype = {

    render: function render() {
        return this.root + this.elements.join('') + this.closeTag('svg');
    },

    a: function anchor(attrs, content) {
        this.addElement(new A(attrs, content));
        return this;
    },

    circle: function circle(attrs, content) {
        this.addElement(new Circle(attrs, content));
        return this;
    },

    text: function link(attrs, content) {
        this.addElement(new Text(attrs, content));
        return this;
    },

    foreignObject: function (attrs, content) {
        this.addElement(new ForeignObject(attrs, content));
        return this;
    }

};

module.exports = new SvgBuilder();

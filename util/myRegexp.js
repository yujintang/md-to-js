"use strict";

module.exports = {
    crud: /(?:\/([^\/^\?]+)[^\/]*$)/,
    mock: /(?:\/([^\/]+\/[^\/^\?]+)[^\/]*$)/,
    must: /^(t|是|y)/i
};
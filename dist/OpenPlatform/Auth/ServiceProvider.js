'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const VerifyTicket_1 = require("./VerifyTicket");
const AccessToken_1 = require("./AccessToken");
const BaseServiceProvider_1 = require("../../Core/BaseServiceProvider");
class ServiceProvider extends BaseServiceProvider_1.default {
    static register(app) {
        app['verify_ticket'] = new VerifyTicket_1.default(app);
        app['access_token'] = new AccessToken_1.default(app);
    }
}
exports.default = ServiceProvider;
;

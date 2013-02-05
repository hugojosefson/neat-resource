(function (angular) {

    var module = angular.module("neat-resource", ["DeferredWithUpdate"]);

    module.factory("NeatResource", function ($http, DeferredWithUpdate) {
        var parseData = function (data, status, headers, config) {
            return data;
        };
        var NeatResource = function (options) {
            var self = this;

            // defaults
            this.parseData = parseData;
            this.deferred = DeferredWithUpdate.defer();

            // apply supplied options
            angular.extend(this, options);

            // check / set up promise
            this.promise || (this.promise = this.deferred.promise);

            // check / set up urlPromise
            if (!this.urlPromise) {
                if (this.url) {
                    var urlDeferred = DeferredWithUpdate.defer();
                    this.urlPromise = urlDeferred.promise;
                    urlDeferred.resolve(this.url);
                } else {
                    this.deferred.reject("urlPromise or url must be supplied.")
                }
            }
            var receivedNoUrl = function () {
                self.url = null;
                self.data = null;
                self.status = null;
                self.headers = null;
                self.deferred.reject("No url available.");
            };
            var receivedUrl = function (url) {
                if (url) {
                    if (url === self.url) {
                        // ignore, because there was no change
                    } else {
                        self.url = url;
                        if (self.lastAction === 'get') {
                            self.get();
                        }
                    }
                } else {
                    receivedNoUrl();
                }
            };
            this.urlPromise.then(receivedUrl, receivedNoUrl);
            this.urlPromise.update(receivedUrl);
            this.urlPromise.mistake(receivedNoUrl);
        };

        NeatResource.prototype.get = function () {
            var self = this;
            this.lastAction = 'get';
            if (self.url) {
                $http({
                    method: 'GET',
                    url: self.url
                }).
                    success(function (data, status, headers, config) {
                        self.data = self.parseData(data, status, headers, config);
                        self.status = status;
                        self.headers = headers;
                        self.deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        self.data = self.parseData(data, status, headers, config);
                        self.status = status;
                        self.headers = headers;
                        self.deferred.reject(data);
                    });
            }
        };

        return NeatResource;
    });


})(angular);
(function (angular) {

    var module = angular.module("providers", ["neat-resource", "DeferredWithUpdate"]);

    module.factory("ORGANIZATION", function (NeatResource) {
        var ORGANIZATION = new NeatResource({url: "/src/example/api/organization.json"});
        ORGANIZATION.get();
        return ORGANIZATION;
    });

    module.factory("PROVIDERS", function (NeatResource, $parse, DeferredWithUpdate, ORGANIZATION) {
        var deferred = DeferredWithUpdate.defer();
        var rejectUrl = function () {
            deferred.reject();
        };
        var checkForUrl = function (org) {
            var providersUrl = $parse("_links.providers.href")(org);
            if (providersUrl) {
                deferred.resolve(providersUrl);
            } else {
                rejectUrl();
            }
        };
        ORGANIZATION.promise.then(checkForUrl, rejectUrl);
        ORGANIZATION.promise.update(checkForUrl);
        ORGANIZATION.promise.mistake(rejectUrl);
        var PROVIDERS = new NeatResource({urlPromise: deferred.promise});
        PROVIDERS.get();
        return PROVIDERS;
    });

    module.controller("ProvidersController", function ($scope, PROVIDERS, ORGANIZATION) {
        $scope.ORGANIZATION = ORGANIZATION;
        $scope.PROVIDERS = PROVIDERS;
        $scope.reloadOrganization = function () {
            ORGANIZATION.get();
        };
    })

})(angular);
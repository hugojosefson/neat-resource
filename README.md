# Neat Resource for AngularJS

Class / Service setup something like [recommended-way-of-getting-data-from-the-server].

* Expose actions (`get`, `post`, `put`, `delete`) as functions on `.prototype`.
* Expose data in `.data`.
* Keep one internal `deferred` which relates to `.data` having something available, and is resolved to `.data`.
  * It can be re-resolved, like [DeferredWithUpdate].
* Expose `deferred`'s promise as `.promise`.
* Return `.promise` from all actions.

* Require an `urlPromise` which resolves to an url.
  * The `urlPromise` can come from a `DeferredWithUpdate`.
  * Updates in `urlPromise` which `null` out the url, and rejections which trigger `mistake`, are treated such that `.data` is cleared and `.promise` is rejected.
  * Updates in `urlPromise` which change the url, trigger a `get` if a `get` was the last action performed.
  * Updates in `urlPromise` which don't change the url, are ignored.
    * *Or are they? Could this be a good way of triggering refreshes?*
  * Alternatively, an `url` string can be supplied in place of `urlPromise`, considering it perpetually resolved to that string.

* Allow a `parseData` function to be supplied, like in [Backbone Model].

Perhaps:
* Parse HTML data from server into JSON.
1. First, decide a protocol which can be expressed in JSON.
2. Then, decide an HTML structure to represent that specific structure, and write an HTML2JSON converter for that.

  [recommended-way-of-getting-data-from-the-server]: http://stackoverflow.com/questions/11850025/recommended-way-of-getting-data-from-the-server#answer-11850027
  [DeferredWithUpdate]: http://www.bennadel.com/blog/2431-Resolving-An-AngularJS-Deferred-Object-Twice-With-DeferredWithUpdate-js.htm#primary-content-container
  [Backbone Model]: http://documentcloud.github.com/backbone/docs/backbone.html#section-65


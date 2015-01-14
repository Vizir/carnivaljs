angular.module('carnival')
.provider('loadingBar', function () {
  return {

    latency: 100,
    size:    0.02,
    parent:  'body',

    template: '<div id="loading-bar">' +
                '<div class="bar">' +
                  '<div class="peg"></div>' +
                '</div>' +
              '</div>',

    $get: function ($injector, $document, $timeout, $rootScope) {

      var $animate;

      var $parentSelector    = this.parent,
          loadingBarTemplate = angular.element(this.template),
          loadingBar         = loadingBarTemplate.find('div').eq(0);

      var incTimeout,
          completeTimeout,
          started = false,
          status  = 0;

      var size = this.size;

      function start() {
        if (!$animate) $animate = $injector.get('$animate');
        var $parent = $document.find($parentSelector).eq(0);
        $timeout.cancel(completeTimeout);
        if (started) return;
        $rootScope.$broadcast('loadingbar.started');
        started = true;
        $animate.enter(loadingBarTemplate, $parent);
        set(size);
      }

      function set(size) {
        if (!started) return;
        var percent = (size * 100) + '%';
        loadingBar.css('width', percent);
        status = size;
        $timeout.cancel(incTimeout);
        incTimeout = $timeout(function () {
          inc();
        }, 200);
      }

      function inc() {
        if (status >= 1) return;
        var rnd = 0;
        if (status >= 0 && status < 0.25) {
          rnd = (Math.random() * (5 - 3 + 1) + 3) / 100;
        } else if (status >= 0.25 && status < 0.65) {
          rnd = (Math.random() * 3) / 100;
        } else if (status >= 0.65 && status < 0.9) {
          rnd = (Math.random() * 2) / 100;
        } else if (status >= 0.9 && status < 0.99) {
          rnd = 0.005;
        } else {
          rnd = 0;
        }
        var pct = status + rnd;
        set(pct);
      }

      function completeAnimation() {
        status  = 0;
        started = false;
      }

      function complete() {
        if (!$animate) $animate = $injector.get('$animate');
        $rootScope.$broadcast('loadingBar.completed');
        set(1);
        $timeout.cancel(completeTimeout);
        completeTimeout = $timeout(function() {
          var promise = $animate.leave(loadingBarTemplate, completeAnimation);
          if (promise && promise.then) {
            promise.then(completeAnimation);
          }
        }, 500);
      }

      return {
        start    : start,
        set      : set,
        status   : status,
        inc      : inc,
        complete : complete,
        latency  : this.latency
      };

    }

  };
});

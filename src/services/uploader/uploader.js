angular.module('carnival')
.service('Uploader', function ($http, Configuration) {

  var upload = function (requestUrl, file) {
    var formData = new FormData();
    formData.append('file', file);
    return $http.post(requestUrl, formData, {
      transformRequest: angular.identity,
      headers: { 'Content-Type': undefined }
    });
  };

  return {
    upload: upload
  };

});

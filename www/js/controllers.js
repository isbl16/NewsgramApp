angular.module('starter.controllers', [])

.controller('HomeCtrl', ['$scope', '$state', '$ionicViewSwitcher', '$ionicModal', '$http', '$rootScope',
    function($scope, $state, $ionicViewSwitcher, $ionicModal, $http, $rootScope) {
        $scope.subTab = 0;
        $scope.subTabStr = 'today';
        $scope.subTabId = '#subtab-' + $scope.subTabStr;
        angular.element($($scope.subTabId)).css('background-color', '#ffffff');
        $scope.goTo = function(page){
            $state.go('tab.' + page);
        };
        $scope.goToSubTab = function(subTab) {
            angular.element($($scope.subTabId)).css('background-color', '#d9d9d9');
            if (subTab == 0) {
                angular.element($('#select-menu')).css('background-color', '#e4e4e4');
            }
            $scope.subTab = subTab;
            switch (subTab) {
                case 0:
                    $scope.subTabStr = 'today';
                    break;
                case 1:
                    $scope.subTabStr = 'week';
                    angular.element($('#select-menu')).css('background-color', '#ffffff');
                    break;
                default:
                    $scope.subTabStr = 'month';
                    break;
            }
            $scope.subTabId = '#subtab-' + $scope.subTabStr;
            angular.element($($scope.subTabId)).css('background-color', '#ffffff');
        };
        
        $http.get('js/data.json').success(function(data) {
            $scope.userPosts = data;
            $rootScope.userPosts = data;
            $scope.userPostsToday = data[0].timeframeData;
            $scope.userPostsWeek = data[1].timeframeData;
            $scope.userPostsMonth = data[2].timeframeData;
        });
    
        $ionicModal.fromTemplateUrl('templates/imageView.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;  
        });
        
        $scope.openModal = function(postId) {
            $scope.timeframe = parseInt(postId[0]);
            $scope.post = parseInt(postId[1]);
            $scope.modal.show();   
        }
        $scope.closeModal = function() {
             $scope.modal.hide();
        }

        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });

        $scope.times = [
         { time: 'day', name: 'Past day' },
         { time: 'week', name: 'Past week' },
         { time: 'month', name: 'Past month' }
        ];
        
        $scope.selectedTime = $scope.times[0];

}])

.controller('CameraCtrl', ['$scope', 'Camera', function($scope, Camera) {
      $scope.getPhoto = function() {
        Camera.getPicture().then(function(imageURI) {
            console.log(imageURI);
        }, function(err) {
            console.err(err);
        });
      }
      $scope.$on('$ionicView.enter', function(){
        $scope.getPhoto();
      });
}])

.controller('ImageViewCtrl', ['$scope', '$state', '$rootScope', function($scope, $state, $rootScope) {
    $scope.goToLocation = function(timeframe, post) {
        $rootScope.indLoc = true;
        $rootScope.timeframe = timeframe;
        $rootScope.post = post;
        $rootScope.currLat = $rootScope.userPosts[$rootScope.timeframe].timeframeData[$rootScope.post].locLat;
        $rootScope.currLng = $rootScope.userPosts[$rootScope.timeframe].timeframeData[$rootScope.post].locLng;
        $state.go('tab.search');
    };  
}])

.controller('SettingsCtrl', function($scope) {
  $scope.settings = {
    enableAwesomeness: true
  };
})



//map controller
.controller('MapController', ['$scope', '$http', '$ionicLoading', '$ionicModal', '$rootScope', 
                              function($scope, $http, $ionicLoading, $ionicModal, $rootScope) {

        $http.get('js/data.json').success(function(data) {
            $scope.userPosts = data;
            $scope.userPostsToday = data[0].timeframeData;
            $scope.userPostsWeek = data[1].timeframeData;
            $scope.userPostsMonth = data[2].timeframeData;
        });
    
        $ionicModal.fromTemplateUrl('templates/imageView.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function(modal) {
                    $scope.modal = modal;  
                });
        
        $scope.openModal = function(postId) {
            $scope.timeframe = parseInt(postId[0]);
            $scope.post = parseInt(postId[1]);
            $scope.modal.show();   
        }
        $scope.closeModal = function() {
             $scope.modal.hide();
        }

        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
//        
//
//
//        
//         var myLatlng = new google.maps.LatLng(-27.498978, 153.010670);
//
//            var mapOptions = {
//                center: myLatlng,
//                zoom: 13,
//                mapTypeId: google.maps.MapTypeId.ROADMAP
//            };
//
//            var map = new google.maps.Map(document.getElementById("map"), mapOptions);
//                var image = {
//                    url: 'http://codetorecovery.com/wp-content/uploads/2015/03/google_maps_marker.png',
//                    scaledSize: new google.maps.Size(40, 40),
//                };
//                var myLocation = new google.maps.Marker({
//                    position: myLatlng,
//                    map: map,
//                    title: "My Location",
//                    icon: image
//                });
//
//            google.maps.event.addListener(myLocation, 'click', function() {
//                $scope.openModal('00');
//
//            });
//
//            $scope.map = map;    
                    
        $scope.$on('$ionicView.enter', function(){    
            if ($rootScope.indLoc == true) {
                var myLatlng = new google.maps.LatLng($rootScope.currLat, $rootScope.currLng);
                var mapOptions = {
                    center: myLatlng,
                    zoom: 13,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                var map = new google.maps.Map(document.getElementById("map"), mapOptions);
                var image = {
                    url: 'http://codetorecovery.com/wp-content/uploads/2015/03/google_maps_marker.png',
                    scaledSize: new google.maps.Size(40, 40),
                };
                var myLocation = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    title: "My Location",
                    icon: image
                });
                google.maps.event.addListener(myLocation, 'click', function() {
                    $scope.openModal($rootScope.timeframe + '' + $rootScope.post);
                });
                $scope.map = map;
            } else {
                var myLatlng = new google.maps.LatLng(-27.486860, 153.010955);
                var mapOptions = {
                    center: myLatlng,
                    zoom: 13,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                var map = new google.maps.Map(document.getElementById("map"), mapOptions);
                var image = {
                    url: 'http://codetorecovery.com/wp-content/uploads/2015/03/google_maps_marker.png',
                    scaledSize: new google.maps.Size(40, 40),
                };
                var post00 = new google.maps.Marker({
                    position: new google.maps.LatLng(-27.483946, 152.994982),
                    map: map,
                    title: "My Location",
                    icon: image
                });
                var post01 = new google.maps.Marker({
                    position: new google.maps.LatLng(-27.497073, 153.014972),
                    map: map,
                    title: "My Location",
                    icon: image
                });
                var post10 = new google.maps.Marker({
                    position: new google.maps.LatLng(-27.495329, 153.007223),
                    map: map,
                    title: "My Location",
                    icon: image
                });
                var post11 = new google.maps.Marker({
                    position: new google.maps.LatLng(-27.468689, 153.011218),
                    map: map,
                    title: "My Location",
                    icon: image
                });
                var post12 = new google.maps.Marker({
                    position: new google.maps.LatLng(-27.508031, 153.015203),
                    map: map,
                    title: "My Location",
                    icon: image
                });
                var post13 = new google.maps.Marker({
                    position: new google.maps.LatLng(-27.497853, 153.013804),
                    map: map,
                    title: "My Location",
                    icon: image
                });
                 var post14 = new google.maps.Marker({
                    position: new google.maps.LatLng(-27.495329, 153.007223),
                    map: map,
                    title: "My Location",
                    icon: image
                });
                var post15 = new google.maps.Marker({
                    position: new google.maps.LatLng(-27.479222, 153.012525),
                    map: map,
                    title: "My Location",
                    icon: image
                });
                var post20 = new google.maps.Marker({
                    position: new google.maps.LatLng(-27.478682, 153.016367),
                    map: map,
                    title: "My Location",
                    icon: image
                });
    
                $scope.markers = [post00, post01, post10, post11, post12, post13, post14, post15, post20];
                $scope.search = {"term" : ""};
                $scope.inputLength = 0;
                $scope.setInvisible = function(keyCode) {
                    if (keyCode != 8) {
                        $scope.inputLength++;
                    } else {
                        if ($scope.inputLength != 0) {
                            $scope.inputLength--;   
                        }
                    }
                    for (var i = 0; i < $scope.markers.length; i++) {
                        $scope.markers[i].setVisible(false);   
                    }
                    if ($scope.inputLength == 0) {
                        for (var i = 0; i < $scope.markers.length; i++) {
                            $scope.markers[i].setVisible(true);   
                        }
                    }
                    if (keyCode == 13) {
                        $scope.inputLength = 0;
                        var count = 0;
                        for (var tf = 0; tf < 3; tf++) {
                            for (var p = 0; p < $rootScope.userPosts[tf].timeframeData.length; p++) {
                                if (
                                    (angular.lowercase($rootScope.userPosts[tf].timeframeData[p].postTitle).indexOf(angular.lowercase($scope.search.term)) != -1) ||
                                    (angular.lowercase($rootScope.userPosts[tf].timeframeData[p].postDescription).indexOf(angular.lowercase($scope.search.term)) != -1) ||
(angular.lowercase($rootScope.userPosts[tf].timeframeData[p].location).indexOf(angular.lowercase($scope.search.term)) != -1) ) 
                                    {
                                        $scope.markers[count].setVisible(true);
                                    }
                                count++;
                            }
                        }
                        $scope.search.term = '';
                    }

                };
                google.maps.event.addListener(post00, 'click', function() {
                    $scope.openModal('00');
                });
                google.maps.event.addListener(post01, 'click', function() {
                    $scope.openModal('01');
                });
                google.maps.event.addListener(post10, 'click', function() {
                    $scope.openModal('10');
                });
                google.maps.event.addListener(post11, 'click', function() {
                    $scope.openModal('11');
                });
                google.maps.event.addListener(post12, 'click', function() {
                    $scope.openModal('12');
                });
                google.maps.event.addListener(post13, 'click', function() {
                    $scope.openModal('13');
                });
                google.maps.event.addListener(post14, 'click', function() {
                    $scope.openModal('14');
                });
                google.maps.event.addListener(post15, 'click', function() {
                    $scope.openModal('15');
                });
                google.maps.event.addListener(post20, 'click', function() {
                    $scope.openModal('20');
                });
                $scope.map = map;
            }
        });
        $scope.$on('$ionicView.leave', function(){
            $rootScope.indLoc = false;
        });
                                  
}]);

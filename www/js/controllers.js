angular.module('starter.controllers', [])

.controller('HomeCtrl', ['$scope', '$state', '$ionicViewSwitcher', '$ionicModal', '$http',
    function($scope, $state, $ionicViewSwitcher, $ionicModal, $http) {
    $scope.subTab = 0;
    $scope.subTabStr = 'today';
    $scope.subTabId = '#subtab-' + $scope.subTabStr;
    angular.element($($scope.subTabId)).css('background-color', '#ffffff');
    $scope.goTo = function(page){
        $state.go('tab.' + page);
    };
    $scope.goToSubTab = function(subTab) {
        angular.element($($scope.subTabId)).css('background-color', '#d9d9d9');
        $scope.subTab = subTab;
        switch (subTab) {
            case 0:
                $scope.subTabStr = 'today';
                break;
            case 1:
                $scope.subTabStr = 'week';
                break;
            default:
                $scope.subTabStr = 'month';
                break;
        }
        $scope.subTabId = '#subtab-' + $scope.subTabStr;
        angular.element($($scope.subTabId)).css('background-color', '#ffffff');
    };
        
    // Retrieve data from json file, rather than hard-coding all the details
    $http.get('js/data.json').success(function(data){
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
        $scope.currentPost = parseInt(postId);
        $scope.modal.show();
    }

    $scope.closeModal = function() {
         $scope.modal.hide();
    }
    
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });

//  $ionicModal.fromTemplateUrl('templates/imageView2.html', {
//        scope: $scope,
//        animation: 'slide-in-up'
//    }).then(function(modal) {
//        $scope.modal2 = modal;
//    });
//    
//  $ionicModal.fromTemplateUrl('templates/imageView3.html', {
//        scope: $scope,
//        animation: 'slide-in-up'
//    }).then(function(modal) {
//        $scope.modal3 = modal;
//    });
//    
//  $ionicModal.fromTemplateUrl('templates/imageView4.html', {
//        scope: $scope,
//        animation: 'slide-in-up'
//    }).then(function(modal) {
//        $scope.modal4 = modal;
//    });
//    
//  $ionicModal.fromTemplateUrl('templates/imageView5.html', {
//        scope: $scope,
//        animation: 'slide-in-up'
//    }).then(function(modal) {
//        $scope.modal5 = modal;
//    });

//      $scope.openModal = function(index) {
//          switch (index) {
//              case 1:
//                  $scope.modal1.show();
//                  break;
//              case 2:
//                  $scope.modal2.show();
//                  break;
//              case 3:
//                  $scope.modal3.show();
//                  break;
//              case 4:
//                  $scope.modal4.show();
//                  break;
//              default:
//                  $scope.modal5.show();
//          }
//      }


}])

.controller('CameraCtrl', function($scope) {
})

.controller('ProfileCtrl', function($scope) {
})

.controller('SettingsCtrl', function($scope) {
  $scope.settings = {
    enableAwesomeness: true
  };
})

//map controller
.controller('MapController', function($scope, $ionicLoading) {
 
        var myLatlng = new google.maps.LatLng(37.3000, -120.4833);
 
        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
 
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
 
        navigator.geolocation.getCurrentPosition(function(pos) {
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            console.log(pos.coords.latitude);
            console.log(pos.coords.longitude);
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                title: "My Location"
            });
        });
 
        $scope.map = map;
     
});

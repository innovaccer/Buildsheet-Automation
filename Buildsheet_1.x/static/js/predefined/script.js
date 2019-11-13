'use strict';

var buildSheetApp = angular.module('buildSheetApp', ['ngMaterial']);
buildSheetApp.config(function ($mdIconProvider, $mdThemingProvider) {
    $mdIconProvider.iconSet("call", 'img/icons/sets/communication-icons.svg', 24);
    $mdThemingProvider.theme('default');//.dark();
})
buildSheetApp.controller('BuildSheetCtrl', BuildSheetCtrl); 

function BuildSheetCtrl($scope) {
    
    $scope.menuItems = ["Menu 1", "Menu 2", "Menu 3"];
    $scope.selectedTab = 1;
    $scope.currentNavItem = 'page1';
    
    $scope.goto = function(tab) {
        $scope.selectedTab = tab;
    };

    $scope.onClick = function onClick(item) {
        $log.log(item);
    };
};
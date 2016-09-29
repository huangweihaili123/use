var app = angular.module('RDash');
app.register.controller("userCtrl", function ($scope, $http, $location, $uibModal, $cookieStore, baseUrl, $rootScope,url_junction,listService,params) {
	var urlBase = baseUrl.getUrl();
	$scope.choice = {};
	$scope.role = "-1";
    $scope.status = "";
    $scope.username = "";
	$scope.dataList = {};
	$scope.index = 1;
	$scope.number = 8;
    $scope.maxSize = 5;
    $scope.numbers = [8,16,24,32,40];
    $scope.roleList = [{key:0,value:"仓库主管"},{key:1,value:"仓库管理员"},{key:2,value:"仓库盒子"},{key:3,value:"云仓系统"},{key:4,value:"其它"},{key:-1,value:"--请选择-"}];
    $scope.statusList = [{key:true,value:"激活"},{key:false,value:"未激活"},{key:-1,value:"--请选择-"}];
    //$scope.listLoadFlag = 1;

    $scope.open = function (size, method,index){
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            controller: 'ModalUser',
            templateUrl: "myModalContent.html",
            size: size,
            resolve: {
                items: function () {
                    if(method=="delete"){
                        return {
                            title:"删除用户",
                            method:"delete",
                            data:$scope.dataList[index],
                            scope:$scope
                        }
                    }else if(method=="add"){
                        return {
                            title:"新增用户",
                            method:"add",
                            //status_disable:true,
                            //choice:$scope.choice,
                            scope:$scope
                        }
                    }else{
                        return {
                            title:"修改用户",
                            method:"modify",
                           	//status_disable:false,
                            data:$scope.dataList[index],
                            //choice:$scope.choice,
                            scope:$scope
                        }
                    }
                }
            }
        });
        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function(){});
    };

    $scope.order={
        id:false,
        user_role_type:false,
        is_active:false,
        date_joined:false
    };

    $scope.roleSel = function(data){
    	$scope.role = data.key;
    }
    $scope.statusSel = function(data){
    	$scope.status = data.key;
    }
    $scope.switch_order = function(key){
        $scope.order[key] = !$scope.order[key];
        $scope.submit_search()
    };
    $scope.setShowNum = function(data){
      $scope.number = data;
      $scope.index = 1;
      $scope.submit_search();
    }
    $scope.setPage = function (pageNo) {
        $scope.submit_search();
    };
    $scope.changePage = function(a){
        $scope.submit_search()
    };
    $scope.submit_search = function(){
    	/*listService.init($scope,'/api/1/user/');
    	if($scope.func_type && $scope.func_type != -1)
    		$scope.params.func_type = $scope.func_type;
    	if($scope.status && $scope.status != -1)
    		$scope.params.status = $scope.status;
    	if($scope.description)
    		$scope.params.description = $scope.description;
    	if($scope.serial_number)
    		$scope.params.serial_number = $scope.serial_number;
    	$scope.params.index = $scope.index;
    	$scope.params.number = $scope.number;
    	$scope.refresh();*/
        var order_str = "";
      for(var i in $scope.order){
        if($scope.order[i]){
          if(order_str){
            order_str += ','+i
          }else{
            order_str += i;
          }
        }
      };

      if($scope.status == true)
        $scope.status = 1;
       else if($scope.status == false) 
        $scope.status = 0;

      var query_url = url_junction.getQuery({
      user_role_type:$scope.role,
      //is_active:$scope.status,
      username:$scope.username,
      descent:order_str,
      number:$scope.number,
      index:$scope.index,
    });

      $http.get(urlBase+"/api/1/user/"+ query_url).success(function(data){
      if(data.code==200){
        $scope.dataList = data.data;
        $scope.bigTotalItems = data.pageinfo.total_number;
        $scope.total_page = data.pageinfo.total_page;
        $scope.currentPageDataNum = data.data.length;
        if($scope.currentPageDataNum == 0)
          $scope.emptyDataListShow = "emptyDataListShow";
        else{
          $scope.emptyDataListShow = "";
        }
      }else{
        alert(data.message)
      }
    }).error(function(data,state){
      if(state == 403){
        baseUrl.redirect()
      }
    })


    };

    $scope.submit_search();	

})
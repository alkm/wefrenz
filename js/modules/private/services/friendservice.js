define(['app'], function (app) {
    app.register.factory('SetFriendOperation', function($http) {
        return {
            getProfileInfo : function(profileID) {
                return $http.post('/api/getProfileInfo/', profileID);
            },
            setFriendInfo : function(friendInfo) {
                return $http.post('/api/setFriendInfo/', friendInfo);
            },
            getFriendInfo : function(friendInfo) {
                console.log(friendInfo);
                return $http.post('/api/getFriendInfo/', friendInfo);
            },
            getFriendReq : function(userid) {
                return $http.post('/api/getFriendReq/', userid);
            },
            getAllFriendReq : function(userid) {
                return $http.post('/api/getAllFriendReq/', userid);
            },
            getRequestDetails : function(reqArr) {
                return $http.post('/api/getRequestDetails/', reqArr);
            },
            confirmFriendReq : function(reqInfo){
                return $http.post('/api/confirmFriendReq/', reqInfo);
            },
            blockFriend : function(reqInfo){
                return $http.post('/api/blockFriend/', reqInfo);
            },
            unFriend : function(reqInfo){
                return $http.post('/api/unFriend/', reqInfo);
            },
            getAllConfirmedFriends : function(profileid){
                return $http.post('/api/getAllConfirmedFriends/', profileid);
            },
            getFriendsSuggestion : function(profileid){
                return $http.post('/api/getFriendsSuggestion/', profileid);
            },
            getAllConfirmedFriendsDetails : function(reqidarr){
                return $http.post('/api/getAllConfirmedFriendsDetails/', reqidarr);
            },
            getAllRandomFriendsDetails : function(reqidarr){
                return $http.post('/api/getAllRandomFriendsDetails/', reqidarr);
            },
            
            getAllOnLineFriendsDetails : function(reqidarr){
                return $http.post('/api/getAllOnLineFriendsDetails/', reqidarr);
            }
        }
    });

    app.register.factory('SetChatOperation', function($http) {
        return {
            getChatBuddyList: function(userID) {
                return $http.post('/api/getChatBuddyList/', userID);
            }
        }
    });
});
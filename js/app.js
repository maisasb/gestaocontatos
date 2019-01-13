var app = angular.module('app',['ui.mask']);

/*
 * Directive for brasilian phone mask
 */
app.directive('maskChange', function() {
    return {
        restrict: 'A',
        scope: {
            maskChange: "=",
        },
        require: '?ngModel',
        link: function(scope, elem, attrs, ngModel) {

            var novoTel, flag = false, val;

            elem.off('keyup');
            elem.on('keyup', function(ev) {

                if (/^\d+$/.test(ev.key) || ev.key == 'Backspace' || ev.key == 'Delete') {

                    novoTel = String(ngModel.$viewValue).replace(/[\(\)\_\-/\s]/g, '')

                    if (novoTel.length == 10 && !flag) {
                        flag = true;
                        scope.maskChange = "(99) 9999-9999";
                        scope.$apply();
                    } else if (novoTel.length == 10 && flag) {
                        flag = false;
                        scope.maskChange = "(99) 9?9999-9999";

                        scope.$apply();
                        ngModel.$viewValue += ev.key
                        ngModel.$render();

                    } else if (novoTel.length < 10) {
                        flag = false;
                    }
                }
            })
        }

    };
})

/*
 * Service to save the list of contacts
 */
app.factory('Contacts', function ($rootScope) {
    var contacts = [];
    var showAddForm = false;
 
    return {
        add: function (contact) {
            contacts.push(angular.copy(contact));
        },
        get: function () {
            return contacts;
        },
        hasEmail: function(em){
        	
        	if (contacts.find(
        	function (contact){
        		return contact.email === em;
        	}) != null){
        		return 0;
        	}else{
        		return -1;
        	}
        	
        },
        hasPhone: function(tel){
            var found = contacts.find(function(contact){
                return contact.phones.find(function(phone){
                    return phone.number === tel;
                })
            });
            if (found != null){
                return 0;
            }else{
                return -1;
            }
        },
        setShowAddForm: function(value){
            showAddForm = value;
            $rootScope.$broadcast('changeState',showAddForm);
        },
        getShowAddForm: function(value){
            return showAddForm;
        }, 
        removeContact: function(index){            
            contacts.splice(index, 1);
        }
    };
});



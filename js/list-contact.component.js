angular.module('app').component('listContact', {
	  
	templateUrl: './list-contact.html',

	controller: ListContactController,

});

function ListContactController ($scope, Contacts, $location, $anchorScroll){

	$scope.contacts = [];

	$scope.contacts = Contacts.get();

	$scope.showAddForm = function(){
		Contacts.setShowAddForm(true);
		$location.hash('form');
		$anchorScroll();
	}

	$scope.removeContact = function(index){
		Contacts.removeContact(index);		
	}

}
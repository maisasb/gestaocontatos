angular.module('app').component('createContact', {
	  
	templateUrl: './create-contact.html',

	controller: CreateContactController

});
  
  
function CreateContactController ($scope, $http, $rootScope, Contacts, $location, $anchorScroll){


	$scope.contato = getContato();	

	$scope.address = {
		cep: "",
		bairro: "",
		cidade: "",
		uf: "",
		numero: "",
		logradouro: ""
	}

	$scope.showAddForm = Contacts.getShowAddForm();
	$scope.$on('changeState', function(event,data) {
		$scope.showAddForm = Contacts.getShowAddForm();
	});

	$scope.messages = {
		phone: "",
		cep: "",
		cidade: "",
		email: ""
	}

	$scope.phoneMask = "(99) 9999-9999";

	$scope.hideForm = function(){
		$scope.clearForm();
	}
		
	$scope.addPhone = function(){

		if ($scope.contato.phones.find(phone => phone.number === $scope.phone.number) != null){			
			$scope.messages.phone ="Número já adicionado";
		}else if (Contacts.hasPhone($scope.phone.number) == 0){
			$scope.messages.phone ="Outro contato já foi cadastrado com este número";
		}else if ($scope.phone.number != ""){

			$scope.contato.phones.push($scope.phone);
			$scope.phone = {
				number : ""
			}
			$scope.messages.phone = "";
		}

	 }

	 $scope.removePhone = function(value){
	 	
	 	var index = $scope.contato.phones.findIndex(phone => phone.number ===  value.number);
        $scope.contato.phones.splice(index, 1);

	 }
	 
	$scope.addAddress = function(){
		  
		if ($scope.validateAddress()){

			$scope.contato.addresses.push(angular.copy($scope.address));

			$scope.address = {
				cep: "",
				bairro: "",
				cidade: "",
				uf: "",
				numero: "",
				logradouro: ""
			}

		}
		  
	 }

	 $scope.removeAddress = function(value){
	 	
	 	var index = $scope.contato.addresses.findIndex(address => address.cep ===  value.cep);
        $scope.contato.addresses.splice(index, 1);

	 }
	 
	 $scope.searchAddress = function(){
		 $http.get('https://api.postmon.com.br/v1/cep/'+$scope.address.cep)
			.then(function(data){   				

				$scope.address.cidade = data.data.cidade;
				$scope.address.bairro = data.data.bairro;
				$scope.address.logradouro = data.data.logradouro
				$scope.address.uf = data.data.estado;	

				$scope.messages.cep = "";			
				 
								
			})
			.catch(function(){
				$scope.messages.cep = "Falha em obter cep";
			});	
	 }
	 
	 $scope.processaFormContato = function(){
		 
		if (!$scope.hasEmail()){			
			Contacts.add($scope.contato);
			$scope.clearForm();

			$scope.errorMessage = false;
			$location.hash('');
		}else{
			$scope.errorMessage = true;
			$location.hash('error-message');
			$anchorScroll();

		}

	 }

	 $scope.hasEmail = function(){

	 	var found = Contacts.hasEmail($scope.contato.email);
	 	if (found == 0){
	 		$scope.messages.email = "Este e-mail já foi utilizado por outro contato";
	 		return true;
	 	}
	 	$scope.messages.email = "";
	 	return false;

	 }

	 $scope.validateAddress = function(){

	 	//Validation only for CEP and Cidade (for now)
	 	if ($scope.address.cep == ""){
	 		$scope.messages.cep = "O CEP precisa ser preenchido";
	 		return false;
	 	}else{
	 		$scope.messages.cep = "";
	 	}
	 	if ($scope.address.cidade == ""){
	 		$scope.messages.cidade = "A cidade precisa ser preenchida";
	 		return false;
	 	}else{
	 		$scope.messages.cidade = "";
	 	}

	 	return true;

	 }

	 $scope.clearForm = function(){
 		$scope.contato = getContato();	
		$scope.showAddForm = false;
		$scope.form.$setUntouched();
		$scope.form.$setValidity();
	 }

	 function getContato(){
		
		return {
			
			nome: "",	
			email: "",
			observation: "",		
			addresses: [],
			phones: []
			
		}
		
	}

	 
	
}




const app = angular.module('patientApp', []);

app.controller('PatientController', function($scope, $http) {
    const API_URL = 'http://localhost:3000/patients';

    $scope.newPatient = {};
    $scope.patients = [];
    $scope.searchQuery = '';
    $scope.sortOption = '';

    // Add a patient
    $scope.addPatient = function() {
        $http.post(API_URL, $scope.newPatient)
            .then(() => {
                $scope.fetchPatients();
                $scope.newPatient = {};
            })
            .catch(error => console.error('Error adding patient:', error));
    };

    // Fetch patients with search and sort
    $scope.fetchPatients = function() {
        const params = {
            search: $scope.searchQuery,
            sort: $scope.sortOption,
        };

        $http.get(API_URL, { params })
            .then(response => {
                $scope.patients = response.data;
            })
            .catch(error => console.error('Error fetching patients:', error));
    };

    // Initial fetch
    $scope.fetchPatients();
});

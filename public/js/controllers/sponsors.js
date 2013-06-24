function SponsorsCtrl($scope) {
  $scope.sponsors = [{
    name : "Evergreen Loft Company", 
    website : "http://www.evergreenloft.co.uk/"
  }, {
    name : "Goodfellows Estate Agency", 
    website : "http://www.goodfellows.co.uk/"
  }, {
    name : "St Anthony's Hospital", 
    website : "http://www.stanthonys.org.uk"
  },{
    name : "Spar and Post Office",
    address: "340 Grand Drive",
    phone:"020 8543 9398",
    website : "http://www.spar.co.uk/"
  },{
    name : "MARTIN & CO", 
    website : "http://www.martinco.com"
  },{
    name : "SCI Products Ltd", 
    website : "http://www.sciwindows.co.uk/"
  },{
    name : "Fiesta Fitness", 
    website : "http://www.Fiestafitness.com"
  },{
    name : "Clothes Line",
    website :"http://www.youruniform.co.uk"
  },{
    name : "Interactive Laser Inks",
    website : "http://www.laser-inks.co.uk"
  },{
    name : "Dale Fencing Ltd",
    website : "http://www.dalefencing.co.uk"
  },{
    name : "Koi Water Gardens", 
    website : "http://www.koiwatergarden.com"
  },{
    name : "Stonecot Studios",
    website : "http://www.stonecotstudios.co.uk"
  },{
    name : "Grand Drive Computers",
    website : "http://www.granddrivecomputers.com/"
  }, {
    name : "Bowlane Pre-School", 
    website: "http://www.bowlanepre-school.co.uk"
  },{
    name : "Chelsea White Building Services", 
    phone: "020 86484033"
  },{
    name : "Imperial Pharmacy", 
    website : "http://www.imperialpharmacysutton.com/"
  },{
    name : "Paul Electrical Co Ltd", 
    address : "248/252 Grand Drive",
    phone : "020 85426546"
  },{
    name : "Wimbledon Racquets & Fitness Club", 
    website : "http://www.wimbledonclub.co.uk"
  },{
    name : "Morden Park Dental Practice", 
    website : "http://mordenparkdentalpractice.com/"
  },{
    name : "Kinleigh, Folkard & Hayward",
    website : "http://www.kfh.co.uk/"
  }]; 
  
  (function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
  })($scope.sponsors);
}
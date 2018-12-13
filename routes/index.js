const request = require('request');
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
const contract = require('truffle-contract');
const SupplyChainArtifacts = require('../public/build/contracts/SupplyChain.json');
const isbn = require('node-isbn');

const supplychain = contract(SupplyChainArtifacts)

var fs = require("fs");
var Web3 = require('web3');

if (typeof web3 !== 'undefined') {
  var web3 = new Web3(web3.currentProvider)
} else {
  var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
}

supplychain.setProvider(web3.currentProvider)

var SupplyChain = supplychain.at("0xfdc02ff67b085c35d854973a0d2aaec128873bdb");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Farm Create Batch
// router.get('/farmCreateBatch', function(req, res, next) {
//   console.log("Farm Creating Batch...");

// 		SupplyChain.farmCreateBatch()
// 		.then((result) => {
// 			res.send(result);
// 		})
// 		.catch((err) => {
// 			console.log(err);
// 		});
// });

router.post('/setFarmDetails', function(req, res, next) {
		console.log("Creating FarmDetails Record...");
		SupplyChain.setFarmDetails(req.body.farmId, req.body.farmLocation, req.body.farmName, {from: req.body.requestor})
		.then((result) => {
		res.send(result);
		})
		.catch((err) => {
		console.log(err);
		});
});


router.post('/getFarmDetails', function(req, res, next) {
  console.log("Fetching Farm Details...");
  		//var points = 100;

      var farmObj={
        "virtualAddress":"",
        "farmName":"",
        "farmLocation":""
      };
		SupplyChain.getFarmDetails.call(req.body.farmId, {from: req.body.requestor})
		.then((result) => {
      farmObj.virtualAddress=result[0];
      farmObj.farmName=result[1];
      farmObj.farmLocation=result[2];
			res.send(farmObj);
		})
		.catch((err) => {
			console.log(err);
		});
});

//AnimalDetails set & get

router.post('/setAnimalDetails', function(req, res, next) {
  		console.log("Creating AnimalDetails Record...");
  		//var points = 100;
  		//console.log(req.body.animalId, req.body.animalbatchId, req.body.animalDOB, req.body.animalMedication, req.body.animalHealthRecord, req.body.requestor);
		SupplyChain.setAnimalDetails(req.body.animalId, req.body.animalbatchId, req.body.breeding_healthCert, req.body.breeding_WelfareCert,req.body.feeding_healthCert,req.body.feeding_WelfareCert,req.body.hygiene_healthCert,req.body.hygiene_WelfareCert, {from: req.body.requestor, gas: 3000000})
		.then((result) => {
			res.send(result);
		})
		.catch((err) => {
			console.log(err);
		});
});

router.post('/getAnimalDetails', function(req, res, next) {
  		console.log("Fetching AnimalDetails...");
  		//var points = 100;
		SupplyChain.getAnimalDetails.call(req.body.animalId, {from: req.body.requestor})
		.then((result) => {
			res.send(result);
		})
		.catch((err) => {
			console.log(err);
		});
});


//get & set farm batch details
router.post('/setFarmBatchDetails', function(req, res, next) {
  		console.log("Creating AnimalDetails Record...");
  		//var points = 100;
  		//console.log(req.body.animalId, req.body.animalbatchId, req.body.animalDOB, req.body.animalMedication, req.body.animalHealthRecord, req.body.requestor);
		SupplyChain.setFarmBatchDetails(req.body.batchId, req.body._farmId, req.body.batchMedication, req.body.breedingMethod, req.body.diet, {from: req.body.requestor, gas: 3000000})
		.then((result) => {
			res.send(result);
		})
		.catch((err) => {
			console.log(err);
		});
});




//ProcessorDetails set & get

router.post('/setProcessorDetails', function(req, res, next) {
		console.log("Creating ProcessorDetails Record...");
		SupplyChain.setProcessorDetails(req.body.processorId, req.body.processorName, req.body.processorLocation, {from: req.body.requestor})
		.then((result) => {
		res.send(result);
		})
		.catch((err) => {
		console.log(err);
		});
});

router.post('/getProcessorDetails', function(req, res, next) {
		console.log("Fetching Processor Details...");
		SupplyChain.getProcessorDetails.call(req.body.processorId, {from: req.body.requestor})
		.then((result) => {
		res.send(result);
		})
		.catch((err) => {
		console.log(err);
		});
});
// setter and getter for process batch

router.post('/setProcessorBatch', function(req, res, next) {
  		console.log("Setting  Processor Batch Details...");
  		//var points = 100;

      var animals=JSON.parse(req.body.farmAnimal);
      console.log("animals are ",animals);
		SupplyChain.setprocessorsbatchDetail(req.body.processorsId,req.body.processorsFarmBatchid,animals,req.body.processorsBatchid ,req.body.quarantineHealth,req.body.quarantineWelfare,{from: req.body.requestor, gas:300000})
		.then((result) => {
			res.send(result);
		})
		.catch((err) => {
			console.log(err);
		});
});


router.post('/getProcessorBatch', function(req, res, next) {
  		console.log("Setting  Processor Package Details...");
  		//var points = 100;
		SupplyChain.getprocessorsbatchDetail.call(req.body.processorsBatchid,{from: req.body.requestor})
		.then((result) => {
			res.send(result);
		})
		.catch((err) => {
			console.log(err);
		});
});



//setter and getters for ProcessorsProcessingUnit

router.post('/setProcessorsProcessingUnit', function(req, res, next) {
		console.log("Creating Processor ProcessingUnit...");
		//(uint processingId, uint processingProcessorBatchId, string preservatives, string processingMethod, string processingStorageCondition, uint processorAnimalId, string organicCertHash, string processCertHash)
		SupplyChain.setProcessorsProcessingUnit(req.body.processingId, req.body.processingProcessorBatchId, req.body.preservatives, req.body.processingMethod, req.body.processingStorageCondition, req.body.processorAnimalId, req.body.organicCertHash, req.body.processingHealth,req.body.processingWelfare, {from: req.body.requestor,gas:500000})
		.then((result) => {
		res.send(result);
		})
		.catch((err) => {
		console.log(err);
		});
});




router.post('/getProcessorsProcessingUnit', function(req, res, next) {
  		console.log("Fetching Processor Processing Unit Details...");
  		//var points = 100;
		SupplyChain.getProcessorsProcessingUnit.call(req.body.processingUnitId, {from: req.body.requestor})
		.then((result) => {
			res.send(result);
		})
		.catch((err) => {
			console.log(err);
		});
});




// setter and getter for processor package details
router.post('/setProcessorPackage', function(req, res, next) {
		console.log("Creating Processor Package...");
		//uint packageId, uint processors_processing_id_p,string manufacturingDate_p,string expiryDate_p,string weight_p
		SupplyChain.setProcessorPackage(req.body.packageId, req.body.processors_processing_id, req.body.manufacturingDate, req.body.expiryDate, req.body.weight, req.body.packageHealth,req.body.packageWelfare,{from: req.body.requestor, gas:300000})
		.then((result) => {
		res.send(result);
		})
		.catch((err) => {
		console.log(err);
		});
});



router.post('/getProcessorPackage', function(req, res, next) {
  		console.log("Fetching Processor Package Details...");
  		//var points = 100;
		SupplyChain.getProcessorPackage.call(req.body.packageId, {from: req.body.requestor})
		.then((result) => {
			res.send(result);
		})
		.catch((err) => {
			console.log(err);
		});
});

//RetailerDetails set & get

router.post('/setRetailerDetail', function(req, res, next) {
  		console.log("Setting Retailer Details...");
  		//var points = 100;
		SupplyChain.setRetailerDetails(req.body.retailerId,req.body.retailerName,req.body.retailerLocation, {from: req.body.requestor})
		.then((result) => {
			res.send(result);
		})
		.catch((err) => {
			console.log(err);
		});
});

router.post('/getRetailerDetail', function(req, res, next) {
  		console.log("Fetching Retailer Details...");
  		//var points = 100;
		SupplyChain.getRetailerDetails.call(req.body.retailerId, {from: req.body.requestor})
		.then((result) => {
			res.send(result);
		})
		.catch((err) => {
			console.log(err);
		});
});

router.post('/setRetailerPackageDetail', function(req, res, next) {
  		console.log("Setting Retailer Details...");


  		//var points = 100;
		SupplyChain.setRetailerPackageDetails(req.body.retailerId, req.body.retailerPackageId,req.body.retailerProcessorPackageId,req.body.dateOfArrival,req.body.retailerStorage,req.body.retailerPrice,req.body.retailerPackageName,{from: req.body.requestor,gas:300000})
		.then((result) => {
			res.send(result);
		})
		.catch((err) => {
			console.log(err);
		});
});

router.post('/getRetailerPackageDetail', function(req, res, next) {
  		console.log("Fetching Processor Batch Details...");
  		//var points = 100;
		SupplyChain.getRetailerPackageDetails.call(req.body.retailerPackageId, {from: req.body.requestor})
		.then((result) => {
			res.send(result);
		})
		.catch((err) => {
			console.log(err);
		});
});


//Get complete product details
router.post('/getProductDetails', function(req, res, next) {
  console.log("Fetching Product Details...");
  		//var points = 100;

      var productObj={
        "productName":"",
        "productPrice":"",
        "manufacturingDate":"",
        "ExpiryDate":"",
        "arrivalDateInStore":"",
        "productWeight":"",
        "retailerName":"",
        "organic_cert":""
      }

      SupplyChain.getEntitytDetails.call(req.body.productId, {from: req.body.requestor,gas:300000})
      .then((result) => {

        productObj.retailerName=result[1];



      })
      .catch((err) => {
        console.log(err);
      });

      SupplyChain.getProductPocessorCertificate.call(req.body.productId, {from: req.body.requestor,gas:300000})
      .then((result) => {

        productObj.organic_cert=result[6];

      })
      .catch((err) => {
        console.log(err);
      });

		SupplyChain.getProductDetails.call(req.body.productId, {from: req.body.requestor,gas:300000})
		.then((result) => {
      productObj.productName=result[0];
      productObj.productPrice=result[1];
      productObj.manufacturingDate=result[2];

      productObj.ExpiryDate=result[3];
      productObj.productWeight=result[4];
      productObj.arrivalDateInStore=result[5];


      if(productObj.productName == "")
      {
        res.status(204).send();
      }
      else{
			res.send(productObj);
    }
		})
		.catch((err) => {
			console.log(err);
		});
});


//Get complete product  farm details
// router.post('/getProductFarmDetails', function(req, res, next) {
//   console.log("Fetching Product Details...");
//   		//var points = 100;
//       var prodFarmObj={
//         "farmName":"",
//         "farmLocation":"",
//         "animalMedication":""
//       }
// 		SupplyChain.getProductFarmDetails.call(req.body.productId, {from: req.body.requestor,gas:300000})
// 		.then((result) => {
//       prodFarmObj.farmName=result[0];
//       prodFarmObj.farmLocation=result[1];
//       prodFarmObj.animalMedication=result[2];
// 			res.send(prodFarmObj);
// 		})
// 		.catch((err) => {
// 			console.log(err);
// 		});
// });


//Get complete details of the entities involved
router.post('/getStakeholderDetails', function(req, res, next) {
  console.log("Fetching Product Details...");
  		//var points = 100;

      var entityObj={
        "retailerLocation":"",
        "retailerName":"",
        "farmLocation":"",
        "farmName":"",
        "processorLocation":"",
        "processorName":""
      }
		SupplyChain.getEntitytDetails.call(req.body.productId, {from: req.body.requestor,gas:300000})
		.then((result) => {
      entityObj.retailerLocation=result[0];
      entityObj.retailerName=result[1];
      entityObj.farmLocation=result[2];
      entityObj.farmName=result[3];
      entityObj.processorLocation=result[5];
      entityObj.processorName=result[4];

			res.send(entityObj);
		})
		.catch((err) => {
			console.log(err);
		});
});


//Get complete details of the entities involved
router.post('/getFarmerCertificate', function(req, res, next) {
  console.log("Fetching Product Details...");
  		//var points = 100;

      var certFarmObj={
        "breeding_health":"",
        "breeding_welfare":"",
        "feeding_health":"",
        "feeding_Welfare":"",
        "hygiene_health":"",
        "hygiene_Welfare":""
      }
		SupplyChain.getProductFarmCertificates.call(req.body.productId, {from: req.body.requestor,gas:300000})
		.then((result) => {
      certFarmObj.breeding_welfare=result[0];
      certFarmObj.breeding_health=result[1];
      certFarmObj.feeding_Welfare=result[2];
      certFarmObj.feeding_health=result[3];
      certFarmObj.hygiene_Welfare=result[4];
      certFarmObj.hygiene_health=result[5];

			res.send(certFarmObj);
		})
		.catch((err) => {
			console.log(err);
		});
});


//Get processor certificates
router.post('/getProcessorCertificate', function(req, res, next) {
  console.log("Fetching Product Details...");
  		//var points = 100;

      var certProcObj={
        "quarantine_health":"",
        "quarantine_welfare":"",
        "processing_health":"",
        "processing_welfare":"",
        "pacckage_health":"",
        "package_welfare":"",
        "Organic_cert":""
      }
		SupplyChain.getProductPocessorCertificate.call(req.body.productId, {from: req.body.requestor,gas:300000})
		.then((result) => {
      certProcObj.quarantine_health=result[0];
      certProcObj.quarantine_welfare=result[1];
      certProcObj.processing_health=result[2];
      certProcObj.processing_welfare=result[3];
      certProcObj.pacckage_health=result[4];
      certProcObj.package_welfare=result[5];
      certProcObj.Organic_cert=result[6];

			res.send(certProcObj);
		})
		.catch((err) => {
			console.log(err);
		});
});
//Get complete product processor Details
router.post('/getProductProcessorDetails', function(req, res, next) {
  console.log("Fetching Product Details...");
  		//var points = 100;
      var processorObj={
        "name":"",
        "preservatives":"",
        "method":"",
        "location":"",
        "chemicalsUsed":""

      }
		SupplyChain.getProductPocessorDetails.call(req.body.productId, {from: req.body.requestor,gas:300000})
		.then((result) => {
      processorObj.name=result[0];
      processorObj.preservatives=result[1];
      processorObj.method=result[2];
      processorObj.location=result[3];
      processorObj.chemicalsUsed=result[4];
			res.send(processorObj);
		})
		.catch((err) => {
			console.log(err);
		});
});


router.post('/getPackageStorageDetail', function(req, res, next) {
  		console.log("Fetching Processor Batch Details...");
  		//var points = 100;

  		var temHumidity={
         "temperatures":"",
         "temperatures_status":"",
         "humidity":"",
         "humidity_status":""
  		}
		SupplyChain.getRetailerPackageDetails.call(req.body.retailerPackageId, {from: req.body.requestor})
		.then((result) => {

			var temp_Humidity=result[2];
      var hIndex=	temp_Humidity.indexOf('h');
      var colonIndex= temp_Humidity.indexOf(':');
      var tempset=temp_Humidity.substr(colonIndex+1,hIndex-(colonIndex+2));
      var humidity=temp_Humidity.substr(hIndex+9);
      temHumidity.temperatures=tempset;
      temHumidity.temperatures_status="OK";
      temHumidity.humidity=humidity;
      temHumidity.humidity_status="OK";
			res.send(temHumidity);
		})
		.catch((err) => {
			console.log(err);
		});
});





module.exports = router;

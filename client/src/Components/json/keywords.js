const warnings = require("./warnings.json")
const globalSettings = require("./global-settings.json")
const globalParameters = require("./global-parameters.json")
const simulationDimension = require("./simulation-dimension.json")
const simulationFlowControl = require("./simulation-flow-control.json")
const strainMinimizationModel = require("./strain-minimization-model.json")
const electricField = require("./electric-field.json")
const magneticField = require("./magnetic-field.json")
const numericControl = require("./numeric-control.json")
const domainCoordinates = require("./domain-coordinates.json")
const regions = require("./regions.json")
const regionCluster = require("./region-cluster.json")
const gridSpecification = require("./grid-specification.json")
const material = require("./material.json")
const quantumRegions = require("./quantum-regions.json")
const quantumCluster = require("./quantum-cluster.json")
const quantumModelElectrons = require("./quantum-model-electrons.json")
const quantumModelHoles = require("./quantum-model-holes.json")
const outputBandstructure = require("./output-bandstructure.json")
const outputDensities = require("./output-densities.json")
const outputStrain = require("./output-strain.json")
const output1BandSchroedinger = require("./output-1-band-schroedinger.json")
const outputKpData = require("./output-kp-data.json")
const outputRawData = require("./output-raw-data.json")
const outputMaterial = require("./output-material.json")
const warnioutputFileFormatngs = require("./output-file-format.json")
const outputSection = require("./output-section.json")

exports.keywords = {
    "warnings": warnings,
    "globalSettings": globalSettings,
    "globalParameters": globalParameters,
    "simulationDimension": simulationDimension,
    "simulationFlowControl": simulationFlowControl,
    "strainMinimizationModel": strainMinimizationModel,
    "electricField": electricField,
    "magneticField": magneticField,
    "numericControl": numericControl,
    "domainCoordinates": domainCoordinates,
    "regions": regions,
    "regionCluster": regionCluster,
    "gridSpecification": gridSpecification,
    "material": material,
    "quantumRegions": quantumRegions,
    "quantumCluster": quantumCluster,
    "quantumModelElectrons": quantumModelElectrons,
    "quantumModelHoles": quantumModelHoles,
    
    "outputBandstructure": outputBandstructure,
    "outputDensities": outputDensities,
    "outputStrain": outputStrain,
    "output1BandSchroedinger": output1BandSchroedinger,
    "outputKpData": outputKpData,
    "outputRawData": outputRawData,
    "outputMaterial": outputMaterial,
    "warnioutputFileFormatngs": warnioutputFileFormatngs,
    "outputSection": outputSection
}

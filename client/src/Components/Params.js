/*jshint esversion: 6 */

const keywordsList = [
    'warnings',
    'globalSettings',
    'globalParameters',
    'simulationDimension',
    'simulationFlowControl',
    'strainMinimizationModel',
    'electricField',
    'magneticField',
    'numericControl',
    'domainCoordinates',
    'regions',
    'regionCluster',
    'gridSpecification',
    'material',
    'quantumRegions',
    'quantumCluster',
    'quantumModelElectrons',
    'quantumModelHoles',
    'outputBandstructure',
    'outputDensities',
    'outputStrain',
    'output1BandSchroedinger',
    'outputKpData',
    'outputRawData',
    'outputMaterial',
    'warnioutputFileFormatngs',
    'outputSection'
  ]

const keywords = require('./json/keywords.js').keywords

export {keywords, keywordsList}

import { ethers } from 'ethers';
import destinationLedgerAbi from '../smartContractAbi/DestinationLedgerAbi';
import provider from '../globalConfig/blockchainProviderSetup';
import type { MapMarker } from '../sharedTypes/GeoCoordinateTypes';


const CONTRACT_ADDRESS =  import.meta.env.VITE_DESTINATION_LEDGER_ADDRESS;
const CONTRACT_ABI = destinationLedgerAbi

const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

async function readContractData(): Promise<MapMarker[]> {
  try {
    const allLocations = await contract.getAllLocations();
      
    const mapMarkers = allLocations.map((data: any[]) => ({
      coordinates: {
        lattitude: data[0],
        longitude: data[1]
      },
      description: data[2]
    }) as MapMarker) as MapMarker[];

    return mapMarkers;
  } catch (error) {
    console.error('Error reading contract:', error);
    return Array<MapMarker>(0);
  }
}

export { readContractData, contract };
import { DriverStore, LocationStore, MarkerData } from '@/types/type';
import { create } from 'zustand';

export const useLocationsStore = create<LocationStore>((set) => ({
    userAddress: null,
    userLongitude: null,
    userLatitude: null,
    destinationLongitude: null,
    destinationLatitude: null,
    destinationAddress: null,
    setUserLocation: ({ latitude, longitude, address }: { latitude: number, longitude: number, address: string }) => {
        set(() => ({
            userLatitude: latitude,
            userLongitude: longitude,
            userAddress: address
        }))
    },
    setDestinationLocation: ({ latitude, longitude, address }: { latitude: number, longitude: number, address: string }) => {
        set(() => ({
            destinationLatitude: latitude,
            destinationLongitude: longitude,
            userAddress: address
        }))
    },
}));

export const useDreiveStore = create<DriverStore>((set) => ({
    drivers: [] as MarkerData[],
    selectedDriver: null,
    setSelectedDriver: (driveId: number) => {
        set(() => ({ selectedDriver: driveId }))
    },
    setDrivers: (drivers: MarkerData[]) => {
        set(() => ({ drivers: drivers }))
    },
    clearSelectedDriver: () => set(() => ({ selectedDriver: null }))
}));
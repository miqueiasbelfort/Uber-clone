import RideLayout from "@/components/RideLayout";
import { Text, View } from "react-native";

const confirmRide = () => {
    return (
        <RideLayout title="Choose a Driver" snapPoints={['65%', '85%']}>
            <Text>Confirm Ride</Text>
        </RideLayout>
    );
};
export default confirmRide;
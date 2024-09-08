import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { fetchAPI } from "@/lib/fetch";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import ReactNativeModal from "react-native-modal";

const SignUp = () => {

    const { isLoaded, signUp, setActive } = useSignUp();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [verification, setVerification] = useState({
        state: 'default',
        error: '',
        code: ''
    });

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: ''
    });

    const onSignUpPress = async () => {
        if (!isLoaded) return;
        try {
            await signUp.create({
                emailAddress: form.email,
                password: form.password,
            })
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
            setVerification({ ...verification, state: 'pending' });
        } catch (err: any) {
            Alert.alert('Error', err.errors[0].longMessage);
        }
    }

    const onPressVerify = async () => {
        if (!isLoaded) return;
        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code: verification.code,
            });
            if (completeSignUp.status === 'complete') {
                await fetchAPI('/(api)/user', {
                    method: 'POST',
                    body: JSON.stringify({
                        name: form.name,
                        email: form.email,
                        clerkId: completeSignUp.createdUserId
                    })
                });

                await setActive({ session: completeSignUp.createdSessionId })
                setVerification({ ...verification, state: 'success' });
            } else {
                setVerification({ ...verification, error: 'Verification failed', state: 'failed' });
                console.error(JSON.stringify(completeSignUp, null, 2));
            }
        } catch (err: any) {
            setVerification({ ...verification, error: err.erros[0].longMessage, state: 'failed' });
            console.error(JSON.stringify(err, null, 2));
        }
    }

    return (
        <ScrollView className="flex-1 bg-white">
            <View className="flex-1 bg-white">
                <View className="relative w-full h-[250px]">
                    <Image
                        source={images.signUpCar}
                        className="z-0 w-full h-[250px]"
                    />
                    <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">Create Your Account</Text>
                </View>
                <View className="p-5">
                    <InputField
                        label="Name"
                        placeholder="Enter your name"
                        icon={icons.person}
                        value={form.name}
                        onChangeText={(value) => setForm({ ...form, name: value })}
                    />
                    <InputField
                        label="Email"
                        placeholder="Enter email"
                        icon={icons.email}
                        value={form.email}
                        onChangeText={(value) => setForm({ ...form, email: value })}
                    />
                    <InputField
                        label="Password"
                        placeholder="Enter your password"
                        icon={icons.lock}
                        value={form.password}
                        secureTextEntry={true}
                        onChangeText={(value) => setForm({ ...form, password: value })}
                    />

                    <CustomButton
                        title="Sign Up"
                        onPress={onSignUpPress}
                        className="mt-6"
                    />

                    <OAuth />

                    <Link href="/sign-in" className="text-lg text-center text-general-200 mt-10">
                        <Text>Already have an account? </Text>
                        <Text className="text-primary-500">Log In</Text>
                    </Link>

                    <ReactNativeModal isVisible={showSuccessModal}>
                        <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                            <Image
                                source={images.check}
                                className="w-[110px] h-[110px] mx-auto my-5"
                            />
                            <Text className="text-3xl font-JakartaBold text-center">Verified</Text>
                            <Text className="text-base mt-2 text-gray-400 font-Jakarta text-center">
                                You have successfully verified your account.
                            </Text>
                            <CustomButton className="mt-5" title="Browse Home" onPress={() => {
                                setShowSuccessModal(false);
                                router.replace('/(root)/(tabs)/home');
                            }} />
                        </View>
                    </ReactNativeModal>

                    <ReactNativeModal
                        isVisible={verification.state === 'pending'}
                        onModalHide={() => {
                            if (verification.state === "success") setShowSuccessModal(true);
                        }}
                    >
                        <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                            <Text className="text-2xl font-JakartaExtraBold mb-2 text-center">Verification</Text>
                            <Text className="mb-5 font-Jakarta">
                                We've sent a verification code to {form.email}
                            </Text>
                            <InputField
                                label="Code"
                                icon={icons.lock}
                                placeholder="12345"
                                value={verification.code}
                                keyboardType="numeric"
                                onChangeText={(code) => setVerification({ ...verification, code })}
                            />
                            {verification.error && (
                                <Text className="text-red-500 text-sm mt-1">
                                    {verification.error}
                                </Text>
                            )}
                            <CustomButton className="mt-5 bg-success-500" title="Verify Email" onPress={onPressVerify} />
                        </View>
                    </ReactNativeModal>
                </View>
            </View>
        </ScrollView>
    );
};

export default SignUp;
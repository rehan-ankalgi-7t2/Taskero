import { Link, router, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, TextInput, Button, TouchableOpacity, Image } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Colors } from '@/constants/Colors';
import { account } from '@/database/appwrite';

// Define the type for form data
type TLoginFormData = {
    email: string;
    password: string;
}

const schema = yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const LoginScreen: React.FC = () => {
    const navigation = useNavigation();
    const { control, handleSubmit, formState: { errors } } = useForm<TLoginFormData>({
        resolver: yupResolver(schema),
    });

    const [secureText, setSecureText] = useState<boolean>(true);

    const onSubmit: SubmitHandler<TLoginFormData> = (data: TLoginFormData) => {
        const promise = account.createEmailPasswordSession(data.email, data.password);

        promise.then(function (response) {
            Alert.alert('SUCCESS', `${response}`);
            console.log(response)
            router.push('/');
        }, function (error) {
            console.log(error); // Failure
        });
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            e.preventDefault(); // Block navigation
            Alert.alert('Please login first', 'login with your account to continue');
        });

        return unsubscribe;
    }, [navigation]);
    return (
        <GestureHandlerRootView style={{ flex: 1, marginInline: 16, paddingTop: 48, paddingBottom: 16 }}>
            <View>
                <Text style={{
                    fontSize: 32,
                    fontWeight: 'bold',
                }}>Login to your account</Text>
                <Text style={{
                    fontSize: 16,
                    opacity: 0.4,
                    marginTop: 16
                }}>Login to your account using email and password and make the most out of taskero's productivity</Text>
            </View>
            <Image source={require('../assets/images/login.png')} style={{ width: '100%', height: 200, aspectRatio: '1/1', alignSelf: 'center', marginTop: 32 }} />
            <View style={{ marginTop: 32 }}>
                {/* Email Input */}
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            placeholder="Email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={value}
                            onChangeText={onChange}
                            style={[styles.input, errors.email && styles.inputError]}
                        />
                    )}
                />
                {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

                {/* Password Input */}
                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.passwordContainer}>
                            <TextInput
                                placeholder="Password"
                                secureTextEntry={secureText}
                                value={value}
                                onChangeText={onChange}
                                style={[styles.input, styles.passwordInput, errors.password && styles.inputError]}
                            />
                            <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.eyeButton}>
                                <Text style={{color: Colors.light.tint, padding: 4}}>{secureText ? 'show' : 'hide'}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
                {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

                {/* Login Button */}
                <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>
            <Text style={{marginTop: 40, textAlign: 'center', flex: 1}}>Don't have an account yet? <Link style={{fontWeight: 'bold', color: Colors.light.tint}} href={'/signup'}>Sign up here</Link></Text>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        fontSize: 16,
        marginBottom: 10,
    },
    inputError: {
        borderColor: 'red',
    },
    error: {
        color: 'red',
        marginBottom: 10,
        fontSize: 12,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    passwordInput: {
        flex: 1,
        paddingRight: 40,
    },
    eyeButton: {
        position: 'absolute',
        right: 12,
        top: 12,
    },
    button: {
        backgroundColor: Colors.light.tint,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default LoginScreen;
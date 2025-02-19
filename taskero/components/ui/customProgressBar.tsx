import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";

interface ProgressBarProps {
    progress: number; // Progress value between 0 and 1
    height?: number;
    color?: string;
    backgroundColor?: string;
}

const CustomProgressBar: React.FC<ProgressBarProps> = ({
    progress,
    height = 4,
    color = "#3498db",
    backgroundColor = "#e0e0e0",
}) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: progress,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [progress]);

    const widthInterpolated = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
    });

    return (
        <View style={[styles.container, { height, backgroundColor }]}>
            <Animated.View style={[styles.progress, { width: widthInterpolated, backgroundColor: color }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 'auto',
        borderRadius: 10,
        overflow: "hidden",
        marginVertical: 8
    },
    progress: {
        height: "100%",
        borderRadius: 10,
    },
});

export default CustomProgressBar;

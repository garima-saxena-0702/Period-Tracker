import React from 'react';
import { StyleProp, Text, TextStyle, View } from "react-native";
import styles from './noCycleFound.styles';

interface NoCycleFoundProps {
    style?: StyleProp<TextStyle>;
}

const NoCycleFound: React.FC<NoCycleFoundProps> = ({ style }) => (
    <View>
        <Text style={[styles.noCycleFound, style]}>No Period logs found. Please add your cycle details!</Text>
    </View>
);

export default NoCycleFound;
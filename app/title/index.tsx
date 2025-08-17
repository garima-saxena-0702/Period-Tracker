import React from 'react';
import { StyleProp, Text, TextStyle } from "react-native";
import styles from './title.styles';

interface TitleProps {
    text: string;
    style?: StyleProp<TextStyle>;
}

const Title: React.FC<TitleProps> = ({ text, style }) => (
    <Text style={[styles.header, style]}>{text}</Text> // <-- Merge styles
);

export default Title;
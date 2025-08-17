import React from 'react';
import { StyleProp, Text, TextStyle } from "react-native";
import styles from './footer.styles';

interface FooterProps {
    text: string;
    style?: StyleProp<TextStyle>;
}

const Footer: React.FC<FooterProps> = ({ text, style }) => (
    <Text style={[styles.footer, style]}>{text}</Text>
);

export default Footer;
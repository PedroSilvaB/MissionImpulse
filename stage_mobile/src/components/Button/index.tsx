import React from "react";

import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ColorValue,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

import { styles } from "./styles";

interface IProps extends TouchableOpacityProps {
  title: string;
  color: ColorValue;
  backgroundColor: ColorValue;
  icon?: React.ComponentProps<typeof AntDesign>["name"];
  isLoading?: boolean;
}

export function Button({
  color,
  title,
  backgroundColor,
  icon,
  isLoading = false,
  ...props
}: IProps) {
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor }]}
      {...props}
      activeOpacity={0.7}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color={color} />
      ) : (
        <>
          <AntDesign name={icon} size={24} style={styles.icon} />
          <Text style={[styles.title, { color }]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

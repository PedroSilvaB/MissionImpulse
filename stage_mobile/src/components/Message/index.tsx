import { MotiView } from "@motify/components";
import React from "react";

import { Text, View } from "react-native";
import { Avatar } from "../Avatar";

import { styles } from "./styles";

export interface IMassage {
  id: string;
  text: string;
  user: {
    name: string;
    avatar_url: string;
  };
}
interface IProps {
  data: IMassage;
}
export function Message({ data }: IProps) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: -50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 700 }}
      style={styles.container}
    >
      <Text style={styles.message}>{data.text}</Text>

      <View style={styles.footer}>
        <Avatar sizes="SMALL" imageUri={data.user.avatar_url} />

        <Text style={styles.userName}>{data.user.name}</Text>
      </View>
    </MotiView>
  );
}

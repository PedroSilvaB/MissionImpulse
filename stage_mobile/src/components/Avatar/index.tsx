import { LinearGradient } from "expo-linear-gradient";
import React from "react";

import { Image } from "react-native";

import avatarImg from "../../assets/avatar.png";
import { COLORS } from "../../theme";

import { styles } from "./styles";

const SIZES = {
  SMALL: {
    contentSize: 32,
    avatarSize: 28,
  },
  NORMAL: {
    contentSize: 48,
    avatarSize: 42,
  },
};

interface IProps {
  imageUri: string | undefined;
  sizes?: "SMALL" | "NORMAL";
}

const AVATAR_DEFAULT = Image.resolveAssetSource(avatarImg).uri;

export function Avatar({ imageUri, sizes = "NORMAL" }: IProps) {
  const { avatarSize, contentSize } = SIZES[sizes];
  return (
    <LinearGradient
      colors={[COLORS.PINK, COLORS.YELLOW]}
      start={{ x: 0, y: 0.8 }}
      end={{ x: 0.9, y: 1 }}
      style={[
        styles.conteiner,
        {
          width: contentSize,
          height: contentSize,
          borderRadius: contentSize / 2,
        },
      ]}
    >
      <Image
        source={{ uri: imageUri || AVATAR_DEFAULT }}
        style={[
          styles.avatar,
          {
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
          },
        ]}
      />
    </LinearGradient>
  );
}

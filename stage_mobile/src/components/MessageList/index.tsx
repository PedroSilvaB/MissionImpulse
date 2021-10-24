import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { api } from "../../service/api";
import io from "socket.io-client";

import { IMassage, Message } from "../Message";

import { styles } from "./styles";
import { MESSAGES_EXAMPLE } from "../../utils/messages";

const socket = io(String(api.defaults.baseURL));

const messageQueue: IMassage[] = MESSAGES_EXAMPLE;

socket.on("new_message", (newMessage) => {
  messageQueue.push(newMessage);
});

export function MessageList() {
  const [currentMessages, setCurrentMessages] = useState<IMassage[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (messageQueue.length > 0) {
        setCurrentMessages((prevState) => [
          messageQueue[0],
          ...prevState.splice(0, 2),
        ]);
        messageQueue.shift();
      }
    }, 3000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    async function fetchMessages() {
      const messageResponse = await api.get<IMassage[]>("/messages/last3");
      setCurrentMessages(messageResponse.data);
    }
    fetchMessages();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="never"
    >
      {currentMessages.map((message) => (
        <Message key={message.id} data={message} />
      ))}
    </ScrollView>
  );
}

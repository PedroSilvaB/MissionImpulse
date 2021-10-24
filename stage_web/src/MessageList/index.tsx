import styles from "./styles.module.scss";
import logoImg from "../assets/logo.svg";
import { api } from "../services/api";
import { useEffect, useState } from "react";
import io from "socket.io-client";

interface IMessage {
  id: string;
  text: string;
  created_at: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

const socket = io("http://localhost:4000");

const messagesQueue: IMessage[] = [];

socket.on("new_message", (newMessage: IMessage) =>
  messagesQueue.push(newMessage)
);

export const MessageList = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    const time = setInterval(() => {
      if (messagesQueue.length > 0) {
        setMessages((prevState) =>
          [messagesQueue[0], ...prevState.slice(0, 2)].filter(Boolean)
        );
        messagesQueue.shift();
      }
    }, 1500);
  }, []);

  useEffect(() => {
    api
      .get<IMessage[]>("messages/last3")
      .then((response) => setMessages(response.data));
  }, []);

  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt="DoWhile 2021" />
      <ul className={styles.messageList}>
        {messages.map(({ id, text, user }) => (
          <li key={id} className={styles.message}>
            <p className={styles.messageContent}>{text}</p>
            <div className={styles.messageUser}>
              <div className={styles.userImage}>
                <img src={user.avatar_url} alt={user.name} />
              </div>
              <span>{user.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

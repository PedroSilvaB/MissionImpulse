import styles from "./App.module.scss";
import { useAuth } from "./hooks/useAuth";
import { LoginBox } from "./LoginBox";
import { MessageList } from "./MessageList";
import { SendMessageForm } from "./SendMessageForm";
export function App() {
  const { user } = useAuth();
  return (
    <main
      className={`${styles.contentWrapper} ${
        !!user ? styles.contentSigned : ""
      }`}
    >
      <MessageList />
      {!user ? <LoginBox /> : <SendMessageForm />}
    </main>
  );
}

import styles from "./styles.module.scss";
import { VscGithubInverted } from "react-icons/vsc";
import { useAuth } from "../hooks/useAuth";

export const LoginBox = () => {
  const { singInUrl } = useAuth();
  return (
    <div className={styles.loginBoxWrapper}>
      <strong>Entre e compartilhe sua mensagem</strong>
      <a href={singInUrl} className={styles.signInWithGithub}>
        <VscGithubInverted size="24" />
        Entra com GitHub
      </a>
    </div>
  );
};

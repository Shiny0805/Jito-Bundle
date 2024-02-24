import Meta from "components/Meta"; // Components: Meta
import Header from "components/Header"; // Components: Header
import type { ReactElement } from "react"; // Types
import { ToastContainer } from 'react-toastify';
import styles from "styles/components/Layout.module.scss"; // Component styles
import 'react-toastify/dist/ReactToastify.css'

export default function Layout({
  children,
}: {
  children: ReactElement | ReactElement[];
}) {
  return (
    <div className={styles.layout}>
      <Meta />
      <Header/>
      <div className={styles.layout__content}>{children}</div>
      <ToastContainer theme="dark"/>
    </div>
  );
}

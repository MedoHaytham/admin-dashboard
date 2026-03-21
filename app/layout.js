import "./globals.css";
import { ToastContainer } from "react-toastify";
import ReduxProvider from "./components/Reduxprovider";
import LayoutShell from "./components/LayoutShell";

export const metadata = {
  title: "Overview",
  description: "admin pages",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastContainer />
        <ReduxProvider>
          <LayoutShell>
            {children}
          </LayoutShell>
        </ReduxProvider>
      </body>
    </html>
  );
}